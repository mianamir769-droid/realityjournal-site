(function ($) {
    ('use strict');
    /*=============================================
    =              Preloader       =
    =============================================*/
    function preloader() {
        $('#preloader').fadeOut();
    }
    /*=============================================
    =     Offcanvas Menu      =
    =============================================*/
    function offcanvasMenu() {
        $('.menu-tigger').on('click', function () {
            $('.offCanvas__info, .offCanvas__overly').addClass('active');
            return false;
        });
        $('.menu-close, .offCanvas__overly').on('click', function () {
            $('.offCanvas__info, .offCanvas__overly').removeClass('active');
        });
    }
    /*=============================================
    =          Data Background      =
    =============================================*/
    function dataBackground() {
        $('[data-background]').each(function () {
            $(this).css('background-image', 'url(' + $(this).attr('data-background') + ')');
        });
    }

    /*=============================================
    =    		Odometer counterup	      =
    =============================================*/
    function odometerCounter() {
        if ($('.odometer').length > 0) {
            $('.odometer').each(function () {
                var $this = $(this);
                var countNumber = $this.attr('data-count');

                $this.html('0');

                $this.appear(
                    function () {
                        var $element = $(this);
                        if (!$element.hasClass('odometer-animated')) {
                            $element.addClass('odometer-animated');

                            setTimeout(function () {
                                $element.html(countNumber);
                            }, 100);
                        }
                    },
                    {
                        accY: -50,
                    },
                );
            });
        }
    }
    /*=============================================
    =    		Magnific Popup		      =
    =============================================*/
    function magnificPopup() {
        $('.popup-image').magnificPopup({
            type: 'image',
            mainClass: 'mfp-with-zoom',
            gallery: {
                enabled: true,
            },
        });
        /* magnificPopup video view */
        $('.popup-video').magnificPopup({
            type: 'iframe',
            mainClass: 'mfp-with-zoom',
            zoom: {
                enabled: true,
                duration: 300,
                easing: 'ease-in-out',
                opener: function (openerElement) {
                    return openerElement.is('img') ? openerElement : openerElement.find('img');
                },
            },
        });
    }
    function theStickySidebar() {
        $('.sidebar_right').stickySidebar({
            topSpacing: 50,
            bottomSpacing: 50,
        });
    }
    /*=============================================
    =           Go to top       =
    =============================================*/
    function progressPageLoad() {
        var progressWrap = document.querySelector('.btn-scroll-top');
        if (progressWrap != null) {
            var progressPath = document.querySelector('.btn-scroll-top path');
            var pathLength = progressPath.getTotalLength();
            var offset = 50;
            progressPath.style.transition = progressPath.style.WebkitTransition = 'none';
            progressPath.style.strokeDasharray = pathLength + ' ' + pathLength;
            progressPath.style.strokeDashoffset = pathLength;
            progressPath.getBoundingClientRect();
            progressPath.style.transition = progressPath.style.WebkitTransition = 'stroke-dashoffset 10ms linear';
            window.addEventListener('scroll', function (event) {
                var scroll = document.body.scrollTop || document.documentElement.scrollTop;
                var height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
                var progress = pathLength - (scroll * pathLength) / height;
                progressPath.style.strokeDashoffset = progress;
                var scrollElementPos = document.body.scrollTop || document.documentElement.scrollTop;
                if (scrollElementPos >= offset) {
                    progressWrap.classList.add('active-progress');
                } else {
                    progressWrap.classList.remove('active-progress');
                }
            });
            progressWrap.addEventListener('click', function (e) {
                e.preventDefault();
                window.scroll({
                    top: 0,
                    left: 0,
                    behavior: 'smooth',
                });
            });
        }
    }
    /*=============================================
    =           Aos Active       =
    =============================================*/
    function aosAnimation() {
        // Check if AOS is loaded
        if (typeof AOS === 'undefined') {
            console.error('AOS library not loaded');
            return;
        }

        // console.log('Initializing AOS...');

        AOS.init({
            duration: 1000,
            mirror: true,
            once: true,
            disable: false, // Enable AOS on all devices
            startEvent: 'DOMContentLoaded', // Start earlier
            debounceDelay: 50,
            throttleDelay: 99,
            offset: 120,
        });

        // console.log('AOS initialized successfully');

        // Refresh AOS to ensure it detects elements
        setTimeout(function () {
            AOS.refresh();
            // console.log('AOS refreshed');
        }, 100);
    }

    // link hover effect 1
    function initLinkEffect1() {
        // Find all <a> elements with class .link-effect-1
        const linkElements = document.querySelectorAll('a.link-effect-1');

        linkElements.forEach(function (linkElement) {
            // Check if already processed to avoid duplicates
            if (linkElement.querySelector('span.text-2')) {
                return;
            }

            // Find the first <span> element inside the <a> tag
            const firstSpan = linkElement.querySelector('span');

            if (firstSpan) {
                // Add class "text-1" to the first <span> element
                firstSpan.classList.add('text-1');

                // Get the content of the first <span> element
                const spanContent = firstSpan.textContent;

                // Create a new <span> element with class "text-2"
                const secondSpan = document.createElement('span');
                secondSpan.className = 'text-2';
                secondSpan.textContent = spanContent;

                // Append the new <span> element to the <a> tag
                linkElement.appendChild(secondSpan);
            }
        });
    }
    // button hover effect 1
    function initButtonEffect3() {
        const buttons = document.querySelectorAll('.button-effect-1');

        buttons.forEach((button) => {
            // Get the original text content
            const originalText = button.textContent.trim();

            // Create the HTML structure with wrapper span and two text spans
            const textStructure = `
                <span class="btn-text">
                    <span class="btn-text-1">${originalText}</span>
                    <span class="btn-text-2">${originalText}</span>
                </span>
            `;

            // Replace button content with the new structure
            button.innerHTML = textStructure;
        });
    }

    /*=============================================
    =          Sidebar Menu Toggle Functionality   =
    =============================================*/
    function initSidebarMenu() {
        const navbarToggler = document.querySelector('.navbar-toggler');
        const sidebarLeft = document.querySelector('.sidebar-left');
        const sidebarOverlay = document.querySelector('.sidebar-overlay');
        const closeSidebar = document.querySelector('.close-sidebar');

        // Add event listener for navbar toggler if it exists
        if (navbarToggler && sidebarLeft && sidebarOverlay) {
            navbarToggler.addEventListener('click', function (e) {
                e.preventDefault();
                sidebarLeft.classList.add('active');
                sidebarOverlay.classList.add('active');
                document.body.style.overflow = 'hidden';
            });
        }

        // Add event listener for overlay if it exists
        if (sidebarOverlay && sidebarLeft) {
            sidebarOverlay.addEventListener('click', function () {
                sidebarLeft.classList.remove('active');
                this.classList.remove('active');
                document.body.style.overflow = '';
            });
        }

        // Add event listener for close button if it exists
        if (closeSidebar && sidebarLeft && sidebarOverlay) {
            closeSidebar.addEventListener('click', function (e) {
                e.preventDefault();
                sidebarLeft.classList.remove('active');
                sidebarOverlay.classList.remove('active');
                document.body.style.overflow = '';
            });
        }

        // Toggle submenu when clicking on menu items with children
        document.querySelectorAll('.sidebar-nav .collapse-toggle').forEach((toggle) => {
            toggle.addEventListener('click', function (e) {
                e.preventDefault();
                const parentItem = this.closest('.nav-item');
                const submenu = this.nextElementSibling;

                // Toggle active class on parent item
                parentItem.classList.toggle('active');

                // Toggle the submenu
                if (submenu && submenu.classList.contains('collapse-menu')) {
                    if (submenu.style.maxHeight) {
                        submenu.style.maxHeight = null;
                    } else {
                        submenu.style.maxHeight = submenu.scrollHeight + 'px';
                    }
                }
            });
        });

        // Toggle submenu for items with has-child class
        document.querySelectorAll('.sidebar-nav .has-child').forEach((childToggle) => {
            childToggle.addEventListener('click', function (e) {
                e.preventDefault();
                const parentItem = this.closest('.nav-item-has-child');
                const submenu = this.nextElementSibling;

                // Toggle active class on parent item
                parentItem.classList.toggle('active');

                // Toggle the submenu
                if (submenu && submenu.classList.contains('sub-menu')) {
                    if (submenu.style.maxHeight) {
                        submenu.style.maxHeight = null;
                    } else {
                        submenu.style.maxHeight = submenu.scrollHeight + 'px';
                    }
                }
            });
        });

        // Close sidebar when clicking on close button
        document.querySelectorAll('.close-popup').forEach((closeBtn) => {
            closeBtn.addEventListener('click', function () {
                document.querySelector('.sidebar-left').classList.remove('active');
                document.querySelector('.popup-search-overlay').classList.remove('active');
                document.body.style.overflow = '';
            });
        });
    }
    /*=============================================
    =          Tab Functionality         =
    =============================================*/
    function initTabs() {
        const tabLinks = document.querySelectorAll('[data-bs-toggle="tab"], [data-toggle="tab"]');

        if (!tabLinks.length) return;

        // Function to show tab
        function showTab(tabLink) {
            if (!tabLink || !tabLink.getAttribute('href')) return;

            const tabId = tabLink.getAttribute('href');
            const tabPane = document.querySelector(tabId);

            if (!tabPane) return;

            // Hide all tab panes and deactivate all tab links
            document.querySelectorAll('.tab-pane').forEach((pane) => {
                pane.classList.remove('show', 'active');
            });

            tabLinks.forEach((link) => {
                link.classList.remove('active');
                link.setAttribute('aria-selected', 'false');
            });

            // Show the selected tab pane and activate the tab link
            tabLink.classList.add('active');
            tabLink.setAttribute('aria-selected', 'true');
            tabPane.classList.add('show', 'active');

            // Trigger a custom event in case other scripts need to know about tab changes
            const event = new Event('shown.bs.tab');
            tabLink.dispatchEvent(event);
        }

        // Handle click events
        tabLinks.forEach((tabLink) => {
            tabLink.addEventListener('click', function (e) {
                e.preventDefault();
                showTab(this);
            });

            // Set initial ARIA attributes
            tabLink.setAttribute('role', 'tab');
            tabLink.setAttribute('aria-selected', 'false');

            // Set up keyboard navigation
            tabLink.addEventListener('keydown', function (e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    showTab(this);
                } else if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
                    e.preventDefault();
                    const tabs = Array.from(tabLinks);
                    const currentIndex = tabs.indexOf(this);
                    let nextIndex = e.key === 'ArrowRight' ? currentIndex + 1 : currentIndex - 1;

                    // Loop around if at the start/end
                    if (nextIndex >= tabs.length) nextIndex = 0;
                    if (nextIndex < 0) nextIndex = tabs.length - 1;

                    tabs[nextIndex].focus();
                }
            });
        });

        // Show first tab by default if none is active
        const activeTab = document.querySelector('.nav-link.active, .nav-tabs .active');
        if (activeTab) {
            showTab(activeTab);
        } else if (tabLinks.length > 0) {
            showTab(tabLinks[0]);
        }
    }

    /*=============================================
    =          Collapse/Accordion Functionality         =
    =============================================*/
    function initCollapse() {
        // Find all collapse triggers
        const collapseTriggers = document.querySelectorAll('[data-bs-toggle="collapse"]');

        collapseTriggers.forEach(function (trigger) {
            // Prevent duplicate event listeners
            if (trigger.dataset.collapseInitialized === 'true') {
                return;
            }
            trigger.dataset.collapseInitialized = 'true';

            // Initialize collapsed state based on current state
            const href = trigger.getAttribute('href');
            if (href) {
                const targetId = href.startsWith('#') ? href : '#' + href;
                const collapseElement = document.querySelector(targetId);
                if (collapseElement) {
                    // Add transition for smooth animation
                    collapseElement.style.transition = 'height 0.35s ease';
                    collapseElement.style.overflow = 'hidden';

                    const isShown = collapseElement.classList.contains('show');
                    if (!isShown) {
                        trigger.classList.add('collapsed');
                        collapseElement.style.height = '0px';
                    } else {
                        trigger.classList.remove('collapsed');
                        collapseElement.style.height = collapseElement.scrollHeight + 'px';
                    }
                }
            }

            trigger.addEventListener('click', function (e) {
                e.preventDefault();

                const href = this.getAttribute('href');
                if (!href) return;

                const targetId = href.startsWith('#') ? href : '#' + href;
                const collapseElement = document.querySelector(targetId);
                if (!collapseElement) return;

                // Ensure transition is set
                collapseElement.style.transition = 'height 0.35s ease';
                collapseElement.style.overflow = 'hidden';

                const isCurrentlyShown = collapseElement.classList.contains('show');
                const parentSelector = collapseElement.getAttribute('data-bs-parent');

                // If has parent (accordion mode), close other collapses in the same parent
                if (parentSelector) {
                    const parent = document.querySelector(parentSelector);
                    if (parent) {
                        // Close all other collapses in the same parent
                        parent.querySelectorAll('.collapse.show').forEach(function (otherCollapse) {
                            if (otherCollapse !== collapseElement) {
                                const otherTrigger = parent.querySelector('[href="#' + otherCollapse.id + '"]');
                                if (otherTrigger) {
                                    otherTrigger.classList.add('collapsed');
                                }
                                // Close with animation
                                otherCollapse.style.height = '0px';
                                setTimeout(function () {
                                    otherCollapse.classList.remove('show');
                                }, 350);
                            }
                        });
                    }
                }

                // Toggle current collapse
                if (isCurrentlyShown) {
                    // Close
                    this.classList.add('collapsed');
                    collapseElement.style.height = '0px';
                    setTimeout(function () {
                        collapseElement.classList.remove('show');
                    }, 350);
                } else {
                    // Open
                    collapseElement.classList.add('show');
                    // Force reflow to ensure height is calculated correctly
                    collapseElement.style.height = '0px';
                    requestAnimationFrame(
                        function () {
                            const targetHeight = collapseElement.scrollHeight + 'px';
                            collapseElement.style.height = targetHeight;
                            this.classList.remove('collapsed');
                        }.bind(this),
                    );

                    // Clean up after animation
                    setTimeout(function () {
                        if (collapseElement.classList.contains('show')) {
                            collapseElement.style.height = 'auto';
                        }
                    }, 350);
                }
            });
        });
    }
    /*-------------------------------
        Sort by active
    -----------------------------------*/
    function initSortBy() {
        if ($('.sort-by-product-area').length) {
            var $body = $('body'),
                $cartWrap = $('.sort-by-product-area'),
                $cartContent = $cartWrap.find('.sort-by-dropdown');
            $cartWrap.on('click', '.sort-by-product-wrap', function (e) {
                e.preventDefault();
                var $this = $(this);
                if (!$this.parent().hasClass('show')) {
                    $this.siblings('.sort-by-dropdown').addClass('show').parent().addClass('show');
                } else {
                    $this.siblings('.sort-by-dropdown').removeClass('show').parent().removeClass('show');
                }
            });
            /*Close When Click Outside*/
            $body.on('click', function (e) {
                var $target = e.target;
                if (!$($target).is('.sort-by-product-area') && !$($target).parents().is('.sort-by-product-area') && $cartWrap.hasClass('show')) {
                    $cartWrap.removeClass('show');
                    $cartContent.removeClass('show');
                }
            });
        }
    }

    /*=============================================
    =          Popup Search Functionality         =
    =============================================*/
    function initPopupSearch() {
        const searchBtn = document.querySelector('.search-btn');
        const popupSearch = document.querySelector('.popup-search');
        const closeBtn = document.querySelector('.close-popup');
        const popupOverlay = document.querySelector('.popup-search-overlay');

        function showPopup() {
            document.body.style.overflow = 'hidden';
            popupSearch.classList.add('show');
            popupOverlay.classList.add('active');
            // Focus on search input when popup opens
            const searchInput = popupSearch.querySelector('input[type="text"]');
            if (searchInput) {
                setTimeout(() => {
                    searchInput.focus();
                }, 100);
            }
        }

        function hidePopup() {
            document.body.style.overflow = '';
            popupSearch.classList.remove('show');
            popupOverlay.classList.remove('active');
        }

        if (searchBtn && popupSearch && popupOverlay) {
            // Show popup when search button is clicked
            searchBtn.addEventListener('click', function (e) {
                e.preventDefault();
                showPopup();
            });
        }

        if (closeBtn && popupSearch && popupOverlay) {
            // Hide popup when close button is clicked
            closeBtn.addEventListener('click', function (e) {
                e.preventDefault();
                hidePopup();
            });
        }

        // Close popup when clicking on overlay
        if (popupOverlay) {
            popupOverlay.addEventListener('click', function () {
                hidePopup();
            });
        }

        // Close popup when clicking outside of the popup content
        if (popupSearch) {
            popupSearch.addEventListener('click', function (e) {
                if (e.target === popupSearch) {
                    hidePopup();
                }
            });
        }
    }
    //Qty Up-Down
    function initQtyUpDown() {
        const detailQty = document.querySelectorAll('.detail-qty');
        detailQty.forEach(function (detailQty) {
            const qtyUp = detailQty.querySelector('.qty-up');
            const qtyDown = detailQty.querySelector('.qty-down');
            qtyUp.addEventListener('click', function (event) {
                event.preventDefault();
                const qtyVal = detailQty.querySelector('.qty-val');
                const currentVal = parseInt(qtyVal.textContent);
                if (currentVal < 10) {
                    qtyVal.textContent = currentVal + 1;
                }
            });
            qtyDown.addEventListener('click', function (event) {
                event.preventDefault();
                const qtyVal = detailQty.querySelector('.qty-val');
                const currentVal = parseInt(qtyVal.textContent);
                if (currentVal > 1) {
                    qtyVal.textContent = currentVal - 1;
                }
            });
        });
    }

    /*=============================================
    =          Quick View Modal Functionality         =
    =============================================*/
    function initQuickViewModal() {
        const quickViewBtns = document.querySelectorAll('[data-bs-target="#quickViewModal"]');
        const quickViewModal = document.querySelector('#quickViewModal');
        const closeBtns = document.querySelectorAll('#quickViewModal .btn-close, #quickViewModal .close-quickview');

        function showModal() {
            document.body.style.overflow = 'hidden';
            if (quickViewModal) {
                quickViewModal.classList.add('show');
                quickViewModal.style.display = 'block';
                // Trigger backdrop
                const backdrop = document.querySelector('.modal-backdrop');
                if (!backdrop) {
                    const modalBackdrop = document.createElement('div');
                    modalBackdrop.className = 'modal-backdrop fade show';
                    document.body.appendChild(modalBackdrop);
                }

                // Update Swiper to ensure it's properly initialized and synced
                const productPopEl = document.querySelector('#quickViewModal .product-popup-quickview');
                if (productPopEl && productPopEl.swiper) {
                    productPopEl.swiper.update();
                    productPopEl.swiper.updateSlides();
                    productPopEl.swiper.updateSlidesClasses();
                }
            }
        }

        function hideModal() {
            document.body.style.overflow = '';
            if (quickViewModal) {
                quickViewModal.classList.remove('show');
                quickViewModal.style.display = 'none';
                // Remove backdrop
                const backdrop = document.querySelector('.modal-backdrop');
                if (backdrop) {
                    backdrop.remove();
                }
            }
        }

        // Show modal when quick view button is clicked
        if (quickViewBtns) {
            quickViewBtns.forEach(function (btn) {
                btn.addEventListener('click', function (e) {
                    e.preventDefault();
                    showModal();
                });
            });
        }

        // Hide modal when close button is clicked
        if (closeBtns) {
            closeBtns.forEach(function (btn) {
                btn.addEventListener('click', function (e) {
                    e.preventDefault();
                    hideModal();
                });
            });
        }

        // Close modal when clicking on backdrop
        if (quickViewModal) {
            quickViewModal.addEventListener('click', function (e) {
                if (e.target === quickViewModal) {
                    hideModal();
                }
            });
        }

        // Close modal when pressing Escape key
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && quickViewModal && quickViewModal.classList.contains('show')) {
                hideModal();
            }
        });
    }

    function customSwiper() {
        const swiperCardHero = new Swiper('.swiper-card-hero', {
            slidesPerView: 4,
            spaceBetween: 42,
            slidesPerGroup: 1,
            centeredSlides: false,
            loop: true,
            autoplay: {
                delay: 4000,
            },
            navigation: {
                nextEl: '.swiper-btn-next',
                prevEl: '.swiper-btn-prev',
            },
            breakpoints: {
                1200: {
                    slidesPerView: 4,
                },
                992: {
                    slidesPerView: 3,
                },
                768: {
                    slidesPerView: 2,
                },
                576: {
                    slidesPerView: 1,
                },
                0: {
                    slidesPerView: 1,
                },
            },
        });
        const slider2 = new Swiper('.slider-2', {
            slidesPerView: 3,
            spaceBetween: 27,
            slidesPerGroup: 1,
            centeredSlides: false,
            loop: true,
            autoplay: {
                delay: 4000,
            },
            breakpoints: {
                1200: {
                    slidesPerView: 2,
                },
                992: {
                    slidesPerView: 2,
                },
                768: {
                    slidesPerView: 1,
                },
                576: {
                    slidesPerView: 1,
                },
                0: {
                    slidesPerView: 1,
                },
            },
        });

        const swiperPopupSearch = new Swiper('.swiper-popup-search', {
            slidesPerView: 3,
            spaceBetween: 15,
            slidesPerGroup: 1,
            centeredSlides: false,
            loop: true,
            autoplay: {
                delay: 4000,
            },
            breakpoints: {
                1200: {
                    slidesPerView: 3,
                },
                992: {
                    slidesPerView: 2,
                },
                768: {
                    slidesPerView: 1,
                },
                576: {
                    slidesPerView: 1,
                },
                0: {
                    slidesPerView: 1,
                },
            },
        });

        const swiperCategory = new Swiper('.swiper-category', {
            slidesPerView: 1,
            spaceBetween: 24,
            slidesPerGroup: 1,
            centeredSlides: false,
            loop: true,
            autoplay: {
                delay: 4000,
            },
        });
        const swiperCategory2 = new Swiper('.swiper-category-2', {
            slidesPerView: 1,
            spaceBetween: 24,
            slidesPerGroup: 1,
            centeredSlides: false,
            loop: true,
            autoplay: {
                reverseDirection: true,
                delay: 4000,
            },
        });

        const galleryThumbs = new Swiper('.gallery-product-thumbs', {
            spaceBetween: 12,
            slidesPerView: 5,
            freeMode: true,
            autoplay: {
                delay: 4000,
            },
            loop: true,
            breakpoints: {
                1200: {
                    slidesPerView: 5,
                },
                992: {
                    slidesPerView: 5,
                },
                768: {
                    slidesPerView: 5,
                },
                576: {
                    slidesPerView: 4,
                },
                0: {
                    slidesPerView: 3,
                },
            },
        });

        const galleryTop = new Swiper('.gallery-product-popup', {
            spaceBetween: 0,
            slidesPerView: 1,
            loop: true,
            freeMode: false,
            autoplay: {
                delay: 4000,
            },
            thumbs: {
                swiper: galleryThumbs,
            },
        });

        const galleryThumbsQuickView = new Swiper('.gallery-thumbs-quickview', {
            spaceBetween: 12,
            slidesPerView: 4,
            freeMode: true,
            loop: true,
            autoplay: {
                delay: 4000,
            },
            breakpoints: {
                1200: {
                    slidesPerView: 4,
                },
                992: {
                    slidesPerView: 4,
                },
                768: {
                    slidesPerView: 3,
                },
                576: {
                    slidesPerView: 3,
                },
                0: {
                    slidesPerView: 2,
                },
            },
        });

        const galleryTopQuickView = new Swiper('.product-popup-quickview', {
            spaceBetween: 10,
            slidesPerView: 1,
            loop: true,
            thumbs: {
                swiper: galleryThumbsQuickView,
            },
            autoplay: {
                delay: 4000,
            },
        });

        const slider1 = new Swiper('.slider-1', {
            slidesPerView: 1,
            spaceBetween: 30,
            slidesPerGroup: 1,
            effect: 'fade',
            centeredSlides: false,
            loop: true,
            autoplay: {
                delay: 2000,
            },
            pagination: {
                el: '.swiper-pagination',
                clickable: true,
            },
        });
        const swiper3 = new Swiper('.swiper-3', {
            slidesPerView: 3,
            spaceBetween: 42,
            slidesPerGroup: 1,
            centeredSlides: false,
            loop: true,
            autoplay: {
                delay: 4000,
            },
            breakpoints: {
                1200: {
                    slidesPerView: 3,
                },
                992: {
                    slidesPerView: 2,
                },
                768: {
                    slidesPerView: 2,
                },
                576: {
                    slidesPerView: 2,
                },
                0: {
                    slidesPerView: 1,
                },
            },
        });
        const slider4 = new Swiper('.slider-4', {
            slidesPerView: 4,
            spaceBetween: 30,
            slidesPerGroup: 1,
            centeredSlides: false,
            loop: true,
            // autoplay: {
            //     delay: 4000,
            // },
            breakpoints: {
                1200: {
                    slidesPerView: 4,
                },
                992: {
                    slidesPerView: 3,
                },
                768: {
                    slidesPerView: 2,
                },
                576: {
                    slidesPerView: 1,
                },
                0: {
                    slidesPerView: 1,
                },
            },
            navigation: {
                nextEl: '.swiper-btn-next',
                prevEl: '.swiper-btn-prev',
            },
        });
        const swiperInsta = new Swiper('.swiper-insta', {
            slidesPerView: 6,
            spaceBetween: 14,
            slidesPerGroup: 1,
            centeredSlides: true,
            loop: true,
            autoplay: {
                delay: 4000,
            },
            breakpoints: {
                1200: {
                    slidesPerView: 6,
                    spaceBetween: 14,
                },
                992: {
                    slidesPerView: 6,
                    spaceBetween: 14,
                },
                768: {
                    slidesPerView: 4,
                    spaceBetween: 14,
                },
                576: {
                    slidesPerView: 2,
                    spaceBetween: 14,
                },
                0: {
                    slidesPerView: 2,
                    spaceBetween: 14,
                },
            },
        });
    }
    /*=============================================
    =          Text Animation Styles          =
    =============================================*/
    function initTextAnimations() {
        // Ensure GSAP and ScrollTrigger are available
        if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
            console.warn('GSAP or ScrollTrigger not loaded. Text animations will be skipped.');
            return;
        }

        // Register ScrollTrigger plugin
        gsap.registerPlugin(ScrollTrigger);

        // Text Animation Style 1 - Word-based animation
        if ($('.text-anime-style-1').length) {
            let staggerAmount = 0.05,
                delayValue = 0.3,
                animatedTextElements = document.querySelectorAll('.text-anime-style-1');

            animatedTextElements.forEach((element) => {
                // Check if element is already processed
                if (element.dataset.textAnimated === 'true') {
                    return;
                }

                let animationSplitText = new SplitText(element, { type: 'chars, words' });

                // Set initial state
                gsap.set(animationSplitText.words, {
                    x: 30,
                    autoAlpha: 0,
                });

                // Create animation
                gsap.to(animationSplitText.words, {
                    duration: 1,
                    delay: delayValue,
                    x: 0,
                    autoAlpha: 1,
                    stagger: staggerAmount,
                    ease: 'power2.out',
                    scrollTrigger: {
                        trigger: element,
                        start: 'top 85%',
                        end: 'bottom 15%',
                        toggleActions: 'play none none reverse',
                        refreshPriority: -1,
                    },
                });

                // Mark as processed
                element.dataset.textAnimated = 'true';
            });
        }

        // Text Animation Style 2 - Character-based animation
        if ($('.text-anime-style-2').length) {
            let staggerAmount = 0.03,
                translateXValue = 20,
                delayValue = 0.1,
                easeType = 'power2.out',
                animatedTextElements = document.querySelectorAll('.text-anime-style-2');

            animatedTextElements.forEach((element) => {
                // Check if element is already processed
                if (element.dataset.textAnimated === 'true') {
                    return;
                }

                let animationSplitText = new SplitText(element, { type: 'chars, words' });

                // Set initial state
                gsap.set(animationSplitText.chars, {
                    x: translateXValue,
                    autoAlpha: 0,
                });

                // Create animation
                gsap.to(animationSplitText.chars, {
                    duration: 0.4,
                    delay: delayValue,
                    x: 0,
                    autoAlpha: 1,
                    stagger: staggerAmount,
                    ease: easeType,
                    scrollTrigger: {
                        trigger: element,
                        start: 'top 85%',
                        end: 'bottom 15%',
                        toggleActions: 'play none none reverse',
                        refreshPriority: -1,
                    },
                });

                // Mark as processed
                element.dataset.textAnimated = 'true';
            });
        }

        // Text Animation Style 3 - Advanced character animation with 3D effects
        if ($('.text-anime-style-3').length) {
            let animatedTextElements = document.querySelectorAll('.text-anime-style-3');

            animatedTextElements.forEach((element) => {
                // Check if element is already processed
                if (element.dataset.textAnimated === 'true') {
                    return;
                }

                // Clean up previous animations if any
                if (element.animation) {
                    element.animation.progress(1).kill();
                    element.split.revert();
                }

                // Create split text
                element.split = new SplitText(element, {
                    type: 'lines,words,chars',
                    linesClass: 'split-line',
                });

                // Set perspective for 3D effect
                gsap.set(element, { perspective: 400 });

                // Set initial state
                gsap.set(element.split.chars, {
                    opacity: 0,
                    x: 50,
                    rotateX: 90,
                });

                // Create animation
                element.animation = gsap.to(element.split.chars, {
                    x: 0,
                    y: 0,
                    rotateX: 0,
                    opacity: 1,
                    duration: 1,
                    ease: Back.easeOut,
                    stagger: 0.02,
                    scrollTrigger: {
                        trigger: element,
                        start: 'top 90%',
                        end: 'bottom 10%',
                        toggleActions: 'play none none reverse',
                        refreshPriority: -1,
                    },
                });

                // Mark as processed
                element.dataset.textAnimated = 'true';
            });
        }

        // Refresh ScrollTrigger after all animations are set up
        ScrollTrigger.refresh();
    }

    // Function to reinitialize text animations (useful for dynamic content)
    function reinitTextAnimations() {
        // Clear existing animations
        document.querySelectorAll('.text-anime-style-1, .text-anime-style-2, .text-anime-style-3').forEach((el) => {
            el.dataset.textAnimated = 'false';
        });
    }

    function inputFocus() {
        $('input')
            .focus(function () {
                $(this).closest('div.input-group').addClass('focus');
            })
            .blur(function () {
                $(this).closest('div.input-group').removeClass('focus');
            });
        $('textarea')
            .focus(function () {
                $(this).closest('div.input-group').addClass('focus');
            })
            .blur(function () {
                $(this).closest('div.input-group').removeClass('focus');
            });
        $('select')
            .focus(function () {
                $(this).closest('div.input-group').addClass('focus');
            })
            .blur(function () {
                $(this).closest('div.input-group').removeClass('focus');
            });
    }
    /*=============================================
    =           Page Load       =
    =============================================*/
    // Toggle active class for bookmark
    $(document).on('click', '.book-mark', function (e) {
        e.preventDefault();
        $(this).toggleClass('active');
    });
    function initElevateZoom() {
        // Initialize zoom for gallery-product-popup swiper
        if ($('.gallery-product-popup').length) {
            const galleryPopEl = document.querySelector('.gallery-product-popup');

            // Wait a bit for swiper to be fully initialized
            setTimeout(function () {
                if (galleryPopEl && galleryPopEl.swiper) {
                    const galleryTop = galleryPopEl.swiper;

                    // Initial zoom on first load
                    $('.gallery-product-popup .swiper-slide-active img').elevateZoom({
                        zoomType: 'inner',
                        cursor: 'crosshair',
                        zoomWindowFadeIn: 500,
                        zoomWindowFadeOut: 750,
                    });

                    // Reinitialize zoom on slide change
                    galleryTop.on('slideChange', function () {
                        // Remove existing zoom
                        $('.zoomWindowContainer,.zoomContainer').remove();

                        // Get the currently active slide image using realIndex for loop mode
                        const realIndex = this.realIndex;
                        const activeSlide = $(this.slides[realIndex] || this.slides[0]);
                        const activeImg = activeSlide.find('img');

                        if (activeImg.length) {
                            // Initialize zoom on new active image
                            activeImg.elevateZoom({
                                zoomType: 'inner',
                                cursor: 'crosshair',
                                zoomWindowFadeIn: 500,
                                zoomWindowFadeOut: 750,
                            });
                        }
                    });
                }
            }, 100);
        }

        // Note: Quick View Modal zoom is initialized in initQuickViewModal function
        // to avoid issues with hidden modal elements
    }
    /*=============================================
    =          Filter Color/Size Functionality         =
    =============================================*/
    function initFilterColorSize() {
        $('.list-filter').each(function () {
            $(this)
                .find('a')
                .on('click', function (event) {
                    event.preventDefault();
                    $(this).parent().siblings().removeClass('active');
                    $(this).parent().toggleClass('active');
                    $(this).parents('.attr-detail').find('.current-size').text($(this).text());
                    $(this).parents('.attr-detail').find('.current-color').text($(this).attr('data-color'));
                });
        });
    }
    function initTheme() {
        preloader();
        // initStickySidebar();
        progressPageLoad();
        offcanvasMenu();
        dataBackground();
        aosAnimation();
        customSwiper();
        initSidebarMenu();
        initTabs();
        inputFocus();
        odometerCounter();
        magnificPopup();
        initPopupSearch();
        initCollapse();
        initLinkEffect1();
        initButtonEffect3();
        initTextAnimations();
        initQtyUpDown();
        initSortBy();
        initElevateZoom();
        initQuickViewModal();
        initFilterColorSize();
        reinitTextAnimations();
        theStickySidebar();
    }

    // This file is loaded with next/script strategy="afterInteractive" so it
    // never mutates the DOM before React hydrates (doing so caused hydration
    // mismatch errors). A consequence is that the window "load" event may
    // have already fired by the time this runs - jQuery does not replay
    // "load" for late listeners the way it does for $(document).ready - so
    // check readyState first and only defer when load is genuinely pending.
    if (document.readyState === 'complete') {
        initTheme();
    } else {
        $(window).on('load', initTheme);
    }
})(jQuery);
