// not Found 
const notFound = (req, res, next) => {
    const error = new Error(`Not Found : ${req.originalUrl}`);

    res.status(404);
    next(error)
};

// Error Handler 
const errorHandler = (err, req, res, next) => {
    const statuscode = res.statusCode == 200 ? 500 : res.statusCode;

    // we have change error status code and send to next
    res.status(statuscode);
    res.json({
        message: err?.message,
        stack: err?.stack,
    });
}

module.exports = { notFound, errorHandler };