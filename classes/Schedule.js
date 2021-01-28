const Course = require("./Course");

class Schedule {

    #courses;

    constructor(courses){
        this.#courses = courses;
    }

    /**
     * An array of courses
     *
     * @memberof Schedule
     * @returns {[Course]}
     */
    get courses(){return this.#courses;}
    set courses(courses){this.#courses = courses}
}

module.exports = Schedule;