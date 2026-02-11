// Initialize Lucide icons
lucide.createIcons();

// Mobile Menu Toggle (Robust & Smooth)
const menuToggle = document.getElementById('menuToggle');
const navContainer = document.querySelector('.nav-container');
const body = document.body;

if (menuToggle && navContainer) {
    const toggleMenu = (isOpen) => {
        const icon = menuToggle.querySelector('i');

        if (isOpen) {
            navContainer.classList.add('active');
            body.style.overflow = 'hidden'; // Lock scroll
            icon.setAttribute('data-lucide', 'x');
        } else {
            navContainer.classList.remove('active');
            body.style.overflow = ''; // Unlock scroll
            icon.setAttribute('data-lucide', 'menu');
        }
        lucide.createIcons();
    };

    menuToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        const isOpen = navContainer.classList.contains('active');
        toggleMenu(!isOpen);
    });

    // Close on Link Click
    document.querySelectorAll('.nav-menu a').forEach(link => {
        link.addEventListener('click', () => toggleMenu(false));
    });

    // Close on Outside Click
    document.addEventListener('click', (e) => {
        const isOpen = navContainer.classList.contains('active');
        if (isOpen && !navContainer.contains(e.target) && !menuToggle.contains(e.target)) {
            toggleMenu(false);
        }
    });

    // Close on ESC
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') toggleMenu(false);
    });
}

// --------------------------------------------------------------------------
// CONSOLIDATED SCROLL & INTERACTION MANAGER (Performance Optimized)
// --------------------------------------------------------------------------
const OptimizationManager = {
    ticking: false,
    lastScrollY: window.scrollY,
    lastMouseX: 0,
    lastMouseY: 0,
    viewportHeight: window.innerHeight,
    viewportWidth: window.innerWidth,
    reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,

    // Elements
    header: document.querySelector('.header'),
    navLinks: document.querySelectorAll('.nav-menu a'),
    sections: document.querySelectorAll('section[id]'),
    footer: document.querySelector('.footer-premium-studio'),
    parallaxText: document.querySelector('.footer-parallax-text span'),
    cards: document.querySelectorAll('.card-wrapper'),
    rippleTexts: document.querySelectorAll('.ripple-text'),
    auroraBlobs: document.querySelectorAll('.aurora-blob'),

    init() {
        // Passive listeners for best performance
        window.addEventListener('scroll', () => this.onScroll(), { passive: true });
        window.addEventListener('resize', () => this.onResize(), { passive: true });

        if (!this.reducedMotion) {
            window.addEventListener('mousemove', (e) => this.onMouseMove(e), { passive: true });
        }

        // Initial setup
        this.update();
    },

    onScroll() {
        this.lastScrollY = window.scrollY;
        this.requestTick();
    },

    onResize() {
        this.viewportHeight = window.innerHeight;
        this.viewportWidth = window.innerWidth;
        this.requestTick();
    },

    onMouseMove(e) {
        this.lastMouseX = e.clientX;
        this.lastMouseY = e.clientY;
        this.requestTick();
    },

    requestTick() {
        if (!this.ticking) {
            requestAnimationFrame(() => this.update());
            this.ticking = true;
        }
    },

    update() {
        const scrollPos = this.lastScrollY;
        const mouseX = this.lastMouseX;
        const mouseY = this.lastMouseY;

        // 1. Sticky Header
        if (this.header) {
            this.header.classList.toggle('sticky', scrollPos > 100);
        }

        // 2. Active Link Highlighting (Index page only)
        if (window.location.pathname.includes('index.html') || window.location.pathname === '/') {
            let current = "";
            for (const section of this.sections) {
                if (scrollPos >= section.offsetTop - 250) {
                    current = section.getAttribute("id");
                }
            }
            this.navLinks.forEach(link => {
                link.classList.toggle('active', link.getAttribute('href').split('#')[1] === current);
            });
        }

        // 3. Footer Parallax
        if (this.footer && this.parallaxText && !this.reducedMotion) {
            const rect = this.footer.getBoundingClientRect();
            if (rect.top <= this.viewportHeight && rect.bottom >= 0) {
                const percentage = (this.viewportHeight - rect.top) / (this.viewportHeight + rect.height);
                const moveY = (percentage - 0.5) * 200;
                this.parallaxText.style.transform = `translate3d(0, ${moveY}px, 0)`;
            }
        }

        // 4. Project Card Stacking
        if (this.cards.length > 0) {
            this.cards.forEach((cardWrapper, index) => {
                const cardInner = cardWrapper.querySelector('.project-card');
                const nextCard = this.cards[index + 1];
                let scale = 1, blur = 0, brightness = 1;

                if (nextCard) {
                    const nextRect = nextCard.getBoundingClientRect();
                    const stickPoint = this.viewportHeight * 0.15;
                    let progress = Math.max(0, Math.min((nextRect.top - stickPoint) / (this.viewportHeight - stickPoint), 1));

                    scale = 0.9 + (0.1 * progress);
                    blur = (1 - progress) * 8;
                    brightness = 0.6 + (0.4 * progress);
                }

                const rx = cardInner.style.getPropertyValue('--rx') || '0deg';
                const ry = cardInner.style.getPropertyValue('--ry') || '0deg';

                // Use translate3d for GPU acceleration
                cardInner.style.transform = `translate3d(0,0,0) scale(${scale}) perspective(1000px) rotateX(${rx}) rotateY(${ry})`;

                if (!this.reducedMotion) {
                    cardInner.style.filter = `blur(${blur}px) brightness(${brightness})`;
                }
            });
        }

        // 5. Ripple Texts (Integrated)
        if (this.rippleTexts.length > 0 && !this.reducedMotion) {
            this.rippleTexts.forEach(text => {
                const rect = text.getBoundingClientRect();
                const centerX = rect.left + rect.width / 2;
                const centerY = rect.top + rect.height / 2;
                const moveX = (mouseX - centerX) * 0.05;
                const moveY = (mouseY - centerY) * 0.05;
                text.style.transform = `translate3d(${moveX}px, ${moveY}px, 0) skewX(${moveX * 0.1}deg)`;
            });
        }

        // 6. Aurora Blobs (Integrated)
        if (this.auroraBlobs.length > 0 && !this.reducedMotion) {
            this.auroraBlobs.forEach((blob, index) => {
                const speed = (index + 1) * 0.02;
                const dx = (mouseX - this.viewportWidth / 2) * speed;
                const dy = (mouseY - this.viewportHeight / 2) * speed;
                const pulse = 1 + Math.sin(Date.now() * 0.001 + index) * 0.1;
                blob.style.transform = `translate3d(${dx}px, ${dy}px, 0) scale(${pulse})`;
            });
            // Keep loop alive for aurora pulse if screen is not static
            this.requestTick();
        }

        this.ticking = false;
    }
};

