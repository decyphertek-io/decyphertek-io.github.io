// Mobile menu toggle
document.addEventListener('DOMContentLoaded', function() {
    // Products dropdown - click to open/close (works on touch + desktop)
    const productsDropdown = document.querySelector('.products-dropdown');
    const productsButton = productsDropdown ? productsDropdown.querySelector('button') : null;
    if (productsDropdown && productsButton) {
        productsButton.setAttribute('aria-expanded', 'false');
        productsButton.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            const isOpen = productsDropdown.classList.toggle('open');
            productsButton.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
        });

        // Close the dropdown when clicking anywhere outside it
        document.addEventListener('click', function(e) {
            if (!productsDropdown.contains(e.target)) {
                productsDropdown.classList.remove('open');
                productsButton.setAttribute('aria-expanded', 'false');
            }
        });

        // Close the dropdown after choosing a product
        productsDropdown.querySelectorAll('.products-dropdown-menu a').forEach(function(link) {
            link.addEventListener('click', function() {
                productsDropdown.classList.remove('open');
                productsButton.setAttribute('aria-expanded', 'false');
            });
        });
    }

    // Mobile menu functionality - v1.1 (cache buster)
    const menuButton = document.querySelector('.fa-bars')?.parentElement;
    if (menuButton) {
        // Clear any existing mobile menu
        const existingMenu = document.querySelector('.mobile-menu');
        if (existingMenu) {
            existingMenu.remove();
        }
        
        const mobileMenu = document.createElement('div');
        mobileMenu.className = 'mobile-menu fixed top-0 left-0 h-full w-64 bg-gray-800 z-50 transform -translate-x-full transition-transform duration-300 ease-in-out shadow-lg';
        
        // Create menu content safely
        const menuDiv = document.createElement('div');
        menuDiv.className = 'p-6';
        
        const headerDiv = document.createElement('div');
        headerDiv.className = 'flex justify-between items-center mb-8';
        
        const logoDiv = document.createElement('div');
        logoDiv.className = 'flex items-center';
        
        // Create logo image
        const logoImg = document.createElement('img');
        logoImg.src = 'data/web-logo.png';
        logoImg.alt = 'Decyphertek';
        logoImg.className = 'h-8 mr-2';
        logoDiv.appendChild(logoImg);
        
        // Create logo text with gradient
        const logoText = document.createElement('span');
        logoText.className = 'text-sm font-bold';
        logoText.textContent = 'DECYPHERTEK';
        logoText.style.fontFamily = "'Montserrat', sans-serif";
        logoText.style.letterSpacing = '1px';
        logoText.style.background = 'linear-gradient(90deg, #22c55e, #3b82f6)';
        logoText.style.webkitBackgroundClip = 'text';
        logoText.style.backgroundClip = 'text';
        logoText.style.webkitTextFillColor = 'transparent';
        logoText.style.textTransform = 'uppercase';
        logoDiv.appendChild(logoText);
        
        const closeBtn = document.createElement('button');
        closeBtn.className = 'text-gray-200 hover:text-white';
        
        const closeIcon = document.createElement('i');
        closeIcon.className = 'fas fa-times text-xl';
        closeBtn.appendChild(closeIcon);
        
        headerDiv.appendChild(logoDiv);
        headerDiv.appendChild(closeBtn);
        
        const nav = document.createElement('nav');
        nav.className = 'space-y-4';

        // Products section header
        const productsHeader = document.createElement('div');
        productsHeader.className = 'text-xs uppercase tracking-wider text-gray-500 font-bold';
        productsHeader.textContent = 'Products';
        productsHeader.setAttribute('data-i18n', 'nav.products');
        nav.appendChild(productsHeader);
        
        // Menu links
        const links = [
            { href: '/', text: 'Cloud Marketplace', icon: 'fas fa-cloud text-blue-400 mr-2', key: 'nav.cloud' },
            { href: '/products/langtek/', text: 'LangTek', icon: 'fas fa-language text-green-500 mr-2' },
            { href: '/products/cloudtek/', text: 'CloudTek', icon: 'fas fa-server text-orange-500 mr-2' },
            { href: '/products/stacktek/', text: 'StackTek', icon: 'fas fa-layer-group text-blue-400 mr-2' },
            { href: 'https://decyphertek.readthedocs.io/en/latest/', text: 'Docs', icon: 'fas fa-book text-blue-400 mr-2', key: 'nav.docs' },
            { href: 'https://github.com/decyphertek-io', text: 'GitHub', icon: 'fab fa-github text-gray-300 mr-2' }
        ];
        
        links.forEach(link => {
            const a = document.createElement('a');
            a.href = link.href;
            if (link.href.startsWith('http')) {
                a.target = "_blank"; // Open external links in new tab
            }
            a.className = 'block text-gray-300 hover:text-green-500 font-medium flex items-center';
            
            // Add icon if present
            if (link.icon) {
                const icon = document.createElement('i');
                icon.className = link.icon;
                a.appendChild(icon);
            }
            
            const text = document.createElement('span');
            if (link.key) {
                text.setAttribute('data-i18n', link.key);
            }
            text.textContent = link.text;
            a.appendChild(text);
            nav.appendChild(a);
        });
        
        menuDiv.appendChild(headerDiv);
        menuDiv.appendChild(nav);
        mobileMenu.appendChild(menuDiv);
        
        document.body.appendChild(mobileMenu);
        
        // Toggle mobile menu
        menuButton.addEventListener('click', function() {
            mobileMenu.classList.toggle('-translate-x-full');
        });
        
        // Close mobile menu
        closeBtn.addEventListener('click', function() {
            mobileMenu.classList.add('-translate-x-full');
        });
        
        // Close menu when clicking on links
        const mobileLinks = mobileMenu.querySelectorAll('a');
        mobileLinks.forEach(link => {
            link.addEventListener('click', function() {
                mobileMenu.classList.add('-translate-x-full');
            });
        });
    }
    
    // Language toggle (EN | ES) - site-wide English / Spanish, persisted in localStorage
    const LANG_STORAGE_KEY = 'decyphertek-lang';
    const I18N = {
        // Shared chrome
        'nav.products': { en: 'Products', es: 'Productos' },
        'nav.cloud': { en: 'Cloud Marketplace', es: 'Marketplace en la nube' },
        'nav.docs': { en: 'Docs', es: 'Documentación' },
        'footer.contact': { en: 'Contact:', es: 'Contacto:' },
        'footer.privacy': { en: 'Privacy Notice:', es: 'Aviso de privacidad:' },
        'footer.privacyText': { en: 'We respect your privacy and do not collect or sell your data.', es: 'Respetamos tu privacidad y no recopilamos ni vendemos tus datos.' },
        'copyright.root': { en: '\u00A9 2026 Decyphertek LLC. All rights reserved.', es: '\u00A9 2026 Decyphertek LLC. Todos los derechos reservados.' },
        'copyright.langtek': { en: '\u00A9 2026 LangTek by Decyphertek LLC. All rights reserved.', es: '\u00A9 2026 LangTek de Decyphertek LLC. Todos los derechos reservados.' },
        'copyright.cloudtek': { en: '\u00A9 2026 CloudTek by Decyphertek LLC. All rights reserved.', es: '\u00A9 2026 CloudTek de Decyphertek LLC. Todos los derechos reservados.' },
        'copyright.stacktek': { en: '\u00A9 2026 StackTek by Decyphertek LLC. All rights reserved.', es: '\u00A9 2026 StackTek de Decyphertek LLC. Todos los derechos reservados.' },
        // Root page (cloud marketplace)
        'root.heroTitle': { en: 'Cloud Marketplace', es: 'Marketplace en la nube' },
        'root.tagline': { en: 'Decoding Technology', es: 'Decodificando la tecnología' },
        'root.servicesTitle': { en: 'Our Services', es: 'Nuestros servicios' },
        'root.servicesText': { en: 'Decyphertek is a trusted partner for Amazon Web Services, Google Cloud Platform, and Microsoft Azure. We specialize in secure open source solutions and ready to deploy virtual machines. Our services prioritize security and ease of use, allowing you to focus on your core business without worrying about the complexities of technology. Decoding technology, so you don\'t have to.', es: 'Decyphertek es un socio de confianza para Amazon Web Services, Google Cloud Platform y Microsoft Azure. Nos especializamos en soluciones de código abierto seguras y máquinas virtuales listas para implementar. Nuestros servicios priorizan la seguridad y la facilidad de uso, para que puedas concentrarte en tu negocio principal sin preocuparte por las complejidades de la tecnología. Decodificamos la tecnología para que tú no tengas que hacerlo.' },
        'root.securityTitle': { en: 'Security Features', es: 'Funciones de seguridad' },
        'root.securityText': { en: 'Our virtual machines are built with security in mind, offering a range of features to protect your infrastructure.', es: 'Nuestras máquinas virtuales están diseñadas pensando en la seguridad y ofrecen una variedad de funciones para proteger tu infraestructura.' },
        'root.debianTitle': { en: 'Debian Based VMs', es: 'VM basadas en Debian' },
        'root.coreosTitle': { en: 'CoreOS Based VMs', es: 'VM basadas en CoreOS' },
        'feat.nginx': { en: 'Nginx Reverse Proxy', es: 'Proxy inverso Nginx' },
        'feat.ufw': { en: 'UFW Host Firewall', es: 'Firewall de host UFW' },
        'feat.ossec': { en: 'OSSEC HIDS', es: 'OSSEC HIDS' },
        'feat.rsyslog': { en: 'Rsyslog Collection', es: 'Recopilación con Rsyslog' },
        'feat.updates': { en: 'Automated Updates', es: 'Actualizaciones automáticas' },
        'feat.auditd': { en: 'Auditd Monitoring', es: 'Monitoreo con Auditd' },
        'feat.immutable': { en: 'Immutable OS', es: 'SO inmutable' },
        'feat.autoupdate': { en: 'Auto-updating OS', es: 'SO con actualización automática' },
        'feat.container': { en: 'Containerized Server', es: 'Servidor en contenedores' },
        'feat.selinux': { en: 'SE Linux', es: 'SE Linux' },
        'feat.firewalld': { en: 'Firewalld Secured', es: 'Protegido con Firewalld' },
        'docs.docsTitle': { en: 'Documentation', es: 'Documentación' },
        'root.docsText': { en: 'Explore our comprehensive documentation for deploying and managing secure open source solutions across major cloud platforms.', es: 'Explora nuestra documentación completa para implementar y gestionar soluciones de código abierto seguras en las principales plataformas en la nube.' },
        'docs.awsTitle': { en: 'AWS Documentation', es: 'Documentación de AWS' },
        'docs.gcpTitle': { en: 'GCP Documentation', es: 'Documentación de GCP' },
        'docs.azureTitle': { en: 'Azure Documentation', es: 'Documentación de Azure' },
        'root.awsText': { en: 'Comprehensive guides for deploying and managing our secure VM solutions on Amazon Web Services.', es: 'Guías completas para implementar y gestionar nuestras soluciones de VM seguras en Amazon Web Services.' },
        'root.gcpText': { en: 'Practical instructions for deploying and managing our secure VM solutions on Google Cloud Platform.', es: 'Instrucciones prácticas para implementar y gestionar nuestras soluciones de VM seguras en Google Cloud Platform.' },
        'root.azureText': { en: 'Detailed documentation for deploying and managing our secure VM solutions on Microsoft Azure.', es: 'Documentación detallada para implementar y gestionar nuestras soluciones de VM seguras en Microsoft Azure.' },
        'docs.viewDocs': { en: 'View Documentation', es: 'Ver documentación' },
        // CloudTek page
        'ctk.tagline': { en: 'Decoding the Cloud', es: 'Decodificando la nube' },
        'feat.vmMgmt': { en: 'VM Management', es: 'Gestión de VM' },
        'feat.ssh': { en: 'SSH Terminal', es: 'Terminal SSH' },
        'feat.secure': { en: 'Secure Access', es: 'Acceso seguro' },
        'ctk.status': { en: 'In Development \u2014 Coming Soon', es: 'En desarrollo \u2014 Próximamente' },
        'docs.appFeatures': { en: 'App Features', es: 'Funciones de la app' },
        'ctk.featuresText': { en: 'CloudTek is a mobile app for managing cloud infrastructure across AWS, Azure, and GCP. Launch, start, stop, reboot, or delete virtual machines, manage firewalls and networking, and SSH into any VM from a built-in terminal \u2014 all from your phone. A Rust core talks directly to cloud provider APIs over TLS 1.3 with certificate pinning, and credentials are protected with the Android Keystore.', es: 'CloudTek es una app móvil para gestionar infraestructura en la nube en AWS, Azure y GCP. Inicia, enciende, apaga, reinicia o elimina máquinas virtuales, gestiona firewalls y redes, y conéctate por SSH a cualquier VM desde una terminal integrada, todo desde tu teléfono. Un núcleo en Rust se comunica directamente con las API de los proveedores de la nube mediante TLS 1.3 con fijación de certificados, y las credenciales están protegidas con el Android Keystore.' },
        'ctk.securityTitle': { en: 'Security & Access', es: 'Seguridad y acceso' },
        'ctk.f1': { en: 'Launch, start, stop, reboot, delete VMs', es: 'Inicia, enciende, apaga, reinicia o elimina VM' },
        'ctk.f2': { en: 'AWS, Azure, and GCP in one app', es: 'AWS, Azure y GCP en una sola app' },
        'ctk.f3': { en: 'Marketplace and custom image management', es: 'Gestión de imágenes del marketplace y personalizadas' },
        'ctk.f4': { en: 'Activity dashboard with costs', es: 'Panel de actividad con costos' },
        'ctk.f5': { en: 'Built-in SSH terminal', es: 'Terminal SSH integrada' },
        'ctk.f6': { en: 'Credential manager (Android Keystore)', es: 'Gestor de credenciales (Android Keystore)' },
        'ctk.f7': { en: 'TLS 1.3 with certificate pinning', es: 'TLS 1.3 con fijación de certificados' },
        'ctk.f8': { en: 'Firewall and security group management', es: 'Gestión de firewalls y grupos de seguridad' },
        'ctk.docsText': { en: 'Follow CloudTek\'s development and learn how the app manages your cloud resources.', es: 'Sigue el desarrollo de CloudTek y descubre cómo la app gestiona tus recursos en la nube.' },
        'ctk.githubTitle': { en: 'CloudTek on GitHub', es: 'CloudTek en GitHub' },
        'ctk.githubText': { en: 'Browse the source code, track progress, and follow development of the CloudTek mobile app.', es: 'Explora el código fuente, sigue el progreso y acompaña el desarrollo de la app móvil de CloudTek.' },
        'docs.viewRepo': { en: 'View Repository', es: 'Ver repositorio' },
        'ctk.archTitle': { en: 'Mobile Architecture', es: 'Arquitectura móvil' },
        'ctk.archText': { en: 'High-level overview of how the Flutter app and Rust core manage VMs directly across AWS, Azure, and GCP.', es: 'Descripción general de cómo la app en Flutter y el núcleo en Rust gestionan VM directamente en AWS, Azure y GCP.' },
        'docs.viewOverview': { en: 'View Overview', es: 'Ver descripción general' },
        'ctk.privTitle': { en: 'Privacy by Design', es: 'Privacidad desde el diseño' },
        'ctk.privText': { en: 'CloudTek is built privacy-first \u2014 credentials stay on your device, protected by the Android Keystore.', es: 'CloudTek está construido con la privacidad como prioridad: las credenciales permanecen en tu dispositivo, protegidas con el Android Keystore.' },
        'docs.viewPolicy': { en: 'View Privacy Policy', es: 'Ver política de privacidad' },
        // StackTek page
        'stk.tagline': { en: 'Decoding the Stack', es: 'Decodificando el stack' },
        'feat.webDesk': { en: 'Web Desktops', es: 'Escritorios web' },
        'feat.aiAgents': { en: 'AI Agents', es: 'Agentes de IA' },
        'feat.contApps': { en: 'Containerized Apps', es: 'Apps en contenedores' },
        'stk.status': { en: 'Self-Hosted \u2014 Active Development', es: 'Autoalojado \u2014 En desarrollo activo' },
        'stk.platformTitle': { en: 'Platform Features', es: 'Funciones de la plataforma' },
        'stk.featuresText': { en: 'StackTek is a secure, browser-native workspace platform you self-host. Launch fully isolated web desktops, AI agents, and containerized Linux applications on demand and access everything directly in your browser over TLS \u2014 no VPN, no SSH, and no client software required. Each workspace is a disposable container built fresh on every launch, fronted by a Caddy + Coraza WAF edge, and running on immutable Fedora CoreOS with rootless Podman.', es: 'StackTek es una plataforma de espacios de trabajo segura, nativa del navegador y autoalojada. Lanza escritorios web totalmente aislados, agentes de IA y aplicaciones Linux en contenedores bajo demanda, y accede a todo directamente en tu navegador mediante TLS: sin VPN, sin SSH y sin software cliente. Cada espacio de trabajo es un contenedor desechable construido desde cero en cada lanzamiento, protegido por un borde Caddy + Coraza WAF y ejecutado sobre Fedora CoreOS inmutable con Podman sin root.' },
        'stk.workspacesTitle': { en: 'Workspaces', es: 'Espacios de trabajo' },
        'stk.w1': { en: 'Web desktops \u2014 Debian, Kali, Ubuntu, and more', es: 'Escritorios web: Debian, Kali, Ubuntu y más' },
        'stk.w2': { en: 'AI agents \u2014 OpenWebUI, LibreChat, Flowise, and more', es: 'Agentes de IA: OpenWebUI, LibreChat, Flowise y más' },
        'stk.w3': { en: 'Linux apps \u2014 Chromium, LibreOffice, VSCodium, and more', es: 'Apps de Linux: Chromium, LibreOffice, VSCodium y más' },
        'stk.w4': { en: 'Persistent data that survives restarts', es: 'Datos persistentes que sobreviven a los reinicios' },
        'stk.securityTitle': { en: 'Security & Isolation', es: 'Seguridad y aislamiento' },
        'stk.s1': { en: 'Browser access over TLS \u2014 no VPN required', es: 'Acceso desde el navegador mediante TLS, sin VPN' },
        'stk.s2': { en: 'Caddy + Coraza WAF edge (OWASP Core Rule Set)', es: 'Borde Caddy + WAF Coraza (OWASP Core Rule Set)' },
        'stk.s3': { en: 'Per-user isolation with rootless Podman containers', es: 'Aislamiento por usuario con contenedores Podman sin root' },
        'stk.s4': { en: 'Immutable Fedora CoreOS host, fresh build on every launch', es: 'Host Fedora CoreOS inmutable, construido desde cero en cada lanzamiento' },
        'stk.docsText': { en: 'Run StackTek on your own server and explore the workspace catalog.', es: 'Ejecuta StackTek en tu propio servidor y explora el catálogo de espacios de trabajo.' },
        'stk.githubTitle': { en: 'StackTek on GitHub', es: 'StackTek en GitHub' },
        'stk.githubText': { en: 'Browse the repository, follow development, and get the latest StackTek updates.', es: 'Explora el repositorio, sigue el desarrollo y obtén las últimas novedades de StackTek.' },
        'stk.quickTitle': { en: 'Quick Start Guide', es: 'Guía de inicio rápido' },
        'stk.quickText': { en: 'Get StackTek running on your own server in minutes with Podman Compose.', es: 'Pon StackTek a funcionar en tu propio servidor en minutos con Podman Compose.' },
        'docs.viewGuide': { en: 'View Guide', es: 'Ver guía' },
        'stk.catalogTitle': { en: 'Workspace Catalog', es: 'Catálogo de espacios de trabajo' },
        'stk.catalogText': { en: 'Explore the full catalog of web desktops, AI agents, security labs, and Linux apps.', es: 'Explora el catálogo completo de escritorios web, agentes de IA, laboratorios de seguridad y apps de Linux.' },
        'docs.viewCatalog': { en: 'View Catalog', es: 'Ver catálogo' },
        // LangTek product page
        'ltk.tagline': { en: 'Decoding the Lexicon', es: 'Decodificando el léxico' },
        'ltk.rss': { en: 'RSS Reader', es: 'Lector RSS' },
        'ltk.translation': { en: 'Translation', es: 'Traducción' },
        'ltk.media': { en: 'Videos & Podcasts', es: 'Videos y podcasts' },
        'ltk.beta': { en: 'Beta Release', es: 'Versión beta' },
        'ltk.deepDive': { en: 'LangTek Deep Dive', es: 'Análisis profundo de LangTek' },
        'ltk.keyFeatures': { en: 'Key Features', es: 'Funciones clave' },
        'ltk.keyFeaturesText': { en: 'LangTek combines media immersion with powerful language learning tools so you can master English or Spanish through real-world content.', es: 'LangTek combina la inmersión en medios con potentes herramientas de aprendizaje de idiomas para que domines el inglés o el español con contenido real.' },
        'ltk.featuresText': { en: 'LangTek is a media immersion language learning app for English and Spanish. Learn naturally by reading, watching, and listening - real articles, news, and stories from RSS feeds, plus videos, podcasts, EPUB books, and a built-in Public Domain Library. The built-in translator handles word-by-word and contextual translations, so you can focus on absorbing vocabulary and grammar through authentic content you actually want to consume.', es: 'LangTek es una app de aprendizaje de idiomas por inmersión en medios para inglés y español. Aprende de forma natural leyendo, viendo y escuchando: artículos, noticias e historias reales de feeds RSS, además de videos, podcasts, libros EPUB y una Biblioteca de Dominio Público integrada. El traductor incorporado maneja traducciones palabra por palabra y contextuales, para que te concentres en absorber vocabulario y gramática mediante contenido auténtico que de verdad quieres consumir.' },
        'ltk.toolsTitle': { en: 'Translation Tools', es: 'Herramientas de traducción' },
        'ltk.t1': { en: 'Word-by-word translation', es: 'Traducción palabra por palabra' },
        'ltk.t2': { en: 'API contextual translation', es: 'Traducción contextual por API' },
        'ltk.t3': { en: 'Offline database support', es: 'Soporte de base de datos sin conexión' },
        'ltk.t4': { en: 'Conversation AI with translation', es: 'IA de conversación con traducción' },
        'ltk.t5': { en: 'Grammar questions in English or Spanish', es: 'Preguntas de gramática en inglés o español' },
        'ltk.contentTitle': { en: 'Content Features', es: 'Funciones de contenido' },
        'ltk.c1': { en: 'RSS feeds, articles, and news', es: 'Feeds RSS, artículos y noticias' },
        'ltk.c2': { en: 'Videos and podcasts', es: 'Videos y podcasts' },
        'ltk.c3': { en: 'EPUB books and Public Domain Library', es: 'Libros EPUB y Biblioteca de Dominio Público' },
        'ltk.c4': { en: 'Anki flash cards', es: 'Tarjetas Anki' },
        'ltk.c5': { en: 'Reading timer', es: 'Temporizador de lectura' },
        'ltk.c6': { en: 'Scheduled notifications', es: 'Notificaciones programadas' },
        'ltk.c7': { en: 'Text-to-Speech (TTS)', es: 'Texto a voz (TTS)' },
        'ltk.docsText': { en: 'Learn how to use LangTek\'s features and get the most out of your language learning experience.', es: 'Aprende a usar las funciones de LangTek y aprovecha al máximo tu experiencia de aprendizaje de idiomas.' },
        'ltk.rssGuideTitle': { en: 'RSS Reader Guide', es: 'Guía del lector RSS' },
        'ltk.rssGuideText': { en: 'Learn how to add custom feeds, manage your subscriptions, and use the RSS reader for language learning.', es: 'Aprende a agregar feeds personalizados, gestionar tus suscripciones y usar el lector RSS para aprender idiomas.' },
        'ltk.transFeaturesTitle': { en: 'Translation Features', es: 'Funciones de traducción' },
        'ltk.transFeaturesText': { en: 'Detailed guide on using word-by-word translation, offline database, and API contextual translation.', es: 'Guía detallada sobre la traducción palabra por palabra, la base de datos sin conexión y la traducción contextual por API.' },
        'ltk.ttsTitle': { en: 'TTS Documentation', es: 'Documentación de TTS' },
        'ltk.ttsText': { en: 'Learn how to use the Text-to-Speech feature to improve your pronunciation and listening skills.', es: 'Aprende a usar la función de texto a voz para mejorar tu pronunciación y comprensión auditiva.' },
        // LangTek deep dive page
        'dd.eyebrow': { en: 'Deep Dive', es: 'Análisis profundo' },
        'dd.subtitle': { en: 'A media immersion app for learning English or Spanish.', es: 'Una app de inmersión en medios para aprender inglés o español.' },
        'dd.getCta': { en: 'Get LangTek on Google Play', es: 'Descargar LangTek en Google Play' },
        'dd.betaNote': { en: 'Beta Release. Free during beta testing.', es: 'Versión beta. Gratis durante las pruebas beta.' },
        'dd.back': { en: 'Back to the LangTek product page', es: 'Volver a la página de LangTek' },
        'dd.privacy': { en: 'Privacy Policy', es: 'Política de privacidad' },
        'dd.faq': { en: 'LangTek FAQ', es: 'Preguntas frecuentes de LangTek' }
    };

    function applyLanguage(lang) {
        if (lang !== 'en' && lang !== 'es') {
            lang = 'en';
        }
        document.documentElement.setAttribute('lang', lang === 'es' ? 'es' : 'en');
        document.querySelectorAll('[data-i18n]').forEach(function(el) {
            const entry = I18N[el.getAttribute('data-i18n')];
            if (entry && entry[lang]) {
                el.textContent = entry[lang];
            }
        });
        document.querySelectorAll('.lang-btn').forEach(function(btn) {
            const active = btn.getAttribute('data-lang') === lang;
            btn.classList.toggle('text-green-500', active);
            btn.classList.toggle('text-gray-300', !active);
            btn.setAttribute('aria-pressed', active ? 'true' : 'false');
        });
    }

    function setLanguage(lang) {
        if (lang !== 'en' && lang !== 'es') {
            lang = 'en';
        }
        try {
            localStorage.setItem(LANG_STORAGE_KEY, lang);
        } catch (err) {
            // localStorage unavailable (private mode) - switch still works for this page
        }
        applyLanguage(lang);
    }

    let savedLang = 'en';
    try {
        savedLang = localStorage.getItem(LANG_STORAGE_KEY) || 'en';
    } catch (err) {
        savedLang = 'en';
    }
    applyLanguage(savedLang);

    document.querySelectorAll('.lang-btn').forEach(function(btn) {
        btn.addEventListener('click', function() {
            setLanguage(btn.getAttribute('data-lang'));
        });
    });

    // Dark/Light mode toggle
    const themeToggle = document.querySelector('[aria-label="Toggle dark mode"]');
    if (themeToggle) {
        const htmlElement = document.documentElement;
        const sunIcon = themeToggle.querySelector('.fa-sun');
        
        if (sunIcon) {
            themeToggle.addEventListener('click', function() {
                if (sunIcon.classList.contains('fa-sun')) {
                    sunIcon.classList.remove('fa-sun');
                    sunIcon.classList.add('fa-moon');
                    sunIcon.classList.remove('text-yellow-400');
                    sunIcon.classList.add('text-blue-400');
                    // Would implement actual light mode toggle here
                } else {
                    sunIcon.classList.remove('fa-moon');
                    sunIcon.classList.add('fa-sun');
                    sunIcon.classList.remove('text-blue-400');
                    sunIcon.classList.add('text-yellow-400');
                    // Would implement actual dark mode toggle here
                }
            });
        }
    }
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href && href !== '#') {
                e.preventDefault();
                const targetElement = document.querySelector(href);
                if (targetElement) {
                    window.scrollTo({
                        top: targetElement.offsetTop - 80,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
    
    // Add hover-scale class to buttons
    document.querySelectorAll('button').forEach(button => {
        button.classList.add('hover-scale');
    });
    
    // Form validation
    const contactForm = document.querySelector('#contact form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form elements safely
            const nameInput = document.getElementById('name');
            const emailInput = document.getElementById('email');
            const subjectInput = document.getElementById('subject');
            const messageInput = document.getElementById('message');
            
            if (!nameInput || !emailInput || !subjectInput || !messageInput) {
                console.error('Form fields not found');
                return;
            }
            
            // Get values and sanitize
            const name = nameInput.value.trim();
            const email = emailInput.value.trim();
            const subject = subjectInput.value.trim();
            const message = messageInput.value.trim();
            
            // Simple validation
            if (!name || !email || !subject || !message) {
                alert('Please fill in all fields');
                return;
            }
            
            // Email validation with strict regex
            const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
            if (!emailRegex.test(email)) {
                alert('Please enter a valid email address');
                return;
            }
            
            // Would send form data to server here
            console.log('Form submitted:', { 
                name: name, 
                email: email, 
                subject: subject, 
                message: message 
            });
            
            alert('Thank you for your message! We will get back to you soon.');
            this.reset();
        });
    }
});
