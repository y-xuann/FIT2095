class Package{
    /**
     * Represents a package
     * @constructor
     * @param {String} packageTitle 
     * @param {Number} packageWeight 
     * @param {String} packageDestination 
     * @param {String} description 
     * @param {Boolean} isAllocated 
     * @param {String} driverId 
     */
    constructor(packageTitle, packageWeight, packageDestination, description, isAllocated, driverId){
        this.id = this.generateId(); 
        this.title = packageTitle; 
        this.weight = packageWeight; 
        this.destination = packageDestination; 
        this.description = description; 
        this.createdAt = this.generateDate();
        this.isAllocated = isAllocated; 
        this.driverId = driverId;
    }

    /**
     * Generates an unique ID for the package
     * @returns {String}
     */
    generateId(){
        const FIRST_LETTER = 'P';
        const LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        let randomLetters = '';
        for (let i = 1; i <= 2; i++){
            randomLetters += LETTERS.charAt(Math.floor(Math.random() * LETTERS.length));
        }

        let randomDigits = '';
        for (let i = 1; i <= 3; i++){
            randomDigits += Math.floor(Math.random()*10);
        }
        return (`${FIRST_LETTER}${randomLetters}-YC-${randomDigits}`)

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

module.exports = Package;
