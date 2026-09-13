function setGalleryImage(src, caption, btn) {
  var img = document.getElementById('galleryMainImg');
  var cap = document.getElementById('galleryCaption');
  if (img) img.src = src;
  if (cap) cap.textContent = caption;
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
});
