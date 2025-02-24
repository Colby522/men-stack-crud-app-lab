const dotenv = require('dotenv')
dotenv.config()
const express = require('express')
const app = express()
const mongoose = require('mongoose')
const methodOverride = require('method-override')
const morgan = require('morgan')

mongoose.connect(process.env.MONGODB_URI)
mongoose.connection.on('connected', () => {
    console.log(`Connected to MongoDB ${mongoose.connection.name}`)
})

// middleware
app.use(express.urlencoded({extended: false}))
app.use(methodOverride('_method'))
app.use(morgan('dev'))

const Car = require('./models/car.js')

// GET /
app.get('/', async (req, res) => {
    res.render('index.ejs')
})

// GET /cars
app.get('/cars', async (req, res) => {
    const allCars = await Car.find()
    res.render('cars/index.ejs', {cars: allCars})
})

// GET /cars/new
app.get('/cars/new', (req, res) => {
    res.render('cars/new.ejs')
})

// GET /cars/:carId
app.get('/cars/:carId', async (req, res) => {
    const foundCar = await Car.findById(req.params.carId)
    res.render('cars/show.ejs', {car: foundCar})
})

// POST /cars
app.post('/cars', async (req, res) => {
    if (req.body.goodCondition === "on") {
        req.body.goodCondition = true
    } else {
        req.body.goodCondition = false
    }
    await Car.create(req.body)
    res.redirect('/cars/new')
})

app.delete('/cars/:carId', async (req, res) => {
    await Car.findByIdAndDelete(req.params.carId)
    res.redirect('/cars')
})

app.get('/cars/:carId/edit', async (req, res) => {
    const foundCar = await Car.findById(req.params.carId)
    res.render('cars/edit.ejs', {car: foundCar})
})

app.put('/cars/:carId', async (req, res) => {
    if (req.body.goodCondition === 'on') {
        req.body.goodCondition = true
    } else {
        req.body.goodCondition = false
    }
    
    await Car.findByIdAndUpdate(req.params.carId, req.body)
    res.redirect(`/cars/${req.params.carId}`)
})

app.listen(3000, () => {
    console.log('listening on port 3000')
})