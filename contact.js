
    const form = document.getElementById("contactForm");
    const successMsg = document.getElementById("successMsg");

    form.addEventListener("submit", function(e) {
      e.preventDefault();
      const name = document.getElementById("name").value.trim();
      const email = document.getElementById("email").value.trim();
      const message = document.getElementById("message").value.trim();

      if (name && email && message) {
        successMsg.style.display = "block";
        form.reset();
        setTimeout(() => {
          successMsg.style.display = "none";
        }, 4000);
      }
    });
  