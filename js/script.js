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

    if (navToggle && navMenu) { // Added checks
        navToggle.addEventListener("click", function() {
            navToggle.classList.toggle("active");
            navMenu.classList.toggle("active");
        });
    }

    // Fermer le menu mobile lors du clic sur un lien
    const navLinks = document.querySelectorAll(".nav-link");
    navLinks.forEach(link => {
        link.addEventListener("click", function() {
            if (navToggle && navMenu && navToggle.classList.contains("active")) { // Added checks
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

    // Vérifier au chargement
    checkFade();

    // Vérifier au scroll
    window.addEventListener("scroll", checkFade);

    // Carrousel À propos
    const carouselTrack = document.querySelector(".carousel-track");

    if (carouselTrack) { // Added check
        const carouselSlides = carouselTrack.querySelectorAll(".carousel-slide"); // Moved inside check
        if (carouselSlides.length > 0) {
            let currentSlide = 0;
            const slideWidth = 100; // En pourcentage
            let autoSlideInterval; // Declare interval variable

            function nextSlide() {
                currentSlide = (currentSlide + 1) % carouselSlides.length;
                updateCarousel();
            }

            function updateCarousel() {
                carouselTrack.style.transform = `translateX(-${currentSlide * slideWidth}%)`;
            }

            // Changement automatique toutes les 3 secondes
            autoSlideInterval = setInterval(nextSlide, 3000);

            // Support tactile pour le carrousel
            let touchStartX = 0;
            let touchEndX = 0;

            carouselTrack.addEventListener("touchstart", function(e) {
                touchStartX = e.changedTouches[0].screenX;
                clearInterval(autoSlideInterval); // Pause auto slide on touch
            });

            carouselTrack.addEventListener("touchend", function(e) {
                touchEndX = e.changedTouches[0].screenX;
                handleSwipe();
                // Resume auto slide only if it was running
                autoSlideInterval = setInterval(nextSlide, 3000);
            });

            function handleSwipe() {
                const threshold = 50; // Minimum swipe distance
                if (touchEndX < touchStartX - threshold) {
                    // Swipe gauche
                    nextSlide();
                } else if (touchEndX > touchStartX + threshold) {
                    // Swipe droite
                    currentSlide = (currentSlide - 1 + carouselSlides.length) % carouselSlides.length;
                    updateCarousel();
                }
                // No action if swipe is too small
            }
        }
    }


    // Slider Avocats
    const avocatsSlider = document.querySelector(".avocats-slider"); // Target the container
    if (avocatsSlider) { // Check if slider exists
        const avocatsTrack = avocatsSlider.querySelector(".avocats-slider-track");
        const avocatCards = avocatsSlider.querySelectorAll(".avocat-card");
        const prevBtn = avocatsSlider.querySelector(".avocats-prev");
        const nextBtn = avocatsSlider.querySelector(".avocats-next");

        if (avocatsTrack && avocatCards.length > 0 && prevBtn && nextBtn) {
            let currentPosition = 0;
            let slidesToShow = 3;
            let cardGap = 30; // Écart entre les cartes en pixels

            function updateSlidesToShow() {
                const trackWidth = avocatsTrack.offsetWidth; // Get current track width
                if (window.innerWidth < 768) {
                    slidesToShow = 1;
                    cardGap = 0; // No gap on mobile usually
                } else if (window.innerWidth < 1024) {
                    slidesToShow = 2;
                    cardGap = 30;
                } else {
                    slidesToShow = 3;
                    cardGap = 30;
                }
                // Adjust card width based on slidesToShow and gap
                const totalGapWidth = cardGap * (slidesToShow - 1);
                // Ensure trackWidth is positive before calculation
                const cardWidth = trackWidth > 0 ? (trackWidth - totalGapWidth) / slidesToShow : 0;
                avocatCards.forEach(card => {
                     card.style.width = cardWidth > 0 ? `${cardWidth}px` : "100%"; // Fallback width
                     card.style.flexShrink = "0"; // Prevent shrinking
                });
                avocatsTrack.style.gap = `${cardGap}px`;

                updateSlider(false); // Update slider position without animation on resize
            }

            function updateSlider(animate = true) {
                const maxPosition = Math.max(0, avocatCards.length - slidesToShow);

                // Clamp currentPosition
                currentPosition = Math.max(0, Math.min(currentPosition, maxPosition));

                // Calculate translation based on actual card width and gap
                const cardWidth = avocatCards.length > 0 ? avocatCards[0].offsetWidth : 0; // Get actual width after styling
                const totalTranslate = currentPosition * (cardWidth + cardGap);

                avocatsTrack.style.transition = animate ? "transform 0.5s ease" : "none";
                avocatsTrack.style.transform = `translateX(-${totalTranslate}px)`;

                // Disable/enable buttons
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

            // Support tactile pour le slider
            let touchStartX = 0;
            let touchEndX = 0;

            avocatsTrack.addEventListener("touchstart", function(e) {
                touchStartX = e.changedTouches[0].screenX;
                avocatsTrack.style.transition = "none"; // Disable transition during swipe
            });

            avocatsTrack.addEventListener("touchend", function(e) {
                touchEndX = e.changedTouches[0].screenX;
                handleSwipe();
            });

            function handleSwipe() {
                const threshold = 50; // Minimum swipe distance
                if (touchEndX < touchStartX - threshold) {
                    // Swipe gauche
                    currentPosition++;
                } else if (touchEndX > touchStartX + threshold) {
                    // Swipe droite
                    currentPosition--;
                }
                // Update slider to snap to the new/current position
                updateSlider();
            }

            // Initial setup
            // Use setTimeout to ensure layout is stable before calculating widths
            setTimeout(() => {
                 updateSlidesToShow(); // Call first to set initial state
                 window.addEventListener("resize", updateSlidesToShow); // Update on resize
            }, 100); // Small delay
        }
    }


    // Témoignages Slider
    const testimonialContainer = document.querySelector(".testimonials-slider"); // Target container
    if (testimonialContainer) { // Check if container exists
        const testimonials = testimonialContainer.querySelectorAll(".testimonial");
        const dotsContainer = testimonialContainer.querySelector(".dots"); // Assuming a container for dots
        const testimonialPrev = testimonialContainer.querySelector(".testimonial-prev");
        const testimonialNext = testimonialContainer.querySelector(".testimonial-next");

        if (testimonials.length > 0 && dotsContainer && testimonialPrev && testimonialNext) {
            let currentTestimonial = 0;

            // Create dots dynamically if needed, or ensure they exist
            dotsContainer.innerHTML = ""; // Clear existing dots if any
            testimonials.forEach((_, index) => {
                const dot = document.createElement("span");
                dot.classList.add("dot");
                dot.dataset.index = index; // Store index for click handling
                dotsContainer.appendChild(dot);
            });
            const dots = dotsContainer.querySelectorAll(".dot"); // Select newly created dots

            function showTestimonial(index) {
                // Ensure index is within bounds
                 index = (index + testimonials.length) % testimonials.length;

                testimonials.forEach(testimonial => testimonial.classList.remove("active"));
                dots.forEach(dot => dot.classList.remove("active"));

                testimonials[index].classList.add("active");
                dots[index].classList.add("active");
                currentTestimonial = index;
            }

            testimonialPrev.addEventListener("click", function() {
                showTestimonial(currentTestimonial - 1);
            });

            testimonialNext.addEventListener("click", function() {
                showTestimonial(currentTestimonial + 1);
            });

            dots.forEach(dot => {
                dot.addEventListener("click", function() {
                    showTestimonial(parseInt(this.dataset.index));
                });
            });

            // Show the first testimonial initially
            if (testimonials.length > 0) {
                showTestimonial(0);
            }
        }
    }


    // Compteurs statistiques
    const statsSection = document.querySelector("#statistiques"); // Target section by ID
    if (statsSection) { // Check if section exists
        const statNumbers = statsSection.querySelectorAll(".stat-number");
        let countersAnimated = false; // Flag to run animation only once

        function animateCounter(element, target) {
            let current = 0;
            const increment = Math.max(1, Math.ceil(target / 100)); // Ensure increment is at least 1, use ceil
            const duration = 2000; // 2 seconds
            // Calculate interval time based on steps needed
            const steps = Math.ceil(target / increment);
            const intervalTime = steps > 0 ? duration / steps : duration;

            const counter = setInterval(function() {
                current += increment;
                if (current >= target) {
                    element.textContent = target; // Set final target value
                    clearInterval(counter);
                } else {
                    element.textContent = Math.floor(current);
                }
            }, intervalTime);
        }

        function runCounters() {
             if (countersAnimated) return; // Don't re-animate
             statNumbers.forEach(stat => {
                 const target = parseInt(stat.getAttribute("data-count"));
                 if (!isNaN(target)) { // Ensure target is a number
                      animateCounter(stat, target);
                 }
             });
             countersAnimated = true; // Mark as animated
        }

        // Use Intersection Observer for better performance
        if ("IntersectionObserver" in window) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    // When the element is visible and not yet animated
                    if (entry.isIntersecting && !countersAnimated) {
                        runCounters();
                        observer.unobserve(statsSection); // Stop observing once animated
                    }
                });
            }, { threshold: 0.1 }); // Trigger when 10% visible
            observer.observe(statsSection);
        } else {
            // Fallback for older browsers using scroll event (less performant)
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
            checkCountersScroll(); // Check on initial load
        }
    }


    // Modals
    const avisBtn = document.getElementById("avis-btn");
    const contactBtn = document.getElementById("contact-btn");
    const avisModal = document.getElementById("avis-modal");
    const contactModal = document.getElementById("contact-modal");
    const modalCloses = document.querySelectorAll(".modal-close");

    function openModal(modal) {
        if (modal) { // Add check if modal exists
            modal.classList.add("active");
            document.body.style.overflow = "hidden"; // Prevent background scroll
        }
    }

    function closeModal(modal) {
        if (modal) { // Add check if modal exists
            modal.classList.remove("active");
            document.body.style.overflow = ""; // Restore background scroll
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
            const modal = close.closest(".modal"); // Find the parent modal
            closeModal(modal);
        });
    });

    // Close modal on clicking outside the content
    window.addEventListener("click", function(e) {
        if (e.target.classList.contains("modal")) { // Check if the click was on the modal background
            closeModal(e.target);
        }
    });

    // Rating system
    const ratingSelect = document.querySelector(".rating-select");
    if (ratingSelect) { // Add check if ratingSelect exists
        const stars = ratingSelect.querySelectorAll("i");
        const ratingInput = document.getElementById("avis-rating");

        if (stars.length > 0 && ratingInput) {
            function highlightStars(rating) {
                // Ensure rating is a number between 0 and 5 (or max rating)
                rating = parseInt(rating) || 0;
                stars.forEach(star => {
                    const starRating = parseInt(star.getAttribute("data-rating"));
                    if (starRating <= rating) {
                        star.classList.remove("far"); // Font Awesome regular
                        star.classList.add("fas");   // Font Awesome solid
                    } else {
                        star.classList.remove("fas");
                        star.classList.add("far");
                    }
                });
            }

            stars.forEach(star => {
                star.addEventListener("mouseover", function() {
                    highlightStars(this.getAttribute("data-rating"));
                });

                star.addEventListener("mouseout", function() {
                    // Highlight based on the actual selected value
                    highlightStars(ratingInput.value);
                });

                star.addEventListener("click", function() {
                    const rating = this.getAttribute("data-rating");
                    ratingInput.value = rating; // Set the hidden input value
                    highlightStars(rating); // Update visual state
                });
            });

            // Initialize stars based on potential initial value (e.g., if editing an existing review)
            if (ratingInput.value) {
                 highlightStars(ratingInput.value);
            } else {
                 highlightStars(0); // Default to 0 stars highlighted
            }
        }
    }


    // --- Start of Corrected Form Submission ---
    const forms = document.querySelectorAll("form[action^=\"https://formsubmit.co/\"]"); // Target only FormSubmit forms
    const notification = document.getElementById("notification");
    // Ensure you have an element with id="notification-message" inside the notification element
    const notificationMessage = document.getElementById("notification-message");

    forms.forEach(form => {
        form.addEventListener("submit", function(e) {
            e.preventDefault(); // Prevent default synchronous submission

            const formData = new FormData(form);
            const formAction = form.getAttribute("action");
            const submitButton = form.querySelector("button[type=\"submit\"]");
            const originalButtonText = submitButton ? submitButton.textContent : "Envoyer";

            // Basic client-side validation example (add more as needed)
            const emailField = form.querySelector("input[type=\"email\"]");
            if (emailField && !emailField.value.includes("@")) {
                 // Use notification for validation errors too
                 if (notification && notificationMessage) {
                      notificationMessage.textContent = "Veuillez entrer une adresse e-mail valide.";
                      notification.className = "notification active error";
                      setTimeout(() => notification.classList.remove("active"), 4000);
                 } else {
                      alert("Veuillez entrer une adresse e-mail valide.");
                 }
                 return; // Stop submission
            }
            // Add more validation here (e.g., required fields)
            const requiredFields = form.querySelectorAll("[required]");
            let firstInvalidField = null;
            requiredFields.forEach(field => {
                if (!field.value.trim()) {
                    if (!firstInvalidField) firstInvalidField = field;
                    // Optionally add visual indication for invalid fields
                    field.classList.add("invalid");
                } else {
                    field.classList.remove("invalid");
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
                firstInvalidField.focus(); // Focus the first invalid field
                return; // Stop submission
            }


            // Disable button during submission
            if (submitButton) {
                submitButton.disabled = true;
                submitButton.textContent = "Envoi en cours..."; // Or use a spinner icon
            }

            fetch(formAction, {
                method: "POST",
                body: formData,
                headers: {
                    "Accept": "application/json" // Important for FormSubmit AJAX
                }
            })
            .then(response => {
                // Check if response is ok (status in the range 200-299)
                if (response.ok) {
                    return response.json(); // Parse JSON response from FormSubmit
                } else {
                    // Try to parse error response if possible, otherwise throw generic error
                    // FormSubmit might return errors as JSON even with non-2xx status
                    return response.json().then(errData => {
                        throw new Error(errData.message || `Erreur serveur: ${response.status}`);
                    }).catch(() => {
                        // If parsing error response fails, throw generic status error
                        throw new Error(`Erreur serveur: ${response.status}`);
                    });
                }
            })
            .then(data => {
                // FormSubmit success response might be { success: "true" } or { ok: "true" }
                // Check for boolean true as well, just in case
                if (data.success === "true" || data.ok === "true" || data.success === true || data.ok === true) {
                    form.reset(); // Clear the form fields
                    // Reset rating system if it"s the avis form
                    if (form.id === "avis-form" && ratingSelect) {
                         const ratingInput = document.getElementById("avis-rating");
                         if(ratingInput) ratingInput.value = ""; // Clear hidden input
                         // Find the highlightStars function within the scope or redefine if needed
                         const ratingSystemScope = ratingSelect.closest("div"); // Adjust selector if needed
                         if (ratingSystemScope) {
                              const stars = ratingSystemScope.querySelectorAll("i");
                              function resetStars() {
                                   stars.forEach(star => {
                                        star.classList.remove("fas");
                                        star.classList.add("far");
                                   });
                              }
                              resetStars();
                         }
                    }

                    const modal = form.closest(".modal");
                    if (modal) {
                        closeModal(modal); // Close the modal if the form was inside one
                    }
                    if (notification && notificationMessage) {
                        notificationMessage.textContent = "Merci ! Votre message a été envoyé avec succès.";
                        // Use classes for styling success/error messages
                        notification.className = "notification active success";
                        setTimeout(() => notification.classList.remove("active"), 4000); // Hide after 4 seconds
                    } else {
                        alert("Merci ! Votre message a été envoyé avec succès."); // Fallback alert
                    }
                } else {
                    // Handle cases where FormSubmit returns a JSON error message (e.g., validation error)
                    throw new Error(data.message || "Une erreur inattendue est survenue lors de la validation.");
                }
            })
            .catch(error => {
                console.error("Erreur de soumission:", error);
                if (notification && notificationMessage) {
                    // Provide a more user-friendly error message
                    notificationMessage.textContent = `Une erreur s"est produite: ${error.message}. Veuillez vérifier vos informations et réessayer.`;
                    notification.className = "notification active error"; // Add "error" class for styling
                    // Keep error message visible longer or until dismissed
                    setTimeout(() => notification.classList.remove("active"), 6000); // Hide after 6 seconds
                } else {
                     alert(`Une erreur s"est produite: ${error.message}. Veuillez réessayer.`); // Fallback alert
                }
            })
            .finally(() => {
                 // Re-enable button regardless of success or failure
                 if (submitButton) {
                    submitButton.disabled = false;
                    submitButton.textContent = originalButtonText;
                 }
            });
        });
    });
    // --- End of Corrected Form Submission ---

}); // End of DOMContentLoaded listener

