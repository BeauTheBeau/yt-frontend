const html = document.querySelector('html');

function toggleTheme() {
    if (html.dataset.theme === 'dark') html.dataset.theme = 'light';
    else html.dataset.theme = 'dark';
    document.cookie = `theme=${html.dataset.theme}; path=/; max-age=31536000; SameSite=Strict`;
}

function setDefaultTheme() {



    const preference = window.matchMedia('(prefers-color-scheme: dark)')

    html.dataset.theme = preference.matches ? 'dark' : 'light';
    document.cookie = `theme=${html.dataset.theme}; path=/; max-age=31536000; SameSite=Strict`;
}

if (!document.cookie) setDefaultTheme();
