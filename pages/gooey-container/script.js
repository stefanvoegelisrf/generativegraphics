document.onload = function () {
    function moveBg(e) {
        const rect = e.target.getBoundingClientRect();
        e.target.style.setProperty('--x', (e.clientX - rect.x) / rect.width * 100);
        e.target.style.setProperty('--y', (e.clientY - rect.y) / rect.height * 100);
    }
    document.querySelector(".gooey-container").addEventListener('pointermove', moveBg);
}
