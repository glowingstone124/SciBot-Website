let nowTheme = 0;

function toggleTheme() {
    if (nowTheme === 0) {
        document.body.classList.add('black')
        nowTheme = 1;
    } else {
        document.body.classList.remove('black')
        nowTheme = 0;
    }
}
toggleTheme()