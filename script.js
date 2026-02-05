// ===== MOBILE NAVIGATION TOGGLE =====
const navToggle = document.getElementById('nav-toggle');
const navMenu = document.getElementById('nav-menu');
const menuDropdown = document.querySelector('.nav__item--dropdown');
const menuDropdownButton = document.querySelector('.nav__item--dropdown .nav__link--no-href');
const menuDropdownMenu = document.querySelector('.nav__item--dropdown .nav__dropdown');

// Toggle main mobile menu
if (navToggle && navMenu) {
    let lastToggleTime = 0;
    
    const handleMenuToggle = (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        // Prevent rapid double-taps on iOS
        const now = Date.now();
        if (now - lastToggleTime < 300) {
            return;
        }
        lastToggleTime = now;
        
        const isOpening = !navMenu.classList.contains('show');
        
        if (isOpening) {
            // Menu always has display:flex, just add show class for animation
            // Use requestAnimationFrame to ensure smooth animation start
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    navMenu.classList.add('show');
                });
            });
            const icon = navToggle.querySelector('i');
            if (icon) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            }
        } else {
            // Smooth close - menu keeps display:flex, just animates transform/opacity
            navMenu.classList.remove('show');
            navMenu.classList.add('closing');
            const icon = navToggle.querySelector('i');
            if (icon) {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
            // Close dropdown when closing main menu
            if (menuDropdownMenu) {
                menuDropdownMenu.classList.remove('show');
            }
            if (menuDropdown) {
                menuDropdown.classList.remove('open');
            }
            // Remove active from dropdown button when closing
            if (menuDropdownButton) {
                menuDropdownButton.classList.remove('active');
            }
            // Remove closing class after animation
            setTimeout(() => {
                navMenu.classList.remove('closing');
            }, 400);
        }
    };
    
    // Use touchstart for iOS devices, click for others
    if ('ontouchstart' in window) {
        navToggle.addEventListener('touchstart', (e) => {
            e.preventDefault();
            e.stopPropagation();
            handleMenuToggle(e);
        }, { passive: false });
        
        // Also handle click as fallback
        navToggle.addEventListener('click', handleMenuToggle);
    } else {
        navToggle.addEventListener('click', handleMenuToggle);
    }
}

// Toggle dropdown menu on mobile
if (menuDropdownButton && menuDropdownMenu && menuDropdown) {
    let touchStartTime = 0;
    
    // Handle both touch and click events for better iOS support
    const handleDropdownToggle = (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        // Prevent rapid double-taps on iOS
        const now = Date.now();
        if (now - touchStartTime < 300) {
            return;
        }
        touchStartTime = now;
        
        const isOpening = !menuDropdownMenu.classList.contains('show');
        
        if (isOpening) {
            menuDropdownMenu.classList.add('show');
            menuDropdown.classList.add('open');
            // Remove active from all nav links
            navLinks.forEach(link => link.classList.remove('active'));
            // Add active to dropdown button when open
            menuDropdownButton.classList.add('active');
        } else {
            menuDropdownMenu.classList.remove('show');
            menuDropdown.classList.remove('open');
            // Remove active from dropdown button when closed
            menuDropdownButton.classList.remove('active');
        }
    };
    
    // Use touchstart for iOS devices, click for others
    if ('ontouchstart' in window) {
        menuDropdownButton.addEventListener('touchstart', (e) => {
            e.preventDefault();
            e.stopPropagation();
            handleDropdownToggle(e);
        }, { passive: false });
        
        // Also handle click as fallback
        menuDropdownButton.addEventListener('click', handleDropdownToggle);
    } else {
        menuDropdownButton.addEventListener('click', handleDropdownToggle);
    }
}

// Close mobile menu and scroll smoothly when clicking on a link
const navLinks = document.querySelectorAll('.nav__link:not(.nav__link--no-href)');
const dropdownLinks = document.querySelectorAll('.nav__dropdown-link');

