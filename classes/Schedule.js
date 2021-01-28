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

    /**
     * Ensures that courses does not contain null or undefined values
     */
    cleanCourses(){
        this.#courses = this.#courses.filter(n => n !== null && n !== undefined)
    }
}

module.exports = Schedule;