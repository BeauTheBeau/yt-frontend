const hbs = require('hbs');

function registerHelpers(helpers) {
    Object.keys(helpers).forEach((name) => {
        hbs.registerHelper(name, helpers[name]);
    });
}

function performReplace(data, regex, replacement) {
    return data.replace(regex, replacement);
}

const createHelpers = () => {
    const helpers = {
        // your helper functions here
    };

    registerHelpers(helpers);
};

module.exports = { createHelpers };