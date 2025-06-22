const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const images = document.querySelectorAll('.gallery img');
const filterButtons = document.querySelectorAll('.filter-buttons button');

let currentIndex = 0;

// Open Lightbox
images.forEach((img, index) => {
  img.addEventListener('click', () => {
    lightbox.classList.add('show');
    lightboxImg.src = img.src;
    currentIndex = index;
  });
});

// Close Lightbox
function closeLightbox() {
  lightbox.classList.remove('show');
}

// Navigate
function navigate(dir) {
  currentIndex = (currentIndex + dir + images.length) % images.length;
  lightboxImg.src = images[currentIndex].src;
}

// Keyboard navigation
document.addEventListener('keydown', (e) => {
  if (!lightbox.classList.contains('show')) return;
  if (e.key === 'ArrowRight') navigate(1);
  if (e.key === 'ArrowLeft') navigate(-1);
  if (e.key === 'Escape') closeLightbox();
});

// Filtering
function filterImages(category) {
  document.querySelectorAll('.image-card').forEach(card => {
    card.style.display =
      category === 'all' || card.classList.contains(category)
        ? 'block'
        : 'none';
  });

  // Update active button
  filterButtons.forEach(btn => btn.classList.remove('active'));
  [...filterButtons].find(b => b.innerText.toLowerCase() === category).classList.add('active');
}
