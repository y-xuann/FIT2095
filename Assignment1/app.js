/**
 * Assignment 1 FIT2095
 * @author Yang Xuan Chew (33520496)
 */

/**
 * Import required modules
 * @const express
 * @const path 
 */
const express = require("express");
const path = require("path");

/**
 * Import models for package and driver class
 * @const Driver 
 * @const Package 
 */
const Driver = require("./models/driver");
const Package = require("./models/package");

/**
 * Path to the views directory
 * @const VIEWS_PATH
 */
const VIEWS_PATH = path.join(__dirname, "/views/"); //Important

/**
 * Port number which the server listens
 * @const {number} PORT_NUMBER
 */
const PORT_NUMBER = 8080;

/**
 * Departments for drivers
 * @const {Array<string>} DRIVER_DEPARTMENT
 */
const DRIVER_DEPARTMENT =["food", "furniture", "electronic"]

/**
 * App instance
 * @const
 */
let app = express();

/**
 * Temporary storage for driver and package object
 * @type {Array<Object>} dbDriver
 * @type {Array<Object>} dbPackage
 */
let dbDriver =[];
let dbPackage =[];

/** 
 * Setup the static assets directories
 */
app.use(express.static("node_modules/bootstrap/dist/css"));
app.use(express.static("images"));
app.use(express.urlencoded({ extended: true }));

/**
 * Setup the view Engine for EJS
 */
app.engine("ejs", require("ejs").renderFile);
app.set("view engine", "ejs");

/**
 * Configure the port number
 * @name listen
 * @function
 * @param {int} port - Express Port number
 * @param {function} callback - Express callback 
 */
app.listen(PORT_NUMBER, function () {
    console.log(`listening on port ${PORT_NUMBER}`);
})

/**
 * Route for the home page
 * @name GET / 
 * @function
 * @param {string} path - Express path
 * @param {function} callback - Express callback
 * @description Renders the home page view (index.ejs).
 */
app.get('/', function (req, res) {
    res.render("index.ejs");
});

/**
 * Route to send request to retrieve the form for adding a new driver
 * @name GET /33520496/Yang/drivers/add-driver
 * @param {string} path - Express path
 * @param {function} callback - Express callback
 * @description Render the add-driver.ejs (form)
 */
app.get("/33520496/Yang/drivers/add-driver", function (req, res) {
    res.render("add-driver.ejs");
});

/**
 * Route to handle form submission for adding a new driver
 * @name POST /33520496/Yang/drivers/add-driver
 * @param {string} path - Express path
 * @param {function} callback - Express callback
 * @description Render the invalid-data.ejs if there exist invalid input, 
 * else create and add the driver into the list and redirect to route viewing all drivers
 */
app.post("/33520496/Yang/drivers/add-driver", function (req, res) {
    if (req.body.name.length < 3 || req.body.name.length > 20 || !isAlpha(req.body.name)){
        res.render("invalid-data.ejs");
    }else if(!DRIVER_DEPARTMENT.includes(req.body.department.toLowerCase())){
        res.render("invalid-data.ejs");
    }else if(req.body.license.length!=5 || !isAlphaNumeric(req.body.license))
        res.render("invalid-data.ejs");
    else{
        let isActive = req.body.isActive == '1';
        let newDriver = new Driver(req.body.name, req.body.department.toLowerCase(), req.body.license, isActive);
        dbDriver.push(newDriver);
        res.redirect("/33520496/Yang/drivers");
    }
});

/**
 * Route to view all drivers
 * @name GET /33520496/Yang/drivers
 * @param {string} path - Express path
 * @param {function} callback - Express callback
 * @description Render the view-driver.ejs template with the list of drivers 
 */
app.get("/33520496/Yang/drivers", function (req, res) {
    res.render("view-driver.ejs",{records: dbDriver});
});

/**
 * Route to send request to retrieve the form for selecting a department to filter drivers
 * @name GET /33520496/Yang/drivers/department
 * @param {string} path - Express path
 * @param {function} callback - Express callback
 * @description Render the list-driver-dep.ejs (form)
 */
app.get("/33520496/Yang/drivers/department", function (req, res) {
    res.render("list-driver-dep.ejs");
});

/**
 * Route to handle form submission for filtering drivers by department
 * @name POST /33520496/Yang/drivers/department
 * @param {string} path - Express path
 * @param {function} callback - Express callback
 * @description Render the view-driver.ejs template with the list of filtered drivers 
 */
app.post("/33520496/Yang/drivers/department", function (req, res) {
    selectedDepartment = req.body.department;
    let dbTemp = [];
    for (let i =0; i < dbDriver.length;i++){
        if (dbDriver[i].department == selectedDepartment){
            dbTemp.push(dbDriver[i]);
        }
    }
    res.render("view-driver.ejs",{records: dbTemp});
});

/**
 * Route to send request to retrieve the form to delete a driver
 * @name GET /33520496/Yang/drivers/delete-driver
 * @param {string} path - Express path
 * @param {function} callback - Express callback
 * @description Render the delete-driver.ejs (form)
 */
app.get("/33520496/Yang/drivers/delete-driver", function (req, res) {
    res.render("delete-driver.ejs");
});

