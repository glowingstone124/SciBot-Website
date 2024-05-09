let nowTheme = 1;

function toggleTheme() {
    if (nowTheme === 0) {
        document.body.classList.add('black')
        nowTheme = 1;
    } else {
        document.body.classList.remove('black')
        nowTheme = 0;
    }
}
const headers = document.querySelectorAll('.introduction');
const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const element = entry.target;
            element.style.animation = 'moveIn 0.5s ease';
            observer.unobserve(element);
        }
    });
});
headers.forEach(header => {
    observer.observe(header);
});

observer.observe(header);
toggleTheme()