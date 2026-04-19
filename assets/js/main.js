/* ============================================================
   AMR CONSTRUCTIONS — MAIN JAVASCRIPT
   ============================================================ */
/* NOTE: Loader is handled by an inline <script> in index.html */

/* ── Navbar: solid background on scroll ─────────────────────── */
var navbar  = document.getElementById('navbar');
var backTop = document.getElementById('back-top');

function onScroll() {
  var y = window.scrollY || window.pageYOffset;
  if (navbar)  navbar.classList.toggle('scrolled', y > 1);
  if (backTop) backTop.classList.toggle('visible', y > 400);
  updateActiveNavLink();
}

window.addEventListener('scroll', onScroll, { passive: true });

if (backTop) {
  backTop.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}


/* ── Mobile Nav ─────────────────────────────────────────────── */
var hamburger = document.getElementById('hamburger');
var mobileNav = document.getElementById('mobile-nav');
var menuClose = document.getElementById('menu-close');

function closeMenu() {
  hamburger.classList.remove('active');
  mobileNav.classList.remove('open');
  document.body.style.overflow = '';
}

if (hamburger && mobileNav) {
  hamburger.addEventListener('click', function () {
    hamburger.classList.toggle('active');
    mobileNav.classList.toggle('open');
    document.body.style.overflow = mobileNav.classList.contains('open') ? 'hidden' : '';
  });

  if (menuClose) {
    menuClose.addEventListener('click', closeMenu);
  }

  mobileNav.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', function() {
      // Small delay allows the browser to process the anchor link navigation 
      // before closeMenu makes the container non-interactive (pointer-events: none)
      setTimeout(closeMenu, 150);
    });
  });
}


/* ── Hero Slideshow ─────────────────────────────────────────── */
var slides       = Array.from(document.querySelectorAll('.hero-slide'));
var dots         = Array.from(document.querySelectorAll('.hero-dot'));
var currentSlide = 0;
var slideTimer;

function goToSlide(n) {
  if (!slides.length) return;
  slides[currentSlide].classList.remove('active');
  if (dots[currentSlide]) dots[currentSlide].classList.remove('active');
  currentSlide = (n + slides.length) % slides.length;
  slides[currentSlide].classList.add('active');
  if (dots[currentSlide]) dots[currentSlide].classList.add('active');
}

function startSlideShow() {
  clearInterval(slideTimer);
  slideTimer = setInterval(function () { goToSlide(currentSlide + 1); }, 5000);
}

dots.forEach(function (dot, i) {
  dot.addEventListener('click', function () {
    clearInterval(slideTimer);
    goToSlide(i);
    startSlideShow();
  });
});

if (slides.length) {
  goToSlide(0);
  setTimeout(startSlideShow, 3300); // start after loader finishes
}


/* ── Scroll Reveal ──────────────────────────────────────────── */
var revealEls = Array.from(document.querySelectorAll('.reveal'));

if ('IntersectionObserver' in window) {
  var revealObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        revealObserver.unobserve(e.target);
      }
    });
  }, { threshold: 0.10 });

  revealEls.forEach(function (el) { revealObserver.observe(el); });
} else {
  /* Fallback for browsers without IntersectionObserver */
  revealEls.forEach(function (el) { el.classList.add('visible'); });
}


/* ── Counter Animation ──────────────────────────────────────── */
function animateCounter(el, target, suffix, duration) {
  duration = duration || 2000;
  suffix   = suffix   || '';
  var start = performance.now();
  function update(time) {
    var progress = Math.min((time - start) / duration, 1);
    var eased    = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.round(eased * target) + suffix;
    if (progress < 1) requestAnimationFrame(update);
  }
  requestAnimationFrame(update);
}

if ('IntersectionObserver' in window) {
  var counterObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) {
        var el = e.target;
        animateCounter(el, parseInt(el.dataset.target, 10), el.dataset.suffix || '');
        counterObserver.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  // Delay observation until loader finishes (~3s) plus a small buffer
  setTimeout(function() {
    document.querySelectorAll('[data-target]').forEach(function (el) {
      counterObserver.observe(el);
    });
  }, 3500);
}


/* ── Project Filter Tabs ─────────────────────────────────────── */
var filterTabs   = Array.from(document.querySelectorAll('.filter-tab'));
var projectCards = Array.from(document.querySelectorAll('.project-card'));

