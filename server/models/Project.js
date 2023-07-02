const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
    name: {
        type: String,
    },
    description: { 
        type: String,
    },
    status: {
        type: String,
        // Enum allows us to set the values that we want to be able to use for this field
        enum: ['Not Started','In Progress', 'Completed']
    },
    clientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Client',
    }
});

module.exports = mongoose.model('Project', ProjectSchema);