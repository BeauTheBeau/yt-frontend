const express = require('express');
const config = require('../../config.json');
const sassMiddleware = require('node-sass-middleware');
const path = require('path');
const logger = require('morgan');
const cookieParser = require('cookie-parser');

const setupMiddleware = (app) => {
    app.use(logger('dev'));
    app.use(cookieParser());
    app.use(express.json());
    app.use(express.urlencoded({ extended: false }));
    app.use(sassMiddleware({
        src: path.join(__dirname,  '../public'),
        dest: path.join(__dirname, '../public'),
        indentedSyntax: false,
        sourceMap: true
    }));
    app.use(express.static(path.join(__dirname, '../public')));
    app.set('views', path.join(__dirname, '../views'));
    app.set('view engine', 'hbs');
    app.use(function (req, res, next) {

        res.locals.site = {
            title: config.site.name,
            description: config.site.description,
            url: config.site.url
        };

        if (req.cookies.theme) res.locals.theme = req.cookies.theme;
        else res.locals.theme = 'light';
        next();
    });

};

module.exports = { setupMiddleware };