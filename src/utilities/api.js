async function sendApiResponse(res, status, message, data = null) {
    if (!res || !status || !message) throw new Error('Missing parameters.');
    if (typeof status !== 'number') throw new Error('Status code must be a number.');

    const responseObject = { status, message }
    if (data) responseObject.data = data;

    return res.status(status).json(responseObject);
}


module.exports = { sendApiResponse };