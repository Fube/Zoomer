const Zoom = require('./Zoom');
const When = require('./When');

/**
 * A struct representing a course within a schedule
 * @class
 * @constructor
 * @public
*/
class Course{

    #zoom;
    #when;
    #teacher;
    #name;
    #autoJoin;

    /**
     * 
     * @param {Zoom} zoom 
     * @param {When} when 
     */
    constructor(teacher, name, zoom, when, autoJoin){

        if(zoom instanceof Zoom){
            this.#zoom = zoom;
            this.#when = when;
            this.#teacher = teacher;
            this.#name = name;
            this.#autoJoin = autoJoin;
        }
        else{
            this.#zoom = zoom.zoom;
            this.#when = zoom.when;
            this.#teacher = zoom.teacher;
            this.#name = zoom.name;
            this.#autoJoin = zoom.autoJoin;
        }
    }

    /**
     * [See]{@link Zoom}
     * @type {Zoom}
     * @readonly
     * @memberof Course
     */
    get zoom(){return this.#zoom;}

    /**
     * [See]{@link When}
     * 
     * @type {When}
     * @readonly
     * @memberof Course
     */
    get when(){return this.#when;}

    /**
     * The name of the teacher
     * 
     * @readonly
     * @memberof Course
     * @returns {string}
     */
    get teacher(){return this.#teacher;}

    /**
     * The name of the course
     * 
     * @readonly
     * @memberof Course
     * @returns {string}
     */
    get name(){return this.#name;}

    /**
     * Should or should not autojoin the class
     * 
     * @readonly
     * @memberof Course
     * @return {boolean}
     */
    get autoJoin(){return this.#autoJoin;}

    static get EMPTY_DAY(){return {name: 'Nothing', zoom: { id:'', pwd:'', link:'' }}};
}

module.exports = Course;