// Start Manager
OptimizationManager.init();

// Smooth Scroll for links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
            navContainer.classList.remove('active');
            body.style.overflow = '';
            lucide.createIcons();
        }
    });
});

// Magnetic Buttons (Consolidated & Passive)
const setupMagnetic = (elements, strength = 0.5) => {
    if (OptimizationManager.reducedMotion) return;

    elements.forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const moveX = (e.clientX - rect.left - rect.width / 2) * strength;
            const moveY = (e.clientY - rect.top - rect.height / 2) * strength;
            btn.style.transform = `translate3d(${moveX}px, ${moveY}px, 0)`;

            const icon = btn.querySelector('.btn-icon');
            if (icon) icon.style.transform = `translate3d(${moveX * 0.5}px, ${moveY * 0.5}px, 0)`;
        }, { passive: true });

        btn.addEventListener('mouseleave', () => {
            btn.style.transform = 'translate3d(0, 0, 0)';
            const icon = btn.querySelector('.btn-icon');
            if (icon) icon.style.transform = 'translate3d(0, 0, 0)';
        });
    });
};

setupMagnetic(document.querySelectorAll('.magnetic-btn, .btn, .social-planet'));

// Card Tilt Logic
const setupTilt = (cards) => {
    if (OptimizationManager.reducedMotion) return;

    cards.forEach(wrapper => {
        const card = wrapper.querySelector('.project-card');
        if (!card) return;

        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);

            const rotateX = ((y - rect.height / 2) / rect.height) * -10;
            const rotateY = ((x - rect.width / 2) / rect.width) * 10;

            card.style.setProperty('--rx', `${rotateX}deg`);
            card.style.setProperty('--ry', `${rotateY}deg`);
            OptimizationManager.requestTick();
        }, { passive: true });

        card.addEventListener('mouseleave', () => {
            card.style.setProperty('--rx', `0deg`);
            card.style.setProperty('--ry', `0deg`);
            card.style.setProperty('--mouse-x', `-100%`);
            card.style.setProperty('--mouse-y', `-100%`);
            OptimizationManager.requestTick();
        });
    });
};

setupTilt(document.querySelectorAll('.card-wrapper'));

// 1. Scroll Reveal Observer
const revealElements = document.querySelectorAll('.reveal-on-scroll');
const revealOptions = {
    threshold: 0.15,
    rootMargin: "0px 0px -50px 0px"
};

const revealOnScroll = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
        }
    });
}, revealOptions);

revealElements.forEach(el => revealOnScroll.observe(el));

