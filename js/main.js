/**
 * PET GROOMING — PREMIUM BOUTIQUE SALON DEMO WEBSITE
 * Pure Vanilla JavaScript (Zero External Dependencies)
 */

(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', function () {
    initStickyHeader();
    initMobileMenu();
    initActiveNavLinks();
    initBeforeAfterSliders();
    initGalleryFiltersAndLightbox();
    initFaqAccordion();
    initBookingForm();
    initContactForm();
    initScrollReveal();
    initBackToTop();
  });

  /* ========================================================================
     1. STICKY HEADER & SCROLL SHADOW
     ======================================================================== */
  function initStickyHeader() {
    var header = document.querySelector('.site-header');
    if (!header) return;

    function onScroll() {
      if (window.scrollY > 16) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ========================================================================
     2. MOBILE HAMBURGER MENU
     ======================================================================== */
  function initMobileMenu() {
    var toggleBtn = document.querySelector('.mobile-menu-toggle');
    var navMenu = document.querySelector('.nav-menu');
    if (!toggleBtn || !navMenu) return;

    toggleBtn.addEventListener('click', function () {
      var isExpanded = toggleBtn.getAttribute('aria-expanded') === 'true';
      toggleBtn.setAttribute('aria-expanded', String(!isExpanded));
      navMenu.classList.toggle('open', !isExpanded);
    });

    // Close menu when clicking a link
    var navLinks = navMenu.querySelectorAll('a');
    navLinks.forEach(function (link) {
      link.addEventListener('click', function () {
        toggleBtn.setAttribute('aria-expanded', 'false');
        navMenu.classList.remove('open');
      });
    });

    // Close on Escape key
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && navMenu.classList.contains('open')) {
        toggleBtn.setAttribute('aria-expanded', 'false');
        navMenu.classList.remove('open');
        toggleBtn.focus();
      }
    });
  }

  /* ========================================================================
     3. ACTIVE NAVIGATION STATES
     ======================================================================== */
  function initActiveNavLinks() {
    var currentPath = window.location.pathname.split('/').pop() || 'index.html';
    var navLinks = document.querySelectorAll('.nav-link');

    navLinks.forEach(function (link) {
      var href = link.getAttribute('href');
      if (href === currentPath) {
        link.classList.add('active');
        link.setAttribute('aria-current', 'page');
      } else {
        link.classList.remove('active');
        link.removeAttribute('aria-current');
      }
    });
  }

  /* ========================================================================
     4. INTERACTIVE BEFORE & AFTER COMPARISON SLIDER
     ======================================================================== */
  function initBeforeAfterSliders() {
    var sliders = document.querySelectorAll('[data-ba-slider]');
    if (!sliders.length) return;

    sliders.forEach(function (slider) {
      var rangeInput = slider.querySelector('.ba-range-input');
      var beforeLayer = slider.querySelector('.ba-layer-before');
      var dividerLine = slider.querySelector('.ba-divider-line');
      var handleBtn = slider.querySelector('.ba-handle-btn');

      if (!rangeInput || !beforeLayer || !dividerLine || !handleBtn) return;

      function updateSlider(val) {
        var percentage = Math.max(0, Math.min(100, Number(val)));
        var rightInset = 100 - percentage;
        beforeLayer.style.clipPath = 'inset(0 ' + rightInset + '% 0 0)';
        dividerLine.style.left = percentage + '%';
        handleBtn.style.left = percentage + '%';
      }

      rangeInput.addEventListener('input', function (e) {
        updateSlider(e.target.value);
      });

      rangeInput.addEventListener('change', function (e) {
        updateSlider(e.target.value);
      });

      // Initialize at default value
      updateSlider(rangeInput.value || 50);
    });
  }

  /* ========================================================================
     5. GALLERY CATEGORY FILTERS & LIGHTBOX MODAL
     ======================================================================== */
  function initGalleryFiltersAndLightbox() {
    var filterBtns = document.querySelectorAll('[data-filter]');
    var galleryCards = Array.prototype.slice.call(document.querySelectorAll('[data-gallery-item]'));

    // Category Filtering
    if (filterBtns.length && galleryCards.length) {
      filterBtns.forEach(function (btn) {
        btn.addEventListener('click', function () {
          var selectedCat = btn.getAttribute('data-filter');

          filterBtns.forEach(function (b) {
            b.classList.remove('active');
            b.setAttribute('aria-pressed', 'false');
          });
          btn.classList.add('active');
          btn.setAttribute('aria-pressed', 'true');

          galleryCards.forEach(function (card) {
            var cardCat = card.getAttribute('data-category');
            if (selectedCat === 'all' || cardCat === selectedCat) {
              card.classList.remove('hidden');
            } else {
              card.classList.add('hidden');
            }
          });
        });
      });
    }

    // Lightbox Modal
    var modal = document.getElementById('gallery-lightbox');
    if (!modal || !galleryCards.length) return;

    var closeBtn = modal.querySelector('[data-lightbox-close]');
    var prevBtn = modal.querySelector('[data-lightbox-prev]');
    var nextBtn = modal.querySelector('[data-lightbox-next]');
    var titleEl = modal.querySelector('[data-lightbox-title]');
    var catEl = modal.querySelector('[data-lightbox-cat]');
    var descEl = modal.querySelector('[data-lightbox-desc]');
    var filenameEl = modal.querySelector('[data-lightbox-filename]');
    var ratioEl = modal.querySelector('[data-lightbox-ratio]');
    var subjectEl = modal.querySelector('[data-lightbox-subject]');
    var counterEl = modal.querySelector('[data-lightbox-counter]');

    var currentIndex = 0;

    function getVisibleCards() {
      return galleryCards.filter(function (card) {
        return !card.classList.contains('hidden');
      });
    }

    function renderLightbox(index) {
      var visible = getVisibleCards();
      if (!visible.length) return;

      if (index < 0) index = visible.length - 1;
      if (index >= visible.length) index = 0;
      currentIndex = index;

      var card = visible[currentIndex];
      var title = card.getAttribute('data-title') || 'Grooming Transformation';
      var catLabel = card.getAttribute('data-cat-label') || 'Grooming Gallery';
      var desc = card.getAttribute('data-desc') || '';
      var filename = card.getAttribute('data-filename') || 'grooming-gallery-01.jpeg';
      var ratio = card.getAttribute('data-ratio') || '4:3 (1200x900px)';
      var imgSrc = card.getAttribute('data-img-src') || (card.querySelector('img') ? card.querySelector('img').getAttribute('src') : ('images/' + filename));
      var imgEl = modal.querySelector('[data-lightbox-img]');

      if (imgEl && imgSrc) {
        imgEl.src = imgSrc;
        imgEl.alt = title + ' — Illustrative Demo Transformation';
      }
      if (titleEl) titleEl.textContent = title;
      if (catEl) catEl.textContent = catLabel;
      if (descEl) descEl.textContent = desc;
      if (filenameEl) filenameEl.textContent = filename;
      if (ratioEl) ratioEl.textContent = ratio;
      if (subjectEl) subjectEl.textContent = title + ' — ' + desc;
      if (counterEl) {
        counterEl.textContent = 'Item ' + (currentIndex + 1) + ' of ' + visible.length;
      }
    }

    function openLightbox(cardElement) {
      var visible = getVisibleCards();
      var idx = visible.indexOf(cardElement);
      renderLightbox(idx !== -1 ? idx : 0);
      modal.classList.add('open');
      modal.setAttribute('aria-hidden', 'false');
      if (closeBtn) closeBtn.focus();
    }

    function closeLightbox() {
      modal.classList.remove('open');
      modal.setAttribute('aria-hidden', 'true');
    }

    galleryCards.forEach(function (card) {
      var trigger = card.querySelector('[data-lightbox-open]');
      if (trigger) {
        trigger.addEventListener('click', function () {
          openLightbox(card);
        });
        trigger.addEventListener('keydown', function (e) {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            openLightbox(card);
          }
        });
      }
    });

    if (closeBtn) {
      closeBtn.addEventListener('click', closeLightbox);
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', function () {
        renderLightbox(currentIndex - 1);
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', function () {
        renderLightbox(currentIndex + 1);
      });
    }

    modal.addEventListener('click', function (e) {
      if (e.target === modal) {
        closeLightbox();
      }
    });

    document.addEventListener('keydown', function (e) {
      if (!modal.classList.contains('open')) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') renderLightbox(currentIndex - 1);
      if (e.key === 'ArrowRight') renderLightbox(currentIndex + 1);
    });
  }

  /* ========================================================================
     6. FAQ ACCORDION
     ======================================================================== */
  function initFaqAccordion() {
    var faqItems = document.querySelectorAll('.faq-item');
    if (!faqItems.length) return;

    faqItems.forEach(function (item) {
      var button = item.querySelector('.faq-question');
      if (!button) return;

      button.addEventListener('click', function () {
        var isOpen = item.classList.contains('open');

        // Close others for clean accordion experience
        faqItems.forEach(function (other) {
          other.classList.remove('open');
          var otherBtn = other.querySelector('.faq-question');
          if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
        });

        if (!isOpen) {
          item.classList.add('open');
          button.setAttribute('aria-expanded', 'true');
        }
      });
    });
  }

  /* ========================================================================
     7. BOOKING APPOINTMENT REQUEST FORM VALIDATION
     ======================================================================== */
  function initBookingForm() {
    var form = document.getElementById('booking-request-form');
    if (!form) return;

    var confirmationPanel = document.getElementById('booking-demo-confirmation');
    var summaryTarget = document.getElementById('booking-summary-details');
    var resetBtn = document.getElementById('booking-reset-btn');

    // Set minimum date to today
    var dateInput = form.querySelector('#preferredDate');
    if (dateInput) {
      var today = new Date().toISOString().split('T')[0];
      dateInput.setAttribute('min', today);
    }

    function validateField(field) {
      var value = (field.value || '').trim();
      var isRequired = field.hasAttribute('required');
      var isValid = true;

      if (isRequired && !value) {
        isValid = false;
      } else if (value && field.type === 'email') {
        var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        isValid = emailRegex.test(value);
      } else if (value && field.id === 'ownerPhone') {
        var digits = value.replace(/\D/g, '');
        isValid = digits.length >= 7 && digits.length <= 15;
      }

      if (!isValid) {
        field.classList.add('invalid');
        field.setAttribute('aria-invalid', 'true');
      } else {
        field.classList.remove('invalid');
        field.setAttribute('aria-invalid', 'false');
      }

      return isValid;
    }

    var inputs = form.querySelectorAll('.form-control');
    inputs.forEach(function (input) {
      input.addEventListener('blur', function () {
        validateField(input);
      });
      input.addEventListener('input', function () {
        if (input.classList.contains('invalid')) {
          validateField(input);
        }
      });
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var allValid = true;
      var firstInvalid = null;

      inputs.forEach(function (input) {
        var valid = validateField(input);
        if (!valid) {
          allValid = false;
          if (!firstInvalid) firstInvalid = input;
        }
      });

      if (!allValid) {
        if (firstInvalid) firstInvalid.focus();
        return;
      }

      // Populate illustrative demo summary without storing/transmitting data
      var ownerName = form.querySelector('#ownerName').value.trim();
      var petName = form.querySelector('#petName').value.trim();
      var animalType = form.querySelector('#animalType').value;
      var petSize = form.querySelector('#petSize').value;
      var serviceRequired = form.querySelector('#serviceRequired').value;
      var preferredDate = form.querySelector('#preferredDate').value;
      var preferredTime = form.querySelector('#preferredTime').value;

      if (summaryTarget) {
        summaryTarget.textContent =
          'Sample Request Preview: ' +
          petName +
          ' (' +
          animalType +
          ', ' +
          petSize +
          ') for ' +
          serviceRequired +
          ' — Requested by ' +
          ownerName +
          ' on ' +
          preferredDate +
          ' (' +
          preferredTime +
          ').';
      }

      if (confirmationPanel) {
        confirmationPanel.classList.add('visible');
        confirmationPanel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    });

    if (resetBtn) {
      resetBtn.addEventListener('click', function () {
        form.reset();
        inputs.forEach(function (input) {
          input.classList.remove('invalid');
          input.removeAttribute('aria-invalid');
        });
        if (confirmationPanel) {
          confirmationPanel.classList.remove('visible');
        }
      });
    }
  }

  /* ========================================================================
     8. CONTACT ENQUIRY FORM VALIDATION
     ======================================================================== */
  function initContactForm() {
    var form = document.getElementById('contact-enquiry-form');
    if (!form) return;

    var confirmationPanel = document.getElementById('contact-demo-confirmation');
    var summaryTarget = document.getElementById('contact-summary-details');

    function validateField(field) {
      var value = (field.value || '').trim();
      var isRequired = field.hasAttribute('required');
      var isValid = true;

      if (isRequired && !value) {
        isValid = false;
      } else if (value && field.type === 'email') {
        var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        isValid = emailRegex.test(value);
      } else if (value && field.id === 'contactPhone') {
        var digits = value.replace(/\D/g, '');
        isValid = digits.length >= 7 && digits.length <= 15;
      }

      if (!isValid) {
        field.classList.add('invalid');
        field.setAttribute('aria-invalid', 'true');
      } else {
        field.classList.remove('invalid');
        field.setAttribute('aria-invalid', 'false');
      }

      return isValid;
    }

    var inputs = form.querySelectorAll('.form-control');
    inputs.forEach(function (input) {
      input.addEventListener('blur', function () {
        validateField(input);
      });
      input.addEventListener('input', function () {
        if (input.classList.contains('invalid')) {
          validateField(input);
        }
      });
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var allValid = true;
      var firstInvalid = null;

      inputs.forEach(function (input) {
        var valid = validateField(input);
        if (!valid) {
          allValid = false;
          if (!firstInvalid) firstInvalid = input;
        }
      });

      if (!allValid) {
        if (firstInvalid) firstInvalid.focus();
        return;
      }

      var senderName = form.querySelector('#contactName').value.trim();
      var subject = form.querySelector('#contactSubject').value.trim();

      if (summaryTarget) {
        summaryTarget.textContent =
          'Enquiry from ' +
          senderName +
          ' regarding "' +
          subject +
          '" validated locally in demonstration mode.';
      }

      if (confirmationPanel) {
        confirmationPanel.classList.add('visible');
        confirmationPanel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
      form.reset();
    });
  }

  /* ========================================================================
     9. SCROLL REVEAL ANIMATIONS
     ======================================================================== */
  function initScrollReveal() {
    var revealEls = document.querySelectorAll('.reveal');
    if (!revealEls.length) return;

    if (!('IntersectionObserver' in window)) {
      revealEls.forEach(function (el) {
        el.classList.add('revealed');
      });
      return;
    }

    var observer = new IntersectionObserver(
      function (entries, obs) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );

    revealEls.forEach(function (el) {
      observer.observe(el);
    });
  }

  /* ========================================================================
     10. BACK TO TOP BUTTON
     ======================================================================== */
  function initBackToTop() {
    var btn = document.getElementById('back-to-top');
    if (!btn) return;

    window.addEventListener(
      'scroll',
      function () {
        if (window.scrollY > 360) {
          btn.classList.add('visible');
        } else {
          btn.classList.remove('visible');
        }
      },
      { passive: true }
    );

    btn.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
})();
