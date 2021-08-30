const mongoose = require("mongoose");

const PlayTimeSchema = new mongoose.Schema({
    time: {
        type: Number,
        required: true
    }
});

module.exports = mongoose.model("PlayTime", PlayTimeSchema);
