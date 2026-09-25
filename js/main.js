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
});
