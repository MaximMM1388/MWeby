// =====================================
// script.js - Všeobecná Funkčnosť a Interaktivita
// =====================================

document.addEventListener('DOMContentLoaded', () => {

    // --- 1. Prepínač Tém (Dark/Light Mode) ---
    const themeToggleBtn = document.getElementById('theme-toggle');
    const darkModeStyle = document.getElementById('dark-mode-style');
    const sunIcon = themeToggleBtn ? themeToggleBtn.querySelector('.icon-sun') : null;
    const moonIcon = themeToggleBtn ? themeToggleBtn.querySelector('.icon-moon') : null;
    const body = document.body;

    // Element pre vizuál v Hero sekcii
    const dayNightVisual = document.querySelector('.day-night-visual');

    // Funkcia na aktualizáciu vizuálu dňa/noci (pre dark mode)
    const updateDayNightVisual = () => {
        if (dayNightVisual) {
            if (body.classList.contains('dark-mode')) {
                dayNightVisual.classList.add('dark-mode');
                dayNightVisual.classList.remove('day-mode'); // Ensure day-mode is removed when in dark mode
            } else {
                dayNightVisual.classList.remove('dark-mode');
                dayNightVisual.classList.add('day-mode'); // Add day-mode when not in dark mode
            }
        }
    };

    // Funkcia na aplikovanie témy
    const applyTheme = (isDarkMode) => {
        if (isDarkMode) {
            body.classList.add('dark-mode');
            if (darkModeStyle) darkModeStyle.disabled = false;
            if (sunIcon && moonIcon) {
                sunIcon.classList.remove('show');
                sunIcon.classList.add('hide');
                moonIcon.classList.remove('hide');
                moonIcon.classList.add('show');
            }
        } else {
            body.classList.remove('dark-mode');
            if (darkModeStyle) darkModeStyle.disabled = true;
            if (sunIcon && moonIcon) {
                sunIcon.classList.remove('hide');
                sunIcon.classList.add('show');
                moonIcon.classList.remove('show');
                moonIcon.classList.add('hide');
            }
        }
        // Always update the visual after theme change
        updateDayNightVisual();
        localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
    };

    // Initialize theme on page load
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
        applyTheme(true);
    } else {
        applyTheme(false);
    }

    // Listener for the toggle button
    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            applyTheme(!body.classList.contains('dark-mode'));
        });
    }

    // --- 2. Custom Cursor ---
    const customCursor = document.querySelector('.custom-cursor');

    if (customCursor) {
        let mouseX = 0;
        let mouseY = 0;
        let cursorX = 0;
        let cursorY = 0;

        const animateCursor = () => {
            cursorX += (mouseX - cursorX) * 0.1;
            cursorY += (mouseY - cursorY) * 0.1;
            customCursor.style.left = `${cursorX}px`;
            customCursor.style.top = `${cursorY}px`;
            requestAnimationFrame(animateCursor);
        };

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            if (customCursor.style.opacity === '0') {
                customCursor.style.opacity = '1';
            }
        });

        // Hover effect on interactive elements
        const interactiveElements = 'a, button, input[type="submit"], input[type="button"], label, .faq-question, .quiz-options label';
        document.querySelectorAll(interactiveElements).forEach(element => {
            element.addEventListener('mouseenter', () => customCursor.classList.add('hover'));
            element.addEventListener('mouseleave', () => customCursor.classList.remove('hover'));
        });

        // Start the animation
        animateCursor();
    }

    // --- 3. Sticky Header (with optimization) ---
    const header = document.querySelector('.main-header');
    const heroSection = document.getElementById('home');
    let headerHeight = header ? header.offsetHeight : 0; // Ensure header exists

    const checkStickyHeader = () => {
        if (!header || !heroSection) return; // If elements are missing, exit function
        const heroBottom = heroSection.getBoundingClientRect().bottom;
        if (window.scrollY > headerHeight || heroBottom < 0) { // Added condition for scrolling
            header.classList.add('sticky');
        } else {
            header.classList.remove('sticky');
        }
    };

    // Ensure headerHeight is correct after resize or content load
    window.addEventListener('resize', () => {
        if (header) headerHeight = header.offsetHeight;
        checkStickyHeader();
    });

    window.addEventListener('scroll', checkStickyHeader);
    checkStickyHeader(); // Run on load in case user loads already scrolled

    // --- 4. Smooth scrolling for navigation links ---
    document.querySelectorAll('.main-nav a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // --- New: Active Navigation Link Logic for both pages and scroll sections ---
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.main-nav a');

    // Function to set active link based on current page URL
    const setPageActiveLink = () => {
        const currentPathname = window.location.pathname; // e.g., "/index.html", "/blog.html", "/"
        const currentFilename = currentPathname.split('/').pop(); // "index.html", "blog.html", or "" for root

        navLinks.forEach(link => {
            const linkHref = link.getAttribute('href');
            // Extract filename from link's href (e.g., "index.html", "blog.html", or "#home")
            const linkFilename = linkHref.includes('/') ? linkHref.split('/').pop() : linkHref;

            // Remove existing 'active' class
            link.classList.remove('active');

            // Handle links to external HTML pages
            if (!linkFilename.startsWith('#')) { // If it's not an internal hash link
                if (currentFilename === linkFilename || (currentFilename === '' && linkFilename === 'index.html')) {
                    link.classList.add('active');
                }
            }
        });
    };

    // Function to highlight navigation link based on scroll position for internal sections
    const highlightNavLink = () => {
        let currentSectionId = '';

        sections.forEach(section => {
            // Adjust offset for sticky header height
            const sectionTop = section.offsetTop - (header ? header.offsetHeight + 1 : 0); // +1 to ensure it triggers after passing header
            const sectionHeight = section.clientHeight;

            // Check if section is currently in viewport
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                currentSectionId = section.id;
            }
        });

        navLinks.forEach(link => {
            // Only manage active class for internal (hash) links when scrolling
            if (link.getAttribute('href').startsWith('#')) {
                link.classList.remove('active'); // Remove existing active class for hash links
                if (link.getAttribute('href').includes(currentSectionId)) {
                    link.classList.add('active');
                }
            }
        });
    };

    // Run setPageActiveLink on page load to mark the current page's link as active
    setPageActiveLink();

    // Add event listener for scroll (for internal section highlighting)
    window.addEventListener('scroll', highlightNavLink);
    // Also run on load to set initial active link based on scroll, but only for hash links
    highlightNavLink();

    // --- 5. Animácie pri scrollovaní (Intersection Observer) ---
    const animateOnScrollElements = document.querySelectorAll('.animate-on-scroll');
    const observerOptions = {
        root: null, // Use the viewport as the root
        rootMargin: '0px',
        threshold: 0.1 // Trigger when 10% of the element is visible
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target); // Stop observing once animated
            }
        });
    }, observerOptions);

    animateOnScrollElements.forEach(element => {
        observer.observe(element);
    });

    // --- 6. FAQ Akordeón ---
    const faqQuestions = document.querySelectorAll('.faq-question');

    faqQuestions.forEach(question => {
        question.addEventListener('click', () => {
            const faqItem = question.closest('.faq-item');
            if (faqItem) {
                faqItem.classList.toggle('active');
            }
        });
    });

    // --- 7. Promo Pop-up (zobrazenie po čase a zatvorenie) ---
    const promoPopup = document.getElementById('promo-popup');
    const popupCloseBtn = document.getElementById('popup-close-btn');

    if (promoPopup) {
        // Zobraziť pop-up po 3 sekundách
        setTimeout(() => {
            promoPopup.classList.add('is-visible');
        }, 3000);

        // Zatvoriť pop-up po kliknutí na X
        if (popupCloseBtn) {
            popupCloseBtn.addEventListener('click', () => {
                promoPopup.classList.remove('is-visible');
            });
        }

        // Zatvoriť pop-up po kliknutí mimo neho
        window.addEventListener('click', (event) => {
            if (event.target === promoPopup) {
                promoPopup.classList.remove('is-visible');
            }
        });

        // Zabrániť zatvoreniu pri kliknutí Vnútri pop-upu
        const popupContent = promoPopup.querySelector('.popup-content');
        if (popupContent) {
            popupContent.addEventListener('click', (event) => {
                event.stopPropagation();
            });
        }
    }

    // --- 8. Lazy Loading pre obrázky (basic) ---
    // Ak by boli na stránke <img> s class="lazy-load" a data-src
    const lazyImages = document.querySelectorAll('img.lazy-load');

    if ('IntersectionObserver' in window) {
        const lazyImageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const lazyImage = entry.target;
                    lazyImage.src = lazyImage.dataset.src;
                    // lazyImage.srcset = lazyImage.dataset.srcset; // Ak používate srcset
                    lazyImage.classList.remove('lazy-load');
                    lazyImageObserver.unobserve(lazyImage);
                }
            });
        });

        lazyImages.forEach(lazyImage => {
            lazyImageObserver.observe(lazyImage);
        });
    } else {
        // Fallback pre staršie prehliadače (načítanie všetkých obrázkov naraz)
        lazyImages.forEach(lazyImage => {
            lazyImage.src = lazyImage.dataset.src;
            // lazyImage.srcset = lazyImage.dataset.srcset;
        });
    }

    // --- 9. Tooltip pre ikonu (napr. pri cene) ---
    const infoIcon = document.getElementById('info-icon');
    const tooltipElement = document.getElementById('price-tooltip');

    if (infoIcon && tooltipElement) {
        const showTooltip = () => {
            tooltipElement.style.opacity = '1';
            tooltipElement.style.visibility = 'visible';
        };

        const hideTooltip = () => {
            if (tooltipElement) {
                tooltipElement.style.opacity = '0';
                tooltipElement.style.visibility = 'hidden';
            }
        };

        infoIcon.addEventListener('mouseenter', showTooltip);
        infoIcon.addEventListener('mouseleave', hideTooltip);

        // For mobile devices (on click)
        infoIcon.addEventListener('click', (e) => {
            e.preventDefault(); // Prevents jumping or other action
            if (tooltipElement && tooltipElement.style.opacity === '1') {
                hideTooltip();
            } else {
                showTooltip();
            }
        });
        // Hide tooltip if clicked elsewhere on the page
        document.addEventListener('click', (e) => {
            if (tooltipElement && e.target !== infoIcon && !infoIcon.contains(e.target)) {
                hideTooltip();
            }
        });
    }

    // --- 10. Fix for Hero Section and Day-Night Visual (Mutation Observer) ---
    // Use Mutation Observer to track class changes on body
    const observerBody = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            if (mutation.attributeName === 'class') {
                updateDayNightVisual();
            }
        });
    });

    if (body) {
        observerBody.observe(body, { attributes: true });
    }
});

const menuToggle = document.querySelector('.menu-toggle');
const mainNav = document.querySelector('.main-nav');

if (menuToggle && mainNav) {
    menuToggle.addEventListener('click', () => {
        mainNav.classList.toggle('active');
    });
}