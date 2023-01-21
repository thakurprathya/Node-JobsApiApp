const { StatusCodes } = require('http-status-codes');  //this package helps in aliasing status codes with name
const CustomAPIError = require('./custom-api');

class UnauthenticatedError extends CustomAPIError {
    constructor(message) {   //will be invoked every time a new instance is created
        super(message);  //it invokes constructor of parent class, as a result we have access to all the method & properties of parent
        this.statusCode = StatusCodes.UNAUTHORIZED;
    }
};

module.exports = UnauthenticatedError;
