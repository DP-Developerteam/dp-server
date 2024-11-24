const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the schema for our Task model
let taskSchema = new Schema({
    client: {
        type: Schema.Types.ObjectId, // References an ObjectId from the User model
        ref: 'User', // Specifies the related collection ('User')
        required: true, // Ensures this field is mandatory
    },
    dateStart: {
        type: String
    },
    dateEnd: {
        type: String
    },
    description: {
        type: String
    }
}, {
    // collection: 'tasks'
    collection: 'taskSchema'
})

// Export the Task model
module.exports = mongoose.model('Task', taskSchema);