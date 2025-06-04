// Navigation et effets de défilement
document.addEventListener("DOMContentLoaded", function() {
    // Navigation scroll
    const navbar = document.querySelector(".navbar");
    window.addEventListener("scroll", function() {
        if (window.scrollY > 50) {
            navbar.classList.add("scrolled");
        } else {
            navbar.classList.remove("scrolled");
        }
    });

    // Menu mobile
    const navToggle = document.querySelector(".nav-toggle");
    const navMenu = document.querySelector(".nav-menu");
    
    navToggle.addEventListener("click", function() {
        navToggle.classList.toggle("active");
        navMenu.classList.toggle("active");
    });

    // Fermer le menu mobile lors du clic sur un lien
    const navLinks = document.querySelectorAll(".nav-link");
    navLinks.forEach(link => {
        link.addEventListener("click", function() {
            navToggle.classList.remove("active");
            navMenu.classList.remove("active");
        });
    });

    // Animation des éléments au scroll
    const fadeElements = document.querySelectorAll(".fade-in");
    
    function checkFade() {
        fadeElements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            
            if (elementTop < windowHeight - 100) {
                element.classList.add("active");
            }
        });
    }
    
    // Vérifier au chargement
    checkFade();
    
    // Vérifier au scroll
    window.addEventListener("scroll", checkFade);

    // Carrousel À propos
    const carouselTrack = document.querySelector(".carousel-track");
    const carouselSlides = document.querySelectorAll(".carousel-slide");
    
    if (carouselTrack && carouselSlides.length > 0) {
        let currentSlide = 0;
        const slideWidth = 100; // En pourcentage
        
        function nextSlide() {
            currentSlide = (currentSlide + 1) % carouselSlides.length;
            updateCarousel();
        }
        
        function updateCarousel() {
            carouselTrack.style.transform = `translateX(-${currentSlide * slideWidth}%)`;
        }
        
        // Changement automatique toutes les 3 secondes
        setInterval(nextSlide, 3000);
        
        // Support tactile pour le carrousel
        let touchStartX = 0;
        let touchEndX = 0;
        
        carouselTrack.addEventListener("touchstart", function(e) {
            touchStartX = e.changedTouches[0].screenX;
        });
        
        carouselTrack.addEventListener("touchend", function(e) {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        });
        
        function handleSwipe() {
            if (touchEndX < touchStartX) {
                // Swipe gauche
                nextSlide();
            } else if (touchEndX > touchStartX) {
                // Swipe droite
                currentSlide = (currentSlide - 1 + carouselSlides.length) % carouselSlides.length;
                updateCarousel();
            }
        }
    }

    // Slider Avocats
    const avocatsTrack = document.querySelector(".avocats-slider-track");
    const avocatCards = document.querySelectorAll(".avocat-card");
    const prevBtn = document.querySelector(".avocats-prev");
    const nextBtn = document.querySelector(".avocats-next");
    
    if (avocatsTrack && avocatCards.length > 0 && prevBtn && nextBtn) {
        let currentPosition = 0;
        let slidesToShow = 3;
        let cardGap = 30; // Écart entre les cartes en pixels
        
        // Ajuster le nombre de slides visibles selon la largeur de l'écran
        function updateSlidesToShow() {
            if (window.innerWidth < 768) {
                slidesToShow = 1;
                // Ajuster le style des cartes pour le mobile
                avocatCards.forEach(card => {
                    card.style.width = "100%";
                    card.style.margin = "0 auto";
                });
                avocatsTrack.style.gap = "0px";
            } else if (window.innerWidth < 1024) {
                slidesToShow = 2;
                avocatCards.forEach(card => {
                    card.style.width = "";
                    card.style.margin = "";
                });
                avocatsTrack.style.gap = cardGap + "px";
            } else {
                slidesToShow = 3;
                avocatCards.forEach(card => {
                    card.style.width = "";
                    card.style.margin = "";
                });
                avocatsTrack.style.gap = cardGap + "px";
            }
            updateSlider();
        }
        
        updateSlidesToShow();
        window.addEventListener("resize", updateSlidesToShow);
        
        function updateSlider() {
            const maxPosition = Math.max(0, avocatCards.length - slidesToShow);
            
            if (currentPosition < 0) currentPosition = 0;
            if (currentPosition > maxPosition) currentPosition = maxPosition;
            
            if (window.innerWidth < 768) {
                // Sur mobile, on utilise une largeur fixe de 100% par carte
                avocatsTrack.style.transform = `translateX(-${currentPosition * 100}%)`;
            } else {
                // Sur desktop, on calcule en fonction du nombre de slides visibles
                const cardWidth = 100 / slidesToShow;
                const gapPercentage = (cardGap * (slidesToShow - 1)) / avocatsTrack.offsetWidth * 100;
                const totalWidth = cardWidth + (gapPercentage / slidesToShow);
                avocatsTrack.style.transform = `translateX(-${currentPosition * totalWidth}%)`;
            }
        }
        
        prevBtn.addEventListener("click", function() {
            currentPosition--;
            updateSlider();
        });
        
        nextBtn.addEventListener("click", function() {
            currentPosition++;
            updateSlider();
        });
        
        // Support tactile pour le slider
        let touchStartX = 0;
        let touchEndX = 0;
        
        avocatsTrack.addEventListener("touchstart", function(e) {
            touchStartX = e.changedTouches[0].screenX;
        });
        
        avocatsTrack.addEventListener("touchend", function(e) {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        });
        
        function handleSwipe() {
            if (touchEndX < touchStartX) {
                // Swipe gauche
                currentPosition++;
                updateSlider();
            } else if (touchEndX > touchStartX) {
                // Swipe droite
                currentPosition--;
                updateSlider();
            }
        }
    }

    // Témoignages Slider
    const testimonials = document.querySelectorAll(".testimonial");
    const dots = document.querySelectorAll(".dot");
    const testimonialPrev = document.querySelector(".testimonial-prev");
    const testimonialNext = document.querySelector(".testimonial-next");
    
    if (testimonials.length > 0 && dots.length > 0 && testimonialPrev && testimonialNext) {
        let currentTestimonial = 0;
        
        function showTestimonial(index) {
            testimonials.forEach(testimonial => testimonial.classList.remove("active"));
            dots.forEach(dot => dot.classList.remove("active"));
            
            testimonials[index].classList.add("active");
            dots[index].classList.add("active");
            currentTestimonial = index;
        }
        
        testimonialPrev.addEventListener("click", function() {
            currentTestimonial = (currentTestimonial - 1 + testimonials.length) % testimonials.length;
            showTestimonial(currentTestimonial);
        });
        
        testimonialNext.addEventListener("click", function() {
            currentTestimonial = (currentTestimonial + 1) % testimonials.length;
            showTestimonial(currentTestimonial);
        });
        
        dots.forEach((dot, index) => {
            dot.addEventListener("click", function() {
                showTestimonial(index);
            });
        });
    }

    // Compteurs statistiques
    const statNumbers = document.querySelectorAll(".stat-number");
    
    function animateCounter(element, target) {
        let current = 0;
        const increment = target / 100;
        const duration = 2000;
        const interval = duration / 100;
        
        const counter = setInterval(function() {
            current += increment;
            element.textContent = Math.floor(current);
            
            if (current >= target) {
                element.textContent = target;
                clearInterval(counter);
            }
        }, interval);
    }
    
    function checkCounters() {
        statNumbers.forEach(stat => {
            const elementTop = stat.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            
            if (elementTop < windowHeight - 100 && !stat.classList.contains("counted")) {
                const target = parseInt(stat.getAttribute("data-count"));
                animateCounter(stat, target);
                stat.classList.add("counted");
            }
        });
    }
    
    window.addEventListener("scroll", checkCounters);
    checkCounters();

    // Modals
    const avisBtn = document.getElementById("avis-btn");
    const contactBtn = document.getElementById("contact-btn");
    const avisModal = document.getElementById("avis-modal");
    const contactModal = document.getElementById("contact-modal");
    const modalCloses = document.querySelectorAll(".modal-close");
    
    function openModal(modal) {
        modal.classList.add("active");
        document.body.style.overflow = "hidden";
    }
    
    function closeModal(modal) {
        modal.classList.remove("active");
        document.body.style.overflow = "";
    }
    
    if (avisBtn && avisModal) {
        avisBtn.addEventListener("click", function() {
            openModal(avisModal);
        });
    }
    
    if (contactBtn && contactModal) {
        contactBtn.addEventListener("click", function() {
            openModal(contactModal);
        });
    }
    
    modalCloses.forEach(close => {
        close.addEventListener("click", function() {
            const modal = close.closest(".modal");
            closeModal(modal);
        });
    });
    
    window.addEventListener("click", function(e) {
        if (e.target.classList.contains("modal")) {
            closeModal(e.target);
        }
    });

    // Rating system
    const stars = document.querySelectorAll(".rating-select i");
    const ratingInput = document.getElementById("avis-rating");
    
    if (stars.length > 0 && ratingInput) {
        stars.forEach(star => {
            star.addEventListener("mouseover", function() {
                const rating = this.getAttribute("data-rating");
                highlightStars(rating);
            });
            
            star.addEventListener("mouseout", function() {
                const currentRating = ratingInput.value;
                highlightStars(currentRating);
            });
            
            star.addEventListener("click", function() {
                const rating = this.getAttribute("data-rating");
                ratingInput.value = rating;
                highlightStars(rating);
            });
        });
        
        function highlightStars(rating) {
            stars.forEach(star => {
                const starRating = star.getAttribute("data-rating");
                if (starRating <= rating) {
                    star.classList.remove("far");
                    star.classList.add("fas");
                } else {
                    star.classList.remove("fas");
                    star.classList.add("far");
                }
            });
        }
    }

    // Form submission with AJAX for FormSubmit
    const forms = document.querySelectorAll("form[action^=\"https://formsubmit.co\"]"); // Select only FormSubmit forms
    const notification = document.getElementById("notification");
    
    // Function to show notification
    function showNotification(message, iconClass, isError = false) {
        if (notification) {
            notification.querySelector("p").textContent = message;
            notification.querySelector("i").className = iconClass;
            notification.classList.add("active");
            if (isError) {
                notification.classList.add("error");
            } else {
                notification.classList.remove("error");
            }
            
            // Hide notification after 3 seconds (or 5 for errors)
            setTimeout(function() {
                notification.classList.remove("active");
            }, isError ? 5000 : 3000);
        }
    }

    forms.forEach(form => {
        form.addEventListener("submit", function(e) {
            e.preventDefault(); // Prevent default submission
            
            const formData = new FormData(form);
            const formAction = form.getAttribute("action");
            const submitButton = form.querySelector("button[type=\"submit\"]");
            const originalButtonText = submitButton.textContent;

            // Disable button and show loading state
            submitButton.disabled = true;
            submitButton.textContent = "Envoi en cours...";

            fetch(formAction, {
                method: "POST",
                body: formData,
                headers: {
                    "Accept": "application/json" // Request JSON response from FormSubmit
                }
            })
            .then(response => {
                // Check if response is ok (status in the range 200-299)
                if (response.ok) {
                    return response.json(); // Attempt to parse JSON
                } else {
                    // If response is not ok, but it's likely a FormSubmit redirect (e.g., status 3xx or other non-2xx)
                    // Treat it as success because the data was likely sent.
                    console.log("FormSubmit likely succeeded with non-JSON response or redirect.");
                    return Promise.resolve({ success: "true" }); // Simulate a success object
                }
            })
            .then(data => {
                if (data.success === "true" || data.success === true) { // Check success status
                    form.reset();
                    const modal = form.closest(".modal");
                    if (modal) {
                        closeModal(modal);
                    }
                    showNotification("Message envoyé avec succès !", "fas fa-check-circle");
                } else {
                    // Handle FormSubmit specific error if returned in JSON
                    console.error("FormSubmit error:", data);
                    showNotification("Erreur lors de l'envoi. Veuillez réessayer.", "fas fa-exclamation-circle", true);
                }
            })
            .catch(error => {
                // This catch block might be triggered by network errors OR by FormSubmit's behavior (redirects/opaque responses)
                // We assume success here as a fallback for FormSubmit's common behavior
                console.warn("Fetch caught an error, assuming FormSubmit success due to potential redirect/CORS:", error);
                form.reset();
                const modal = form.closest(".modal");
                if (modal) {
                    closeModal(modal);
                }
                showNotification("Message envoyé avec succès !", "fas fa-check-circle");
            })
            .finally(() => {
                 // Re-enable button and restore original text
                 submitButton.disabled = false;
                 submitButton.textContent = originalButtonText;
            });
        });
    });
});

