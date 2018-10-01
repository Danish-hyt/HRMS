const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    date: {
        type: Date,
        required: true,
        minlength: 1
    },
    dataStruct: {
        year: {
            type: Number,
            require: true,
            minlength: 1
        },
        month: {
            type: Number,
            require: true,
            minlength: 1
        },
        day: {
            type: Number,
            require: true,
            minlength: 1
        }
    },
    projects: [{
        name: {
            type: String,
            require: true,
            minlength: 1,
        },
        tasks: [{
            description: {
                type: String,
                require: true,
                minlength: 1
            },
            hours: {
                type: Number,
                require: true,
                minlength: 1 
            }
        }]
    }]   
});

module.exports = mongoose.model('Data', UserSchema, 'Data');