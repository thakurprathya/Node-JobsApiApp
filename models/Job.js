const mongoose = require('mongoose');

//schemas our userdefined structures for database collection as mongoDB noSQL db it doesn't have any predefined structure
//models are fancy structures compiled from schema definations, instance of model is called a document, they are responsible for creating and reading documents from database.
//we have provided validation to our schema, for further validation props refer mongoose docs-> validation.
const JobSchema = new mongoose.Schema(
    {
        company: {
            type: String,
            required: [true, 'Please provide company name'],
            maxlength: 50,
        },
        position: {
            type: String,
            required: [true, 'Please provide position'],
            maxlength: 100,
        },
        status: {
            type: String,
            enum: ['interview', 'declined', 'pending'],
            default: 'pending',
        },
        createdBy: { //most imp prop here because of this each job will be assosiated with a user
            type: mongoose.Types.ObjectId,
            ref: 'User',  //referencing to user model
            required: [true, 'Please provide user'],
        }
    },
    { timestamps: true }  //this will automatically tell mongoose to maintain create and update date.
);

module.exports = mongoose.model('Job', JobSchema);
