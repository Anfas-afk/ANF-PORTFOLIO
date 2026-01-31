// Initialize Lucide icons
if (window.lucide) {
    lucide.createIcons();
}

// Global Mouse Tracking (Required for animations)
let mouseX = 0;
let mouseY = 0;
window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
});

// Initialize Lenis Smooth Scroll
if (typeof Lenis !== 'undefined') {
    const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        direction: 'vertical',
        gestureDirection: 'vertical',
        smooth: true,
        mouseMultiplier: 1,
        smoothTouch: false,
        touchMultiplier: 2,
    });

    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);
}

// Mobile Menu Toggle (Robust & Smooth)
const menuToggle = document.getElementById('menuToggle');
const navContainer = document.querySelector('.nav-container');
const body = document.body;

if (menuToggle && navContainer) {
    const toggleMenu = (isOpen) => {
        // Toggle Active Class for Animation
        if (isOpen) {
            navContainer.classList.add('active');
            menuToggle.classList.add('is-active');
            body.style.overflow = 'hidden'; // Lock scroll
        } else {
            navContainer.classList.remove('active');
            menuToggle.classList.remove('is-active');
            body.style.overflow = ''; // Unlock scroll
        }
        // No need to recreate icons for menu anymore
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

// Sticky Header & Active Link
const header = document.querySelector('.header');
const navLinks = document.querySelectorAll('.nav-menu a');
const sections = document.querySelectorAll('section[id]');

window.addEventListener('scroll', () => {
    // Sticky Toggle
    if (window.scrollY > 150) {
        header.classList.add('sticky');
    } else {
        header.classList.remove('sticky');
    }

    // Active Link Highlighting (only on home page)
    if (window.location.pathname.includes('index.html') || window.location.pathname === '/') {
        let current = "";
        sections.forEach((section) => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (pageYOffset >= sectionTop - 200) {
                current = section.getAttribute("id");
            }
        });

        navLinks.forEach((link) => {
            link.classList.remove("active");
            const href = link.getAttribute("href");
            if (href.includes("#") && href.split("#")[1] === current) {
                link.classList.add("active");
            }
        });
    }
});

// Smooth Scroll for links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth'
            });
            // Close mobile menu if open
            navMenu.classList.remove('active');
            menuToggle.classList.remove('is-active'); // Reset animation
        }
    });
});

