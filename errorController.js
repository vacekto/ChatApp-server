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
            errorList = ['This email address is already taken'];
            break;
        default:
            errorList = ['An unknown error occurred.'];
            statusCode = 500;
    }
    res.status(statusCode);
    res.send(errorList)
}

module.exports = { errorController, InvalidInputError }