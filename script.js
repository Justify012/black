/* ==========================================================================
   PREMIUM ARCHITECTURE PORTFOLIO - ADEGOKE A. ADEKOLA
   INTERACTION ENGINE (JAVASCRIPT)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    
    // ==========================================================================
    // 1. CUSTOM INTERACTIVE CURSOR SYSTEM
    // ==========================================================================
    const cursorDot = document.querySelector('.custom-cursor-dot');
    const cursorOutline = document.querySelector('.custom-cursor-outline');
    
    if (cursorDot && cursorOutline) {
        let mouseX = 0;
        let mouseY = 0;
        let outlineX = 0;
        let outlineY = 0;
        
        // Track mouse position
        window.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            
            // Instantly move the center dot
            cursorDot.style.left = `${mouseX}px`;
            cursorDot.style.top = `${mouseY}px`;
        });
        
        // Custom animation frame loop for smooth lag easing on outline circle
        function animateCursorOutline() {
            // Easing equation (lerp)
            const ease = 0.15;
            outlineX += (mouseX - outlineX) * ease;
            outlineY += (mouseY - outlineY) * ease;
            
            cursorOutline.style.left = `${outlineX}px`;
            cursorOutline.style.top = `${outlineY}px`;
            
            requestAnimationFrame(animateCursorOutline);
        }
        requestAnimationFrame(animateCursorOutline);
        
        // Register hover triggers for interactive components
        const hoverables = document.querySelectorAll('a, button, .gallery-item, .faq-trigger, .form-input, .form-textarea, .btn');
        hoverables.forEach(item => {
            item.addEventListener('mouseenter', () => {
                document.body.classList.add('cursor-hover');
            });
            item.addEventListener('mouseleave', () => {
                document.body.classList.remove('cursor-hover');
            });
        });
    }

    // ==========================================================================
    // 2. FLOATING NAVIGATION BAR SCROLL TRIGGER
    // ==========================================================================
    const navbar = document.querySelector('.navbar');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section');
    
    window.addEventListener('scroll', () => {
        // Toggle navbar shrink-and-blur
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        // Active Navigation Link on Scroll (Intersection-like behavior)
        let currentSectionId = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (window.scrollY >= (sectionTop - 250)) {
                currentSectionId = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSectionId}`) {
                link.classList.add('active');
            }
        });
    });

    // ==========================================================================
    // 3. RESPONSIVE MOBILE NAVIGATION DRAWER
    // ==========================================================================
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            navToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
        
        // Close menu when a navigation item is clicked
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                navToggle.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    }

    // ==========================================================================
    // 4. FADE-UP INTERSECTION REVEAL OBSERVER
    // ==========================================================================
    const reveals = document.querySelectorAll('.reveal');
    
    if ('IntersectionObserver' in window) {
        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                    observer.unobserve(entry.target); // Reveal once
                }
            });
        }, {
            threshold: 0.15,
            rootMargin: '0px 0px -50px 0px'
        });
        
        reveals.forEach(element => {
            revealObserver.observe(element);
        });
    } else {
        // Fallback for older browsers
        reveals.forEach(element => element.classList.add('active'));
    }

    // ==========================================================================
    // 5. TESTIMONIALS SLIDER / CAROUSEL SYSTEM
    // ==========================================================================
    const track = document.querySelector('.testimonials-track');
    const slides = Array.from(document.querySelectorAll('.testimonial-slide'));
    const prevBtn = document.querySelector('.slider-control-prev');
    const nextBtn = document.querySelector('.slider-control-next');
    const dotsContainer = document.querySelector('.slider-dots');
    
    if (track && slides.length > 0) {
        let currentSlideIndex = 0;
        const totalSlides = slides.length;
        let slideTimer;
        
        // Dynamically build pagination dots
        slides.forEach((_, index) => {
            const dot = document.createElement('button');
            dot.classList.add('slider-dot');
            if (index === 0) dot.classList.add('active');
            dot.setAttribute('aria-label', `Go to slide ${index + 1}`);
            dotsContainer.appendChild(dot);
        });
        
        const dots = Array.from(document.querySelectorAll('.slider-dot'));
        
        // Main function to transition to a slide
        function goToSlide(index) {
            if (index < 0) index = totalSlides - 1;
            if (index >= totalSlides) index = 0;
            
            currentSlideIndex = index;
            
            // Slide track horizontally using percentages
            track.style.transform = `translateX(-${currentSlideIndex * 100}%)`;
            
            // Update active dot indicators
            dots.forEach(dot => dot.classList.remove('active'));
            dots[currentSlideIndex].classList.add('active');
            
            // Reset automatic shift interval
            resetAutoSlide();
        }
        
        // Controls
        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                goToSlide(currentSlideIndex + 1);
            });
        }
        
        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                goToSlide(currentSlideIndex - 1);
            });
        }
        
        // Dot clicks
        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                goToSlide(index);
            });
        });
        
        // Automatic cycle
        function startAutoSlide() {
            slideTimer = setInterval(() => {
                goToSlide(currentSlideIndex + 1);
            }, 8000);
        }
        
        function resetAutoSlide() {
            clearInterval(slideTimer);
            startAutoSlide();
        }
        
        // Initialize
        startAutoSlide();
        
        // Swipe/touch gestures for mobile devices
        let touchStartX = 0;
        let touchEndX = 0;
        
        track.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });
        
        track.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        }, { passive: true });
        
        function handleSwipe() {
            const threshold = 50;
            if (touchStartX - touchEndX > threshold) {
                // Swiped Left -> Next Slide
                goToSlide(currentSlideIndex + 1);
            } else if (touchEndX - touchStartX > threshold) {
                // Swiped Right -> Prev Slide
                goToSlide(currentSlideIndex - 1);
            }
        }
    }

    // ==========================================================================
    // 6. WORK GALLERY LIGHTBOX MODAL VIEWER
    // ==========================================================================
    const galleryItems = document.querySelectorAll('.gallery-item');
    const lightbox = document.querySelector('.lightbox-modal');
    const lightboxImage = document.querySelector('.lightbox-image');
    const lightboxCaption = document.querySelector('.lightbox-caption');
    const lightboxClose = document.querySelector('.lightbox-close');
    
    if (galleryItems && lightbox && lightboxImage) {
        galleryItems.forEach(item => {
            item.addEventListener('click', () => {
                const img = item.querySelector('img');
                const title = item.querySelector('.gallery-item-title').textContent;
                const category = item.querySelector('.gallery-category').textContent;
                
                if (img) {
                    lightboxImage.src = img.src;
                    lightboxImage.alt = img.alt || title;
                    lightboxCaption.textContent = `${category} — ${title}`;
                    
                    // Show modal
                    lightbox.style.display = 'flex';
                    // Trigger reflow for transition fade
                    setTimeout(() => {
                        lightbox.classList.add('active');
                    }, 20);
                    
                    document.body.style.overflow = 'hidden'; // Lock background scroll
                }
            });
        });
        
        // Close modal methods
        function closeLightbox() {
            lightbox.classList.remove('active');
            setTimeout(() => {
                lightbox.style.display = 'none';
            }, 400);
            document.body.style.overflow = ''; // Unlock scroll
        }
        
        if (lightboxClose) {
            lightboxClose.addEventListener('click', closeLightbox);
        }
        
        // Click outside image closes lightbox
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox || e.target.classList.contains('lightbox-container')) {
                closeLightbox();
            }
        });
        
        // Escape key closes lightbox
        window.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && lightbox.classList.contains('active')) {
                closeLightbox();
            }
        });
    }

    // ==========================================================================
    // 7. FAQ ACCORDION INTERACTIVITY
    // ==========================================================================
    const faqTriggers = document.querySelectorAll('.faq-trigger');
    
    if (faqTriggers) {
        faqTriggers.forEach(trigger => {
            trigger.addEventListener('click', () => {
                const item = trigger.closest('.faq-item');
                const content = item.querySelector('.faq-content');
                const isAlreadyActive = item.classList.contains('active');
                
                // Close all other accordion drawers
                document.querySelectorAll('.faq-item').forEach(otherItem => {
                    otherItem.classList.remove('active');
                    otherItem.querySelector('.faq-content').style.maxHeight = null;
                });
                
                // Toggle clicked panel
                if (!isAlreadyActive) {
                    item.classList.add('active');
                    // Compute full height of content drawer for CSS transition
                    content.style.maxHeight = `${content.scrollHeight}px`;
                }
            });
        });
    }

    // ==========================================================================
    // 8. CONTACT FORM SIMULATION
    // ==========================================================================
    const contactForm = document.getElementById('portfolioContactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Gather values
            const name = document.getElementById('formName').value.trim();
            const email = document.getElementById('formEmail').value.trim();
            const service = document.getElementById('formService').value;
            const message = document.getElementById('formMessage').value.trim();
            
            if (!name || !email || !message) {
                alert('Please fill out all required fields.');
                return;
            }
            
            // Visual success state feedback on submit button
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalBtnHtml = submitBtn.innerHTML;
            
            submitBtn.disabled = true;
            submitBtn.style.backgroundColor = '#10b981'; // Green success color
            submitBtn.style.boxShadow = '0 0 20px rgba(16, 185, 129, 0.4)';
            submitBtn.innerHTML = `
                Sending message... 
                <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10" stroke-opacity="0.25"></circle>
                    <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"></path>
                </svg>
            `;
            
            // Simulate API request delay
            setTimeout(() => {
                submitBtn.innerHTML = `
                    Message Sent Successfully!
                    <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5"></path>
                    </svg>
                `;
                
                // Clear input values
                contactForm.reset();
                
                // Revert button styling back to normal after a brief window
                setTimeout(() => {
                    submitBtn.disabled = false;
                    submitBtn.style.backgroundColor = '';
                    submitBtn.style.boxShadow = '';
                    submitBtn.innerHTML = originalBtnHtml;
                }, 4000);
                
                // Fire mailto trigger in background to actually allow direct email client launch
                const mailtoBody = `Name: ${name}%0D%0AEmail: ${email}%0D%0AService Requested: ${service}%0D%0A%0D%0A${encodeURIComponent(message)}`;
                window.location.href = `mailto:archyadegoke89.bb@gmail.com?subject=New Portfolio Inquiry - ${encodeURIComponent(name)}&body=${mailtoBody}`;
                
            }, 1800);
        });
    }
});
