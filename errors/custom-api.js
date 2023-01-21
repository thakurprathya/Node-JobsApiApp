class CustomAPIError extends Error {
    constructor(message) {  //will be invoked every time a new instance is created
      super(message);  //it invokes constructor of parent class, as a result we have access to all the method & properties of parent
    }
};

module.exports = CustomAPIError;
