const Course = require("./Course");

class Schedule {

    /**@type {[Course]} */
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

    /**
     * Returns a Map representation of the Schedule object
     * @returns {Map<string, [Course]>}
     */
    toMap(){

        /**@type {Map<string, [Course]>} */
        const map = new Map();
        for(const course of this.#courses){

            const { day } = course.when;

            if(map.has(day)){
                map.get(day).push(course);
            }
            else{
                map.set(day, [course]);
            }
        }
        return map;
    }
}

module.exports = Schedule;