const html = document.querySelector('html');

function setIcon(newTheme) {

    const themeSwitcher = document.querySelector('#theme-toggle');
    const icon = themeSwitcher.querySelector('i');

    if (newTheme === 'dark') {
        icon.classList.add('nf-oct-moon');
        icon.classList.remove('nf-oct-sun');
    }
    else {
        icon.classList.add('nf-oct-sun');
        icon.classList.remove('nf-oct-moon');
    }

}

function toggleTheme() {
    if (html.dataset.theme === 'dark') html.dataset.theme = 'light';
    else html.dataset.theme = 'dark';
    document.cookie = `theme=${html.dataset.theme}; path=/; max-age=31536000; SameSite=Strict`;
    setIcon(html.dataset.theme);
}

function setDefaultTheme() {

    const preference = window.matchMedia('(prefers-color-scheme: dark)')

    html.dataset.theme = preference.matches ? 'dark' : 'light';
    document.cookie = `theme=${html.dataset.theme}; path=/; max-age=31536000; SameSite=Strict`;
    setIcon(html.dataset.theme);
}

if (!document.cookie) setDefaultTheme();
