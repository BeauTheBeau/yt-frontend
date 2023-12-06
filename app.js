const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const sassMiddleware = require('node-sass-middleware');
const config = require('./config');

// Express + Handlebars
const app = express();
const hbs = require('hbs');

// Make sure config.storage.video_path exists
const fs = require('fs');

// Could be multiple levels deep, so we need to check each level
// eg. ./data/videos
function checkDir(dir, mkdir = true) {
    if (mkdir) if (!fs.existsSync(dir)) fs.mkdirSync(dir);
    else return fs.existsSync(dir);
}

const directories = [ config.storage.paths.videos, config.storage.paths.processing, config.storage.paths.metadata ]

// get each level of the path
for (let i = 0; i < directories.length; i++) {
    const dirs = directories[i].split('/');
    let dir = '';

    // loop through each level and check if it exists
    for (let i = 0; i < dirs.length; i++) {
        dir += dirs[i] + '/';
        checkDir(dir);
    }
}



// view engine setup
hbs.registerPartials(path.join(__dirname, 'views/partials'));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(sassMiddleware({
    src: path.join(__dirname, 'public'),
    dest: path.join(__dirname, 'public'),
    indentedSyntax: false,
    sourceMap: true
}));
app.use(express.static(path.join(__dirname, 'public')));
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


// Routes
const indexRouter = require('./routes/index');
app.use('/', indexRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error', {title: 'Express', res: res});
});

module.exports = app;

process.on('unhandledRejection', (reason, promise) => {
    console.log('Unhandled Rejection at:', reason.stack || reason)
});

process.on('uncaughtException', function (err) {
    console.error(err.stack);
});