// Fade in Hero Title
const heroTitle = document.querySelector('.hero-text h1');
if (heroTitle) {
    setTimeout(() => {
        heroTitle.style.transition = 'opacity 1s ease, transform 1s ease';
        heroTitle.style.opacity = '1';
        heroTitle.style.transform = 'translateY(0)';
    }, 300);
}

// Stats Counter
const statNumbers = document.querySelectorAll('.stat-number');
const runCounter = (el) => {
    const target = +el.getAttribute('data-target');
    const duration = Math.min(2000, Math.max(500, target * 50));
    const increment = target / (duration / 16);
    let current = 0;

    const updateCount = () => {
        current += increment;
        if (current < target) {
            const val = Math.floor(current);
            const targetStr = el.getAttribute('data-target');
            el.innerText = (targetStr.startsWith('0') && val < 10) ? '0' + val : val;
            requestAnimationFrame(updateCount);
        } else {
            el.innerText = el.getAttribute('data-target');
        }
    };
    updateCount();
};

const statObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            runCounter(entry.target);
            observer.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

statNumbers.forEach(number => statObserver.observe(number));

// FAQ Accordion (Generic)
const setupAccordion = (itemSelector, headerSelector, bodySelector) => {
    const items = document.querySelectorAll(itemSelector);
    items.forEach(item => {
        const header = item.querySelector(headerSelector);
        const body = item.querySelector(bodySelector);
        if (header && body) {
            header.addEventListener('click', () => {
                const isActive = item.classList.contains('active');
                items.forEach(other => {
                    if (other !== item && other.classList.contains('active')) {
                        other.classList.remove('active');
                        const otherBody = other.querySelector(bodySelector);
                        if (otherBody) otherBody.style.height = '0';
                    }
                });
                item.classList.toggle('active');
                body.style.height = isActive ? '0' : body.scrollHeight + 'px';
                lucide.createIcons();
            });
        }
    });
};

setupAccordion('.faq-item', '.faq-question', '.faq-answer');
setupAccordion('.cc-item', '.cc-header', '.cc-body');
setupAccordion('.sf-item', '.sf-header', '.sf-body');

// Holographic Ticket Tilt
const ticketContainer = document.querySelector('.holo-ticket-container');
const ticketGlass = document.querySelector('.ticket-glass');
if (ticketContainer && ticketGlass && !OptimizationManager.reducedMotion) {
    ticketContainer.addEventListener('mousemove', (e) => {
        const rect = ticketContainer.getBoundingClientRect();
        const rotateX = ((e.clientY - rect.top - rect.height / 2) / (rect.height / 2)) * -15;
        const rotateY = ((e.clientX - rect.left - rect.width / 2) / (rect.width / 2)) * 15;
        ticketGlass.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    }, { passive: true });
    ticketContainer.addEventListener('mouseleave', () => {
        ticketGlass.style.transform = `rotateX(0deg) rotateY(0deg)`;
    });
}

// Cinematic Intro
(() => {
    const initIntro = () => {
        const introOverlay = document.querySelector(".intro-overlay");
        if (introOverlay && typeof gsap !== 'undefined') {
            document.body.style.overflow = "hidden";
            if (sessionStorage.getItem('introPlayed')) {
                introOverlay.style.display = 'none';
                document.body.style.overflow = "";
                return;
            }
            sessionStorage.setItem('introPlayed', 'true');

            const svgElement = introOverlay.querySelector("svg");
            const letterA1 = introOverlay.querySelector(".letter-a1");
            const otherLetters = introOverlay.querySelectorAll(".letter-n, .letter-f, .letter-a2, .letter-s");

            introOverlay.querySelectorAll(".draw").forEach(path => {
                const length = path.getTotalLength();
                path.style.strokeDasharray = length;
                path.style.strokeDashoffset = length;
            });

            const tl = gsap.timeline({
                onComplete: () => {
                    document.body.style.overflow = "";
                    gsap.to(introOverlay, { opacity: 0, duration: 0.5, onComplete: () => introOverlay.remove() });
                }
            });

            tl.set(letterA1, { y: -150, x: 44, opacity: 0 })
                .to(otherLetters, { strokeDashoffset: 0, duration: 1.5, stagger: 0.1 })
                .to(letterA1, { y: 0, opacity: 1, duration: 0.8, ease: "bounce.out", strokeDashoffset: 0 })
                .to(letterA1, { x: 0, duration: 0.8, ease: "power3.inOut" })
                .to([...otherLetters, letterA1], { fillOpacity: 1, duration: 0.5, stroke: "transparent" })
                .to(svgElement, { scale: 50, opacity: 0, duration: 0.8, ease: "expo.in", filter: "blur(20px)" });
        }
    };
    if (document.readyState === 'complete') setTimeout(initIntro, 100);
    else window.addEventListener('load', () => setTimeout(initIntro, 100));
})();
// Ensure the initially active item has its height set
document.querySelectorAll('.sf-item.active, .faq-item.active, .cc-item.active').forEach(item => {
    const body = item.querySelector('.sf-body, .faq-answer, .cc-body');
    if (body) {
        setTimeout(() => {
            body.style.height = body.scrollHeight + 'px';
        }, 500);
    }
});

