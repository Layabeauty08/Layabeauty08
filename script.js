// script.js

let isAnimating = false;

document.addEventListener("DOMContentLoaded", () => {
  // 1. Dropdown accesible
  const dropdownToggle = document.getElementById("dropdown-toggle");
  const dropdownMenu   = document.getElementById("dropdown-menu");
  if (dropdownToggle && dropdownMenu) {
    dropdownToggle.setAttribute("aria-expanded", "false");
    dropdownToggle.setAttribute("aria-controls", "dropdown-menu");
    dropdownToggle.addEventListener("click", e => {
      e.stopPropagation();
      const open = dropdownMenu.classList.toggle("show");
      dropdownToggle.setAttribute("aria-expanded", String(open));
    });
    document.addEventListener("click", e => {
      if (!dropdownToggle.parentElement.contains(e.target)) {
        dropdownMenu.classList.remove("show");
        dropdownToggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  // 2. Scroll Reveal
  const revealElems = document.querySelectorAll(".reveal, .reveal-testimonios");
  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });
  revealElems.forEach(el => observer.observe(el));

  // 3. Intro Screen (solo la primera vez)
  const introScreen   = document.querySelector(".intro-screen");
  const hiddenContent = document.querySelector(".hidden-content");
  const logo          = document.querySelector("img.intro-logo");
  const loadingBar    = document.querySelector(".loading-bar");

  function showContent() {
    introScreen.classList.add("fade-out");
    setTimeout(() => {
      introScreen.style.display = "none";
      hiddenContent.classList.add("visible");
      document.body.style.overflow = "auto";
      sessionStorage.setItem("introShown", "true");
    }, 1000);
  }

  if (!sessionStorage.getItem("introShown")) {
    logo.addEventListener("animationend", () => {
      loadingBar.classList.add("animate");
      setTimeout(showContent, 600);
    });
  } else {
    // Si ya lo vio, salta directo
    introScreen.style.display = "none";
    hiddenContent.classList.add("visible");
    document.body.style.overflow = "auto";
  }
});

// 4. Toggle de productos con entrada y salida
function toggleProductos(categoriaId) {
  if (isAnimating) return;
  isAnimating = true;

  const secciones = document.querySelectorAll(".productos");
  secciones.forEach(sec => {
    if (sec.id === categoriaId) {
      // Mostrar nueva sección
      sec.classList.remove("salida");
      sec.classList.add("activo");
    } else if (sec.classList.contains("activo")) {
      // Ocultar sección activa anterior
      sec.classList.remove("activo");
      sec.classList.add("salida");
      // Al finalizar la animación de salida, quitar la clase
      setTimeout(() => {
        sec.classList.remove("salida");
      }, 1000); // coincide con fadeOut de 1s en CSS
    }
  });

  // Marcar botón activo
  document.querySelectorAll(".categorias button").forEach(btn => {
    btn.classList.toggle("activo", btn.getAttribute("onclick").includes(categoriaId));
  });

  // Permitir nueva animación tras completar
  setTimeout(() => { isAnimating = false; }, 1000);
}
