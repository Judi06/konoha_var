// Main JavaScript for KONOHA Website

document.addEventListener('DOMContentLoaded', function() {
    // Portal Loader
    const portalLoader = document.getElementById('portalLoader');
    if (portalLoader) {
        // Check if user has visited the site before in this session
        if (!sessionStorage.getItem('portalShown')) {
            // Show portal animation for 3 seconds then fade out
            setTimeout(() => {
                portalLoader.style.opacity = '0';
                setTimeout(() => {
                    portalLoader.style.display = 'none';
                }, 500);
                // Set session storage to remember portal was shown
                sessionStorage.setItem('portalShown', 'true');
            }, 3000);
        } else {
            // Skip portal animation if already shown in this session
            portalLoader.style.display = 'none';
        }
    }
    
    // Header scroll effect
    const header = document.getElementById('header');
    if (header) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 100) {
                header.classList.add('scrolled');
                header.classList.remove('transparent');
            } else {
                header.classList.remove('scrolled');
                if (window.location.pathname.includes('index')) {
                    header.classList.add('transparent');
                }
            }
        });
    }
    
    // Mobile menu toggle
    const menuToggle = document.getElementById('menuToggle');
    const navMobile = document.getElementById('navMobile');
    if (menuToggle && navMobile) {
        menuToggle.addEventListener('click', function() {
            this.classList.toggle('active');
            navMobile.classList.toggle('active');
        });
    }
    
    // Mobile submenu toggle
    const navLinks = document.querySelectorAll('.nav-mobile .nav-link');
    if (navLinks.length > 0) {
        navLinks.forEach(link => {
            if (link.nextElementSibling && link.nextElementSibling.classList.contains('mobile-submenu')) {
                link.addEventListener('click', function(e) {
                    if (window.innerWidth <= 992) {
                        e.preventDefault();
                        this.nextElementSibling.classList.toggle('active');
                    }
                });
            }
        });
    }
    
    // Review modal
    const leaveReviewBtn = document.getElementById('leaveReviewBtn');
    const reviewModal = document.getElementById('reviewModal');
    const modalClose = document.getElementById('modalClose');
    if (leaveReviewBtn && reviewModal && modalClose) {
        leaveReviewBtn.addEventListener('click', function() {
            reviewModal.classList.add('active');
        });
        
        modalClose.addEventListener('click', function() {
            reviewModal.classList.remove('active');
        });
        
        // Close modal when clicking outside
        reviewModal.addEventListener('click', function(e) {
            if (e.target === this) {
                this.classList.remove('active');
            }
        });
    }
    
    // Rating system
    const ratingStars = document.querySelectorAll('.rating i');
    if (ratingStars.length > 0) {
        let selectedRating = 0;
        
        ratingStars.forEach(star => {
            star.addEventListener('mouseover', function() {
                const rating = parseInt(this.getAttribute('data-rating'));
                highlightStars(rating);
            });
            
            star.addEventListener('mouseout', function() {
                highlightStars(selectedRating);
            });
            
            star.addEventListener('click', function() {
                selectedRating = parseInt(this.getAttribute('data-rating'));
                highlightStars(selectedRating);
            });
        });
        
        function highlightStars(rating) {
            ratingStars.forEach(star => {
                const starRating = parseInt(star.getAttribute('data-rating'));
                if (starRating <= rating) {
                    star.classList.remove('far');
                    star.classList.add('fas');
                } else {
                    star.classList.remove('fas');
                    star.classList.add('far');
                }
            });
        }
    }
    
    // Gallery lightbox
    const galleryItems = document.querySelectorAll('.gallery-item');
    const galleryLightbox = document.getElementById('galleryLightbox');
    const lightboxImage = document.getElementById('lightboxImage');
    const lightboxClose = document.getElementById('lightboxClose');
    const lightboxPrev = document.getElementById('lightboxPrev');
    const lightboxNext = document.getElementById('lightboxNext');
    
    if (galleryItems.length > 0 && galleryLightbox && lightboxImage) {
        let currentIndex = 0;
        
        galleryItems.forEach((item, index) => {
            item.addEventListener('click', function() {
                const imgSrc = this.querySelector('img').getAttribute('src');
                const imgAlt = this.querySelector('img').getAttribute('alt');
                
                lightboxImage.setAttribute('src', imgSrc);
                lightboxImage.setAttribute('alt', imgAlt);
                galleryLightbox.classList.add('active');
                
                currentIndex = index;
            });
        });
        
        if (lightboxClose) {
            lightboxClose.addEventListener('click', function() {
                galleryLightbox.classList.remove('active');
            });
        }
        
        if (lightboxPrev && lightboxNext) {
            lightboxPrev.addEventListener('click', function() {
                currentIndex = (currentIndex - 1 + galleryItems.length) % galleryItems.length;
                updateLightboxImage();
            });
            
            lightboxNext.addEventListener('click', function() {
                currentIndex = (currentIndex + 1) % galleryItems.length;
                updateLightboxImage();
            });
        }
        
        // Close lightbox when clicking outside
        galleryLightbox.addEventListener('click', function(e) {
            if (e.target === this) {
                this.classList.remove('active');
            }
        });
        
        function updateLightboxImage() {
            const imgSrc = galleryItems[currentIndex].querySelector('img').getAttribute('src');
            const imgAlt = galleryItems[currentIndex].querySelector('img').getAttribute('alt');
            
            lightboxImage.setAttribute('src', imgSrc);
            lightboxImage.setAttribute('alt', imgAlt);
        }
    }
    
    // Form submission
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Simulate form submission
            const submitButton = this.querySelector('.form-submit');
            const originalText = submitButton.textContent;
            
            submitButton.textContent = 'Envoi en cours...';
            submitButton.disabled = true;
            
            setTimeout(() => {
                alert('Votre message a été envoyé avec succès !');
                this.reset();
                submitButton.textContent = originalText;
                submitButton.disabled = false;
            }, 1500);
        });
    }
    
    // Review form submission
    const reviewForm = document.getElementById('reviewForm');
    if (reviewForm) {
        reviewForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Simulate form submission
            const submitButton = this.querySelector('.form-submit');
            const originalText = submitButton.textContent;
            
            submitButton.textContent = 'Envoi en cours...';
            submitButton.disabled = true;
            
            setTimeout(() => {
                alert('Merci pour votre avis !');
                this.reset();
                submitButton.textContent = originalText;
                submitButton.disabled = false;
                
                // Reset rating stars
                const ratingStars = document.querySelectorAll('.rating i');
                ratingStars.forEach(star => {
                    star.classList.remove('fas');
                    star.classList.add('far');
                });
                
                // Close modal
                const reviewModal = document.getElementById('reviewModal');
                if (reviewModal) {
                    reviewModal.classList.remove('active');
                }
            }, 1500);
        });
    }
    
    // Back to top button
    const backToTop = document.getElementById('backToTop');
    if (backToTop) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 500) {
                backToTop.classList.add('active');
            } else {
                backToTop.classList.remove('active');
            }
        });
        
        backToTop.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
    
    // Smooth scrolling for anchor links
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    if (anchorLinks.length > 0) {
        anchorLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                const href = this.getAttribute('href');
                
                if (href !== '#') {
                    e.preventDefault();
                    
                    const targetElement = document.querySelector(href);
                    if (targetElement) {
                        const headerHeight = document.querySelector('.header').offsetHeight;
                        const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;
                        
                        window.scrollTo({
                            top: targetPosition,
                            behavior: 'smooth'
                        });
                        
                        // Close mobile menu if open
                        const navMobile = document.getElementById('navMobile');
                        const menuToggle = document.getElementById('menuToggle');
                        if (navMobile && navMobile.classList.contains('active')) {
                            navMobile.classList.remove('active');
                            if (menuToggle) {
                                menuToggle.classList.remove('active');
                            }
                        }
                    }
                }
            });
        });
    }
    
    // Set current year in footer
    const currentYearElement = document.getElementById('currentYear');
    if (currentYearElement) {
        currentYearElement.textContent = new Date().getFullYear();
    }
    
    // Video background fallback
    const video = document.getElementById('bgVideo');
    const fallbackImage = document.querySelector('.fallback-image');
    if (video && fallbackImage) {
        video.addEventListener('error', function() {
            video.style.display = 'none';
            fallbackImage.style.display = 'block';
        });
    }
});