/**
 * Route to handle request for deleting a driver via query string
 * @name GET /33520496/Yang/drivers/delete-driver-req
 * @param {string} path - Express path
 * @param {function} callback - Express callback
 * @description redirect to route viewing all drivers if it is a valid ID,
 * else render the invalid-data.ejs
 */
app.get("/33520496/Yang/drivers/delete-driver-req", function (req, res) {
    let checkID = req.query.driverId;
    valid = deleteData(checkID, dbDriver);
    if (valid){
        res.redirect("/33520496/Yang/drivers");
    }else{
        res.render("invalid-data.ejs");
    }
});

/**
 * Route to send request to retrieve the form for adding a new driver
 * @name GET /33520496/Yang/packages/add-packages
 * @param {string} path - Express path
 * @param {function} callback - Express callback
 * @description Render the add-packages.ejs (form) with the list of drivers (for drop-down list)
 */
app.get("/33520496/Yang/packages/add-packages", function (req, res) {
    res.render("add-packages.ejs", {records: dbDriver});
});

/**
 * Route to handle form submission for adding a new package
 * @name POST /33520496/Yang/packages/add-packages
 * @param {string} path - Express path
 * @param {function} callback - Express callback
 * @description Render the invalid-data.ejs if there exist invalid input, 
 * else create and add the package into the list and redirect to route viewing all packages
 */
app.post("/33520496/Yang/packages/add-packages", function (req, res) {
    if (req.body.title.length < 3 || req.body.title.length > 15 || !isAlphaNumeric(req.body.title)){
        res.render("invalid-data.ejs");
    }else if (req.body.description > 30){
        res.render("invalid-data.ejs");
    }else if (req.body.weight <=0){
        res.render("invalid-data.ejs");
    }else if(req.body.destination.length < 3 || req.body.destination.length > 15 || !isAlphaNumeric(req.body.destination)){
        res.render("invalid-data.ejs");
    }else if (req.body.driverID.length == 0){
        res.render("invalid-data.ejs");
    }else{
        let isAllocated = req.body.isAllocated == '1';
        let newPackage = new Package(req.body.title, req.body.weight, req.body.destination, req.body.description, isAllocated, 
            req.body.driverID);
        dbPackage.push(newPackage);
        res.redirect("/33520496/Yang/packages");
    }
});

/**
 * Route to view all packages
 * @name GET /33520496/Yang/packages
 * @param {string} path - Express path
 * @param {function} callback - Express callback
 * @description Render the view-packages.ejs template with the list of packages
 */
app.get("/33520496/Yang/packages", function (req, res) {
    res.render("view-packages.ejs",{records: dbPackage});
});

/**
 * Route to send request to retrieve the form to delete a package
 * @name GET /33520496/Yang/drivers/delete-driver
 * @param {string} path - Express path
 * @param {function} callback - Express callback
 * @description Render the delete-packages.ejs (form)
 */
app.get("/33520496/Yang/packages/delete-packages", function (req, res) {
    res.render("delete-packages.ejs");
});

/**
 * Route to handle request for deleting a driver via query string
 * @name GET /33520496/Yang/drivers/delete-driver-req
 * @param {string} path - Express path
 * @param {function} callback - Express callback
 * @description Redirect to route viewing all packages if it is a valid ID,
 * else render the invalid-data.ejs
 */
app.get("/33520496/Yang/packages/delete-packages-req", function (req, res) {
    let checkID = req.query.packageId;
    valid = deleteData(checkID, dbPackage);
    if (valid){
        res.redirect("/33520496/Yang/packages");
    }else{
        res.render("invalid-data.ejs");
    }
});

/**
 * Route to handle undefined routes
 * @name GET /*
 * @param {string} path - Express path
 * @param {function} callback - Express callback
 * @description Renders an error page for any route that is not defined.
 */
app.get('/*', function (req, res) {
    res.render("404.ejs");
  });

/**
 * Deletes an item from the array based on the provided ID
 * @function
 * @param {String} id - The ID of the driver or package input.
 * @param {Array<Object>} db - The array from which the item refers to
 * @returns {boolean} validID - Returns `true` if the item was successfully deleted; `false` otherwise.
 */
function deleteData(id,db){
    let validID = true;
    let index = -1;
    for (let i = 0;i<db.length;i++){
        if (db[i].id == id){
            index = i;
            break;
        }
    }

    if (index != -1){
        db.splice(index,1);}
    else{
        validID = false;
    }
    return validID
}

/**
 * Check if a string contains only alphabetic character
 * @function
 * @param {string} str - The string to be tested  
 * @returns {boolean} - Returns `true` if the string contains only alphabetic characters; `false` otherwise.
 */
function isAlpha(str){
    return /^[a-zA-Z]*$/.test(str);
}

/**
 * Checks if a string contains only alphanumeric characters (letters and numbers).
 * @function
 * @param {string} str - The string to be tested.
 * @returns {boolean} - Returns `true` if the string contains only alphanumeric characters; `false` otherwise.
 */
function isAlphaNumeric(str){
    return /^[a-z0-9]*$/gi.test(str);
}
