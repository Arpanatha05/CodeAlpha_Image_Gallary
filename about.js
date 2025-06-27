
    window.addEventListener('scroll', () => {
      document.querySelectorAll('section').forEach(section => {
        const top = section.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;
        if (top < windowHeight - 100) {
          section.classList.add('visible');
        }
      });
    });
