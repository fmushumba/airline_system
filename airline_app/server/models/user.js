import { v4 as uuidv4 } from 'uuid'

let user = class User {
    constructor() {
        this.created = new Date()
        this.id = uuidv4();
        this.name = {
            first: null,
            last: null
        };
        this.banned = false
    }
}

export default user;