filterTabs.forEach(function (tab) {
  tab.addEventListener('click', function () {
    filterTabs.forEach(function (t) { t.classList.remove('active'); });
    tab.classList.add('active');

    var filter = tab.dataset.filter;
    projectCards.forEach(function (card) {
      var match = (filter === 'all' || card.dataset.category === filter);
      card.style.transition  = 'opacity 0.35s ease, transform 0.35s ease';
      card.style.opacity     = '0';
      card.style.transform   = 'translateY(16px)';
      card.style.pointerEvents = 'none';

      setTimeout(function () {
        card.style.display = match ? '' : 'none';
        if (match) {
          requestAnimationFrame(function () {
            card.style.opacity       = '1';
            card.style.transform     = 'translateY(0)';
            card.style.pointerEvents = '';
          });
        }
      }, 320);
    });
  });
});


/* ── Contact Form ────────────────────────────────────────────── */
var contactForm = document.getElementById('contact-form');
if (contactForm) {
  contactForm.addEventListener('submit', function (e) {
    e.preventDefault();
    var btn = contactForm.querySelector('button[type="submit"]');

    // Gather inputs
    var name = document.getElementById('contact-name').value.trim();
    var email = document.getElementById('contact-email').value.trim();
    var phone = document.getElementById('contact-phone').value.trim();
    var service = document.getElementById('contact-service').value.trim();
    var message = document.getElementById('contact-message').value.trim();

    // Basic Validation
    if (!name || !phone || !service || !message) {
      alert("Please fill in your Name, Phone Number, Service, and Project Details.");
      return;
    }

    btn.disabled = true;
    btn.innerHTML = '<span style="display:inline-block;animation:spin 1s linear infinite">&#9881;</span> Connecting...';

    // Build Native WhatsApp Message
    var waNumber = '918008863695';
    var text = "Hi AMR Constructions! I'm interested in working with you.\n\n";
    text += "*Name:* " + name + "\n";
    if (email) text += "*Email:* " + email + "\n";
    text += "*Phone:* " + phone + "\n";
    text += "*Required Service:* " + service + "\n";
    text += "\n*Project Details:*\n" + message;

    var waURL = "https://wa.me/" + waNumber + "?text=" + encodeURIComponent(text);

    setTimeout(function () {
      btn.innerHTML = '<i class="fa-brands fa-whatsapp"></i> Redirecting to WhatsApp...';
      btn.style.background = 'linear-gradient(135deg, #25D366, #128C7E)';
      btn.style.color = '#fff';

      // Open WhatsApp
      window.open(waURL, '_blank');

      // Reset Form State
      setTimeout(function () {
        btn.disabled = false;
        btn.innerHTML = 'Send Message <i class="fa-solid fa-paper-plane" style="margin-left:8px;font-size:0.85rem"></i>';
        btn.style.background = '';
        btn.style.color = '';
        contactForm.reset();
      }, 3500);
    }, 600);
  });
}


/* ── Active Nav Link: scroll-based ──────────────────────────── */
var navSections = Array.from(document.querySelectorAll('section[id]'));
var navLinkMap  = {};
navSections.forEach(function (sec) {
  // Skip sections that don't have a matching regular nav link
  // (contact is only linked via the CTA button, not a regular nav item)
  var link = document.querySelector('.nav-links a:not(.nav-cta)[href="#' + sec.id + '"]');
  if (link) navLinkMap[sec.id] = link;
});


function updateActiveNavLink() {
  var navH    = navbar ? navbar.offsetHeight : 72;
  var scrollY = (window.scrollY || window.pageYOffset) + navH + 60;

  var currentId = null;
  for (var i = navSections.length - 1; i >= 0; i--) {
    if (navSections[i].offsetTop <= scrollY) {
      currentId = navSections[i].id;
      break;
    }
  }

  Object.keys(navLinkMap).forEach(function (id) {
    var link = navLinkMap[id];
    if (id === currentId) {
      link.classList.add('nav-active');
    } else {
      link.classList.remove('nav-active');
    }
  });

  /* Mobile nav colour sync */
  document.querySelectorAll('.mobile-nav a').forEach(function (a) {
    a.style.color = (a.getAttribute('href') === '#' + currentId) ? 'var(--gold)' : '';
  });
}


/* ── Spin keyframe ───────────────────────────────────────────── */
var styleEl = document.createElement('style');
styleEl.textContent = '@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}';
document.head.appendChild(styleEl);


/* ── Run initial state ───────────────────────────────────────── */
onScroll();           // sets navbar state + active link immediately
