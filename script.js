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
            const icon = menuToggle.querySelector('i');
            icon.setAttribute('data-lucide', 'menu');
            lucide.createIcons();
        }
    });
});

// Contact Form Handling
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

        const text =
            `Hello Anfas,%0A%0A` +
            `Name: ${name}%0A` +
            `Email: ${email}%0A` +
            (subject ? `Subject: ${subject}%0A` : '') +
            `Message: ${message}`;

        const whatsappURL = `https://wa.me/${whatsappNumber}?text=${text}`;

        formStatus.innerText = 'Redirecting to WhatsAppâ€¦';
        formStatus.className = 'form-status success';

        setTimeout(() => {
            window.open(whatsappURL, '_blank');
            contactForm.reset();
        }, 600);
    });
}


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

// --------------------------------------------------------------------------
// --------------------------------------------------------------------------
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

let mouseX = 0;
let mouseY = 0;
window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
});

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

/* ===============================
   SERVICE SECTION EXPANSION (MOBILE FIX)
   =============================== */
const serviceContainer = document.querySelector('.service-split-container');
if (serviceContainer) {
    // User requested "touch" (click) to expand to 800px
    serviceContainer.addEventListener('click', () => {
        // Toggle the expanded class ONLY on larger screens where layout isn't vertical
        if (window.innerWidth > 768) {
            serviceContainer.classList.toggle('touch-expand');
        }
    });
}

/* ===============================
   CINEMATIC INTRO ANIMATION (FALLING A)
   =============================== */
/* ===============================
   CINEMATIC INTRO ANIMATION (FALLING A)
   =============================== */
// Wrapped in a block or IIFE to prevent variable collisions if script runs twice
(() => {
    const initIntro = () => {
        const introOverlay = document.querySelector(".intro-overlay");

        if (introOverlay && typeof gsap !== 'undefined') {
            console.log("Intro: Starting Animation Sequence");

            // Lock scroll during intro
            document.body.style.overflow = "hidden";

            try {
                const svgElement = introOverlay.querySelector("svg");

                // Check if intro has already played this session
                if (sessionStorage.getItem('introPlayed')) {
                    if (introOverlay) introOverlay.style.display = 'none';
                    document.body.style.overflow = ""; // Ensure scroll is unlocked
                    return;
                }

                // Mark as played
                sessionStorage.setItem('introPlayed', 'true');

                // Select letters individually
                const letterA1 = introOverlay.querySelector(".letter-a1");
                const letterN = introOverlay.querySelector(".letter-n");
                const letterF = introOverlay.querySelector(".letter-f");
                const letterA2 = introOverlay.querySelector(".letter-a2");
                const letterS = introOverlay.querySelector(".letter-s");

                // Group "other" letters
                const otherLetters = [letterN, letterF, letterA2, letterS];

                /* Prepare paths for stroke animation */
                const allPaths = introOverlay.querySelectorAll(".draw");
                allPaths.forEach((path) => {
                    if (path) {
                        const length = path.getTotalLength();
                        // Set initial state via CSS styles to ensure no flicker
                        path.style.strokeDasharray = length;
                        path.style.strokeDashoffset = length;
                        path.style.fillOpacity = '0'; // Ensure stroke only first
                    }
                });

                // --- INTERACTIVE HOLOGRAPHIC TILT (Optimized) ---
                // Only add tilt listener if user is active, and maybe not immediately?
                // Kept simple but relying on CSS will-change
                const tiltEffect = (e) => {
                    const x = (window.innerWidth / 2 - e.clientX) / 20;
                    const y = (window.innerHeight / 2 - e.clientY) / 20;

                    gsap.to(svgElement, {
                        rotationY: x,
                        rotationX: -y,
                        duration: 0.5,
                        ease: "power2.out",
                        transformPerspective: 1000,
                        transformOrigin: "center center",
                        overwrite: 'auto' // Prevent conflict
                    });
                };

                // Add listener
                document.addEventListener("mousemove", tiltEffect);

                /* Timeline (cinematic timing) */
                const tl = gsap.timeline({
                    ease: "power2.inOut",
                    onComplete: () => {
                        // Cleanup
                        document.removeEventListener("mousemove", tiltEffect);
                        document.body.style.overflow = "";

                        // Fade out and remove
                        gsap.to(introOverlay, {
                            opacity: 0,
                            duration: 0.5,
                            onComplete: () => introOverlay.remove()
                        });
                    }
                });

                // 0. Initial Setup
                // Ensure A1 is hidden and above
                tl.set(letterA1, {
                    y: -150,
                    x: 44,
                    opacity: 0,
                    fillOpacity: 0
                });

                // Ensure others are hidden (fill) but prepared for stroke
                tl.set(otherLetters, {
                    fillOpacity: 0,
                    stroke: "#ffffff" // Ensure visible stroke color
                });

                // 1. Draw "NFAS"
                tl.to(otherLetters, {
                    strokeDashoffset: 0,
                    duration: 1.5,
                    stagger: 0.1,
                    ease: "power2.out"
                });

                // 2. 'A' Falls Down (onto N)
                tl.to(letterA1, {
                    y: 0,
                    opacity: 1,
                    duration: 0.8,
                    ease: "bounce.out",
                    strokeDashoffset: 0
                });

                // 3. Sequential Glow (N -> F -> A -> S)
                const flashGlow = (target) => {
                    return gsap.to(target, {
                        fillOpacity: 1,
                        duration: 0.1,
                        yoyo: true,
                        repeat: 1
                    });
                };

                tl.add(flashGlow(letterN), "+=0.1");
                tl.add(flashGlow(letterF), "+=0.1");
                tl.add(flashGlow(letterA2), "+=0.1");
                tl.add(flashGlow(letterS), "+=0.1");

                // 4. 'A' Slides to Start (Completing "ANFAS")
                tl.to(letterA1, {
                    x: 0, // Move to original 0 position
                    duration: 0.8,
                    ease: "power3.inOut"
                });

                // 5. Final Full Glow -> Warp
                tl.to([letterA1, ...otherLetters], {
                    fillOpacity: 1,
                    duration: 0.5,
                    stroke: "transparent"
                });

                // Explosive Reveal
                tl.to(svgElement, {
                    scale: 50, // Massive scale
                    opacity: 0,
                    duration: 0.8,
                    ease: "expo.in",
                    filter: "blur(20px)"
                }, "+=0.1");

            } catch (error) {
                console.error("Intro Animation Error:", error);
                // Emergency cleanup
                document.body.style.overflow = "";
                introOverlay.style.display = "none";
            }
        } else {
            // Fallback if GSAP missing or element missing
            if (introOverlay) introOverlay.style.display = "none";
        }
    };

    // Defer start to ensure smoothness
    if (document.readyState === 'complete') {
        setTimeout(initIntro, 100);
    } else {
        window.addEventListener('load', () => setTimeout(initIntro, 100));
    }
})();


