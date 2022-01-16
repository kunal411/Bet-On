const mongoose = require('mongoose');

// mongoose.connect('mongodb+srv://domino-beton:dominobeton@dominobeton.rxgn1.mongodb.net/dominobeton?retryWrites=true&w=majority');
mongoose.connect('mongodb://localhost/BETON_DOMINO');

const db = mongoose.connection;

db.on('error', console.error.bind(console, "Error connecting to MongoDB"));


db.once('open', function(){
    console.log('Connected to Database :: MongoDB');
});


module.exports = db;