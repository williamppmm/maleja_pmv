/**
 * LIGHTBOX OPTIMIZADO PARA PRESENTACIÓN MALEJA CALZADO
 * Compatible con Reveal.js y diseño visual consistente
 */

class PresentationLightbox {
  constructor() {
    this.isOpen = false;
    this.overlay = null;
    this.isInitialized = false;
    
    this.init();
  }

  init() {
    // Evitar doble inicialización
    if (this.isInitialized) return;
    this.isInitialized = true;

    this.createOverlay();
    this.addEventListeners();
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
      background: rgba(26, 26, 26, 0.96); /* Negro principal */
      z-index: 9999;
      display: none;
      justify-content: center;
      align-items: center;
      backdrop-filter: blur(8px);
      opacity: 0;
      transition: opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    `;

    // Contenedor principal
    const container = document.createElement('div');
    container.className = 'lightbox-container';
    container.style.cssText = `
      position: relative;
      max-width: 90vw;
      max-height: 90vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 2rem;
      border-radius: 12px;
      background: rgba(255, 255, 255, 0.98); /* Fondo blanco casi sólido */
      backdrop-filter: blur(10px);
      box-shadow: 0 20px 40px rgba(212, 170, 58, 0.18); /* Sombra dorada MALEJA */
      border: 2px solid #d4aa3a; /* Borde dorado MALEJA */
    `;

    // Imagen principal
    const img = document.createElement('img');
    img.className = 'lightbox-image';
    img.style.cssText = `
      max-width: 100%;
      max-height: 75vh;
      object-fit: contain;
      border-radius: 8px;
      box-shadow: 0 8px 25px rgba(212, 170, 58, 0.18); /* Sombra dorada MALEJA */
      transition: transform 0.3s ease;
    `;

    // Caption
    const caption = document.createElement('div');
    caption.className = 'lightbox-caption';
    caption.style.cssText = `
      color: #d4aa3a; /* Dorado MALEJA */
      text-align: center;
      margin-top: 1.5rem;
      padding: 0 1rem;
      font-size: 1.1rem;
      font-weight: 500;
      line-height: 1.5;
      max-width: 600px;
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      text-shadow: 0 2px 8px rgba(26,26,26,0.08);
    `;

    // Botón cerrar mejorado
    const closeBtn = document.createElement('button');
    closeBtn.innerHTML = `
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <line x1="18" y1="6" x2="6" y2="18"></line>
        <line x1="6" y1="6" x2="18" y2="18"></line>
      </svg>
    `;
    closeBtn.className = 'lightbox-close';
    closeBtn.style.cssText = `
      position: absolute;
      top: -10px;
      right: -10px;
      background: #25d366; /* Verde WhatsApp */
      border: none;
      color: white;
      width: 40px;
      height: 40px;
      border-radius: 50%;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      box-shadow: 0 4px 12px rgba(37, 211, 102, 0.18); /* Sombra verde */
      z-index: 10001;
      border: 2px solid #d4aa3a; /* Borde dorado */
    `;

    // Hover effects para el botón
    closeBtn.addEventListener('mouseenter', () => {
      closeBtn.style.transform = 'scale(1.1)';
      closeBtn.style.background = '#d4aa3a'; /* Dorado MALEJA */
      closeBtn.style.boxShadow = '0 6px 20px rgba(212, 170, 58, 0.25)';
    });

    closeBtn.addEventListener('mouseleave', () => {
      closeBtn.style.transform = 'scale(1)';
      closeBtn.style.background = '#25d366'; /* Verde WhatsApp */
      closeBtn.style.boxShadow = '0 4px 12px rgba(37, 211, 102, 0.18)';
    });

    // Ensamblar elementos
    container.appendChild(img);
    container.appendChild(caption);
    container.appendChild(closeBtn);
    this.overlay.appendChild(container);
    document.body.appendChild(this.overlay);

    // Event listener para cerrar (solo en el botón)
    closeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      this.close();
    });

    // Cerrar al hacer clic en el overlay (fondo)
    this.overlay.addEventListener('click', (e) => {
      if (e.target === this.overlay) {
        this.close();
      }
    });
  }

  addEventListeners() {
    // Event delegation para imágenes zoomables
    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('zoomable') && !this.isOpen) {
        e.preventDefault();
        e.stopPropagation();
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

    // Prevenir navegación de Reveal.js cuando lightbox está abierto
    document.addEventListener('keydown', (e) => {
      if (this.isOpen && ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Space', 'PageUp', 'PageDown'].includes(e.code)) {
        e.preventDefault();
        e.stopPropagation();
      }
    }, true);
  }

  open(imgElement) {
    if (this.isOpen) return;

    this.isOpen = true;

    // Actualizar contenido
    const lightboxImg = this.overlay.querySelector('.lightbox-image');
    const lightboxCaption = this.overlay.querySelector('.lightbox-caption');

    lightboxImg.src = imgElement.src;
    lightboxImg.alt = imgElement.alt;

    // Detectar si es SVG y aplicar estilos específicos
    const isSVG = imgElement.src.toLowerCase().includes('.svg') || 
                  imgElement.src.toLowerCase().includes('image/svg');
    
    if (isSVG) {
      // Estilos específicos para SVG
      lightboxImg.style.cssText = `
        width: 85vw;
        height: 75vh;
        max-width: 1200px;
        max-height: 800px;
        object-fit: contain;
        border-radius: 8px;
        box-shadow: 0 8px 25px rgba(212, 170, 58, 0.18); /* Sombra dorada */
        transition: transform 0.3s ease;
        background: white;
        padding: 1rem;
      `;
    } else {
      // Estilos para PNG/JPG (originales)
      lightboxImg.style.cssText = `
        max-width: 100%;
        max-height: 75vh;
        object-fit: contain;
        border-radius: 8px;
        box-shadow: 0 8px 25px rgba(212, 170, 58, 0.18); /* Sombra dorada */
        transition: transform 0.3s ease;
      `;
    }

    // Caption desde data-caption o alt
    const captionText = imgElement.getAttribute('data-caption') || imgElement.alt || '';
    lightboxCaption.textContent = captionText;

    // Mostrar con animación suave
    this.overlay.style.display = 'flex';
    
    // Forzar reflow antes de animar
    this.overlay.offsetHeight;
    
    requestAnimationFrame(() => {
      this.overlay.style.opacity = '1';
    });

    // Prevenir scroll del body
    document.body.style.overflow = 'hidden';

    // Pausar Reveal.js
    if (window.Reveal && typeof window.Reveal.configure === 'function') {
      window.Reveal.configure({ keyboard: false });
    }
  }

  close() {
    if (!this.isOpen) return;

    this.isOpen = false;

    // Animar salida
    this.overlay.style.opacity = '0';

    setTimeout(() => {
      this.overlay.style.display = 'none';
      
      // Restaurar scroll
      document.body.style.overflow = '';

      // Reactivar Reveal.js
      if (window.Reveal && typeof window.Reveal.configure === 'function') {
        window.Reveal.configure({ keyboard: true });
      }
    }, 300);
  }
}

// Inicialización segura
function initLightbox() {
  if (!window.presentationLightbox) {
    window.presentationLightbox = new PresentationLightbox();
  }
}

// Múltiples puntos de inicialización para asegurar funcionamiento
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initLightbox);
} else {
  initLightbox();
}

// Integración con Reveal.js
if (window.Reveal) {
  if (typeof Reveal.addEventListener === 'function') {
    Reveal.addEventListener('ready', initLightbox);
  }
} else {
  // Esperar a que Reveal.js se cargue
  const checkReveal = setInterval(() => {
    if (window.Reveal) {
      clearInterval(checkReveal);
      if (typeof Reveal.addEventListener === 'function') {
        Reveal.addEventListener('ready', initLightbox);
      }
    }
  }, 100);
}