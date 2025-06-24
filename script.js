 
  const fileInput = document.getElementById('fileInput');
  const gallery = document.getElementById('gallery');
  const modal = document.getElementById('modal');
  const modalImage = document.getElementById('modalImage');
  const shareOptions = document.getElementById('shareOptions');

  let currentIndex = 0;
  let images = [];

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
    let i = 0;
    const chunk = 10;

    function renderChunk() {
      for (let j = 0; j < chunk && i < images.length; j++, i++) {
        const img = images[i];
        const imgElement = document.createElement('div');
        imgElement.classList.add('gallery-item');
        imgElement.innerHTML = `
          <img src="${img.src}" loading="lazy" alt="Gallery Image" onclick="openModal(${i})">
          <button class="delete-btn" onclick="deleteImage(${i})">Delete</button>
        `;
        gallery.appendChild(imgElement);
      }
      if (i < images.length) {
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
        <a href="https://wa.me/?text=${url}" target="_blank">WhatsApp</a>
        <a href="https://www.facebook.com/sharer/sharer.php?u=${url}" target="_blank">Facebook</a>
        <a href="https://twitter.com/intent/tweet?url=${url}" target="_blank">Twitter</a>
        <a href="${images[currentIndex].src}" download="image.jpg">Download</a>
      `;
    } else {
      shareOptions.innerHTML = '';
    }
  }


       function goToNewPage() {
      // Redirect to another HTML file in the same folder
      window.location.href = "sign.html";
    }