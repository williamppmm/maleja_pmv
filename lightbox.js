/**
 * LIGHTBOX OPTIMIZADO PARA REVEAL.JS
 * Evita conflictos con navegación de presentación
 */

class OptimizedLightbox {
  constructor() {
    this.isOpen = false;
    this.currentImage = null;
    this.overlay = null;
    
    this.init();
  }

  init() {
    // Crear overlay una sola vez
    this.createOverlay();
    
    // Agregar event listeners
    this.addEventListeners();
    
    // Prevenir conflictos con Reveal.js
    this.setupRevealIntegration();
  }

  createOverlay() {
    this.overlay = document.createElement('div');
    this.overlay.className = 'lightbox-overlay';
    this.overlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background: rgba(0, 0, 0, 0.9);
      z-index: 9999;
      display: none;
      justify-content: center;
      align-items: center;
      backdrop-filter: blur(5px);
    `;

    // Contenedor de imagen
    const imageContainer = document.createElement('div');
    imageContainer.style.cssText = `
      position: relative;
      max-width: 90vw;
      max-height: 90vh;
      display: flex;
      flex-direction: column;
      align-items: center;
    `;

    // Imagen principal
    const img = document.createElement('img');
    img.className = 'lightbox-image';
    img.style.cssText = `
      max-width: 100%;
      max-height: 85vh;
      object-fit: contain;
      border-radius: 8px;
      box-shadow: 0 10px 30px rgba(0,0,0,0.5);
    `;

    // Caption
    const caption = document.createElement('div');
    caption.className = 'lightbox-caption';
    caption.style.cssText = `
      color: white;
      text-align: center;
      margin-top: 1rem;
      padding: 0 2rem;
      font-size: 1rem;
      line-height: 1.4;
      max-width: 800px;
    `;

    // Botón cerrar
    const closeBtn = document.createElement('button');
    closeBtn.innerHTML = '×';
    closeBtn.style.cssText = `
      position: absolute;
      top: 20px;
      right: 20px;
      background: rgba(255,255,255,0.2);
      border: none;
      color: white;
      font-size: 2rem;
      width: 40px;
      height: 40px;
      border-radius: 50%;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: background 0.3s ease;
    `;

    closeBtn.addEventListener('mouseenter', () => {
      closeBtn.style.background = 'rgba(255,255,255,0.3)';
    });

    closeBtn.addEventListener('mouseleave', () => {
      closeBtn.style.background = 'rgba(255,255,255,0.2)';
    });

    // Ensamblar
    imageContainer.appendChild(img);
    imageContainer.appendChild(caption);
    this.overlay.appendChild(imageContainer);
    this.overlay.appendChild(closeBtn);
    document.body.appendChild(this.overlay);

    // Event listeners para cerrar
    closeBtn.addEventListener('click', () => this.close());
    this.overlay.addEventListener('click', (e) => {
      if (e.target === this.overlay) this.close();
    });
  }

  addEventListeners() {
    // Delegar eventos para imágenes con clase 'zoomable'
    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('zoomable')) {
        e.preventDefault();
        e.stopPropagation(); // Evitar que Reveal.js capture el click
        this.open(e.target);
      }
    });

    // Tecla ESC para cerrar
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isOpen) {
        e.preventDefault();
        e.stopPropagation();
        this.close();
      }
    });
  }

  setupRevealIntegration() {
    // Pausar Reveal.js cuando lightbox esté abierto
    document.addEventListener('keydown', (e) => {
      if (this.isOpen) {
        // Bloquear navegación de Reveal.js cuando lightbox está abierto
        if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Space'].includes(e.code)) {
          e.preventDefault();
          e.stopPropagation();
        }
      }
    }, true); // Captura en fase de captura
  }

  open(imgElement) {
    if (this.isOpen) return;

    this.isOpen = true;
    this.currentImage = imgElement;

    // Actualizar imagen en lightbox
    const lightboxImg = this.overlay.querySelector('.lightbox-image');
    const lightboxCaption = this.overlay.querySelector('.lightbox-caption');

    lightboxImg.src = imgElement.src;
    lightboxImg.alt = imgElement.alt;

    // Usar data-caption si existe, sino usar alt
    const captionText = imgElement.getAttribute('data-caption') || imgElement.alt;
    lightboxCaption.textContent = captionText;

    // Mostrar overlay con animación
    this.overlay.style.display = 'flex';
    this.overlay.style.opacity = '0';
    
    requestAnimationFrame(() => {
      this.overlay.style.transition = 'opacity 0.3s ease';
      this.overlay.style.opacity = '1';
    });

    // Prevenir scroll del body
    document.body.style.overflow = 'hidden';

    // Notificar a Reveal.js que pause la presentación
    if (window.Reveal) {
      window.Reveal.configure({ keyboard: false });
    }
  }

  close() {
    if (!this.isOpen) return;

    this.isOpen = false;

    // Animar salida
    this.overlay.style.transition = 'opacity 0.3s ease';
    this.overlay.style.opacity = '0';

    setTimeout(() => {
      this.overlay.style.display = 'none';
      
      // Restaurar scroll del body
      document.body.style.overflow = '';

      // Reactivar Reveal.js
      if (window.Reveal) {
        window.Reveal.configure({ keyboard: true });
      }
    }, 300);
  }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
  new OptimizedLightbox();
});

// También inicializar si Reveal.js ya está cargado
if (window.Reveal) {
  Reveal.addEventListener('ready', () => {
    if (!window.lightboxInstance) {
      window.lightboxInstance = new OptimizedLightbox();
    }
  });
}