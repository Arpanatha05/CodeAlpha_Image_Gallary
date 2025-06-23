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
    }

    function addToGallery() {
      const file = fileInput.files[0];
      if (!file) {
        alert("Please choose an image file.");
        return;
      }

      const reader = new FileReader();
      reader.onload = function (e) {
        const imageData = {
          src: e.target.result,
          date: new Date().toISOString()
        };
        images.push(imageData);
        saveImages();
        renderGallery();
        fileInput.value = '';
      };
      reader.readAsDataURL(file);
    }

    function renderGallery() {
      gallery.innerHTML = '';
      images.forEach((img, index) => {
        const imgElement = document.createElement('div');
        imgElement.classList.add('gallery-item');
        imgElement.innerHTML = `
          <img src="${img.src}" alt="Gallery Image" onclick="openModal(${index})">
          <button class="delete-btn" onclick="deleteImage(${index})">Delete</button>
        `;
        gallery.appendChild(imgElement);
      });
    }

    function deleteImage(index) {
      images.splice(index, 1);
      saveImages();
      renderGallery();
      closeModal();
    }

    // function sortByDate() {
    //   images.sort((a, b) => new Date(a.date) - new Date(b.date));
    //   renderGallery();
    // }
    function sortByDate() {
  images.sort((a, b) => new Date(b.date) - new Date(a.date)); // Sort newest to oldest
  saveImages(); // Save sorted order
  renderGallery(); // Refresh the gallery
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
          <a href="${url}" download>Download</a>
        `;
      } else {
        shareOptions.innerHTML = '';
      }
    }
  