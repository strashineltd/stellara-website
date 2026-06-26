(function() {
    // API 地址统一在 js/config.js 中通过 window.API_BASE 配置
    var scrollTicking = false;

    function throttle(fn, wait) {
        var last = 0;
        return function() {
            var now = Date.now();
            if (now - last >= wait) {
                last = now;
                fn.apply(this, arguments);
            }
        };
    }

    function escapeHtml(str) {
        if (typeof str !== 'string') return '';
        var div = document.createElement('div');
        div.appendChild(document.createTextNode(str));
        return div.innerHTML;
    }

    function initNavbar() {
        var navbar = document.querySelector('.navbar');
        if (!navbar) return;

        var onScroll = function() {
            if (scrollTicking) return;
            scrollTicking = true;
            requestAnimationFrame(function() {
                if (window.scrollY > 50) {
                    navbar.classList.add('scrolled');
                } else {
                    navbar.classList.remove('scrolled');
                }
                scrollTicking = false;
            });
        };

        window.addEventListener('scroll', onScroll, { passive: true });
        onScroll();
    }

    function initAnimations() {
        var observer = new IntersectionObserver(function(entries) {
            for (var i = 0; i < entries.length; i++) {
                if (entries[i].isIntersecting) {
                    entries[i].target.classList.add('visible');
                    observer.unobserve(entries[i].target);
                }
            }
        }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

        var selectors = '.feature-card,.product-card,.stat-item,.about-visual-card,.about-check,.product-hero-card,.product-feature-item,.streaming-card,.feature-v2-card,.showcase-card,.step-card,.testimonial-card';
        var els = document.querySelectorAll(selectors);
        for (var i = 0; i < els.length; i++) {
            observer.observe(els[i]);
        }
    }

    function initStatsCounter() {
        var statsSection = document.querySelector('.stats-section');
        if (!statsSection) return;

        var animated = false;
        var observer = new IntersectionObserver(function(entries) {
            if (entries[0].isIntersecting && !animated) {
                animated = true;
                observer.unobserve(statsSection);

                var numbers = statsSection.querySelectorAll('.stat-number');
                for (var i = 0; i < numbers.length; i++) {
                    animateNumber(numbers[i], parseInt(numbers[i].getAttribute('data-target')) || 0);
                }
            }
        }, { threshold: 0.3 });

        observer.observe(statsSection);
    }

    function animateNumber(el, target) {
        var duration = 1500;
        var startTime = null;

        function step(timestamp) {
            if (!startTime) startTime = timestamp;
            var progress = Math.min((timestamp - startTime) / duration, 1);
            var eased = 1 - Math.pow(1 - progress, 3);
            el.textContent = Math.floor(eased * target);
            if (progress < 1) {
                requestAnimationFrame(step);
            } else {
                el.textContent = target;
            }
        }

        requestAnimationFrame(step);
    }

    function initMobileMenu() {
        var mobileToggle = document.querySelector('.mobile-toggle');
        var mobileMenu = document.querySelector('.mobile-menu');
        if (!mobileToggle || !mobileMenu) return;

        function closeMobileMenu() {
            mobileMenu.classList.remove('active');
            document.body.style.overflow = '';
        }

        mobileToggle.addEventListener('click', function() {
            mobileMenu.classList.add('active');
            document.body.style.overflow = 'hidden';
        });

        var closeBtn = document.createElement('div');
        closeBtn.innerHTML = '\u00d7';
        closeBtn.className = 'mobile-menu-close';
        closeBtn.addEventListener('click', closeMobileMenu);
        mobileMenu.appendChild(closeBtn);

        var links = mobileMenu.querySelectorAll('a');
        for (var i = 0; i < links.length; i++) {
            links[i].addEventListener('click', closeMobileMenu);
        }
    }

    function initBackToTop() {
        var backToTop = document.querySelector('.back-to-top');
        if (!backToTop) return;

        var onScroll = throttle(function() {
            if (window.scrollY > 500) {
                backToTop.classList.add('visible');
            } else {
                backToTop.classList.remove('visible');
            }
        }, 100);
        window.addEventListener('scroll', onScroll, { passive: true });

        backToTop.addEventListener('click', function() {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    function initSmoothScroll() {
        var anchors = document.querySelectorAll('a[href^="#"]');
        for (var i = 0; i < anchors.length; i++) {
            anchors[i].addEventListener('click', function(e) {
                var href = this.getAttribute('href');
                if (href === '#') return;
                e.preventDefault();
                var target = document.querySelector(href);
                if (target) {
                    var navbarHeight = document.querySelector('.navbar') ? document.querySelector('.navbar').offsetHeight : 0;
                    var pos = target.getBoundingClientRect().top + window.scrollY - navbarHeight;
                    window.scrollTo({ top: pos, behavior: 'smooth' });
                }
            });
        }
    }

    function initExternalLinks() {
        var links = document.querySelectorAll('a[target="_blank"]');
        for (var i = 0; i < links.length; i++) {
            if (links[i].getAttribute('rel') === null) {
                links[i].setAttribute('rel', 'noopener noreferrer');
            }
        }
    }

    function initLazyLoad() {
        if ('IntersectionObserver' in window) {
            var lazyImages = document.querySelectorAll('img[loading="lazy"]');
            var imgObserver = new IntersectionObserver(function(entries) {
                for (var i = 0; i < entries.length; i++) {
                    if (entries[i].isIntersecting) {
                        var img = entries[i].target;
                        if (img.dataset.src) {
                            img.src = img.dataset.src;
                            delete img.dataset.src;
                        }
                        imgObserver.unobserve(img);
                    }
                }
            }, { rootMargin: '100px' });

            for (var i = 0; i < lazyImages.length; i++) {
                imgObserver.observe(lazyImages[i]);
            }
        }
    }

    initNavbar();
    initAnimations();
    initStatsCounter();
    initMobileMenu();
    initBackToTop();
    initSmoothScroll();
    initExternalLinks();
    initLazyLoad();
})();