// Contact Form Handling
document.addEventListener('DOMContentLoaded', () => {

    const contactForm = document.getElementById('contactForm');
    const formStatus = document.getElementById('formStatus');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const subject = document.getElementById('subject').value.trim();
            const message = document.getElementById('message').value.trim();

            if (!name || !email || !message) {
                formStatus.innerText = 'Please fill in all required fields.';
                formStatus.className = 'form-status error';
                return;
            }

            const whatsappNumber = '918590468094';

            const text = `
Hello Anfas,

Name: ${name}
Email: ${email}
${subject ? `Subject: ${subject}` : ''}
Message: ${message}
        `;

            const whatsappURL = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(text)}`;

            formStatus.innerText = 'Redirecting to WhatsApp...';
            formStatus.className = 'form-status success';

            window.location.href = whatsappURL;
        });
    }

});





// --------------------------------------------------------------------------
// STICKY 3D STACK ANIMATION & HOLOGRAPHIC GLARE
// --------------------------------------------------------------------------

const stackArea = document.querySelector('.stack-area');
const cards = document.querySelectorAll('.card-wrapper');

if (stackArea && cards.length > 0) {
    // Scroll Animation for Stacking + Rotation
    window.addEventListener('scroll', () => {
        const viewportHeight = window.innerHeight;

        cards.forEach((cardWrapper, index) => {
            const cardInner = cardWrapper.querySelector('.project-card');
            const nextCard = cards[index + 1];
            let scale = 1;
            let blur = 0;
            let brightness = 1;

            // Calculate Scale & Blur based on next card's position
            if (nextCard) {
                const nextRect = nextCard.getBoundingClientRect();
                // "Stick point" is top: 15vh.
                const stickPoint = viewportHeight * 0.15;

                // Distance of next card from stick point
                const dist = nextRect.top;

                let progress = (dist - stickPoint) / (viewportHeight - stickPoint);
                progress = Math.max(0, Math.min(progress, 1));

                scale = 0.9 + (0.1 * progress);
                blur = (1 - progress) * 8; // Max blur 8px
                brightness = 0.6 + (0.4 * progress); // Dim it down
            }

            // Read rotation vars set by mousemove
            const rx = cardInner.style.getPropertyValue('--rx') || '0deg';
            const ry = cardInner.style.getPropertyValue('--ry') || '0deg';

            cardInner.style.transform = `scale(${scale}) perspective(1000px) rotateX(${rx}) rotateY(${ry})`;
            cardInner.style.filter = `blur(${blur}px) brightness(${brightness})`;
        });
    });

    // Holographic Glare Effect (Mouse Interaction)
    cards.forEach(wrapper => {
        const card = wrapper.querySelector('.project-card');

        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            // For CSS radial gradient (glare)
            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);

            // Calculate Rotation
            // Max rotation +/- 5 deg
            const rotateX = ((y - rect.height / 2) / rect.height) * -10;
            const rotateY = ((x - rect.width / 2) / rect.width) * 10;

            // Store in CSS vars so scroll loop picks it up
            card.style.setProperty('--rx', `${rotateX}deg`);
            card.style.setProperty('--ry', `${rotateY}deg`);
        });

        card.addEventListener('mouseleave', () => {
            card.style.setProperty('--rx', `0deg`);
            card.style.setProperty('--ry', `0deg`);
            card.style.setProperty('--mouse-x', `-100%`);
            card.style.setProperty('--mouse-y', `-100%`);
        });

        // Click to view project
        card.addEventListener('click', (e) => {
            const link = card.querySelector('a.btn-link');
            if (link && !e.target.closest('a')) {
                const href = link.getAttribute('href');
                if (href && href !== '#') {
                    window.open(href, '_blank');
                }
            }
        });
    });
}

// --------------------------------------------------------------------------
// STUNNING ANIMATIONS LOGIC
// --------------------------------------------------------------------------

// 1. Scroll Reveal Observer
const revealElements = document.querySelectorAll('.reveal-on-scroll');
const revealOptions = {
    threshold: 0.15,
    rootMargin: "0px 0px -50px 0px" // Trigger slightly before element enters
};

const revealOnScroll = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target); // Only animate once
        }
    });
}, revealOptions);

revealElements.forEach(el => revealOnScroll.observe(el));

// 2. Hero Visual 3D Parallax
const heroSection = document.querySelector('.hero');
const heroVisual = document.querySelector('.hero-visual');

if (heroSection && heroVisual) {
    heroSection.addEventListener('mousemove', (e) => {
        const x = (window.innerWidth - e.pageX * 2) / 100;
        const y = (window.innerHeight - e.pageY * 2) / 100;

        heroVisual.style.transform = `translateX(${x}px) translateY(${y}px)`;
    });
}

// Fade in Hero Title manually since we removed the scramble effect
const heroTitle = document.querySelector('.hero-text h1');
if (heroTitle) {
    setTimeout(() => {
        heroTitle.style.transition = 'opacity 1s ease, transform 1s ease';
        heroTitle.style.opacity = '1';
        heroTitle.style.transform = 'translateY(0)';
    }, 300);
}

// 3. Magnetic Buttons Effect
const magneticBtns = document.querySelectorAll('.btn');

magneticBtns.forEach(btn => {
    btn.addEventListener('mousemove', function (e) {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        // Calculate distance from center
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        // Strength of magnetic pull
        const strength = 0.5; // Controls how far the button moves

        const moveX = (x - centerX) * strength;
        const moveY = (y - centerY) * strength;

        this.style.transform = `translate(${moveX}px, ${moveY}px)`;
    });

    btn.addEventListener('mouseleave', function () {
        this.style.transform = 'translate(0, 0)';
    });
});
// --------------------------------------------------------------------------
// CUSTOM CURSOR & MOTION REMOVED
// --------------------------------------------------------------------------


// Magnetic Scroll Hook for the "Send Message" button if it exists
const contactBtn = document.querySelector('.contact-form .btn');
if (contactBtn) {
    contactBtn.addEventListener('mousemove', function (e) {
        const rect = this.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const strength = 0.5;
        const moveX = (x - centerX) * strength;
        const moveY = (y - centerY) * strength;
        this.style.transform = `translate(${moveX}px, ${moveY}px)`;
    });
    contactBtn.addEventListener('mouseleave', function () {
        this.style.transform = 'translate(0, 0)';
    });
}

// --------------------------------------------------------------------------
// 3D INFINITY FLUX RIBBON MARQUEE REMOVED
// --------------------------------------------------------------------------
// New Kinetic Marquee is CSS-only for performance



// --------------------------------------------------------------------------
// RUNNING NUMBERS ANIMATION
// --------------------------------------------------------------------------
const statNumbers = document.querySelectorAll('.stat-number');

const runCounter = (el) => {
    const target = +el.getAttribute('data-target'); // Convert to number
    // Dynamic duration: uniform for large numbers, faster for small ones to avoid "stuck on 0" feel
    const duration = Math.min(2000, Math.max(500, target * 50));
    const increment = target / (duration / 16); // 60fps

    let current = 0;

    const updateCount = () => {
        current += increment;

        if (current < target) {
            // Use floor so we count 0 -> 1 -> 2 properly
            const val = Math.floor(current);
            // Format number: add leading zero if target has it
            const targetStr = el.getAttribute('data-target');
            if (targetStr.startsWith('0') && val < 10) {
                el.innerText = '0' + val;
            } else {
                el.innerText = val;
            }
            requestAnimationFrame(updateCount);
        } else {
            // Ensure final value is exact string from attribute
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

statNumbers.forEach(number => {
    statObserver.observe(number);
});

// --------------------------------------------------------------------------
// FOOTER: CLOCK & ACTIONS
// --------------------------------------------------------------------------

// 1. Live Time Widget
const updateTime = () => {
    const timeDisplay = document.getElementById('localTime');
    if (timeDisplay) {
        const now = new Date();
        const timeString = now.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
            timeZone: 'Asia/Kolkata' // IST for Anfas
        });
        timeDisplay.innerText = `${timeString} IST`;
    }
};

setInterval(updateTime, 1000);
updateTime(); // Initial call

// 2. Magnetic Social Planets
const socialPlanets = document.querySelectorAll('.social-planet');

if (socialPlanets.length > 0) {
    socialPlanets.forEach(planet => {
        planet.addEventListener('mousemove', (e) => {
            const rect = planet.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const moveX = (x - centerX) * 0.5;
            const moveY = (y - centerY) * 0.5;

            planet.style.transform = `translate(${moveX}px, ${moveY}px)`;
        });

        planet.addEventListener('mouseleave', () => {
            planet.style.transform = 'translate(0, 0)';
        });
    });
}


// --------------------------------------------------------------------------
// UNDERWORLD REVEAL FOOTER LOGIC
// --------------------------------------------------------------------------
const adjustFooterSpacer = () => {
    const footer = document.querySelector('.footer-premium');
    const wrapper = document.querySelector('.content-wrapper');

    if (footer && wrapper) {
        const footerHeight = footer.offsetHeight;
        wrapper.style.marginBottom = `${footerHeight}px`;
    }
};

window.addEventListener('load', adjustFooterSpacer);
window.addEventListener('resize', adjustFooterSpacer);
// Also trigger after a short delay to account for any lateloading images
setTimeout(adjustFooterSpacer, 500);


// --------------------------------------------------------------------------
// --------------------------------------------------------------------------
// --------------------------------------------------------------------------
// CHROMATIC RIPPLE INTERACTIONS
// --------------------------------------------------------------------------

// 1. Fluid Typography (Ripple Effect)
const rippleTexts = document.querySelectorAll('.ripple-text');

if (rippleTexts.length > 0) {
    document.addEventListener('mousemove', (e) => {
        const x = e.clientX;
        const y = e.clientY;

        rippleTexts.forEach(text => {
            const rect = text.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;

            const distX = x - centerX;
            const distY = y - centerY;

            // Subtle "Liquid" distortion
            // Moving towards the mouse but delaying slightly (lerp-like feel)
            const moveX = distX * 0.05;
            const moveY = distY * 0.05;

            text.style.transform = `translate(${moveX}px, ${moveY}px) skewX(${moveX * 0.1}deg)`;
        });
    });
}

// 2. Aurora Interactive Blobs
const auroraBlobs = document.querySelectorAll('.aurora-blob');

// mouseX and mouseY are already declared globally at line 308/309
// We just reuse them here

// Smooth animate blobs towards mouse
const animateAurora = () => {
    if (auroraBlobs.length > 0) {
        auroraBlobs.forEach((blob, index) => {
            const speed = (index + 1) * 0.02; // Staggered speed

            const rect = blob.getBoundingClientRect();
            const blobX = rect.left + rect.width / 2;
            const blobY = rect.top + rect.height / 2;

            // Drift towards mouse (subtly, on top of CSS animation)
            // We use CSS transform for the drift, so we manipulate top/left or a variable here
            // To keep it simple and performant, we'll just adjust a CSS variable or transform slightly

            const dx = (mouseX - window.innerWidth / 2) * speed;
            const dy = (mouseY - window.innerHeight / 2) * speed;

            blob.style.transform = `translate(${dx}px, ${dy}px) scale(${1 + Math.sin(Date.now() * 0.001 + index) * 0.1})`;
        });
    }
    requestAnimationFrame(animateAurora);
};


// Start animation loop
animateAurora();

// --------------------------------------------------------------------------
// PREMIUM HERO INTERACTIONS (Parallax & Reveal)
// --------------------------------------------------------------------------
const heroPremium = document.querySelector('.hero-premium');
const bgText = document.querySelector('.hero-bg-text');
const heroVisualFrame = document.querySelector('.hero-visual-frame');
const floaters = document.querySelectorAll('.glass-floater');

if (heroPremium) {
    // Parallax on Mouse Move
    heroPremium.addEventListener('mousemove', (e) => {
        const x = (window.innerWidth / 2 - e.clientX) / 20;
        const y = (window.innerHeight / 2 - e.clientY) / 20;

        // 1. Background Text - Subtle opposite movement
        if (bgText) {
            bgText.style.transform = `translate(${-50 + x * 0.2}%, ${-50 + y * 0.2}%)`;
        }

        // 2. Visual Frame - Slight tilt
        if (heroVisualFrame) {
            const rotX = (y / 10).toFixed(2);
            const rotY = (-x / 10).toFixed(2);
            heroVisualFrame.style.transform = `perspective(1000px) rotateX(${rotX}deg) rotateY(${rotY}deg)`;
        }

        // 3. Floating Elements - Deeper layer movement
        floaters.forEach((el, index) => {
            const factor = (index + 1) * 0.5;
            el.style.transform = `translate(${x * factor}px, ${y * factor - (index % 2 === 0 ? 15 : 0)}px)`; // Keep the initial float offset logic if possible, or just overwrite safely
        });
    });

    // Reset on Leave
    heroPremium.addEventListener('mouseleave', () => {
        if (bgText) bgText.style.transform = 'translate(-50%, -50%)';
        if (heroVisualFrame) heroVisualFrame.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
        floaters.forEach(el => el.style.transform = 'translate(0, 0)');
    });
}


// --------------------------------------------------------------------------
// SERVICE SECTION EXPANSION (Mobile - Touch to Expand)
// --------------------------------------------------------------------------
const serviceContainer = document.querySelector('.service-split-container');
if (serviceContainer) {
    // User requested "touch" (click) to expand to 800px
    serviceContainer.addEventListener('click', () => {
        // Toggle the expanded class
        serviceContainer.classList.toggle('touch-expand');
    });
}




