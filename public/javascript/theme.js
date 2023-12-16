const html = document.querySelector('html');

function setIcon(newTheme) {

    const themeSwitcher = document.querySelector('#theme-toggle');
    const icon = themeSwitcher.querySelector('i');

    if (newTheme === 'dark') {
        icon.classList.add('nf-md-lightbulb_off_outline');
        icon.classList.remove('nf-md-lightbulb');
    }
    else {
        icon.classList.add('nf-md-lightbulb');
        icon.classList.remove('nf-md-lightbulb_off_outline');
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
