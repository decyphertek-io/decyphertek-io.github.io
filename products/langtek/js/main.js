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
        'dd.i1': { en: 'You already spend your day immersed in media. You read the news over coffee, watch videos on your lunch break, and put on a podcast while you drive or cook. That is how you stay sharp in your native language. Nobody studies for it. There are no lessons in it. You just keep consuming things you wanted to consume anyway.', es: 'Ya pasas el día inmerso en medios. Lees las noticias con el café, ves videos en el descanso del almuerzo y pones un podcast mientras manejas o cocinas. Así mantienes tu idioma nativo al día. Nadie estudia para eso. No hay lecciones en ello. Simplemente sigues consumiendo cosas que de todas formas querías consumir.' },
        'dd.i2': { en: 'LangTek points that same habit at a second language. You read, watch, and listen to real English or Spanish content inside the app, and a built-in translator stands by for the moments you get stuck. There are no streaks to keep, no points to earn, and no gamification. Just the media, a translator, and a set of study tools that respect your time.', es: 'LangTek apunta ese mismo hábito a un segundo idioma. Lees, ves y escuchas contenido real en inglés o español dentro de la app, y un traductor integrado está ahí para los momentos en que te atascas. No hay rachas que mantener, puntos que ganar ni gamificación. Solo los medios, un traductor y un conjunto de herramientas de estudio que respetan tu tiempo.' },
        'dd.h1': { en: 'Why immersion beats lessons', es: 'Por qué la inmersión gana a las lecciones' },
        'dd.h1p1': { en: 'Think about how you learned the words you use every day. Very few of them came from a textbook. They came from sportscasters, song lyrics, comments sections, and conversations you actually wanted to follow. Vocabulary sticks when it arrives attached to something you cared about, and grammar makes sense once you have seen it used a few hundred times in real sentences.', es: 'Piensa en cómo aprendiste las palabras que usas todos los días. Muy pocas vienen de un libro de texto. Vinieron de narradores deportivos, letras de canciones, secciones de comentarios y conversaciones que en verdad querías seguir. El vocabulario se queda cuando llega pegado a algo que te importaba, y la gramática tiene sentido una vez que la has visto usada unas cien veces en oraciones reales.' },
        'dd.h1p2': { en: 'Most language apps work the other way around. They front-load you with drills, lock progress behind a paywall, and train you to memorize isolated words you will forget by Friday. Immersion apps like LangTek take the opposite approach. The content is the course, and the study tools exist to support it, not to replace it.', es: 'La mayoría de las apps de idiomas funcionan al revés. Te saturan con ejercicios, bloquean el progreso detrás de un pago y te entrenan para memorizar palabras aisladas que olvidarás el viernes. Las apps de inmersión como LangTek toman el enfoque opuesto. El contenido es el curso, y las herramientas de estudio existen para apoyarlo, no para reemplazarlo.' },
        'dd.h1p3': { en: 'That said, immersion alone has a gap: comprehension. When every third word is unknown, people quit. LangTek closes that gap with translation help when you get stuck, spaced-repetition flash cards, and an AI you can ask questions. You stay in the content, which is where the learning happens.', es: 'Dicho esto, la inmersión sola tiene un vacío: la comprensión. Cuando cada tercera palabra es desconocida, la gente abandona. LangTek cierra ese vacío con ayuda de traducción cuando te atascas, tarjetas de repetición espaciada y una IA a la que puedes hacer preguntas. Tú te quedas en el contenido, que es donde ocurre el aprendizaje.' },
        'dd.h2': { en: 'Reading: RSS articles and news', es: 'Lectura: artículos y noticias RSS' },
        'dd.h2p1': { en: 'The core of the app is an RSS reader. Bring the feeds you already follow, in the language you are learning, or start with feeds covering news, technology, sports, and finance. Every article you open is real, current content written for native speakers, not simplified textbook Spanish or English.', es: 'El corazón de la app es un lector RSS. Trae los feeds que ya sigues, en el idioma que estás aprendiendo, o empieza con feeds de noticias, tecnología, deportes y finanzas. Cada artículo que abres es contenido real y actual, escrito para hablantes nativos, no español ni inglés simplificados de libro de texto.' },
        'dd.h2p2': { en: 'Reading a daily article in Spanish fits into the same gap in your day that scrolling a news feed already occupies. The difference is that this habit compounds. A few articles a week turns into a few hundred by the end of a quarter, and the vocabulary you meet keeps showing up again because real news rhymes: the same politicians, the same teams, the same eight verbs.', es: 'Leer un artículo diario en español cabe en el mismo hueco del día que ya ocupa el scroll de un feed de noticias. La diferencia es que este hábito se acumula. Unos artículos a la semana se convierten en unos cientos al final de un trimestre, y el vocabulario que encuentras sigue apareciendo porque las noticias reales riman: los mismos políticos, los mismos equipos, los mismos ocho verbos.' },
        'dd.h2cap': { en: 'Real articles, with translation built in so unfamiliar words never stop you.', es: 'Artículos reales, con traducción integrada para que las palabras desconocidas nunca te detengan.' },
        'dd.h3': { en: 'Videos: learn English or Spanish by watching', es: 'Videos: aprende inglés o español viendo' },
        'dd.h3p1': { en: 'LangTek also brings video into the same reader. Watch Spanish or English videos on the topics you already follow, and when a sentence goes by too fast, use the same translation tools you use for articles to pick it apart.', es: 'LangTek también trae el video al mismo lector. Mira videos en español o inglés sobre los temas que ya sigues, y cuando una oración pasa demasiado rápido, usa las mismas herramientas de traducción que usas para los artículos y desármala.' },
        'dd.h3p2': { en: 'Video gives you something text cannot: faces, gestures, and mouth shapes. Hearing a word while you watch someone say it anchors the sound to the meaning in a way that reading alone does not, and for learners whose goal is conversation, that pairing matters more than perfect grammar.', es: 'El video te da algo que el texto no puede: rostros, gestos y formas de los labios. Escuchar una palabra mientras ves a alguien decirla ancla el sonido al significado de una forma en que la lectura sola no lo hace, y para quienes buscan conversar, ese emparejamiento importa más que la gramática perfecta.' },
        'dd.h3cap': { en: 'Watch what you already watch. It just counts as practice now.', es: 'Mira lo que ya mirabas. Ahora simplemente cuenta como práctica.' },
        'dd.h4': { en: 'Podcasts: learn Spanish or English by listening', es: 'Podcasts: aprende español o inglés escuchando' },
        'dd.h4p1': { en: 'Podcasts are where the immersion habit gets cheap. You can listen while driving, walking, washing dishes, or pretending to work out. LangTek treats podcast feeds like any other feed, so the shows live next to your articles and videos instead of in a separate app you never open.', es: 'Los podcasts son donde el hábito de inmersión sale barato. Puedes escuchar mientras manejas, caminas, lavas los platos o finges hacer ejercicio. LangTek trata los feeds de podcasts como cualquier otro feed, así que los shows viven junto a tus artículos y videos en lugar de en una app aparte que nunca abres.' },
        'dd.h4p2': { en: 'Listening builds an ear for the actual speed and rhythm of the language, which is usually the last thing to click for learners. Words you can read comfortably can still fly by at native speed, and the only fix for that is listening in volume. Having transcription-style translation help a tap away means a fast segment never becomes a dead end.', es: 'Escuchar entrena el oído para la velocidad y el ritmo reales del idioma, que suele ser lo último que se domina. Las palabras que lees con comodidad pueden pasar volando a velocidad nativa, y la única solución es escuchar en volumen. Tener ayuda de traducción tipo transcripción a un toque de distancia significa que un segmento rápido nunca se convierte en un callejón sin salida.' },
        'dd.h4cap': { en: 'Podcasts fill the dead time in a day. No extra time required.', es: 'Los podcasts llenan el tiempo muerto del día. No requieren tiempo extra.' },
        'dd.h5': { en: 'EPUB reader and free Spanish and English books', es: 'Lector EPUB y libros gratis en español e inglés' },
        'dd.h5p1': { en: 'When you are ready for longer reads, LangTek opens EPUB books. Load your own, or browse the built-in Public Domain Library, a collection of classic books in English and Spanish that costs nothing because their copyrights have long since expired. Cervantes, Twain, Verne, and thousands of others.', es: 'Cuando estás listo para lecturas más largas, LangTek abre libros EPUB. Carga los tuyos, o explora la Biblioteca de Dominio Público integrada, una colección de clásicos en inglés y español que no cuesta nada porque sus derechos de autor expiraron hace tiempo. Cervantes, Twain, Verne y miles más.' },
        'dd.h5p2': { en: 'Finishing your first whole novel in a second language is a quiet milestone. The first chapters are slow and the translation tools get heavy use. Somewhere past the halfway mark you notice you have stopped translating every other line, and by the end you are reading in the language instead of decoding it. The library exists so that experience does not require a bookstore budget.', es: 'Terminar tu primera novela completa en un segundo idioma es un hito silencioso. Los primeros capítulos son lentos y las herramientas de traducción se usan a fondo. En algún punto después de la mitad notas que dejaste de traducir cada dos líneas, y al final estás leyendo en el idioma en lugar de descifrarlo. La biblioteca existe para que esa experiencia no requiera presupuesto de librería.' },
        'dd.h5cap1': { en: 'Read full EPUB books with the same translation help.', es: 'Lee libros EPUB completos con la misma ayuda de traducción.' },
        'dd.h5cap2': { en: 'The built-in bookstore, stocked with free public domain classics.', es: 'La librería integrada, surtida con clásicos de dominio público gratuitos.' },
        'dd.h6': { en: 'Word-for-word and contextual translation', es: 'Traducción palabra por palabra y contextual' },
        'dd.h6p1': { en: 'LangTek gives you two translations at once, because they teach you different things. The word-for-word translation shows you the literal skeleton of the sentence, which is how you learn structure and decode new words yourself. The contextual translation shows you what the sentence actually means, which is how natives would say it.', es: 'LangTek te da dos traducciones a la vez, porque te enseñan cosas distintas. La traducción palabra por palabra muestra el esqueleto literal de la oración, que es como aprendes la estructura y descifras palabras nuevas por ti mismo. La traducción contextual muestra lo que la oración significa en realidad, que es como lo diría un hablante nativo.' },
        'dd.h6p2': { en: 'Over time, comparing the two trains you to stop translating in your head. You start noticing that Spanish puts the verb somewhere unexpected or that an English idiom has a Spanish cousin, and those observations stick better than a grammar table ever did. There is also offline database support, so common translations do not always depend on a network connection.', es: 'Con el tiempo, comparar las dos te entrena para dejar de traducir en tu cabeza. Empiezas a notar que el español pone el verbo en un lugar inesperado o que un modismo inglés tiene un primo español, y esas observaciones se quedan mejor que cualquier tabla de gramática. También hay soporte de base de datos sin conexión, así que las traducciones comunes no siempre dependen de una conexión de red.' },
        'dd.h6p3': { en: 'The same two-layer translation follows you across everything in the app: articles, videos, podcasts, and books. Wherever the language gets hard, the tools are the same and a tap away.', es: 'La misma traducción de dos capas te sigue en todo lo que hay en la app: artículos, videos, podcasts y libros. Donde el idioma se pone difícil, las herramientas son las mismas y están a un toque.' },
        'dd.h7': { en: 'Grammar info from Wiktionary', es: 'Información gramatical de Wiktionary' },
        'dd.h7p1': { en: 'Sometimes a translation is not the question. You meet a verb and want its conjugation, or a noun whose gender decides the article in front of it. For moments like that, LangTek pulls grammar info from Wiktionary while you read an RSS article, so definitions, parts of speech, and word forms are a tap away without leaving the page.', es: 'A veces la traducción no es la pregunta. Encuentras un verbo y quieres su conjugación, o un sustantivo cuyo género decide el artículo que lleva delante. Para momentos así, LangTek extrae información gramatical de Wiktionary mientras lees un artículo RSS, así que definiciones, partes de la oración y formas de las palabras están a un toque sin salir de la página.' },
        'dd.h7p2': { en: 'The EPUB reader has the same Wiktionary option, so the same help follows you into books. The reference material lives inside the app instead of another tab, which keeps the reading session moving.', es: 'El lector EPUB tiene la misma opción de Wiktionary, así que la misma ayuda te sigue en los libros. El material de referencia vive dentro de la app en lugar de en otra pestaña, lo que mantiene la sesión de lectura en marcha.' },
        'dd.h8': { en: 'Conversation AI with translation', es: 'IA de conversación con traducción' },
        'dd.h8p1': { en: 'Speaking is the part most learners postpone, because it needs a partner and a partner needs scheduling. The conversation AI in LangTek is the partner that is always available. Type in English or Spanish, and it replies like a normal chat, with translations alongside so the conversation never breaks down because of one unknown word.', es: 'Hablar es la parte que la mayoría de los estudiantes pospone, porque necesita un compañero y un compañero necesita coordinación. La IA de conversación de LangTek es el compañero que siempre está disponible. Escribe en inglés o español, y responde como un chat normal, con traducciones al lado para que la conversación nunca se rompa por una palabra desconocida.' },
        'dd.h8p2': { en: 'It also answers grammar questions on demand. If a verb ending confused you in this morning\'s article, you can ask about it in plain English and get the word-for-word and contextual breakdown plus grammar notes, without sidetracking your reading session.', es: 'También responde preguntas de gramática al momento. Si una terminación verbal te confundió en el artículo de esta mañana, puedes preguntar en inglés sencillo y obtener el desglose palabra por palabra y contextual más notas de gramática, sin desviar tu sesión de lectura.' },
        'dd.h8p3': { en: 'The AI feature is optional, and it only ever sees what you type into it. It is a tool that lives quietly until you call on it, like the rest of the app.', es: 'La función de IA es opcional, y solo ve lo que tú le escribes. Es una herramienta que vive en silencio hasta que la llamas, como el resto de la app.' },
        'dd.h8cap': { en: 'Conversation practice with a partner that never gets tired of your questions.', es: 'Práctica de conversación con un compañero que nunca se cansa de tus preguntas.' },
        'dd.h9': { en: 'Anki flash cards and spaced repetition for vocabulary', es: 'Tarjetas Anki y repetición espaciada para vocabulario' },
        'dd.h9p1': { en: 'Immersion fills your head with new words, and spaced repetition keeps them there. LangTek builds in Anki flash cards, the gold standard for vocabulary review: every card carries a memory schedule, the ones you know well come back rarely, and the ones that slip away come back right before you would have forgotten them.', es: 'La inmersión te llena la cabeza de palabras nuevas, y la repetición espaciada las mantiene ahí. LangTek integra tarjetas Anki, el estándar de oro para repasar vocabulario: cada tarjeta carga su propio calendario de memoria, las que sabes bien vuelven rara vez, y las que se te escapan vuelven justo antes de que las hubieras olvidado.' },
        'dd.h9p2': { en: 'This closes the loop the app is built on. You meet a word on Tuesday while reading news you actually care about, it becomes a flash card, and LangTek hands it back to you at the moment it needs one more look. You are not memorizing a list someone else wrote. You are reviewing your own reading history, card by card.', es: 'Esto cierra el ciclo sobre el que la app está construida. Encuentras una palabra un martes leyendo noticias que en verdad te importan, se convierte en tarjeta, y LangTek te la devuelve en el momento en que necesita una mirada más. No estás memorizando una lista que otra persona escribió. Estás repasando tu propia historia de lectura, tarjeta por tarjeta.' },
        'dd.h9cap1': { en: 'Spaced repetition review of the words you met in your content.', es: 'Revisión con repetición espaciada de las palabras que encontraste en tu contenido.' },
        'dd.h9cap2': { en: 'Deck management for your collection as it grows.', es: 'Gestión de mazos para tu colección a medida que crece.' },
        'dd.h10': { en: 'Reading timer and scheduled notifications', es: 'Temporizador de lectura y notificaciones programadas' },
        'dd.h10p1': { en: 'Languages are not learned in weekend marathons. They are learned by showing up a bit at a time, for months, until the accent stops sounding like noise. LangTek keeps the habit honest with a reading timer that tracks your sessions and scheduled notifications that put the app in front of you at the times you actually have a spare minute.', es: 'Los idiomas no se aprenden en maratones de fin de semana. Se aprenden apareciendo un poco a la vez, durante meses, hasta que el acento deja de sonar a ruido. LangTek mantiene honesto el hábito con un temporizador de lectura que registra tus sesiones y notificaciones programadas que ponen la app frente a ti en los momentos en que de verdad tienes un minuto libre.' },
        'dd.h10p2': { en: 'A timer sounds like a small thing, but it changes your relationship with practice. Fifteen honest minutes with a timer on feels different from a vague intention to read more, and the notifications keep the footprint small: a nudge, not a guilt trip.', es: 'Un temporizador suena a cosa pequeña, pero cambia tu relación con la práctica. Quince minutos honestos con el temporizador encendido se sienten distintos a una vaga intención de leer más, y las notificaciones mantienen la huella pequeña: un empujón, no un golpe de culpa.' },
        'dd.h10cap': { en: 'Time on task, tracked and scheduled on your terms.', es: 'Tiempo en la tarea, registrado y programado a tu manera.' },
        'dd.h11': { en: 'Text-to-speech: listen while you read', es: 'Texto a voz: escucha mientras lees' },
        'dd.h11p1': { en: 'Text-to-speech reads content aloud so you can hear the words while your eyes follow them. For learners, pairing the sound with the page is one of the cheapest wins there is: pronunciation stops being guesswork, and words you have only ever read acquire a voice. It is also a way to keep consuming when your eyes are busy, since articles can play while you handle the dishes you were pretending not to see.', es: 'El texto a voz lee el contenido en voz alta para que escuches las palabras mientras tus ojos las siguen. Para estudiantes, emparejar el sonido con la página es de las victorias más baratas que existen: la pronunciación deja de ser adivinanza, y las palabras que solo habías leído adquieren una voz. También es una forma de seguir consumiendo cuando tienes los ojos ocupados, ya que los artículos pueden sonar mientras te ocupas de esos platos que fingías no ver.' },
        'dd.h12': { en: 'No games, no lessons, no tracking', es: 'Sin juegos, sin lecciones, sin rastreo' },
        'dd.h12p1': { en: 'LangTek does not track your behavior, sell your data, or wrap your study time in notifications engineered to make you anxious. The translator and the conversation AI see only what you send them, and anything optional stays optional. The interface is deliberately minimal, because every minute you spend navigating an app is a minute you did not spend in the language.', es: 'LangTek no rastrea tu comportamiento, no vende tus datos ni envuelve tu tiempo de estudio en notificaciones diseñadas para ponerte ansioso. El traductor y la IA de conversación solo ven lo que les envías, y todo lo opcional sigue siendo opcional. La interfaz es deliberadamente minimalista, porque cada minuto que pasas navegando una app es un minuto que no pasaste en el idioma.' },
        'dd.h12p2': { en: 'The settings that exist are the ones that matter: your feeds, your languages, your review decks, and how the app looks and reads. Nothing is hiding behind a paywall you cannot see coming.', es: 'Las configuraciones que existen son las que importan: tus feeds, tus idiomas, tus mazos de repaso y el aspecto y la lectura de la app. Nada está escondido detrás de un pago que no puedas ver venir.' },
        'dd.story': { en: 'My personal story', es: 'Mi historia personal' },
        'dd.story1': { en: 'I struggled with learning a second language for years. I tried many language apps, and I always found the games and lessons unappealing. I stayed persistent and kept trying different ways to learn.', es: 'Luché durante años por aprender un segundo idioma. Probé muchas apps de idiomas y sus juegos y lecciones siempre me parecieron poco atractivos. Me mantuve persistente y seguí probando distintas formas de aprender.' },
        'dd.story2': { en: 'Eventually I started consuming media in my second language the same way I do in my native language. I read books, watched videos and movies, listened to podcasts, and even tried to think in the language. Suddenly I improved. Daily media immersion was building my ability in a way the apps never had.', es: 'Con el tiempo empecé a consumir medios en mi segundo idioma igual que lo hago en mi idioma nativo. Leí libros, vi videos y películas, escuché podcasts e incluso intenté pensar en el idioma. De repente mejoré. La inmersión diaria en medios estaba construyendo mi habilidad de una forma en que las apps nunca lo hicieron.' },
        'dd.story3': { en: 'The only issue was that I had to switch between many different apps to achieve this. That gave me the idea to develop an app that makes it easier to consume media in a second language. Then I thought, maybe other people are having the same issue learning another language.', es: 'El único problema era que tenía que alternar entre muchas apps distintas para lograrlo. Eso me dio la idea de desarrollar una app que hiciera más fácil consumir medios en un segundo idioma. Luego pensé: ¿quizá otras personas tienen el mismo problema aprendiendo otro idioma?' },
        'dd.story4': { en: 'That is why I built LangTek.', es: 'Por eso construí LangTek.' },
        'dd.q1': { en: 'What is media immersion language learning?', es: '¿Qué es el aprendizaje de idiomas por inmersión en medios?' },
        'dd.a1': { en: 'It is learning a second language by consuming normal media in that language, like news articles, videos, podcasts, and books, instead of working through lessons and drills. It works because it is the same process you already use every day to stay sharp in your native language.', es: 'Es aprender un segundo idioma consumiendo medios normales en ese idioma, como artículos de noticias, videos, podcasts y libros, en lugar de avanzar por lecciones y ejercicios. Funciona porque es el mismo proceso que ya usas todos los días para mantenerte al día en tu idioma nativo.' },
        'dd.q2': { en: 'Can I really learn Spanish by reading news articles?', es: '¿De verdad puedo aprender español leyendo artículos de noticias?' },
        'dd.a2': { en: 'Yes. Daily news is repetitive by nature, so the vocabulary you meet keeps coming back in new combinations, which is exactly how words stick. LangTek keeps each article readable with word-for-word and contextual translation, and the flash card review catches the words you want to keep.', es: 'Sí. Las noticias diarias son repetitivas por naturaleza, así que el vocabulario que encuentras sigue volviendo en combinaciones nuevas, que es exactamente cómo las palabras se quedan. LangTek mantiene cada artículo legible con traducción palabra por palabra y contextual, y el repaso con tarjetas captura las palabras que quieres conservar.' },
        'dd.q3': { en: 'Does LangTek have an RSS reader for language learning?', es: '¿LangTek tiene un lector RSS para aprender idiomas?' },
        'dd.a3': { en: 'Yes, RSS is the core of the app. You can bring the Spanish or English feeds you already follow, or start with presets covering news, technology, sports, and finance. Every article opens with translation tools built in.', es: 'Sí, el RSS es el corazón de la app. Puedes traer los feeds en español o inglés que ya sigues, o empezar con presets de noticias, tecnología, deportes y finanzas. Cada artículo se abre con herramientas de traducción integradas.' },
        'dd.q4': { en: 'Can I learn English or Spanish with videos and podcasts?', es: '¿Puedo aprender inglés o español con videos y podcasts?' },
        'dd.a4': { en: 'Yes. Videos and podcast feeds live alongside your articles, with the same translation help a tap away. Watching trains your eyes and ears together, and listening at native speed is the fastest way to make fast speech stop sounding like noise.', es: 'Sí. Los videos y feeds de podcasts viven junto a tus artículos, con la misma ayuda de traducción a un toque. Ver entrena tus ojos y oídos juntos, y escuchar a velocidad nativa es la forma más rápida de que el habla rápida deje de sonar a ruido.' },
        'dd.q5': { en: 'Can I read EPUB books and free Spanish books?', es: '¿Puedo leer libros EPUB y libros gratis en español?' },
        'dd.a5': { en: 'Yes. Load your own EPUB files, or browse the built-in Public Domain Library, which is stocked with free classic Spanish and English books whose copyrights have expired. The same translation tools follow you into every book.', es: 'Sí. Carga tus propios archivos EPUB, o explora la Biblioteca de Dominio Público integrada, llena de clásicos gratuitos en español e inglés cuyos derechos de autor expiraron. Las mismas herramientas de traducción te siguen en cada libro.' },
        'dd.q6': { en: 'Does LangTek support Anki flash cards?', es: '¿LangTek es compatible con tarjetas Anki?' },
        'dd.a6': { en: 'Yes. Anki flash cards are built into the app with spaced repetition scheduling, the proven method for vocabulary review. Words you meet while reading become cards, and each card comes back right before you would have forgotten it.', es: 'Sí. Las tarjetas Anki están integradas en la app con programación de repetición espaciada, el método probado para repasar vocabulario. Las palabras que encuentras leyendo se convierten en tarjetas, y cada tarjeta vuelve justo antes de que la hubieras olvidado.' },
        'dd.q7': { en: 'How does the Spanish to English translation work?', es: '¿Cómo funciona la traducción de español a inglés?' },
        'dd.a7': { en: 'Every sentence offers two translations at once: a word-for-word translation that shows the literal structure, and a contextual translation that shows what the sentence actually means. There is offline database support, so common translations do not depend on a connection.', es: 'Cada oración ofrece dos traducciones a la vez: una traducción palabra por palabra que muestra la estructura literal, y una traducción contextual que muestra lo que la oración significa en realidad. Hay soporte de base de datos sin conexión, así que las traducciones comunes no dependen de una conexión.' },
        'dd.q8': { en: 'Is LangTek a no-games, no-lessons language learning app?', es: '¿LangTek es una app de idiomas sin juegos y sin lecciones?' },
        'dd.a8': { en: 'Yes. There are no streaks, points, or gamification, and there is no tracking or data selling. The app is free during beta, with a single three dollar monthly subscription planned once beta ends.', es: 'Sí. No hay rachas, puntos ni gamificación, y no hay rastreo ni venta de datos. La app es gratis durante la beta, con una única suscripción mensual de tres dólares planeada para cuando termine la beta.' },
        'dd.faq': { en: 'LangTek FAQ', es: 'Preguntas frecuentes de LangTek' },
        'dd.h13': { en: 'Pricing: free during beta', es: 'Precio: gratis durante la beta' },
        'dd.h13p1': { en: 'LangTek is free while it is in beta, and you should judge it on how it works today, not on a promise. Once beta ends, the plan is a single subscription at three dollars a month, which is a fraction of what most language apps charge, and there will be one plan because pricing games are their own kind of lesson nobody needs.', es: 'LangTek es gratis mientras está en beta, y deberías juzgarla por cómo funciona hoy, no por una promesa. Cuando termine la beta, el plan es una única suscripción de tres dólares al mes, una fracción de lo que cobran la mayoría de las apps de idiomas, y habrá un solo plan porque los juegos de precios son su propia clase de lección que nadie necesita.' },
        'dd.h13p2': { en: 'We would rather earn a small subscription from people who read in the app every week than farm attention from people who forgot to cancel. The app is available now on Google Play, and the full privacy policy lives in the documentation.', es: 'Preferimos ganar una pequeña suscripción de personas que leen en la app cada semana a cultivar la atención de personas que olvidaron cancelar. La app está disponible ahora en Google Play, y la política de privacidad completa vive en la documentación.' },
        'dd.getCta': { en: 'Get LangTek on Google Play', es: 'Descargar LangTek en Google Play' },
        'dd.betaNote': { en: 'Beta Release. Free during beta testing.', es: 'Versión beta. Gratis durante las pruebas beta.' },
        'dd.back': { en: 'Back to the LangTek product page', es: 'Volver a la página de LangTek' },
        'dd.privacy': { en: 'Privacy Policy', es: 'Política de privacidad' }
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
