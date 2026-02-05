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
            // Ensure menu is ready before opening
            navMenu.style.visibility = 'visible';
            navMenu.style.display = 'flex';
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
            
            // Check if user is on menu or salads section, and if so, set active on "Meny" button
            setTimeout(() => {
                activateNavLink();
            }, 100);
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
            // Remove closing class and reset styles after animation
            setTimeout(() => {
                navMenu.classList.remove('closing');
                // Reset inline styles to allow menu to open again
                navMenu.style.visibility = '';
                navMenu.style.display = '';
                navMenu.style.willChange = '';
            }, 450);
        }
    };
    
    // Use touchstart for iOS devices, click for others
    // On touch devices, handle both touchstart and click, but prevent double-firing
    let touchHandled = false;
    
    if ('ontouchstart' in window) {
        navToggle.addEventListener('touchstart', (e) => {
            if (touchHandled) return;
            touchHandled = true;
            e.preventDefault();
            e.stopPropagation();
            handleMenuToggle(e);
            // Reset after a short delay to allow click if needed
            setTimeout(() => {
                touchHandled = false;
            }, 300);
        }, { passive: false });
        
        // Also handle click as fallback, but only if touch wasn't handled
        navToggle.addEventListener('click', (e) => {
            if (!touchHandled) {
                handleMenuToggle(e);
            }
        });
    } else {
        // Desktop: just use click
        navToggle.addEventListener('click', handleMenuToggle);
    }
}

// Toggle dropdown menu on mobile
if (menuDropdownButton && menuDropdownMenu && menuDropdown) {
    let touchStartTime = 0;
    let dropdownTouchHandled = false;
    
    // Handle both touch and click events for better iOS support
    const handleDropdownToggle = (e) => {
        // Check if we're on mobile and menu is open
        const isMobile = window.innerWidth <= 767;
        if (!isMobile) {
            // On desktop, let CSS hover handle it - don't interfere
            return;
        }
        
        // Only handle when mobile menu is open
        if (!navMenu || !navMenu.classList.contains('show')) {
            return;
        }
        
        // Always prevent default and stop propagation
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }
        
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
            // Remove active from all nav links (including Åpningstider, Kontakt, etc.)
            navLinks.forEach(link => link.classList.remove('active'));
            // Also remove active from any other elements that might have it
            document.querySelectorAll('.nav__link.active').forEach(link => {
                link.classList.remove('active');
            });
            // Add active to dropdown button when open
            menuDropdownButton.classList.add('active');
        } else {
            menuDropdownMenu.classList.remove('show');
            menuDropdown.classList.remove('open');
            // Remove active from dropdown button when closed
            menuDropdownButton.classList.remove('active');
        }
    };
    
    // Add event listeners - always add them, but check conditions inside
    // Use touchstart for better iOS support
    menuDropdownButton.addEventListener('touchstart', (e) => {
        const isMobile = window.innerWidth <= 767;
        if (!isMobile || !navMenu || !navMenu.classList.contains('show')) {
            return;
        }
        
        if (dropdownTouchHandled) return;
        dropdownTouchHandled = true;
        
        handleDropdownToggle(e);
        
        setTimeout(() => {
            dropdownTouchHandled = false;
        }, 300);
    }, { passive: false });
    
    // Also handle click as fallback (for devices that fire both)
    menuDropdownButton.addEventListener('click', (e) => {
        const isMobile = window.innerWidth <= 767;
        if (!isMobile || !navMenu || !navMenu.classList.contains('show')) {
            return;
        }
        
        // Only handle if touch wasn't already handled
        if (!dropdownTouchHandled) {
            handleDropdownToggle(e);
        } else {
            // If touch was handled, prevent click from doing anything
            e.preventDefault();
            e.stopPropagation();
        }
    });
}

// Close mobile menu and scroll smoothly when clicking on a link
const navLinks = document.querySelectorAll('.nav__link:not(.nav__link--no-href)');
const dropdownLinks = document.querySelectorAll('.nav__dropdown-link');

function closeMenuAndScroll(target) {
    if (!navMenu || !navMenu.classList.contains('show')) return;
    
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
    
    // Update icon first
    const icon = navToggle ? navToggle.querySelector('i') : null;
    if (icon) {
        icon.classList.remove('fa-times');
        icon.classList.add('fa-bars');
    }
    
    // Ensure menu is visible and ready for animation BEFORE starting
    navMenu.style.visibility = 'visible';
    navMenu.style.display = 'flex';
    navMenu.style.willChange = 'transform, opacity';
    
    // Force reflow to ensure styles are applied
    navMenu.offsetHeight;
    
    // Use requestAnimationFrame to ensure smooth animation start on iOS
    // First frame: prepare for animation
    requestAnimationFrame(() => {
        // Second frame: start the closing animation
        requestAnimationFrame(() => {
            // Remove show class and add closing class
            navMenu.classList.remove('show');
            navMenu.classList.add('closing');
            
            // Remove closing class and reset styles after animation completes
            setTimeout(() => {
                navMenu.classList.remove('closing');
                // Reset all inline styles to allow menu to open again
                navMenu.style.visibility = '';
                navMenu.style.display = '';
                navMenu.style.willChange = '';
            }, 450);
            
            // Smooth scroll to target after menu closes
            if (target) {
                // Wait for menu close animation to complete (450ms)
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
                }, 450);
            }
        });
    });
}

