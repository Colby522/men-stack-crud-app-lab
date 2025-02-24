const mongoose = require('mongoose')

const carSchema = new mongoose.Schema ({
    makeModel: String,
    year: Number,
    color: String,
    goodCondition: Boolean,
})

const Car = mongoose.model('Car', carSchema)

module.exports = Car