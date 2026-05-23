/* ==========================================================================
   RESPONSIVE PREVIEW BAR — JavaScript Controller
   Handles Desktop / Tablet / Phone viewport simulation
   ========================================================================== */

(function () {
    const previewFrame = document.getElementById('previewFrame');
    const previewWrapper = document.getElementById('previewWrapper');
    const buttons = document.querySelectorAll('.preview-btn');

    if (!previewFrame || !buttons.length) return;

    buttons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active state
            buttons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const device = btn.dataset.device;

            // Apply device class to frame for CSS styling
            previewFrame.setAttribute('data-device', device);

            // Adjust wrapper background for framed devices
            if (device === 'desktop') {
                previewWrapper.style.background = 'rgba(4, 7, 17, 1)';
                previewWrapper.style.alignItems = 'flex-start';
            } else {
                previewWrapper.style.background = '#02030b';
                previewWrapper.style.alignItems = 'flex-start';
            }
        });
    });

    // Initialize with desktop
    previewFrame.setAttribute('data-device', 'desktop');
})();