// Only add click handlers for mobile menu links (when menu is visible)
// On desktop, the smooth scroll handler below will handle navigation
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');
        const isMobile = window.innerWidth <= 767;
        
        // Only handle if mobile menu is open, or if it's a mobile device
        if (isMobile && navMenu && navMenu.classList.contains('show')) {
            if (href && href.startsWith('#')) {
                e.preventDefault();
                const target = document.querySelector(href);
                closeMenuAndScroll(target);
            } else {
                closeMenuAndScroll(null);
            }
        }
        // On desktop, let the default behavior or smooth scroll handler work
    });
});

dropdownLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');
        const isMobile = window.innerWidth <= 767;
        
        // Only handle if mobile menu is open, or if it's a mobile device
        if (isMobile && navMenu && navMenu.classList.contains('show')) {
            if (href && href.startsWith('#')) {
                e.preventDefault();
                const target = document.querySelector(href);
                closeMenuAndScroll(target);
            } else {
                closeMenuAndScroll(null);
            }
        }
        // On desktop, let the default behavior or smooth scroll handler work
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
    
    // Check if user is on menu or salads section (these are under "Meny" dropdown)
    const menuSection = document.querySelector('#menu');
    const saladsSection = document.querySelector('#salads');
    let isOnMenuSection = false;
    
    if (menuSection) {
        const menuHeight = menuSection.offsetHeight;
        const menuTop = menuSection.offsetTop - 100;
        if (scrollY > menuTop && scrollY <= menuTop + menuHeight) {
            isOnMenuSection = true;
        }
    }
    
    if (saladsSection) {
        const saladsHeight = saladsSection.offsetHeight;
        const saladsTop = saladsSection.offsetTop - 100;
        if (scrollY > saladsTop && scrollY <= saladsTop + saladsHeight) {
            isOnMenuSection = true;
        }
    }
    
    // If on menu or salads section, set active on "Meny" button
    if (isOnMenuSection) {
        navLinks.forEach(link => link.classList.remove('active'));
        if (menuDropdownButton) {
            menuDropdownButton.classList.add('active');
        }
        return;
    }

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
// Handle smooth scroll for desktop navigation links
document.querySelectorAll('.nav__menu a[href^="#"]:not(.nav__dropdown-link):not(.nav__link--no-href)').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const isMobile = window.innerWidth <= 767;
        
        // Only handle on desktop (mobile is handled by closeMenuAndScroll)
        if (!isMobile) {
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
        }
    });
});

// Handle smooth scroll for desktop dropdown links
document.querySelectorAll('.nav__dropdown-link').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const isMobile = window.innerWidth <= 767;
        
        // Only handle on desktop (mobile is handled by closeMenuAndScroll)
        if (!isMobile) {
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
        }
    });
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
    
    // Setup footer links (tel: and mailto: only on mobile)
    const footerPhoneLink = document.querySelector('.footer__list a[href^="tel:"]');
    const footerEmailLink = document.querySelector('.footer__list a[href^="mailto:"]');
    
    if (isMobileDevice()) {
        // Mobile: keep tel: and mailto: links active
        if (footerPhoneLink) {
            footerPhoneLink.href = 'tel:46673269';
        }
        if (footerEmailLink) {
            footerEmailLink.href = 'mailto:post@s-a-g.no';
        }
    } else {
        // Desktop: remove tel: and mailto: functionality
        if (footerPhoneLink) {
            footerPhoneLink.href = 'javascript:void(0)';
            footerPhoneLink.style.cursor = 'text';
        }
        if (footerEmailLink) {
            footerEmailLink.href = 'javascript:void(0)';
            footerEmailLink.style.cursor = 'text';
        }
    }
}

// ===== INITIALIZE ON LOAD =====
document.addEventListener('DOMContentLoaded', () => {
    // Always scroll to top on page load/refresh
    window.scrollTo(0, 0);
    
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

// Also scroll to top on page load (before DOMContentLoaded)
window.addEventListener('load', () => {
    window.scrollTo(0, 0);
});

// Scroll to top immediately if page is already loaded
if (document.readyState === 'loading') {
    window.scrollTo(0, 0);
} else {
    window.scrollTo(0, 0);
}

