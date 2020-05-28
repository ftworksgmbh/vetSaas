const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const vetSchema = new Schema({
    name: String,
    email: String,
    phone: String,
    customerId: String
});

module.exports = mongoose.model('Vet', vetSchema)