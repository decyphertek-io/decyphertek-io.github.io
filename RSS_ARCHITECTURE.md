# RSS Aggregator Architecture

> **Status:** Idea / proposal — not implemented. This document has no effect on the
> current static site. It describes a future, fully separate service that could run
> on a Cloudflare Worker (free tier friendly) and expose its own domain/subdomain.

## Overview

A lightweight, serverless RSS aggregator that periodically fetches a curated list of
external feeds (security, cloud, open source news consistent with the Decyphertek
audience), normalizes and deduplicates the items, and serves them as both a human
readable HTML page and a machine readable RSS feed from the edge.

## Components

### 1. Feed Fetcher (Cloudflare Worker + Cron Trigger)
- Runs on a schedule every **6–12 hours** (Cron Triggers: `0 */6 * * *` or `0 */12 * * *`).
- Fetches **20–50 curated RSS/Atom feeds** concurrently (with a per-host concurrency cap).
- Politeness rules per source:
  - Custom `User-Agent` identifying the aggregator (e.g., `DecyphertekRSS/1.0 (+https://.../opt-out)`).
  - Per-feed TTL: skip a feed if the last fetch was too recent (feed TTL from ETag /
    `Last-Modified` / `<ttl>` / `sy:updateFrequency` when present).
  - Timeout of 10–15s per fetch; retry once with backoff on transient failure.
- **Edge cases handled:** invalid XML, dead feeds (auto-disable after N consecutive
  failures), character-encoding mismatches, HTTP redirects, `410 Gone` → drop feed,
  `429`/`503` → back off and respect `Retry-After`.

### 2. Parser + Normalizer
- Parse RSS 2.0, Atom, and RDF (RSS 1.0) into a common item schema.

  ```jsonc
  {
    "id": "<sha256 of canonicalized linkguid>",   // stable, used for dedup
    "title": "string",
    "link": "https://original-post",              // canonical URL
    "source": "Feed Name",
    "sourceUrl": "https://feed-site",
    "published": "ISO-8601",
    "summary": "max ~200 chars, HTML stripped",   // snippet only, never full text
    "category": "security|cloud|oss|general"      // optional, from feed config
  }
  ```

- **Deduplication (two passes):**
  1. Within a batch: hash of the canonicalized `link` (or `guid` when present).
  2. Across runs: keep a rolling window of seen item IDs (last 30–60 days) to avoid
     re-publishing items when a feed's window overlaps previous runs.
- **Normalization:** resolve relative URLs, unify dates to ISO-8601 (UTC), strip
  tracking query params (`utm_*`, `fbclid`), decode HTML entities, strip scripts and
  inline styles, generate the trimmed summary.

### 3. Cache / Storage (Edge)
- Primary store: **Cloudflare KV** (or D1 / Durable Objects if ordering matters).
  - `items:<hash>` → normalized item JSON, TTL 60 days.
  - `feedlist` → curated feed config (URL, name, category, enabled).
  - `seen:<id>` → tiny marker key with short TTL for cross-run dedup.
  - `meta:lastRun`, `meta:feedStatus` (per-feed health) for observability.
- Compiled output (the rendered HTML body and the final `feed.xml`) cached in the
  Worker **Cache API** keyed by URL; regenerated on each successful cron run.
- Storage estimate: 50 feeds × ~20 new items/run × 4 runs/day → a few MB/month.

## Outputs

| Route | Format | Audience | Caching |
|---|---|---|---|
| `/` | HTML page (server-rendered from the same JSON data) | Humans | `Cache-Control: public, max-age=3600` |
| `/feed.xml` | RSS 2.0 feed | RSS readers/bots | Same; served `application/rss+xml` |
| `/opt-out` | Simple contact/opt-out form page | Source publishers | Static |
| `/health` | JSON: last run, per-feed statuses | Ops | `no-store` |

- Both outputs are generated from the same normalized dataset, so they never diverge.
- HTML page: minimal, static-ish, Tailwind-styled list of snippets with attribution
  and "Read original" links; pagination (e.g., 50 items/page); optional filtering
  by category via query param (feeds are cheap to filter at request time; no
  separate DB queries needed beyond the paginated `items` list).

## Flow

```
                   ┌─────────────────────────────────────────────┐
                   │               Cloudflare                    │
                   │                                             │
 External Feeds ─► │  Cron ─► Worker ─► Parse/Normalize/Dedupe   │
 (20–50 sources)   │             │                                │
                   │             ▼                                │
                   │        KV Storage (items, seen, feedlist)   │
                   │             │                                │
                   │             ▼                                │
                   │          Cache API (edge, 1h TTL)            │
                   │             │                                │
                   │     ┌───────┴───────┐                        │
                   │     ▼               ▼                        │
                   │     /           /feed.xml                    │
                   └──────┬───────────────┬───────────────────────┘
                          ▼               ▼
                       Humans         RSS Readers
```

Request-time path is trivial: the Worker just reads the cached compiled response;
all heavy lifting happens in the 6–12h cron run, so p95 latency is low and the
free-tier CPU limits (10ms on the unpaid plan cron ~ fine since parsing is
split across subrequests) are respected.

## Deployment Notes

- Zero relation to the existing static site on GitHub Pages — deploy as a separate
  Cloudflare Worker project (`npm create cloudflare@latest -- --template=hello-world`),
  bound to its own subdomain or a `rss.` subdomain, or simply a Worker route.
- Config lives in a single JSON feed list, committed to a private repo or edited
  via an authenticated `/admin` route (future work — not needed for v1).
- Cost: comfortably within Cloudflare's free tier (~20–50 feeds at 4 runs/day,
  KV free allowance of 1,000 writes/day and 100k reads/day is enough with a
  read-optimized design: most requests hit Cache API, not KV).

## Legal / Ethical Guidelines (v1 self-imposed rules)

- ✅ Snippets only (~200 characters): never republish full article text, only a
  short excerpt plus headline.
- ✅ Attribution on each item: visible feed/source name on both outputs
  (HTML: "via Feedit", RSS: `<source>` + `dc:creator` naming).
- ✅ Link back to the original article URL on every item.
- ✅ Respect source `robots.txt` for any HTML scraping (feeds themselves are
  meant for syndication, but the same tooling must not be used to scrape pages).
- ⚠️ Opt-out: a public `/opt-out` page where any feed publisher can request
  removal; requests honored within 24–48h, verified via the feed's contact email
  or domain email.

## Considerations & Future Work

- **Redis-style ranking (v2):** score items by keyword match with the site's focus
  areas (security, cloud, open source) rather than pure chronological order.
- **Email digest (v2):** daily email of top items (Cloudflare Email Workers /
> external provider).
- **Feed discovery:** small admin tool to validate a candidate feed URL before
  adding it to the roster.
- **Broken-link/feed monitoring:** a simple cron alert (via a webhook or
  email) if a feed fails N times consecutively.
