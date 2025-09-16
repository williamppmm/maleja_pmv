// Lightbox sencillo con navegación y soporte PNG/SVG

(() => {
  // Esperar a que el DOM esté completamente cargado
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initLightbox);
  } else {
    initLightbox();
  }

  function initLightbox() {
    const thumbs = Array.from(document.querySelectorAll('.image-card img.zoomable'));
    if (!thumbs.length) {
      console.log('No se encontraron imágenes con clase .zoomable');
      return;
    }

    // Crear DOM del visor
    const wrap = document.createElement('div');
    wrap.className = 'lightbox';
    wrap.innerHTML = `
      <div class="lightbox__inner">
        <div class="lightbox__media">
          <img class="lightbox__img" alt="">
        </div>
        <div class="lightbox__caption"></div>
      </div>
      <button class="lightbox__close" aria-label="Cerrar">✕</button>
      <button class="lightbox__prev" aria-label="Anterior">‹</button>
      <button class="lightbox__next" aria-label="Siguiente">›</button>
    `;
    document.body.appendChild(wrap);

    const imgEl = wrap.querySelector('.lightbox__img');
    const captionEl = wrap.querySelector('.lightbox__caption');
    const btnClose = wrap.querySelector('.lightbox__close');
    const btnPrev = wrap.querySelector('.lightbox__prev');
    const btnNext = wrap.querySelector('.lightbox__next');

    let idx = 0;

    // Función para abrir lightbox en imagen específica
    function openAt(i) {
      idx = i;
      const t = thumbs[idx];
      const full = t.dataset.full || t.src;
      const caption = t.dataset.caption || t.alt || '';

      // Con SVG funciona igual usando <img src="...svg">
      imgEl.src = full;
      imgEl.alt = caption;
      captionEl.textContent = caption;
      wrap.classList.add('show');
      
      // Prevenir scroll del body mientras está abierto
      document.body.style.overflow = 'hidden';
      
      // Focus para accesibilidad
      btnClose.focus();
    }

    // Función para cerrar lightbox
    function close() { 
      wrap.classList.remove('show'); 
      document.body.style.overflow = '';
    }
    
    // Navegación
    function prev() { 
      openAt((idx - 1 + thumbs.length) % thumbs.length); 
    }
    
    function next() { 
      openAt((idx + 1) % thumbs.length); 
    }

    // Configurar eventos de las miniaturas
    thumbs.forEach((t, i) => {
      // Click para abrir lightbox
      t.addEventListener('click', () => openAt(i));
      
      // Función para ajustar orientación automática
      const adjustOrientation = () => {
        const card = t.closest('.image-card');
        if (!card) return;

        // Detectar imágenes verticales (móviles) - solo si no tiene clase portrait ya
        if (t.naturalHeight > t.naturalWidth && !card.classList.contains('portrait')) {
          card.classList.add('portrait');
          console.log(`Imagen ${t.src} detectada como vertical, agregando clase 'portrait'`);
        }
        
        // Detectar diagramas/SVG que deben mostrarse completos - solo si no tiene clase contain ya
        if ((t.src.endsWith('.svg') || t.dataset.fit === 'contain') && !card.classList.contains('contain')) {
          card.classList.add('contain');
          console.log(`Imagen ${t.src} detectada como diagrama, agregando clase 'contain'`);
        }
      };
      
      // Si la imagen ya está cargada
      if (t.complete && t.naturalWidth > 0) {
        adjustOrientation();
      } else {
        // Si aún no está cargada, esperar al evento load
        t.addEventListener('load', adjustOrientation);
        
        // Timeout de seguridad por si la imagen no carga
        setTimeout(() => {
          if (!t.complete) {
            console.warn(`Imagen ${t.src} no se ha cargado completamente`);
          }
        }, 5000);
      }

      // Mejorar accesibilidad
      t.setAttribute('tabindex', '0');
      t.setAttribute('role', 'button');
      t.setAttribute('aria-label', `Ver imagen en grande: ${t.alt || 'Imagen ' + (i + 1)}`);
      
      // Soporte para teclado en miniaturas
      t.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openAt(i);
        }
      });
    });

    // Eventos de controles del lightbox
    btnClose.addEventListener('click', close);
    btnPrev.addEventListener('click', prev);
    btnNext.addEventListener('click', next);
    
    // Cerrar al hacer click en el fondo
    wrap.addEventListener('click', (e) => { 
      if (e.target === wrap) close(); 
    });

    // Navegación por teclado (mejorada)
    document.addEventListener('keydown', (e) => {
      if (!wrap.classList.contains('show')) return;
      
      switch(e.key) {
        case 'Escape':
          close();
          break;
        case 'ArrowLeft':
          prev();
          break;
        case 'ArrowRight':
          next();
          break;
        case 'Home':
          openAt(0);
          break;
        case 'End':
          openAt(thumbs.length - 1);
          break;
      }
    });

    // Integración con Reveal.js - cerrar lightbox al cambiar de slide
    if (window.Reveal) {
      Reveal.on('slidechanged', () => { 
        if (wrap.classList.contains('show')) {
          close();
          console.log('Lightbox cerrado por cambio de slide en Reveal.js');
        }
      });
    }

    // Soporte para gestos touch en móviles
    let touchStartX = 0;
    let touchEndX = 0;

    wrap.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    wrap.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipe();
    }, { passive: true });

    function handleSwipe() {
      const swipeThreshold = 50;
      const diff = touchStartX - touchEndX;
      
      if (Math.abs(diff) > swipeThreshold) {
        if (diff > 0) {
          next(); // Swipe left = siguiente
        } else {
          prev(); // Swipe right = anterior
        }
      }
    }

    // Manejar redimensionamiento de ventana
    window.addEventListener('resize', () => {
      if (wrap.classList.contains('show')) {
        // Reajustar el lightbox si está abierto
        const currentImg = imgEl;
        if (currentImg.src) {
          // Forzar recalculo de dimensiones
          currentImg.style.maxWidth = '90vw';
          currentImg.style.maxHeight = '80vh';
        }
      }
    });

    // Log para debug
    console.log(`Lightbox inicializado con ${thumbs.length} imágenes zoomables`);
    
    // Verificar que todas las imágenes tienen las clases necesarias
    thumbs.forEach((img, index) => {
      if (!img.classList.contains('zoomable')) {
        console.warn(`Imagen ${index + 1} no tiene clase 'zoomable':`, img.src);
      }
    });
  }
})();