require("dotenv").config();
const express = require('express')
const app = express()
const path = require("path");
const hbs = require("hbs");
const cookieParser = require("cookie-parser");
const cors = require("cors");
app.use(cookieParser());
app.use(cors());
hbs.registerHelper('isActive', function (activePage, page, options) {
    return (activePage === page) ? 'bg-[#585c67b5] dark:bg-[#585c67b5] text-white' : 'bg-white';
});

hbs.registerPartials(path.join(__dirname, "./templates/partials"));
const port = process.env.PORT||3000

app.use(express.static('public', { maxAge: '1y' }));
app.use(express.static(path.join(__dirname, "./public")));
app.set("views", path.join(__dirname, "./templates/views"));
app.set("view engine", "hbs");

let settings_options = [
    {name: "Temperature", id: "temp", options: [{optionName: "Celsius", value: "C"}, {optionName: "Fahrenheit", value: "F"}, {optionName: "Kelvin", value: "K"}]},
    {name: "Pressure", id: "pressure", options: [{optionName: "hPa", value: "hPa"}, {optionName: "inHg", value: "inHg"}, {optionName: "kPa", value: "kPa"}, {optionName: "psi", value: "psi"}]},
    {name: "Wind Speed", id: "wind", options: [{optionName: "m/s", value: "m/s"}, {optionName: "km/h", value: "km/h"}, {optionName: "mph", value: "mph"}, {optionName: "knots", value: "knots"}]},
    {name: "Visibility", id: "visibility", options: [{optionName: "m", value: "m"}, {optionName: "miles", value: "miles"}, {optionName: "km", value: "km"}]},
    {name: "Precipitation", id: "precipitation", options: [{optionName: "mm", value: "mm"}, {optionName: "cm", value: "cm"}, {optionName: "inches", value: "in"}]},
];


app.get('/', (req, res) => {
    
    res.render('index', {activePage: "home", loggedIn: req.cookies["loggedIn"], email: req.cookies["email"], backend_Url: process.env.BACKEND_URL, backend_Url: process.env.BACKEND_URL})
});


app.get('/mycities', (req, res) => res.render('myCities', {activePage: "mycities" , loggedIn: req.cookies["loggedIn"], email: req.cookies["email"], backend_Url: process.env.BACKEND_URL}));

app.get('/map', (req, res) => res.render('map', {activePage: "map", loggedIn: req.cookies["loggedIn"], email: req.cookies["email"], backend_Url: process.env.BACKEND_URL}));

app.get('/settings', (req, res) => res.render('settings', {activePage: "settings", settings_options:settings_options, loggedIn: req.cookies["loggedIn"] , email: req.cookies["email"], backend_Url: process.env.BACKEND_URL}));

app.get('/login', (req, res) => res.render('login',{loggedIn: req.cookies["loggedIn"], backend_Url: process.env.BACKEND_URL}));

app.get('/signUp', (req, res) => res.render('signUp',{loggedIn: req.cookies["loggedIn"],backend_Url: process.env.BACKEND_URL}));

app.get('/', (req, res) => res.status(404).send("Sorry the file couldn't be found!!"));

app.listen(port,()=>{
    console.log(`SErver is running on port http://localhost:${port}`);
})