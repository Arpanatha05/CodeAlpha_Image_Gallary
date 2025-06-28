 //this is main js part of ig web page
  const fileInput = document.getElementById('fileInput');
  const gallery = document.getElementById('gallery');
  const modal = document.getElementById('modal');
  const modalImage = document.getElementById('modalImage');
  const shareOptions = document.getElementById('shareOptions');
  let showFavourites = false;
  let currentIndex = 0;
  let images = [];
  let editCanvas = document.getElementById('editCanvas');
  let editCtx = editCanvas.getContext('2d');
  let editImage = null;
  let editBrightness = 0;



  window.onload = () => {
    const saved = localStorage.getItem("galleryImages");
    if (saved) {
      images = JSON.parse(saved);
      renderGallery();
    }
  };

  function addToGallery() {
    const files = fileInput.files;
    if (!files.length) {
      alert("Please choose image files.");
      return;
    }

    Array.from(files).forEach(file => {
      const reader = new FileReader();
      reader.onload = function (e) {
        compressImage(e.target.result, (compressed) => {
          const imageData = {
            src: compressed,
            date: new Date().toISOString()
          };
          images.push(imageData);
          saveImages();
          renderGallery();
        });
      };
      reader.readAsDataURL(file);
    });

    fileInput.value = '';
  }

  function compressImage(src, callback) {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const maxW = 800;
      const scale = maxW / img.width;
      canvas.width = maxW;
      canvas.height = img.height * scale;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      const compressed = canvas.toDataURL('image/jpeg', 0.7);
      callback(compressed);
    };
    img.src = src;
  }
function renderGallery() {
  gallery.innerHTML = '';
  let filteredImages = showFavourites ? images.filter(img => img.favourite) : images;

  let i = 0;
  const chunk = 10;

  function renderChunk() {
    for (let j = 0; j < chunk && i < filteredImages.length; j++, i++) {
      const img = filteredImages[i];
      const actualIndex = images.indexOf(img);
      const imgElement = document.createElement('div');
      imgElement.classList.add('gallery-item');
      imgElement.innerHTML = `
        <img src="${img.src}" loading="lazy" alt="Gallery Image" onclick="openModal(${actualIndex})">
        <button class="delete-btn" onclick="deleteImage(${actualIndex})">Delete</button>
        <button class="favourite-btn" onclick="toggleFavourite(${actualIndex})">
          ${img.favourite ? '❤️' : '🤍'}
        </button>
      `;
      gallery.appendChild(imgElement);
    }
    if (i < filteredImages.length) {
      requestAnimationFrame(renderChunk);
    }
  }

  requestAnimationFrame(renderChunk);
}

  

  function deleteImage(index) {
    images.splice(index, 1);
    saveImages();
    renderGallery();
    closeModal();
  }

  function sortByDate() {
    images.sort((a, b) => new Date(b.date) - new Date(a.date));
    saveImages();
    renderGallery();
  }

  function saveImages() {
    localStorage.setItem("galleryImages", JSON.stringify(images));
  }
  function toggleFavourite(index) {
  images[index].favourite = !images[index].favourite;
  saveImages();
  renderGallery();
}

function toggleShowFavourites() {
  showFavourites = !showFavourites;
  document.getElementById("favouriteToggleBtn").innerText = showFavourites ? "Show All" : "Show Favourites";
  renderGallery();
}


  function openModal(index) {
    currentIndex = index;
    modalImage.src = images[currentIndex].src;
    modal.style.display = 'flex';
    shareOptions.classList.remove('active');
  }

  function closeModal() {
    modal.style.display = 'none';
  }

  function prevImage() {
    currentIndex = (currentIndex - 1 + images.length) % images.length;
    modalImage.src = images[currentIndex].src;
    shareOptions.classList.remove('active');
  }

  function nextImage() {
    currentIndex = (currentIndex + 1) % images.length;
    modalImage.src = images[currentIndex].src;
    shareOptions.classList.remove('active');
  }

  function toggleShareOptions() {
    shareOptions.classList.toggle('active');
    if (shareOptions.classList.contains('active')) {
      const url = encodeURIComponent(images[currentIndex].src);
      shareOptions.innerHTML = `
        <a href="https://wa.me/?text=${url}" class="whatsapp" target="_blank"><i class="fab fa-whatsapp"></i></a>
<a href="https://twitter.com/intent/tweet?url=${url}" class="twitter" target="_blank"><i class="fab fa-twitter"></i></a>
<a href="https://www.facebook.com/sharer/sharer.php?u=${url}" class="facebook" target="_blank"><i class="fab fa-facebook-f"></i></a>
  <a href="https://www.linkedin.com/shareArticle?mini=true&url=${url}" class="linkedin" target="_blank"><i class="fab fa-linkedin-in"></i></a>
  <a href="https://www.instagram.com/" class="instagram" target="_blank"><i class="fab fa-instagram"></i></a>
<a href="${images[currentIndex].src}" class="download" download="image.jpg"><i class="fas fa-download"></i></a>

      `;
    } else {
      shareOptions.innerHTML = '';
    }
  }


     const menuButton = document.getElementById("menuButton");
  const menuItems = document.getElementById("menuItems");
  const contents = {
    home: document.getElementById("contentHome"),
    about: document.getElementById("contentAbout"),
    contact: document.getElementById("contentContact")
  };

  let isMenuOpen = false;

  menuButton.addEventListener("click", () => {
    isMenuOpen = !isMenuOpen;
    menuItems.style.display = isMenuOpen ? "flex" : "none";
  });

  function showPage(page) {
    
    Object.values(contents).forEach(div => div.classList.remove("active"));
    
    contents[page].classList.add("active");

    menuItems.style.display = "none";
    isMenuOpen = false;
  }

 
  showPage('home');
