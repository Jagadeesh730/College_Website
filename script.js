/* ==========================================
   COLLEGE WEBSITE - MAIN JAVASCRIPT
   ========================================== */

'use strict';

// ===== DOM READY =====
document.addEventListener('DOMContentLoaded', function () {

  // ===== LOADING SCREEN =====
  function initLoadingScreen() {
    const loadingScreen = document.getElementById('loading-screen');
    const progressBar = document.querySelector('.loader-progress-bar');
    let progress = 0;
    const interval = setInterval(function () {
      progress += Math.random() * 30;
      if (progress > 100) progress = 100;
      if (progressBar) progressBar.style.width = progress + '%';
      if (progress === 100) {
        clearInterval(interval);
        setTimeout(function () {
          loadingScreen.classList.add('hidden');
          document.body.style.overflow = 'visible';
          initScrollReveal();
        }, 400);
      }
    }, 300);
  }
  initLoadingScreen();

  // ===== TOAST NOTIFICATION =====
  function showToast(message, type) {
    type = type || 'success';
    const container = document.getElementById('toast-container');
    if (!container) return;
    const toast = document.createElement('div');
    toast.className = 'toast ' + type;
    const icons = {
      success: 'fa-check-circle',
      error: 'fa-exclamation-circle',
      info: 'fa-info-circle'
    };
    toast.innerHTML = '<i class="fas ' + (icons[type] || icons.info) + '"></i> ' + message;
    container.appendChild(toast);
    setTimeout(function () {
      if (toast.parentNode) toast.remove();
    }, 4000);
  }

  // ===== STICKY NAVBAR =====
  function initStickyNav() {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;
    window.addEventListener('scroll', function () {
      if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    }, { passive: true });
  }
  initStickyNav();

  // ===== MOBILE MENU =====
  function initMobileMenu() {
    const toggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    if (!toggle || !navLinks) return;

    toggle.addEventListener('click', function () {
      toggle.classList.toggle('active');
      navLinks.classList.toggle('open');
      document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
    });

    // Close menu on link click (mobile)
    navLinks.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        if (window.innerWidth <= 768) {
          toggle.classList.remove('active');
          navLinks.classList.remove('open');
          document.body.style.overflow = '';
        }
      });
    });

    // Dropdown toggle on mobile
    navLinks.querySelectorAll('.dropdown-toggle').forEach(function (toggle) {
      toggle.addEventListener('click', function (e) {
        if (window.innerWidth <= 768) {
          e.preventDefault();
          var parent = this.closest('li');
          parent.classList.toggle('open-dropdown');
        }
      });
    });
  }
  initMobileMenu();

  // ===== HERO SLIDER =====
  function initHeroSlider() {
    const slides = document.querySelectorAll('.hero-slide');
    const prevBtn = document.querySelector('.slider-btn.prev');
    const nextBtn = document.querySelector('.slider-btn.next');
    const indicators = document.querySelectorAll('.slider-indicators span');
    if (!slides.length) return;

    let currentSlide = 0;
    const totalSlides = slides.length;
    let autoSlideInterval;

    function goToSlide(index) {
      slides.forEach(function (s) { s.classList.remove('active'); });
      indicators.forEach(function (i) { i.classList.remove('active'); });
      currentSlide = (index + totalSlides) % totalSlides;
      slides[currentSlide].classList.add('active');
      if (indicators[currentSlide]) indicators[currentSlide].classList.add('active');
    }

    function nextSlide() { goToSlide(currentSlide + 1); }
    function prevSlide() { goToSlide(currentSlide - 1); }

    function startAutoSlide() {
      stopAutoSlide();
      autoSlideInterval = setInterval(nextSlide, 5000);
    }

    function stopAutoSlide() {
      if (autoSlideInterval) clearInterval(autoSlideInterval);
    }

    if (nextBtn) nextBtn.addEventListener('click', function () { nextSlide(); startAutoSlide(); });
    if (prevBtn) prevBtn.addEventListener('click', function () { prevSlide(); startAutoSlide(); });

    indicators.forEach(function (dot, idx) {
      dot.addEventListener('click', function () { goToSlide(idx); startAutoSlide(); });
    });

    startAutoSlide();

    // Pause on hover
    const slider = document.querySelector('.hero-slider');
    if (slider) {
      slider.addEventListener('mouseenter', stopAutoSlide);
      slider.addEventListener('mouseleave', startAutoSlide);
    }
  }
  initHeroSlider();

  // ===== ANIMATED COUNTERS =====
  function initCounters() {
    const counters = document.querySelectorAll('.stat-number, .counter');
    if (!counters.length) return;

    function isElementInViewport(el) {
      var rect = el.getBoundingClientRect();
      return rect.top < window.innerHeight - 50 && rect.bottom > 0;
    }

    function animateCounter(el) {
      if (el.dataset.animated === 'true') return;
      el.dataset.animated = 'true';
      var target = parseInt(el.dataset.target) || parseInt(el.textContent.replace(/[^0-9]/g, '')) || 0;
      var duration = 2000;
      var start = 0;
      var startTime = null;

      function step(timestamp) {
        if (!startTime) startTime = timestamp;
        var progress = Math.min((timestamp - startTime) / duration, 1);
        var ease = 1 - Math.pow(1 - progress, 3);
        var current = Math.floor(ease * target);
        el.textContent = current.toLocaleString();
        if (progress < 1) {
          requestAnimationFrame(step);
        } else {
          el.textContent = target.toLocaleString();
        }
      }
      requestAnimationFrame(step);
    }

    function checkCounters() {
      counters.forEach(function (counter) {
        if (isElementInViewport(counter) && counter.dataset.animated !== 'true') {
          animateCounter(counter);
        }
      });
    }

    window.addEventListener('scroll', checkCounters, { passive: true });
    checkCounters();
  }
  initCounters();

  // ===== SCROLL REVEAL =====
  function initScrollReveal() {
    const reveals = document.querySelectorAll('.reveal');
    if (!reveals.length) return;

    function reveal() {
      var windowHeight = window.innerHeight;
      var revealPoint = 100;
      reveals.forEach(function (el) {
        var revealTop = el.getBoundingClientRect().top;
        if (revealTop < windowHeight - revealPoint) {
          el.classList.add('revealed');
        }
      });
    }

    window.addEventListener('scroll', reveal, { passive: true });
    reveal();
  }

  // ===== BACK TO TOP =====
  function initBackToTop() {
    const btn = document.querySelector('.back-to-top');
    if (!btn) return;
    window.addEventListener('scroll', function () {
      if (window.scrollY > 400) {
        btn.classList.add('visible');
      } else {
        btn.classList.remove('visible');
      }
    }, { passive: true });
    btn.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
  initBackToTop();

  // ===== DARK MODE =====
  function initDarkMode() {
    const toggle = document.querySelector('.theme-toggle');
    if (!toggle) return;
    var savedTheme = localStorage.getItem('college-theme');
    if (savedTheme === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark');
      toggle.innerHTML = '<i class="fas fa-sun"></i>';
    }
    toggle.addEventListener('click', function () {
      var current = document.documentElement.getAttribute('data-theme');
      if (current === 'dark') {
        document.documentElement.removeAttribute('data-theme');
        localStorage.setItem('college-theme', 'light');
        toggle.innerHTML = '<i class="fas fa-moon"></i>';
      } else {
        document.documentElement.setAttribute('data-theme', 'dark');
        localStorage.setItem('college-theme', 'dark');
        toggle.innerHTML = '<i class="fas fa-sun"></i>';
      }
    });
  }
  initDarkMode();

  // ===== ACTIVE NAV LINK =====
  function initActiveNav() {
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-links a').forEach(function (link) {
      var href = link.getAttribute('href');
      if (href === currentPath) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }
  initActiveNav();

  // ===== ACCORDION FAQ =====
  function initFAQ() {
    document.querySelectorAll('.faq-question').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var item = this.closest('.faq-item');
        var isActive = item.classList.contains('active');
        // Close all
        document.querySelectorAll('.faq-item').forEach(function (i) {
          i.classList.remove('active');
        });
        if (!isActive) {
          item.classList.add('active');
        }
      });
    });
  }
  initFAQ();

  // ===== GALLERY LIGHTBOX =====
  function initLightbox() {
    var lightbox = document.querySelector('.lightbox');
    var lightboxImg = document.querySelector('.lightbox-img');
    var closeBtn = document.querySelector('.lightbox-close');
    var prevBtn = document.querySelector('.lightbox-nav.prev');
    var nextBtn = document.querySelector('.lightbox-nav.next');
    if (!lightbox) return;

    var images = [];
    var currentIndex = 0;

    document.querySelectorAll('.gallery-item').forEach(function (item, idx) {
      var img = item.querySelector('img');
      if (img) {
        images.push(img.src);
        item.addEventListener('click', function () {
          currentIndex = idx;
          lightboxImg.src = images[currentIndex];
          lightbox.classList.add('active');
          document.body.style.overflow = 'hidden';
        });
      }
    });

    function showImage(index) {
      currentIndex = (index + images.length) % images.length;
      lightboxImg.src = images[currentIndex];
    }

    if (closeBtn) {
      closeBtn.addEventListener('click', function () {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
      });
    }

    if (prevBtn) prevBtn.addEventListener('click', function () { showImage(currentIndex - 1); });
    if (nextBtn) nextBtn.addEventListener('click', function () { showImage(currentIndex + 1); });

    // Keyboard support
    document.addEventListener('keydown', function (e) {
      if (!lightbox.classList.contains('active')) return;
      if (e.key === 'Escape') { lightbox.classList.remove('active'); document.body.style.overflow = ''; }
      if (e.key === 'ArrowLeft') showImage(currentIndex - 1);
      if (e.key === 'ArrowRight') showImage(currentIndex + 1);
    });

    // Click outside to close
    lightbox.addEventListener('click', function (e) {
      if (e.target === lightbox) {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  }
  initLightbox();

  // ===== TESTIMONIALS SLIDER =====
  function initTestimonials() {
    var slides = document.querySelectorAll('.testimonial-slide');
    var dots = document.querySelectorAll('.testimonial-dots span');
    if (!slides.length) return;

    var current = 0;
    var interval;

    function showSlide(index) {
      slides.forEach(function (s) { s.classList.remove('active'); });
      dots.forEach(function (d) { d.classList.remove('active'); });
      current = (index + slides.length) % slides.length;
      slides[current].classList.add('active');
      if (dots[current]) dots[current].classList.add('active');
    }

    function nextSlide() { showSlide(current + 1); }

    function startAuto() {
      stopAuto();
      interval = setInterval(nextSlide, 4000);
    }

    function stopAuto() { if (interval) clearInterval(interval); }

    dots.forEach(function (dot, idx) {
      dot.addEventListener('click', function () { showSlide(idx); startAuto(); });
    });

    var container = document.querySelector('.testimonials-container');
    if (container) {
      container.addEventListener('mouseenter', stopAuto);
      container.addEventListener('mouseleave', startAuto);
    }

    startAuto();
  }
  initTestimonials();

  // ===== SEARCH FACULTY =====
  function initFacultySearch() {
    var input = document.getElementById('facultySearch');
    var cards = document.querySelectorAll('.faculty-card');
    if (!input || !cards.length) return;

    input.addEventListener('input', function () {
      var query = this.value.toLowerCase().trim();
      cards.forEach(function (card) {
        var text = card.textContent.toLowerCase();
        card.style.display = text.indexOf(query) !== -1 ? '' : 'none';
      });
    });
  }
  initFacultySearch();

  // ===== SEARCH DEPARTMENTS =====
  function initDepartmentSearch() {
    var input = document.getElementById('deptSearch');
    var cards = document.querySelectorAll('.dept-card');
    if (!input || !cards.length) return;

    input.addEventListener('input', function () {
      var query = this.value.toLowerCase().trim();
      cards.forEach(function (card) {
        var text = card.textContent.toLowerCase();
        card.style.display = text.indexOf(query) !== -1 ? '' : 'none';
      });
    });
  }
  initDepartmentSearch();

  // ===== SEARCH COURSES =====
  function initCourseSearch() {
    var input = document.getElementById('courseSearch');
    var cards = document.querySelectorAll('.course-card');
    if (!input || !cards.length) return;

    input.addEventListener('input', function () {
      var query = this.value.toLowerCase().trim();
      cards.forEach(function (card) {
        var text = card.textContent.toLowerCase();
        card.style.display = text.indexOf(query) !== -1 ? '' : 'none';
      });
    });
  }
  initCourseSearch();

  // ===== FORM VALIDATION (Admission) =====
  function initAdmissionForm() {
    var form = document.getElementById('admissionForm');
    if (!form) return;

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var valid = true;

      // Clear errors
      form.querySelectorAll('.form-group').forEach(function (g) { g.classList.remove('error'); });

      // Name
      var name = form.querySelector('#fullName');
      if (!name || !name.value.trim()) {
        setError(name, 'Please enter your full name');
        valid = false;
      }

      // Email
      var email = form.querySelector('#email');
      if (email) {
        var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email.value.trim()) {
          setError(email, 'Please enter your email');
          valid = false;
        } else if (!emailRegex.test(email.value.trim())) {
          setError(email, 'Please enter a valid email address');
          valid = false;
        }
      }

      // Phone
      var phone = form.querySelector('#phone');
      if (phone) {
        var phoneRegex = /^[0-9]{10}$/;
        if (!phone.value.trim()) {
          setError(phone, 'Please enter your phone number');
          valid = false;
        } else if (!phoneRegex.test(phone.value.trim())) {
          setError(phone, 'Please enter a valid 10-digit phone number');
          valid = false;
        }
      }

      // Course
      var course = form.querySelector('#course');
      if (course && !course.value) {
        setError(course, 'Please select a course');
        valid = false;
      }

      if (valid) {
        showToast('Admission Form Submitted Successfully! We will contact you soon.', 'success');
        form.reset();
      }
    });

    function setError(el, msg) {
      if (!el) return;
      var group = el.closest('.form-group');
      if (!group) return;
      group.classList.add('error');
      var err = group.querySelector('.error-message');
      if (err) err.textContent = msg;
    }
  }
  initAdmissionForm();

  // ===== CONTACT FORM =====
  function initContactForm() {
    var form = document.getElementById('contactForm');
    if (!form) return;

    // Restore draft from localStorage
    var savedDraft = localStorage.getItem('college-contact-draft');
    if (savedDraft) {
      try {
        var data = JSON.parse(savedDraft);
        Object.keys(data).forEach(function (key) {
          var field = form.querySelector('[name="' + key + '"]');
          if (field) field.value = data[key];
        });
      } catch (e) { /* ignore */ }
    }

    // Save draft on input
    form.querySelectorAll('input, textarea').forEach(function (field) {
      field.addEventListener('input', function () {
        var draft = {};
        form.querySelectorAll('input, textarea').forEach(function (f) {
          draft[f.name] = f.value;
        });
        localStorage.setItem('college-contact-draft', JSON.stringify(draft));
      });
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var valid = true;

      form.querySelectorAll('.form-group').forEach(function (g) { g.classList.remove('error'); });

      var name = form.querySelector('[name="name"]');
      if (!name || !name.value.trim()) { setError2(name, 'Please enter your name'); valid = false; }

      var email = form.querySelector('[name="email"]');
      if (email) {
        var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email.value.trim()) { setError2(email, 'Please enter your email'); valid = false; }
        else if (!emailRegex.test(email.value.trim())) { setError2(email, 'Invalid email'); valid = false; }
      }

      var phone = form.querySelector('[name="phone"]');
      if (phone && phone.value.trim()) {
        var phoneRegex = /^[0-9]{10}$/;
        if (!phoneRegex.test(phone.value.trim())) { setError2(phone, 'Invalid phone number'); valid = false; }
      }

      var subject = form.querySelector('[name="subject"]');
      if (!subject || !subject.value.trim()) { setError2(subject, 'Please enter a subject'); valid = false; }

      var message = form.querySelector('[name="message"]');
      if (!message || !message.value.trim()) { setError2(message, 'Please enter your message'); valid = false; }

      if (valid) {
        showToast('Thank You for Contacting Us! We will get back to you soon.', 'success');
        form.reset();
        localStorage.removeItem('college-contact-draft');
      }
    });

    function setError2(el, msg) {
      if (!el) return;
      var group = el.closest('.form-group');
      if (!group) return;
      group.classList.add('error');
      var err = group.querySelector('.error-message');
      if (err) err.textContent = msg;
    }
  }
  initContactForm();

  // ===== COUNTDOWN TIMER =====
  function initCountdownTimers() {
    document.querySelectorAll('.countdown').forEach(function (container) {
      var targetDate = container.getAttribute('data-target');
      if (!targetDate) return;
      var target = new Date(targetDate).getTime();

      function updateCountdown() {
        var now = new Date().getTime();
        var diff = target - now;

        if (diff <= 0) {
          container.innerHTML = '<div class="countdown-item"><span class="num">Event Started</span></div>';
          return;
        }

        var days = Math.floor(diff / (1000 * 60 * 60 * 24));
        var hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        var minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        var seconds = Math.floor((diff % (1000 * 60)) / 1000);

        container.innerHTML =
          '<div class="countdown-item"><span class="num">' + days + '</span><span class="label">Days</span></div>' +
          '<div class="countdown-item"><span class="num">' + hours + '</span><span class="label">Hours</span></div>' +
          '<div class="countdown-item"><span class="num">' + minutes + '</span><span class="label">Mins</span></div>' +
          '<div class="countdown-item"><span class="num">' + seconds + '</span><span class="label">Secs</span></div>';
      }

      updateCountdown();
      setInterval(updateCountdown, 1000);
    });
  }
  initCountdownTimers();

  // ===== LAST VIEWED DEPARTMENT (LocalStorage) =====
  function initLastViewedDepartment() {
    document.querySelectorAll('.dept-card .btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var card = this.closest('.dept-card');
        if (!card) return;
        var name = card.querySelector('h3') ? card.querySelector('h3').textContent : '';
        localStorage.setItem('college-last-dept', name);
      });
    });
  }
  initLastViewedDepartment();

  // ===== SMOOTH SCROLL FOR ANCHOR LINKS =====
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
      anchor.addEventListener('click', function (e) {
        var targetId = this.getAttribute('href');
        if (targetId === '#') return;
        var target = document.querySelector(targetId);
        if (target) {
          e.preventDefault();
          var offset = 80;
          var top = target.getBoundingClientRect().top + window.pageYOffset - offset;
          window.scrollTo({ top: top, behavior: 'smooth' });
        }
      });
    });
  }
  initSmoothScroll();

  // ===== GLOBAL EXPOSE =====
  window.showToast = showToast;

}); // end DOMContentLoaded
