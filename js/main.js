function setGalleryImage(src, caption, btn) {
  var img = document.getElementById('galleryMainImg');
  var cap = document.getElementById('galleryCaption');
  if (img && img.getAttribute('src') !== src) {
    img.style.opacity = 0;
    setTimeout(function () {
      img.src = src;
      img.alt = caption;
      if (cap) cap.textContent = caption;
      img.style.opacity = 1;
    }, 250);
  }
  document.querySelectorAll('.showcase-thumb').forEach(function (t) {
    t.classList.remove('active');
  });
  if (btn) btn.classList.add('active');
}

document.addEventListener('DOMContentLoaded', function () {
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.querySelector('header nav');

  if (toggle && nav) {
    nav.hidden = window.innerWidth <= 768;
    toggle.addEventListener('click', function () {
      nav.hidden = !nav.hidden;
    });

    nav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        if (window.innerWidth <= 768) nav.hidden = true;
      });
    });
  }

  // Gallery autoplay: advance every 5s, pause on hover, restart timer on manual click
  var showcaseParts = document.querySelectorAll('.showcase-main, .showcase-thumbs');
  var thumbs = document.querySelectorAll('.showcase-thumb');
  if (showcaseParts.length && thumbs.length > 1) {
    var isHovered = function () {
      return Array.prototype.some.call(showcaseParts, function (el) { return el.matches(':hover'); });
    };
    var timer = null;
    var next = function () {
      var current = Array.prototype.indexOf.call(thumbs, document.querySelector('.showcase-thumb.active'));
      thumbs[(current + 1) % thumbs.length].click();
    };
    var start = function () { stop(); timer = setInterval(next, 5000); };
    var stop = function () { if (timer) clearInterval(timer); timer = null; };

    showcaseParts.forEach(function (el) {
      el.addEventListener('mouseenter', stop);
      el.addEventListener('mouseleave', function () { if (!isHovered()) start(); });
    });
    thumbs.forEach(function (t) {
      t.addEventListener('click', function (e) { if (e.isTrusted && !isHovered()) start(); });
    });
    start();
  }

  // Admission enquiry form: submitted via our own /api/send-admission function,
  // which sends the enquiry through Resend to rootadmin@wwistrichy.com.
  var admissionForm = document.getElementById('admissionForm');
  if (admissionForm) {
    var statusEl = document.getElementById('admissionStatus');
    var submitBtn = document.getElementById('admissionSubmitBtn');
    var ADMISSION_ENDPOINT = '/api/send-admission';

    function isValidEmail(value) {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    }
    function isValidPhone(value) {
      var digits = String(value).replace(/\D/g, '');
      return digits.length >= 7 && digits.length <= 15;
    }
    function showSuccess() {
      admissionForm.reset();
      admissionForm.querySelectorAll('fieldset').forEach(function (fs) { fs.hidden = true; });
      submitBtn.hidden = true;
      statusEl.textContent = "Thank you — we've received your enquiry. Our admissions team will contact you shortly.";
      statusEl.className = 'enquiry-status success';
      statusEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    admissionForm.addEventListener('submit', function (e) {
      e.preventDefault();

      if (!admissionForm.reportValidity()) return;

      var formData = new FormData(admissionForm);

      // Honeypot: real visitors never fill this hidden field. Pretend success so bots
      // don't learn to look for a different signal, but skip sending anything.
      if ((formData.get('_honey') || '').toString().trim()) {
        showSuccess();
        return;
      }

      var raw = {};
      formData.forEach(function (value, key) {
        if (key === '_honey') return;
        if (raw.hasOwnProperty(key)) {
          raw[key] = Array.isArray(raw[key]) ? raw[key].concat(value) : [raw[key], value];
        } else {
          raw[key] = value;
        }
      });

      var email = (raw.email || '').toString().trim();
      var contactNumber = (raw.contactNumber || '').toString().trim();
      if (!isValidEmail(email)) {
        statusEl.textContent = 'Please provide a valid email address.';
        statusEl.className = 'enquiry-status error';
        return;
      }
      if (!isValidPhone(contactNumber)) {
        statusEl.textContent = 'Please provide a valid contact number.';
        statusEl.className = 'enquiry-status error';
        return;
      }

      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending…';
      statusEl.textContent = '';
      statusEl.className = 'enquiry-status';

      fetch(ADMISSION_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(raw)
      })
        .then(function (res) { return res.json().then(function (data) { return { ok: res.ok, data: data }; }); })
        .then(function (result) {
          if (result.ok && result.data && result.data.ok) {
            showSuccess();
          } else {
            throw new Error((result.data && result.data.error) || 'Request failed');
          }
        })
        .catch(function (err) {
          statusEl.textContent = (err && err.message) || 'Something went wrong sending your enquiry. Please try again.';
          statusEl.className = 'enquiry-status error';
          submitBtn.disabled = false;
          submitBtn.textContent = 'Submit Enquiry';
        });
    });
  }
});
