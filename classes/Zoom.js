/**
 * A struct representing the Zoom meeting information
 * @class
 * @constructor
 * @public
*/
class Zoom{

    #id;
    #password;
    #link;

    /**
     * 
     * @param {string} id 
     * @param {string} password 
     * @param {string} link 
     */
    constructor(id, password, link){

        if(typeof id === 'string'){

            this.#id = id;
            this.#password = password;
            this.#link = link;
        }
        else{
            this.#id = id.id;
            this.#password = id.password;
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
    get password(){return this.#password}

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