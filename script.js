// ==============================================
// 1. Lógica del Carrusel (Slider)
// ==============================================

let currentSlide = 0; // Variable para rastrear la diapositiva actual

// Función para mover el carrusel en una dirección (1: siguiente, -1: anterior)
function moveSlide(direction) {
    const slides = document.querySelectorAll('.slide'); // Obtener todas las diapositivas
    const totalSlides = slides.length; // Número total de diapositivas

    currentSlide += direction; // Actualizar la diapositiva actual

    // Reiniciar el carrusel si se llega al final o al inicio
    if (currentSlide >= totalSlides) {
        currentSlide = 0;
    } else if (currentSlide < 0) {
        currentSlide = totalSlides - 1;
    }

    // Calcular el desplazamiento y mover el carrusel
    const offset = -currentSlide * 100;
    document.querySelector('.carousel-track').style.transform = `translateX(${offset}%)`;

    // Actualizar los indicadores de la diapositiva actual
    updateIndicators();
}

// Función para actualizar los indicadores del carrusel
function updateIndicators() {
    const indicators = document.querySelectorAll('.indicator'); // Obtener todos los indicadores
    indicators.forEach((indicator, index) => {
        // Marcar el indicador activo según la diapositiva actual
        if (index === currentSlide) {
            indicator.classList.add('active');
        } else {
            indicator.classList.remove('active');
        }
    });
}

// Inicializar el carrusel cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    // Botones de anterior y siguiente
    document.querySelector('.prev').addEventListener('click', () => moveSlide(-1));
    document.querySelector('.next').addEventListener('click', () => moveSlide(1));

    // Indicadores del carrusel
    const indicators = document.querySelectorAll('.indicator');
    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => {
            currentSlide = index; // Ir a la diapositiva correspondiente
            moveSlide(0); // Mover el carrusel sin cambiar la dirección
        });
    });

    // Cambiar automáticamente las diapositivas cada 5 segundos
    setInterval(() => moveSlide(1), 5000);
});

// ==============================================
// 2. Lógica del Menú Desplegable (Dropdown)
// ==============================================
document.addEventListener('DOMContentLoaded', () => {
    const dropdowns = document.querySelectorAll('.dropdown');

    dropdowns.forEach((dropdown) => {
        const dropdownToggle = dropdown.querySelector('.menu-icon');
        const dropdownMenu = dropdown.querySelector('.dropdown-menu');

        dropdownToggle.addEventListener('click', (e) => {
            e.preventDefault();
            dropdown.classList.toggle('active');
            dropdownMenu.setAttribute('aria-expanded', dropdown.classList.contains('active'));
        });

        dropdown.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                dropdown.classList.remove('active');
                dropdownMenu.setAttribute('aria-expanded', 'false');
            }
        });
    });

    document.addEventListener('click', (e) => {
        if (!e.target.closest('.dropdown')) {
            dropdowns.forEach((dropdown) => {
                dropdown.classList.remove('active');
                dropdown.querySelector('.dropdown-menu').setAttribute('aria-expanded', 'false');
            });
        }
    });
});

// ==============================================
// 3. Lógica del Botón de la Galería
// ==============================================

document.querySelector('.gallery-btn').addEventListener('click', () => {
    window.location.href = 'galeria.html'; // Redirigir a la página de la galería
});

// ==============================================
// 4. Lógica del Header Sticky
// ==============================================

window.addEventListener('scroll', () => {
    const header = document.querySelector('header'); // Obtener el header
    if (window.scrollY > 50) {
        header.classList.add('sticky'); // Hacer el header sticky al desplazarse
    } else {
        header.classList.remove('sticky'); // Quitar el sticky al volver al inicio
    }
});

// ==============================================
// 5. Lógica del Contador Animado
// ==============================================
function animarContador() {
    const contadores = document.querySelectorAll('.contador-numero');

    contadores.forEach((contador) => {
        const target = +contador.getAttribute('data-target');
        const duration = 2000; // Duración de la animación en milisegundos
        const startTime = performance.now();

        function animate(currentTime) {
            const elapsedTime = currentTime - startTime;
            const progress = Math.min(elapsedTime / duration, 1);
            contador.textContent = Math.floor(progress * target).toLocaleString();

            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                contador.textContent = target.toLocaleString();
            }
        }

        requestAnimationFrame(animate);
    });
}

const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            animarContador();
            observer.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

observer.observe(document.querySelector('.contador'));
