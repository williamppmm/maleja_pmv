// Configuración Reveal.js optimizada para MALEJA Calzado
// Paleta de colores basada en el PMV real

const MALEJA_COLORS = {
    // Colores principales del PMV
    primary: '#d4aa3a',      // Dorado MALEJA (botones, acentos)
    secondary: '#25d366',     // Verde WhatsApp (CTAs)
    dark: '#1a1a1a',         // Negro principal
    darkAlt: '#2a2a2a',      // Negro alternativo
    light: '#ffffff',         // Blanco
    lightAlt: '#f8f9fa',     // Gris claro
    accent: '#d4aa3a',       // Dorado para highlights
    shadow: 'rgba(212, 170, 58, 0.3)' // Sombra dorada
};

// Configuración principal de Reveal.js
Reveal.initialize({
    // Configuración esencial
    hash: true,
    center: true,
    controls: true,
    progress: true,
    history: true,
    keyboard: true,
    overview: true,
    touch: true,
    
    // Navegación
    controlsLayout: 'bottom-right',
    controlsBackArrows: 'faded',
    
    // Transiciones suaves
    transition: 'slide',
    transitionSpeed: 'default',
    backgroundTransition: 'fade',
    
    // Configuración responsive
    width: '100%',
    height: '100%',
    margin: 0.04,
    minScale: 0.2,
    maxScale: 2.0,
    
    // Características adicionales
    fragments: true,
    showSlideNumber: 'c/t', // Formato: actual/total
    hideInactiveCursor: true,
    hideCursorTime: 3000,
    
    // Auto-slide desactivado (presentación manual)
    autoSlide: 0,
    
    // PDF export
    pdfMaxPagesPerSlide: 1,
    pdfSeparateFragments: true
});

// Función para aplicar estilos de MALEJA a los controles
function applyMALEJABranding() {
    // Estilizar controles de navegación
    const controls = document.querySelector('.reveal .controls');
    if (controls) {
        // Asegurar visibilidad
        controls.style.display = 'block';
        controls.style.visibility = 'visible';
        controls.style.opacity = '1';
        
        // Aplicar estilos a todos los botones
        controls.querySelectorAll('button').forEach(button => {
            Object.assign(button.style, {
                background: MALEJA_COLORS.darkAlt,
                border: `2px solid ${MALEJA_COLORS.primary}`,
                color: MALEJA_COLORS.light,
                borderRadius: '8px',
                padding: '8px',
                transition: 'all 0.3s ease',
                boxShadow: `0 4px 12px ${MALEJA_COLORS.shadow}`,
                cursor: 'pointer'
            });
            
            // Efectos hover
            button.addEventListener('mouseenter', () => {
                Object.assign(button.style, {
                    background: MALEJA_COLORS.primary,
                    color: MALEJA_COLORS.dark,
                    transform: 'translateY(-2px)',
                    boxShadow: `0 6px 16px ${MALEJA_COLORS.shadow}`
                });
            });
            
            button.addEventListener('mouseleave', () => {
                Object.assign(button.style, {
                    background: MALEJA_COLORS.darkAlt,
                    color: MALEJA_COLORS.light,
                    transform: 'translateY(0)',
                    boxShadow: `0 4px 12px ${MALEJA_COLORS.shadow}`
                });
            });
        });
    }
    
    // Estilizar barra de progreso
    const progress = document.querySelector('.reveal .progress');
    if (progress) {
        Object.assign(progress.style, {
            height: '4px',
            background: MALEJA_COLORS.darkAlt,
            borderRadius: '2px'
        });
        
        const progressBar = progress.querySelector('span');
        if (progressBar) {
            Object.assign(progressBar.style, {
                background: `linear-gradient(90deg, ${MALEJA_COLORS.primary}, ${MALEJA_COLORS.secondary})`,
                boxShadow: `0 0 10px ${MALEJA_COLORS.shadow}`,
                borderRadius: '2px'
            });
        }
    }
    
    // Estilizar número de slide
    const slideNumber = document.querySelector('.reveal .slide-number');
    if (slideNumber) {
        Object.assign(slideNumber.style, {
            background: MALEJA_COLORS.darkAlt,
            color: MALEJA_COLORS.primary,
            border: `1px solid ${MALEJA_COLORS.primary}`,
            borderRadius: '6px',
            padding: '4px 8px',
            fontSize: '14px',
            fontWeight: '600',
            boxShadow: `0 2px 8px ${MALEJA_COLORS.shadow}`
        });
    }
}

// Función para mejorar la experiencia móvil
function optimizeForMobile() {
    if (window.innerWidth <= 768) {
        // Configuración específica para móvil
        Reveal.configure({
            controls: true,
            touch: true,
            embedded: false,
            controlsLayout: 'bottom-right'
        });
        
        // Ajustar tamaño de controles en móvil
        const controls = document.querySelector('.reveal .controls');
        if (controls) {
            controls.style.transform = 'scale(1.2)';
            controls.style.bottom = '20px';
            controls.style.right = '20px';
        }
        
        // Hacer la barra de progreso más visible en móvil
        const progress = document.querySelector('.reveal .progress');
        if (progress) {
            progress.style.height = '6px';
        }
    }
}

// Función para logging simplificado (útil para analytics futuras)
function logSlideChange(slideInfo) {
    const currentSlide = slideInfo.indexh + 1;
    const totalSlides = Reveal.getTotalSlides();
    
    console.log(`MALEJA PMV - Slide ${currentSlide}/${totalSlides}`);
    
    // Aquí podrías agregar analytics de Google, Facebook Pixel, etc.
    // Ejemplo: gtag('event', 'slide_view', { slide_number: currentSlide });
}

// Event listeners principales
Reveal.on('ready', (event) => {
    console.log('🎯 Presentación MALEJA Calzado iniciada');
    applyMALEJABranding();
    optimizeForMobile();
    
    // Log del slide inicial
    logSlideChange(event);
});

Reveal.on('slidechanged', (event) => {
    logSlideChange(event);
    
    // Re-aplicar estilos si es necesario (por si algún slide los modifica)
    applyMALEJABranding();
});

// Optimización para diferentes tamaños de pantalla
window.addEventListener('resize', () => {
    optimizeForMobile();
    applyMALEJABranding();
});

// Inicialización al cargar la página
document.addEventListener('DOMContentLoaded', () => {
    // Timeout para asegurar que Reveal.js esté completamente cargado
    setTimeout(() => {
        applyMALEJABranding();
        optimizeForMobile();
    }, 100);
});

// Función de utilidad para alternar vista overview (útil para debugging)
function toggleOverview() {
    if (Reveal.isOverview()) {
        Reveal.toggleOverview(false);
    } else {
        Reveal.toggleOverview(true);
    }
}

// Atajo de teclado personalizado (O para overview)
document.addEventListener('keydown', (event) => {
    if (event.key.toLowerCase() === 'o' && !event.ctrlKey && !event.metaKey) {
        toggleOverview();
    }
});

// Exportar funciones para uso global si es necesario
window.MALEJA_Presentation = {
    colors: MALEJA_COLORS,
    toggleOverview: toggleOverview,
    applyBranding: applyMALEJABranding,
    getCurrentSlide: () => Reveal.getIndices().h + 1,
    getTotalSlides: () => Reveal.getTotalSlides()
};
