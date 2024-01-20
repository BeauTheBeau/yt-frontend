const createError = require('http-errors');

const handle404 = (req, res, next) => {
    next(createError(404));
};

const handleError = (err, req, res, next) => {
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    res.status(err.status || 500);
    res.render('error', { title: 'Express', res: res });
}

module.exports = { handle404, handleError };