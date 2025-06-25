
window.addEventListener('DOMContentLoaded', () => {
document.querySelectorAll('.fade-in').forEach(el => {
    //   delay here
    setTimeout(() => el.classList.add('visible'), 80);
    });

    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;

    const setTheme = (theme) => {
        if (theme === 'light') {
            body.classList.add('light-mode');
        } else {
            body.classList.remove('light-mode');
        }
        localStorage.setItem('theme', theme);
    };

    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        setTheme(savedTheme);
    } else {
        setTheme('dark');
    }

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            if (body.classList.contains('light-mode')) {
                setTheme('dark');
            } else {
                setTheme('light');
            }
        })
    }

});
