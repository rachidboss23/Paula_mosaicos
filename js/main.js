/* Paula Guerra Chamorro – comportamiento mínimo (sustituye al JS de WordPress/Astra) */
(function () {
  var body = document.body;
  var BREAK = 921;

  // Modo móvil / escritorio (igual que el tema original)
  function setMode() {
    var mobile = document.documentElement.clientWidth <= BREAK;
    body.classList.toggle('ast-header-break-point', mobile);
    body.classList.toggle('ast-desktop', !mobile);
    if (!mobile) {
      body.classList.remove('ast-main-header-nav-open');
      document.querySelectorAll('.menu-toggle').forEach(function (b) {
        b.classList.remove('toggled'); b.setAttribute('aria-expanded', 'false');
      });
    }
  }
  setMode();
  window.addEventListener('resize', setMode);

  // Menú hamburguesa
  document.querySelectorAll('.menu-toggle').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var open = !body.classList.contains('ast-main-header-nav-open');
      body.classList.toggle('ast-main-header-nav-open', open);
      btn.classList.toggle('toggled', open);
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  });

  // Botón flotante de WhatsApp
  var wa = document.getElementById('ht-ctc-chat');
  if (wa) {
    wa.style.display = 'block';
    wa.style.cursor = 'pointer';
    wa.addEventListener('click', function () {
      window.open('https://wa.me/34628044032', '_blank', 'noopener');
    });
  }

  // Animaciones de entrada (sustituye a AOS)
  var aos = document.querySelectorAll('[data-aos]');
  if (aos.length) {
    if (!('IntersectionObserver' in window)) {
      aos.forEach(function (e) { e.classList.add('aos-animate'); });
    } else {
      var ao = new IntersectionObserver(function (es) {
        es.forEach(function (e) {
          if (e.isIntersecting) {
            e.target.classList.add('aos-animate');
            if (e.target.getAttribute('data-aos-once') === 'true') ao.unobserve(e.target);
          } else if (e.target.getAttribute('data-aos-once') !== 'true') {
            e.target.classList.remove('aos-animate');
          }
        });
      }, { threshold: 0.1 });
      aos.forEach(function (e) { ao.observe(e); });
    }
  }

  // Aparición suave de las cards de publicaciones
  var cards = document.querySelectorAll('.pub-card');
  if ('IntersectionObserver' in window && cards.length) {
    document.documentElement.classList.add('js-reveal');
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { threshold: 0.12 });
    cards.forEach(function (c, i) { c.style.transitionDelay = (i % 3) * 90 + 'ms'; io.observe(c); });
  }
})();
