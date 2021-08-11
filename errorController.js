class InvalidInputError extends Error {
    constructor(message) {
        super(message);
        this.name = "InvalidInputError";
    }
}

const errorController = (err, req, res, next) => {
    let errorList;
    let statusCode = 400
    switch (true) {
        case (err.name === 'ValidationError'):
            errorList = (Object.keys(err.errors)).map(errorName => err.errors[errorName].message);
            break;
        case (err.name === 'InvalidInputError'):
            errorList = ['Email or password is incorrect'];
            break;
        case (err.name === 'MongoError' && err.code === 11000):
            const field = Object.keys(err.keyValue)
            errorList = [`This ${field} is already taken`];
            break;
        case (err.message === 'This user is already logged in'):
            errorList = [err.message]
            break;
        default:
            console.log(err)
            errorList = ['An unknown error has occurred.'];
            statusCode = 500;
    }
    res.status(statusCode).send({ errorList })
}

module.exports = { errorController, InvalidInputError }