// Configuración de Reveal.js para la presentación MALEJA Calzado
Reveal.initialize({
    // Configuración básica
    hash: true,
    center: true,
    controls: true,        // ← IMPORTANTE: Activa los botones de navegación
    progress: true,        // Barra de progreso
    history: true,         // Historial del navegador
    keyboard: true,        // Navegación con teclado
    overview: true,        // Vista panorámica con ESC
    touch: true,           // Navegación táctil en móviles
    loop: false,           // No hace loop al final
    shuffle: false,        // No mezcla las diapositivas
    
    // Configuración de navegación
    controlsTutorial: true,
    controlsLayout: 'bottom-right',
    controlsBackArrows: 'faded',
    
    // Configuración visual
    transition: 'slide',   // Transición por defecto
    transitionSpeed: 'default',
    backgroundTransition: 'fade',
    
    // Configuración responsive
    width: '100%',
    height: '100%',
    margin: 0.04,
    minScale: 0.2,
    maxScale: 2.0,
    
    // Configuración de fragmentos
    fragments: true,
    fragmentInURL: false,
    
    // Configuración de auto-slide (desactivado)
    autoSlide: 0,
    autoSlideStoppable: true,
    autoSlideMethod: null,
    
    // Configuración de vista
    showSlideNumber: 'all',
    hideInactiveCursor: true,
    hideCursorTime: 5000,
    
    // Configuración de PDF
    pdfMaxPagesPerSlide: 1,
    pdfSeparateFragments: true,
    
    // Plugins opcionales (comentados hasta que los necesites)
    dependencies: [
        // { src: 'plugin/markdown/marked.js' },
        // { src: 'plugin/markdown/markdown.js' },
        // { src: 'plugin/notes/notes.js', async: true },
        // { src: 'plugin/highlight/highlight.js', async: true }
    ]
});

// Eventos personalizados
Reveal.on('ready', function(event) {
    console.log('Presentación MALEJA Calzado cargada');
    
    // Asegurar que los controles son visibles
    const controls = document.querySelector('.reveal .controls');
    if (controls) {
        controls.style.display = 'block';
        controls.style.visibility = 'visible';
    }
});

Reveal.on('slidechanged', function(event) {
    // Opcional: agregar analytics o logs aquí
    console.log(`Diapositiva: ${event.indexh + 1}`);
});

// Configuración adicional para mobile
if (window.innerWidth <= 768) {
    Reveal.configure({
        controls: true,
        touch: true,
        embedded: false
    });
}

// Asegurar que los controles funcionan después de cargar
document.addEventListener('DOMContentLoaded', function() {
    // Forzar la visibilidad de los controles
    setTimeout(function() {
        const controls = document.querySelector('.reveal .controls');
        if (controls) {
            controls.style.display = 'block !important';
            controls.style.visibility = 'visible !important';
            controls.style.opacity = '1 !important';
        }
    }, 100);
});