/* ===============================
   FAQ ACCORDION LOGIC
   =============================== */
const faqItems = document.querySelectorAll('.faq-item');

if (faqItems.length > 0) {
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');

        if (question && answer) {
            question.addEventListener('click', () => {
                const isActive = item.classList.contains('active');

                // Close all other items (Exclusive Accordion)
                faqItems.forEach(otherItem => {
                    if (otherItem !== item && otherItem.classList.contains('active')) {
                        otherItem.classList.remove('active');
                        otherItem.querySelector('.faq-answer').style.height = '0';
                    }
                });

                // Toggle current item
                if (isActive) {
                    item.classList.remove('active');
                    answer.style.height = '0';
                } else {
                    item.classList.add('active');
                    // Reset height to auto to get correct scrollHeight, then animate
                    answer.style.height = answer.scrollHeight + 'px';
                }
            });
        }
    });
}


/* ===============================
   HOLOGRAPHIC TICKET TILT LOGIC
   =============================== */
const ticketContainer = document.querySelector('.holo-ticket-container');
const ticketGlass = document.querySelector('.ticket-glass');

if (ticketContainer && ticketGlass) {
    ticketContainer.addEventListener('mousemove', (e) => {
        const rect = ticketContainer.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        // Calculate rotation (max +/- 15 deg)
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = ((y - centerY) / centerY) * -15; // Invert Y axis
        const rotateY = ((x - centerX) / centerX) * 15;

        // Apply transform
        ticketGlass.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;

        // Adjust Shine Position
        const shine = ticketGlass.querySelector('.ticket-shine');
        if (shine) {
            // dynamic gradient adjustment could go here for advanced effect
        }
    });

    ticketContainer.addEventListener('mouseleave', () => {
        // Reset position smoothly
        ticketGlass.style.transform = `rotateX(0deg) rotateY(0deg)`;
    });
}

/* ===============================
   CLEAN CARD FAQ LOGIC
   =============================== */
const ccItems = document.querySelectorAll('.cc-item');

if (ccItems.length > 0) {
    ccItems.forEach(item => {
        const header = item.querySelector('.cc-header');
        const body = item.querySelector('.cc-body');
        const icon = item.querySelector('.cc-icon i');

        if (header) {
            header.addEventListener('click', () => {
                const isActive = item.classList.contains('active');

                // Close all others
                ccItems.forEach(other => {
                    if (other !== item) {
                        other.classList.remove('active');
                        other.querySelector('.cc-body').style.height = 0;
                        const otherIcon = other.querySelector('.cc-icon i');
                        if (otherIcon) otherIcon.setAttribute('data-lucide', 'chevron-down');
                    }
                });

                // Toggle current
                item.classList.toggle('active');

                if (!isActive) {
                    body.style.height = body.scrollHeight + 'px';
                    if (icon) icon.setAttribute('data-lucide', 'chevron-up');
                } else {
                    body.style.height = 0;
                    if (icon) icon.setAttribute('data-lucide', 'chevron-down');
                }

                // Re-init lucide icons to update chevron direction
                lucide.createIcons();
            });
        }
    });

    // Ensure icon consistency on load
    lucide.createIcons();
}




