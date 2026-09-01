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
        nav.appendChild(productsHeader);
        
        // Menu links
        const links = [
            { href: '/', text: 'Cloud Marketplace', icon: 'fas fa-cloud text-blue-400 mr-2' },
            { href: '/products/langtek/', text: 'LangTek', icon: 'fas fa-language text-green-500 mr-2' },
            { href: '/products/cloudtek/', text: 'CloudTek', icon: 'fas fa-server text-orange-500 mr-2' },
            { href: '/products/stacktek/', text: 'StackTek', icon: 'fas fa-layer-group text-blue-400 mr-2' },
            { href: 'https://decyphertek.readthedocs.io/en/latest/', text: 'Docs', icon: 'fas fa-book text-blue-400 mr-2' },
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
            
            const text = document.createTextNode(link.text);
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
