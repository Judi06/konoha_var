// Navigation et effets de défilement
document.addEventListener("DOMContentLoaded", function() {
    // Navigation scroll
    const navbar = document.querySelector(".navbar");
    if (navbar) { // Check if navbar exists
        window.addEventListener("scroll", function() {
            if (window.scrollY > 50) {
                navbar.classList.add("scrolled");
            } else {
                navbar.classList.remove("scrolled");
            }
        });
    }

    // Menu mobile
    const navToggle = document.querySelector(".nav-toggle");
    const navMenu = document.querySelector(".nav-menu");

    if (navToggle && navMenu) {
        navToggle.addEventListener("click", function() {
            navToggle.classList.toggle("active");
            navMenu.classList.toggle("active");
        });
    }

    // Fermer le menu mobile lors du clic sur un lien
    const navLinks = document.querySelectorAll(".nav-link");
    navLinks.forEach(link => {
        link.addEventListener("click", function() {
            if (navToggle && navMenu && navToggle.classList.contains("active")) {
                navToggle.classList.remove("active");
                navMenu.classList.remove("active");
            }
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

    if (fadeElements.length > 0) { // Check if elements exist
        // Vérifier au chargement
        checkFade();
        // Vérifier au scroll
        window.addEventListener("scroll", checkFade);
    }

    // Carrousel À propos
    const carouselTrack = document.querySelector(".carousel-track");

    if (carouselTrack) {
        const carouselSlides = carouselTrack.querySelectorAll(".carousel-slide");
        if (carouselSlides.length > 0) {
            let currentSlide = 0;
            const slideWidth = 100; // En pourcentage
            let autoSlideInterval;

            function nextSlide() {
                currentSlide = (currentSlide + 1) % carouselSlides.length;
                updateCarousel();
            }

            function updateCarousel() {
                carouselTrack.style.transform = `translateX(-${currentSlide * slideWidth}%)`;
            }

            autoSlideInterval = setInterval(nextSlide, 3000);

            let touchStartX = 0;
            let touchEndX = 0;

            carouselTrack.addEventListener("touchstart", function(e) {
                touchStartX = e.changedTouches[0].screenX;
                clearInterval(autoSlideInterval);
            }, { passive: true }); // Improve scroll performance

            carouselTrack.addEventListener("touchend", function(e) {
                touchEndX = e.changedTouches[0].screenX;
                handleSwipe();
                autoSlideInterval = setInterval(nextSlide, 3000);
            });

            function handleSwipe() {
                const threshold = 50;
                if (touchEndX < touchStartX - threshold) {
                    nextSlide();
                } else if (touchEndX > touchStartX + threshold) {
                    currentSlide = (currentSlide - 1 + carouselSlides.length) % carouselSlides.length;
                    updateCarousel();
                }
            }
        }
    }

    // Slider Avocats
    const avocatsSlider = document.querySelector(".avocats-slider");
    if (avocatsSlider) {
        const avocatsTrack = avocatsSlider.querySelector(".avocats-slider-track");
        const avocatCards = avocatsSlider.querySelectorAll(".avocat-card");
        const prevBtn = avocatsSlider.querySelector(".avocats-prev");
        const nextBtn = avocatsSlider.querySelector(".avocats-next");

        if (avocatsTrack && avocatCards.length > 0 && prevBtn && nextBtn) {
            let currentPosition = 0;
            let slidesToShow = 3;
            let cardGap = 30;

            function updateSlidesToShow() {
                const trackWidth = avocatsTrack.offsetWidth;
                if (window.innerWidth < 768) {
                    slidesToShow = 1;
                    cardGap = 0;
                } else if (window.innerWidth < 1024) {
                    slidesToShow = 2;
                    cardGap = 30;
                } else {
                    slidesToShow = 3;
                    cardGap = 30;
                }
                const totalGapWidth = cardGap * (slidesToShow - 1);
                const cardWidth = trackWidth > 0 ? (trackWidth - totalGapWidth) / slidesToShow : 0;
                avocatCards.forEach(card => {
                    card.style.width = cardWidth > 0 ? `${cardWidth}px` : "100%";
                    card.style.flexShrink = "0";
                });
                avocatsTrack.style.gap = `${cardGap}px`;
                updateSlider(false);
            }

            function updateSlider(animate = true) {
                const maxPosition = Math.max(0, avocatCards.length - slidesToShow);
                currentPosition = Math.max(0, Math.min(currentPosition, maxPosition));
                const cardWidth = avocatCards.length > 0 ? avocatCards[0].offsetWidth : 0;
                const totalTranslate = currentPosition * (cardWidth + cardGap);
                avocatsTrack.style.transition = animate ? "transform 0.5s ease" : "none";
                avocatsTrack.style.transform = `translateX(-${totalTranslate}px)`;
                prevBtn.disabled = currentPosition === 0;
                nextBtn.disabled = currentPosition === maxPosition;
            }

            prevBtn.addEventListener("click", function() {
                currentPosition--;
                updateSlider();
            });

            nextBtn.addEventListener("click", function() {
                currentPosition++;
                updateSlider();
            });

            let touchStartX = 0;
            let touchEndX = 0;

            avocatsTrack.addEventListener("touchstart", function(e) {
                touchStartX = e.changedTouches[0].screenX;
                avocatsTrack.style.transition = "none";
            }, { passive: true });

            avocatsTrack.addEventListener("touchend", function(e) {
                touchEndX = e.changedTouches[0].screenX;
                handleSwipe();
            });

            function handleSwipe() {
                const threshold = 50;
                if (touchEndX < touchStartX - threshold) {
                    currentPosition++;
                } else if (touchEndX > touchStartX + threshold) {
                    currentPosition--;
                }
                updateSlider();
            }

            setTimeout(() => {
                updateSlidesToShow();
                window.addEventListener("resize", updateSlidesToShow);
            }, 100);
        }
    }

    // --- Start of Corrected Testimonial Slider ---
    const testimonialContainer = document.querySelector(".testimonials-slider");
    if (testimonialContainer) {
        const testimonials = Array.from(testimonialContainer.querySelectorAll(".testimonial")); // Use Array.from for easier handling
        const dotsContainer = testimonialContainer.querySelector(".dots");
        const testimonialPrev = testimonialContainer.querySelector(".testimonial-prev");
        const testimonialNext = testimonialContainer.querySelector(".testimonial-next");

        if (testimonials.length > 0 && dotsContainer && testimonialPrev && testimonialNext) {
            let currentTestimonial = 0;

            // Ensure dots are created correctly
            dotsContainer.innerHTML = ""; // Clear previous dots
            testimonials.forEach((_, index) => {
                const dot = document.createElement("span");
                dot.classList.add("dot");
                dot.dataset.index = index;
                dotsContainer.appendChild(dot);
            });
            const dots = dotsContainer.querySelectorAll(".dot");

            function showTestimonial(index) {
                // Ensure index is valid and wraps around
                const newIndex = (index + testimonials.length) % testimonials.length;

                testimonials.forEach((testimonial, i) => {
                    testimonial.classList.toggle("active", i === newIndex);
                });
                dots.forEach((dot, i) => {
                    dot.classList.toggle("active", i === newIndex);
                });
                currentTestimonial = newIndex;
            }

            // Attach event listeners reliably
            testimonialPrev.addEventListener("click", function() {
                showTestimonial(currentTestimonial - 1);
            });

            testimonialNext.addEventListener("click", function() {
                showTestimonial(currentTestimonial + 1);
            });

            dots.forEach(dot => {
                dot.addEventListener("click", function() {
                    // Use dataset.index which is a string, parse it
                    showTestimonial(parseInt(this.dataset.index));
                });
            });

            // Initial display
            showTestimonial(0);
        }
    }
    // --- End of Corrected Testimonial Slider ---

    // Compteurs statistiques
    const statsSection = document.querySelector("#statistiques");
    if (statsSection) {
        const statNumbers = statsSection.querySelectorAll(".stat-number");
        let countersAnimated = false;

        function animateCounter(element, target) {
            let current = 0;
            const increment = Math.max(1, Math.ceil(target / 100));
            const duration = 2000;
            const steps = Math.ceil(target / increment);
            const intervalTime = steps > 0 ? duration / steps : duration;

            const counter = setInterval(function() {
                current += increment;
                if (current >= target) {
                    element.textContent = target;
                    clearInterval(counter);
                } else {
                    element.textContent = Math.floor(current);
                }
            }, intervalTime);
        }

        function runCounters() {
            if (countersAnimated) return;
            statNumbers.forEach(stat => {
                const target = parseInt(stat.getAttribute("data-count"));
                if (!isNaN(target)) {
                    animateCounter(stat, target);
                }
            });
            countersAnimated = true;
        }

        if ("IntersectionObserver" in window) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting && !countersAnimated) {
                        runCounters();
                        observer.unobserve(statsSection);
                    }
                });
            }, { threshold: 0.1 });
            observer.observe(statsSection);
        } else {
            function checkCountersScroll() {
                if (countersAnimated) {
                    window.removeEventListener("scroll", checkCountersScroll);
                    return;
                }
                const sectionTop = statsSection.getBoundingClientRect().top;
                const windowHeight = window.innerHeight;
                if (sectionTop < windowHeight - 100) {
                    runCounters();
                }
            }
            window.addEventListener("scroll", checkCountersScroll);
            checkCountersScroll();
        }
    }

    // Modals
    const avisBtn = document.getElementById("avis-btn");
    const contactBtn = document.getElementById("contact-btn");
    const avisModal = document.getElementById("avis-modal");
    const contactModal = document.getElementById("contact-modal");
    const modalCloses = document.querySelectorAll(".modal-close");

    function openModal(modal) {
        if (modal) {
            modal.classList.add("active");
            document.body.style.overflow = "hidden";
        }
    }

    function closeModal(modal) {
        if (modal) {
            modal.classList.remove("active");
            document.body.style.overflow = "";
        }
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
    const ratingSelect = document.querySelector(".rating-select");
    if (ratingSelect) {
        const stars = ratingSelect.querySelectorAll("i");
        const ratingInput = document.getElementById("avis-rating");

        if (stars.length > 0 && ratingInput) {
            function highlightStars(rating) {
                rating = parseInt(rating) || 0;
                stars.forEach(star => {
                    const starRating = parseInt(star.getAttribute("data-rating"));
                    star.classList.toggle("fas", starRating <= rating);
                    star.classList.toggle("far", starRating > rating);
                });
            }

            stars.forEach(star => {
                star.addEventListener("mouseover", function() {
                    highlightStars(this.getAttribute("data-rating"));
                });
                star.addEventListener("mouseout", function() {
                    highlightStars(ratingInput.value);
                });
                star.addEventListener("click", function() {
                    const rating = this.getAttribute("data-rating");
                    ratingInput.value = rating;
                    highlightStars(rating);
                });
            });

            highlightStars(ratingInput.value || 0);
        }
    }

    // --- Start of Corrected Form Submission V2 ---
    const forms = document.querySelectorAll("form[action^=\"https://formsubmit.co/\"]");
    const notification = document.getElementById("notification");
    const notificationMessage = document.getElementById("notification-message");

    forms.forEach(form => {
        form.addEventListener("submit", function(e) {
            e.preventDefault();

            const formData = new FormData(form);
            const formAction = form.getAttribute("action");
            const submitButton = form.querySelector("button[type=\"submit\"]");
            const originalButtonText = submitButton ? submitButton.textContent : "Envoyer";

            // Basic client-side validation
            const requiredFields = form.querySelectorAll("[required]");
            let firstInvalidField = null;
            requiredFields.forEach(field => {
                field.classList.remove("invalid"); // Clear previous invalid state
                if (!field.value.trim()) {
                    if (!firstInvalidField) firstInvalidField = field;
                    field.classList.add("invalid");
                }
            });

            if (firstInvalidField) {
                if (notification && notificationMessage) {
                    notificationMessage.textContent = "Veuillez remplir tous les champs obligatoires.";
                    notification.className = "notification active error";
                    setTimeout(() => notification.classList.remove("active"), 4000);
                } else {
                    alert("Veuillez remplir tous les champs obligatoires.");
                }
                firstInvalidField.focus();
                return;
            }

            if (submitButton) {
                submitButton.disabled = true;
                submitButton.textContent = "Envoi en cours...";
            }

            fetch(formAction, {
                method: "POST",
                body: formData,
                headers: {
                    // Keep Accept header, but handle non-JSON responses gracefully
                    "Accept": "application/json"
                }
            })
            .then(response => {
                // Check if the response status is OK (2xx) or a redirect (3xx) which FormSubmit might use
                if (response.ok || (response.status >= 300 && response.status < 400)) {
                    // Assume success if status is OK or redirect, regardless of content type
                    return { success: true }; // Simulate a success object
                } else {
                    // If status is not OK, try to parse as JSON for error message, otherwise throw status text
                    return response.json().catch(() => {
                         // If JSON parsing fails, create an error with status text
                         const error = new Error(response.statusText || `Erreur ${response.status}`);
                         error.status = response.status;
                         throw error;
                    }).then(errData => {
                         // If JSON parsing succeeds but indicates error
                         throw new Error(errData.message || `Erreur ${response.status}`);
                    });
                }
            })
            .then(data => {
                // This block now executes if response.ok was true or redirect
                form.reset();
                if (form.id === "avis-form" && ratingSelect) {
                    const ratingInput = document.getElementById("avis-rating");
                    if(ratingInput) ratingInput.value = "";
                    const stars = ratingSelect.querySelectorAll("i");
                    stars.forEach(star => {
                         star.classList.remove("fas");
                         star.classList.add("far");
                    });
                }

                const modal = form.closest(".modal");
                if (modal) {
                    closeModal(modal);
                }
                if (notification && notificationMessage) {
                    notificationMessage.textContent = "Merci ! Votre message a été envoyé avec succès.";
                    notification.className = "notification active success";
                    setTimeout(() => notification.classList.remove("active"), 4000);
                } else {
                    alert("Merci ! Votre message a été envoyé avec succès.");
                }
            })
            .catch(error => {
                console.error("Erreur de soumission:", error);
                if (notification && notificationMessage) {
                    notificationMessage.textContent = `Une erreur s'est produite: ${error.message}. Veuillez réessayer.`;
                    notification.className = "notification active error";
                    setTimeout(() => notification.classList.remove("active"), 6000);
                } else {
                    alert(`Une erreur s'est produite: ${error.message}. Veuillez réessayer.`);
                }
            })
            .finally(() => {
                if (submitButton) {
                    submitButton.disabled = false;
                    submitButton.textContent = originalButtonText;
                }
            });
        });
    });
    // --- End of Corrected Form Submission V2 ---

}); // End of DOMContentLoaded listener

