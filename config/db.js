const { response } = require('express');
const mongoose = require('mongoose');

const MONGO_URI = 'mongodb+srv://ioanciuciu:Masterfreud1349@firstcluster.y4ujd.mongodb.net/storybooks?retryWrites=true&w=majority';

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch(err) {
        console.log(err);
        process.exit(1);
    }
}

module.exports = connectDB;