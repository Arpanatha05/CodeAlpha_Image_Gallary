let images = [];
let selectedImageIndex = null;
const gallery = document.getElementById('gallery');
const contextMenu = document.getElementById('contextMenu');

function uploadImage() {
  const input = document.getElementById('imageInput');
  const category = document.getElementById('categoryInput').value.trim();

  if (!input.files.length || !category) {
    alert("Select an image and enter category");
    return;
  }

  const file = input.files[0];
  const reader = new FileReader();

  reader.onload = function(e) {
    images.push({
      src: e.target.result,
      category: category,
      date: new Date()
    });
    displayImages(images);
    input.value = '';
    document.getElementById('categoryInput').value = '';
  };

  reader.readAsDataURL(file);
}

function displayImages(imgArray) {
  gallery.innerHTML = '';
  imgArray.forEach((img, index) => {
    const card = document.createElement('div');
    card.className = 'image-card';
    card.innerHTML = `
      <img src="${img.src}" alt="Image">
      <div class="image-info">
        <strong>${img.category}</strong><br>
        ${img.date.toLocaleDateString()}
      </div>
    `;

    card.addEventListener('click', (e) => {
      selectedImageIndex = index;
      showContextMenu(e);
    });

    gallery.appendChild(card);
  });
}

function sortByDate() {
  const sorted = [...images].sort((a, b) => b.date - a.date);
  displayImages(sorted);
}

// Context Menu Handling
function showContextMenu(e) {
  e.preventDefault();
  const menu = contextMenu;
  menu.style.top = e.clientY + 'px';
  menu.style.left = e.clientX + 'px';
  menu.style.display = 'flex';
}

function closeContextMenu() {
  contextMenu.style.display = 'none';
}

// Menu Actions
function cutImage() {
  if (selectedImageIndex !== null) {
    images.splice(selectedImageIndex, 1);
    displayImages(images);
    closeContextMenu();
  }
}

function cropImage() {
  alert("🧪 Crop tool coming soon!");
  closeContextMenu();
}

function editImage() {
  alert("🖊️ Edit function placeholder (can add filters, rotate, etc.)");
  closeContextMenu();
}

function sendImage() {
  alert("📤 Image sent successfully!");
  closeContextMenu();
}

// Hide menu if clicked outside
window.addEventListener('click', () => closeContextMenu());
window.addEventListener('scroll', () => closeContextMenu());
