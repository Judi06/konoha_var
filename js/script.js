// Navigation et effets de défilement
document.addEventListener('DOMContentLoaded', function() {
    // Navigation scroll
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Menu mobile
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            navToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }

    // Fermer le menu mobile lors du clic sur un lien
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (navToggle && navMenu) {
                navToggle.classList.remove('active');
                navMenu.classList.remove('active');
            }
        });
    });

    // Animation des éléments au scroll
    const fadeElements = document.querySelectorAll('.fade-in');
    
    function checkFade() {
        fadeElements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            
            if (elementTop < windowHeight - 100) {
                element.classList.add('active');
            }
        });
    }
    
    // Vérifier au chargement
    checkFade();
    
    // Vérifier au scroll
    window.addEventListener('scroll', checkFade);

    // Carrousel À propos
    const carouselTrack = document.querySelector('.carousel-track');
    const carouselSlides = document.querySelectorAll('.carousel-slide');
    
    if (carouselTrack && carouselSlides.length > 0) {
        let currentSlide = 0;
        const slideWidth = 100; // En pourcentage
        let intervalId = null;
        
        function nextSlide() {
            currentSlide = (currentSlide + 1) % carouselSlides.length;
            updateCarousel();
        }
        
        function updateCarousel() {
            carouselTrack.style.transform = `translateX(-${currentSlide * slideWidth}%)`;
        }

        function startCarousel() {
            if (intervalId) clearInterval(intervalId);
            intervalId = setInterval(nextSlide, 3000);
        }

        function stopCarousel() {
            clearInterval(intervalId);
        }
        
        // Changement automatique toutes les 3 secondes
        startCarousel();
        
        // Support tactile pour le carrousel
        let touchStartX = 0;
        let touchEndX = 0;
        
        carouselTrack.addEventListener('touchstart', function(e) {
            touchStartX = e.changedTouches[0].screenX;
            stopCarousel(); // Arrêter le défilement auto pendant le swipe
        });
        
        carouselTrack.addEventListener('touchend', function(e) {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
            startCarousel(); // Redémarrer le défilement auto après le swipe
        });
        
        function handleSwipe() {
            if (touchEndX < touchStartX - 50) { // Ajouter une marge pour éviter les clics accidentels
                // Swipe gauche
                nextSlide();
            } else if (touchEndX > touchStartX + 50) {
                // Swipe droite
                currentSlide = (currentSlide - 1 + carouselSlides.length) % carouselSlides.length;
                updateCarousel();
            }
        }
    }

    // Slider Avocats
    const avocatsSlider = document.querySelector('.avocats-slider');
    const avocatsTrack = document.querySelector('.avocats-slider-track');
    const avocatCards = document.querySelectorAll('.avocat-card');
    const prevBtn = document.querySelector('.avocats-prev');
    const nextBtn = document.querySelector('.avocats-next');
    
    if (avocatsSlider && avocatsTrack && avocatCards.length > 0 && prevBtn && nextBtn) {
        let currentPosition = 0;
        let slidesToShow = 3;
        let cardGap = 30; // Écart entre les cartes en pixels
        
        function updateSlidesToShow() {
            const sliderWidth = avocatsSlider.offsetWidth;
            if (window.innerWidth < 768) {
                slidesToShow = 1;
                cardGap = 0; // Pas d'écart sur mobile
            } else if (window.innerWidth < 1024) {
                slidesToShow = 2;
                cardGap = 20;
            } else {
                slidesToShow = 3;
                cardGap = 30;
            }
            avocatsTrack.style.gap = cardGap + 'px';
            updateSlider();
        }
        
        function updateSlider() {
            const maxPosition = Math.max(0, avocatCards.length - slidesToShow);
            
            if (currentPosition < 0) currentPosition = 0;
            if (currentPosition > maxPosition) currentPosition = maxPosition;
            
            // Calcul de la largeur d'une carte + gap
            const cardWidth = avocatCards[0].offsetWidth;
            const totalCardWidth = cardWidth + cardGap;
            
            avocatsTrack.style.transform = `translateX(-${currentPosition * totalCardWidth}px)`;

            // Activer/désactiver les boutons
            prevBtn.disabled = currentPosition === 0;
            nextBtn.disabled = currentPosition === maxPosition;
        }
        
        updateSlidesToShow();
        window.addEventListener('resize', updateSlidesToShow);
        
        prevBtn.addEventListener('click', function() {
            currentPosition--;
            updateSlider();
        });
        
        nextBtn.addEventListener('click', function() {
            currentPosition++;
            updateSlider();
        });
        
        // Support tactile pour le slider
        let touchStartX = 0;
        let touchEndX = 0;
        
        avocatsTrack.addEventListener('touchstart', function(e) {
            touchStartX = e.changedTouches[0].screenX;
        });
        
        avocatsTrack.addEventListener('touchend', function(e) {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipeAvocats();
        });
        
        function handleSwipeAvocats() {
            if (touchEndX < touchStartX - 50) {
                // Swipe gauche
                currentPosition++;
                updateSlider();
            } else if (touchEndX > touchStartX + 50) {
                // Swipe droite
                currentPosition--;
                updateSlider();
            }
        }
    }

    // Témoignages Slider
    const testimonialsContainer = document.querySelector('.testimonials-container');
    const testimonials = document.querySelectorAll('.testimonial');
    const dotsContainer = document.querySelector('.dots-container');
    const testimonialPrev = document.querySelector('.testimonial-prev');
    const testimonialNext = document.querySelector('.testimonial-next');
    
    if (testimonialsContainer && testimonials.length > 0 && dotsContainer && testimonialPrev && testimonialNext) {
        let currentTestimonial = 0;
        const totalDots = testimonials.length;
        const maxVisibleDots = 7; // Nombre maximum de points visibles (doit être impair de préférence)
        const sideDots = Math.floor((maxVisibleDots - 1) / 2); // Nombre de points de chaque côté de l'actif

        // Vider les points existants
        dotsContainer.innerHTML = ''; 

        // Créer les points dynamiquement
        for (let i = 0; i < totalDots; i++) {
            const dot = document.createElement('span');
            dot.classList.add('dot');
            dot.dataset.index = i;
            dotsContainer.appendChild(dot);
        }
        const dots = dotsContainer.querySelectorAll('.dot');

        function showTestimonial(index) {
            // Déplacer le conteneur de témoignages
            testimonialsContainer.style.transform = `translateX(-${index * 100}%)`;
            
            // Mettre à jour les points
            updateDotsVisibility(index);
            currentTestimonial = index;
        }

        function updateDotsVisibility(activeIndex) {
            dots.forEach((dot, index) => {
                dot.classList.remove('active');
                dot.style.display = 'none'; // Cacher tous les points par défaut
            });

            if (totalDots <= maxVisibleDots) {
                // Si moins de points que le max, afficher tous les points
                dots.forEach((dot, index) => {
                    dot.style.display = 'inline-block';
                    if (index === activeIndex) {
                        dot.classList.add('active');
                    }
                });
            } else {
                // Si plus de points que le max, calculer la plage visible
                let start = Math.max(0, activeIndex - sideDots);
                let end = Math.min(totalDots - 1, activeIndex + sideDots);

                // Ajuster si la plage est trop petite près des bords
                if (activeIndex < sideDots) {
                    end = maxVisibleDots - 1;
                } else if (activeIndex > totalDots - 1 - sideDots) {
                    start = totalDots - maxVisibleDots;
                }

                // Afficher les points dans la plage calculée
                for (let i = start; i <= end; i++) {
                    dots[i].style.display = 'inline-block';
                    if (i === activeIndex) {
                        dots[i].classList.add('active');
                    }
                }
            }
        }
        
        testimonialPrev.addEventListener('click', function() {
            currentTestimonial = (currentTestimonial - 1 + totalDots) % totalDots;
            showTestimonial(currentTestimonial);
        });
        
        testimonialNext.addEventListener('click', function() {
            currentTestimonial = (currentTestimonial + 1) % totalDots;
            showTestimonial(currentTestimonial);
        });
        
        dots.forEach(dot => {
            dot.addEventListener('click', function() {
                showTestimonial(parseInt(this.dataset.index));
            });
        });

        // Afficher le premier témoignage et les points initiaux
        showTestimonial(0);
    }

    // Compteurs statistiques
    const statNumbers = document.querySelectorAll('.stat-number');
    let countersAnimated = false;
    
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
        const statsSection = document.getElementById('statistiques');
        if (!statsSection) return;

        const sectionTop = statsSection.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;

        if (sectionTop < windowHeight - 100 && !countersAnimated) {
             statNumbers.forEach(stat => {
                if (!stat.classList.contains('counted')) {
                    const target = parseInt(stat.getAttribute('data-count'));
                    animateCounter(stat, target);
                    stat.classList.add('counted');
                }
            });
            countersAnimated = true; // Marquer comme animé pour ne pas relancer
        }
    }
    
    window.addEventListener('scroll', checkCounters);
    checkCounters(); // Vérifier au chargement initial

    // Modals
    const avisBtn = document.getElementById('avis-btn');
    const contactBtn = document.getElementById('contact-btn');
    const avisModal = document.getElementById('avis-modal');
    const contactModal = document.getElementById('contact-modal');
    const modalCloses = document.querySelectorAll('.modal-close');
    
    function openModal(modal) {
        if(modal) {
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    }
    
    function closeModal(modal) {
        if(modal) {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        }
    }
    
    if (avisBtn && avisModal) {
        avisBtn.addEventListener('click', function() {
            openModal(avisModal);
        });
    }
    
    if (contactBtn && contactModal) {
        contactBtn.addEventListener('click', function() {
            openModal(contactModal);
        });
    }
    
    modalCloses.forEach(close => {
        close.addEventListener('click', function() {
            const modal = close.closest('.modal');
            closeModal(modal);
        });
    });
    
    window.addEventListener('click', function(e) {
        if (e.target.classList.contains('modal')) {
            closeModal(e.target);
        }
    });

    // Rating system
    const stars = document.querySelectorAll('.rating-select i');
    const ratingInput = document.getElementById('avis-rating');
    
    if (stars.length > 0 && ratingInput) {
        stars.forEach(star => {
            star.addEventListener('mouseover', function() {
                const rating = this.getAttribute('data-rating');
                highlightStars(rating);
            });
            
            star.addEventListener('mouseout', function() {
                const currentRating = ratingInput.value;
                highlightStars(currentRating);
            });
            
            star.addEventListener('click', function() {
                const rating = this.getAttribute('data-rating');
                ratingInput.value = rating;
                highlightStars(rating);
            });
        });
        
        function highlightStars(rating) {
            stars.forEach(star => {
                const starRating = star.getAttribute('data-rating');
                if (starRating <= rating) {
                    star.classList.remove('far');
                    star.classList.add('fas');
                } else {
                    star.classList.remove('fas');
                    star.classList.add('far');
                }
            });
        }
        // Initialiser l'affichage des étoiles si une valeur existe déjà
        if (ratingInput.value) {
            highlightStars(ratingInput.value);
        }
    }

    // Form submission AJAX pour FormSubmit
    const forms = document.querySelectorAll('form[action^="https://formsubmit.co/"]');
    const notification = document.getElementById('notification');
    const notificationMessage = document.getElementById('notification-message');

    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(form);
            const formAction = form.getAttribute('action');
            const submitButton = form.querySelector('button[type="submit"]');
            const originalButtonText = submitButton ? submitButton.textContent : 'Envoyer'; // Ou un texte par défaut approprié

            // Désactiver le bouton et afficher un message de chargement
            if (submitButton) {
                submitButton.disabled = true;
                // Utiliser une icône de chargement ou un texte approprié
                const loadingText = submitButton.dataset.loadingText || 'Envoi en cours...'; 
                submitButton.textContent = loadingText;
            }

            fetch(formAction, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            })
            .then(response => {
                // FormSubmit peut renvoyer 200 OK même en cas d'erreur de configuration (ex: email non confirmé)
                // Il est plus fiable de vérifier le contenu de la réponse si possible
                if (!response.ok) {
                    // Tenter de lire le corps de l'erreur si possible
                    return response.json().catch(() => ({ success: false, message: `HTTP error! status: ${response.status}` })).then(errData => {
                        throw new Error(errData.message || `HTTP error! status: ${response.status}`);
                    });
                }
                return response.json();
            })
            .then(data => {
                // FormSubmit renvoie {success: "true"} en cas de succès
                if (data.success === "true" || (typeof data.success === 'boolean' && data.success)) { 
                    form.reset();
                    // Réinitialiser les étoiles si c'est le formulaire d'avis
                    if (form.id === 'avis-form' && ratingInput) {
                        ratingInput.value = '';
                        highlightStars(0);
                    }
                    const modal = form.closest('.modal');
                    closeModal(modal);
                    // Utiliser des messages traduisibles si nécessaire
                    const successMessage = form.dataset.successMessage || 'Message envoyé avec succès !';
                    showNotification(successMessage, 'success');
                } else {
                    // Gérer les erreurs renvoyées par FormSubmit (ex: email non confirmé)
                    console.error('Erreur FormSubmit:', data);
                    const errorMessage = form.dataset.errorMessage || 'Erreur lors de l\'envoi du message.';
                    showNotification(data.message || errorMessage, 'error');
                }
            })
            .catch(error => {
                console.error('Erreur Fetch:', error);
                const networkErrorMessage = form.dataset.networkErrorMessage || 'Erreur réseau lors de l\'envoi.';
                showNotification(networkErrorMessage, 'error');
            })
            .finally(() => {
                 // Réactiver le bouton et restaurer le texte original
                 if (submitButton) {
                    submitButton.disabled = false;
                    submitButton.textContent = originalButtonText;
                }
            });
        });
    });

    function showNotification(message, type) {
        if (notification && notificationMessage) {
            notificationMessage.textContent = message;
            notification.className = 'notification'; // Reset classes
            notification.classList.add('active', type); // Ajouter active et le type (success/error)
            
            // Masquer la notification après 4 secondes
            setTimeout(function() {
                notification.classList.remove('active');
            }, 4000);
        }
    }
});