function closeMenuAndScroll(target) {
    if (!navMenu) return;
    
    // Close dropdown first with smooth animation
    if (menuDropdownMenu && menuDropdownMenu.classList.contains('show')) {
        menuDropdownMenu.classList.remove('show');
    }
    if (menuDropdown && menuDropdown.classList.contains('open')) {
        menuDropdown.classList.remove('open');
    }
    // Remove active from dropdown button when closing
    if (menuDropdownButton) {
        menuDropdownButton.classList.remove('active');
    }
    
    // Close main menu with smooth animation using CSS animation
    navMenu.classList.remove('show');
    navMenu.classList.add('closing');
    const icon = navToggle ? navToggle.querySelector('i') : null;
    if (icon) {
        icon.classList.remove('fa-times');
        icon.classList.add('fa-bars');
    }
    
    // Remove closing class after animation
    setTimeout(() => {
        navMenu.classList.remove('closing');
    }, 400);
    
    // Smooth scroll to target after menu closes
    if (target) {
        // Wait for menu close animation to complete (400ms)
        setTimeout(() => {
            // Check if mobile
            const isMobile = window.innerWidth <= 767;
            const headerOffset = isMobile ? 70 : 80;
            const elementPosition = target.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
            
            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }, 400);
    }
}

navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');
        if (href && href.startsWith('#')) {
            e.preventDefault();
            const target = document.querySelector(href);
            closeMenuAndScroll(target);
        } else {
            closeMenuAndScroll(null);
        }
    });
});

dropdownLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');
        if (href && href.startsWith('#')) {
            e.preventDefault();
            const target = document.querySelector(href);
            closeMenuAndScroll(target);
        } else {
            closeMenuAndScroll(null);
        }
    });
});

// ===== HEADER SCROLL EFFECT =====
const header = document.getElementById('header');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
    
    lastScroll = currentScroll;
});

// ===== ACTIVE NAVIGATION LINK =====
const sections = document.querySelectorAll('section[id]');

function activateNavLink() {
    // Don't update active links if dropdown is open
    if (menuDropdownMenu && menuDropdownMenu.classList.contains('show')) {
        return;
    }
    
    const scrollY = window.pageYOffset;

    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 100;
        const sectionId = section.getAttribute('id');
        const navLink = document.querySelector(`.nav__link[href="#${sectionId}"]`);

        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            navLinks.forEach(link => link.classList.remove('active'));
            // Also remove active from dropdown button
            if (menuDropdownButton) {
                menuDropdownButton.classList.remove('active');
            }
            if (navLink) {
                navLink.classList.add('active');
            }
        }
    });
}

window.addEventListener('scroll', activateNavLink);

// ===== SMOOTH SCROLL FOR ANCHOR LINKS (Desktop) =====
// This is handled in the mobile menu close function, but we keep this for desktop links
document.querySelectorAll('a[href^="#"]:not(.nav__dropdown-link):not(.nav__link--no-href)').forEach(anchor => {
    // Only add if not already handled by mobile menu
    if (!anchor.closest('.nav__menu')) {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const headerOffset = 80;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    }
});

// ===== SCROLL ANIMATIONS =====
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe menu cards and other elements
document.addEventListener('DOMContentLoaded', () => {
    const animateElements = document.querySelectorAll('.menu__card, .hours__card, .contact__item');
    animateElements.forEach(el => {
        observer.observe(el);
    });
});

// ===== MOBILE DETECTION AND CONTACT LINKS =====
function isMobileDevice() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || 
           (window.innerWidth <= 768 && 'ontouchstart' in window);
}

function setupContactLinks() {
    const phoneText = document.querySelector('.phone-text');
    const phoneLink = document.querySelector('.phone-link');
    const emailText = document.querySelector('.email-text');
    const emailLink = document.querySelector('.email-link');
    
    if (isMobileDevice()) {
        // Mobile: show links, hide text
        if (phoneText && phoneLink) {
            phoneText.style.display = 'none';
            phoneLink.style.display = 'inline';
        }
        if (emailText && emailLink) {
            emailText.style.display = 'none';
            emailLink.style.display = 'inline';
        }
    } else {
        // Desktop: show text, hide links
        if (phoneText && phoneLink) {
            phoneText.style.display = 'inline';
            phoneLink.style.display = 'none';
        }
        if (emailText && emailLink) {
            emailText.style.display = 'inline';
            emailLink.style.display = 'none';
        }
    }
}

// ===== INITIALIZE ON LOAD =====
document.addEventListener('DOMContentLoaded', () => {
    // Activate nav link on page load
    activateNavLink();
    
    // Add fade-in animation to hero content
    const heroContent = document.querySelector('.hero__content');
    if (heroContent) {
        heroContent.classList.add('fade-in');
    }
    
    // Setup contact links based on device
    setupContactLinks();
    
    // Update on window resize
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            setupContactLinks();
        }, 250);
    });
});

