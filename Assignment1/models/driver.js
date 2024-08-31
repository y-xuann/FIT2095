class Driver{

    /** Represents a driver
     * @constructor
     * @param {String} driverName 
     * @param {String} driverDepartment 
     * @param {String} driverLicence 
     * @param {boolean} driverIsActive 
     */
    constructor(driverName, driverDepartment, driverLicence, driverIsActive){
        this.id = this.generateId();
        this.name = driverName;
        this.department = driverDepartment;
        this.license = driverLicence;
        this.isActive = driverIsActive;
        this.createdAt = this.generateDate();
    }

    /**
     * Generates an unique ID for the driver 
     * @returns {String}
     */
    generateId(){
        const FIRST_LETTER = 'D';
        const LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        let randomLetters = '';
        for (let i = 1; i <= 3; i++){
            randomLetters += LETTERS.charAt(Math.floor(Math.random() * LETTERS.length));
        }

        let randomDigits = Math.floor(Math.random()* 90 + 10);
        const STUDENT_ID = 33;
        return (`${FIRST_LETTER}${randomDigits}-${STUDENT_ID}-${randomLetters}`)

    }

    /**
     * Generates the current date and time in a localized string format.
     * @function
     * @returns {String} - A string representing the current date and time.
     */
    generateDate(){
        var today = new Date();
        return(today.toLocaleString());
    }
}

module.exports = Driver;