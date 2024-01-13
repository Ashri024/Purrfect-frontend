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

let settings_options=[  
    {name:"Temperature", options:["Celsius", "Fahrenheit", "Kelvin"]},
    {name:"Pressure", options:["hPa", "inHg", "mb", "psi"]},
    {name:"Wind Speed", options:["m/s", "km/h", "mph", "knots"]},
    {name:"Visibility", options:["km", "miles","meters"]},
    {name:"Precipitation", options:["mm", "cm", "inches"]},
]


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