//this is for redirect one page to another
      function goToaNewPage() {
      window.location.href = "sign.html";
    }
      function goToNewPage() {
      window.location.href = "index.html";
    }


 
//this is toggle fun of hamburger
  function toggleMenu() {
    const nav = document.getElementById('navLinks');
    nav.classList.toggle('active');
  }
  
  function toggleMenu() {
  const hamburger = document.querySelector('.hamburger');
  const navMenu = document.getElementById('navLinks');

  hamburger.classList.toggle('active');
  navMenu.classList.toggle('active');
}


// this is edit area for the webpage


function openCustomEditor(index) {
  editImage = new Image();
  editImage.onload = function() {
    const maxWidth = window.innerWidth * 0.8;
    const maxHeight = window.innerHeight * 0.8;
    let width = editImage.width;
    let height = editImage.height;
    const aspect = width / height;

    if (width > maxWidth) {
      width = maxWidth;
      height = width / aspect;
    }
    if (height > maxHeight) {
      height = maxHeight;
      width = height * aspect;
    }

    editCanvas.width = width;
    editCanvas.height = height;
    editCtx.drawImage(editImage, 0, 0, width, height);

    document.getElementById('customEditorModal').style.display = 'block';
  }
  editImage.src = images[index].src;
}

function rotateImage() {
  const tempCanvas = document.createElement('canvas');
  const tempCtx = tempCanvas.getContext('2d');
  tempCanvas.width = editCanvas.width;
  tempCanvas.height = editCanvas.height;
  tempCtx.drawImage(editCanvas, 0, 0);

  editCtx.clearRect(0, 0, editCanvas.width, editCanvas.height);
  editCtx.save();
  editCtx.translate(editCanvas.width / 2, editCanvas.height / 2);
  editCtx.rotate(Math.PI / 2);

  editCtx.drawImage(tempCanvas, -editCanvas.height / 2, -editCanvas.width / 2, editCanvas.height, editCanvas.width);

  editCtx.restore();
}


function applyGrayScale() {
  const imageData = editCtx.getImageData(0, 0, editCanvas.width, editCanvas.height);
  const data = imageData.data;
  for (let i = 0; i < data.length; i += 4) {
    const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
    data[i] = data[i + 1] = data[i + 2] = avg;
  }
  editCtx.putImageData(imageData, 0, 0);
}

function adjustBrightness(amount) {
  const imageData = editCtx.getImageData(0, 0, editCanvas.width, editCanvas.height);
  const data = imageData.data;
  for (let i = 0; i < data.length; i += 4) {
    data[i] += amount;
    data[i + 1] += amount;
    data[i + 2] += amount;
  }
  editCtx.putImageData(imageData, 0, 0);
}



function resetImage() {
  editCtx.clearRect(0, 0, editCanvas.width, editCanvas.height);
  editCtx.drawImage(editImage, 0, 0);
}

function saveEditedImage() {
  const dataURL = editCanvas.toDataURL();
  images[currentIndex].src = dataURL;
  saveImages();
  renderGallery();
  closeCustomEditor();
}

function closeCustomEditor() {
  document.getElementById('customEditorModal').style.display = 'none';
}






