const mongoose = require('mongoose');
const connect = () => mongoose.connect('mongodb+srv://olszewskimarcel:olszewskimarcel@testbaza.pumt181.mongodb.net/test');

module.exports = connect;