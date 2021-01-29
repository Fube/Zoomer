/**
 * A struct representing the Zoom meeting information
 * @class
 * @constructor
 * @public
*/
class Zoom{

    #id;
    #pwd;
    #link;

    /**
     * 
     * @param {string} id 
     * @param {string} pwd 
     * @param {string} link 
     */
    constructor(id, pwd, link){

        if(typeof id === 'string'){

            this.#id = id;
            this.#pwd = pwd;
            this.#link = link;
        }
        else{
            this.#id = id.id;
            this.#pwd = id.pwd;
            this.#link = id.link;
        }
    }

    /**
     *
     *
     * @readonly
     * @memberof Zoom
     * @returns {string}
     */
    get id(){return this.#id}

    /**
     *
     *
     * @readonly
     * @memberof Zoom
     * @returns {string}
     */
    get pwd(){return this.#pwd}

    /**
     *
     *
     * @readonly
     * @memberof Zoom
     * @returns {string}
     */
    get link(){return this.#link}
}

module.exports = Zoom;