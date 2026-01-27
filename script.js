javascript
const bgVideo = document.querySelector('.bg-video');


let isScrolling = false;

window.addEventListener('scroll', () => {
    if (!isScrolling && bgVideo) {
        window.requestAnimationFrame(() => {
            bgVideo.style.transform = `translateY(${window.scrollY * 0.2}px)`;
        });
        isScrolling = true;
    }
});