// Prism Aura Contact Interactivity (Blow-Away Redesign)
const setupContactInteractions = () => {
    if (OptimizationManager.reducedMotion) return;

    const prismSection = document.querySelector('.contact-prism');
    const prismCard = document.querySelector('.prism-card');
    const blobs = document.querySelectorAll('.aura-blob');
    const spheres = document.querySelectorAll('.prism-sphere');
    const contactForm = document.getElementById('contactForm');
    const formStatus = document.getElementById('formStatus');

    if (!prismSection) return;

    // 1. Deep Parallax & 3D Tilt
    window.addEventListener('mousemove', (e) => {
        const rect = prismSection.getBoundingClientRect();
        if (e.clientY >= rect.top && e.clientY <= rect.bottom) {
            const centerX = window.innerWidth / 2;
            const centerY = window.innerHeight / 2;
            const mouseX = e.clientX - centerX;
            const mouseY = e.clientY - centerY;

            // Background Aura Parallax (Very Slow)
            blobs.forEach((blob, index) => {
                const speed = (index + 1) * 0.01;
                gsap.to(blob, {
                    x: mouseX * speed,
                    y: mouseY * speed,
                    duration: 2,
                    ease: "power2.out"
                });
            });

            // Decor Spheres Parallax (Fast)
            spheres.forEach((sphere, index) => {
                const speed = (index + 1) * 0.05;
                gsap.to(sphere, {
                    x: mouseX * speed,
                    y: mouseY * speed,
                    duration: 1,
                    ease: "power3.out"
                });
            });

            // 3D Tilt for Central Card
            if (prismCard) {
                const rotateX = (mouseY / (window.innerHeight / 2)) * -5; // Max 5deg
                const rotateY = (mouseX / (window.innerWidth / 2)) * 5;  // Max 5deg

                gsap.to(prismCard, {
                    rotateX: rotateX,
                    rotateY: rotateY,
                    duration: 1,
                    ease: "power2.out",
                    transformPerspective: 1000
                });
            }
        }
    }, { passive: true });

    // 2. Entrance Reveal (GSAP)
    if (typeof gsap !== 'undefined') {
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: ".contact-prism",
                start: "top 75%",
            }
        });

        tl.from(".prism-card", {
            opacity: 0,
            y: 100,
            scale: 0.9,
            duration: 1.5,
            ease: "expo.out"
        })
            .from(".prism-tag", {
                opacity: 0,
                y: 20,
                duration: 0.8,
                ease: "power2.out"
            }, "-=0.8")
            .from(".prism-title", {
                opacity: 0,
                y: 30,
                duration: 1,
                ease: "power3.out"
            }, "-=0.6")
            .from(".p-field", {
                opacity: 0,
                x: 20,
                duration: 0.6,
                stagger: 0.1,
                ease: "power2.out"
            }, "-=0.8");
    }

    // 3. Form Transmission (WhatsApp)
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const subject = document.getElementById('subject').value;
            const message = document.getElementById('message').value;

            const whatsappNumber = '918590468094';
            const text = encodeURIComponent(
                `Aura Connection Request:\n\n` +
                `Name: ${name}\n` +
                `Email: ${email}\n` +
                (subject ? `Subject: ${subject}\n` : '') +
                `Message: ${message}`
            );

            const whatsappURL = `https://wa.me/${whatsappNumber}?text=${text}`;

            if (formStatus) {
                formStatus.innerText = 'Synchronizing with Prism Aura...';
                formStatus.style.opacity = '1';
                formStatus.style.color = 'var(--accent-primary)';
            }

            const btn = contactForm.querySelector('.prism-submit-btn');
            if (btn) {
                btn.classList.add('sending');
                btn.innerHTML = '<span>SYNCHRONIZING...</span><i data-lucide="loader"></i>';
                lucide.createIcons();
            }

            setTimeout(() => {
                window.open(whatsappURL, '_blank');
                contactForm.reset();
                if (formStatus) {
                    formStatus.innerText = 'Sync Complete. Portal Opening...';
                    setTimeout(() => { formStatus.style.opacity = '0'; }, 3000);
                }
                if (btn) {
                    btn.classList.remove('sending');
                    btn.innerHTML = '<span>INITIATE CONNECTION</span><i data-lucide="sparkles"></i>';
                    lucide.createIcons();
                }
            }, 1500);
        });
    }
};

// Initialize Prism Contact Interactions
if (document.readyState === 'complete') setupContactInteractions();
else window.addEventListener('load', setupContactInteractions);
