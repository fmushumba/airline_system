import { v4 as uuidv4 } from 'uuid'
import constraints from '../lib/constraint.js'
import validate from 'validate.js'
import bcrypt from 'bcrypt'
import { client, stripe } from '../../index.js'
let user = class User {
    constructor() {
        this.created = new Date();
        this.id = uuidv4();
        this.name = {
            first: null,
            last: null
        };
        this.email = null;
        this.security = {
            passwordHash: null
        };
        this.banned = false
    }
    async save(id, firstname, lastname, email, password) {
        console.log(`saving user ${this.id} to DB`)
        let i = await client.query('INSERT INTO users (id,firstname,lastname, email,password) VALUES ($1, $2, $3, $4,$5) RETURNING *', [id, firstname, lastname, email, password])
        console.log(i.rows)

    }
    find(id) {
        return ''

    };
    setFirstName(firstName) {
        try {
            if (firstName) {
                firstName = firstName.trim().replace(/  +/g, '')
            };
            let msg = validate.single(firstName, constraints.name);
            if (msg) {
                return msg;
            } else {
                this.name.first = firstName;
            } return

        } catch (e) {
            throw new Error(e)
        }
    }

    setLastName(lastName) {
        try {
            if (lastName) {
                lastName = lastName.trim().replace(/  +/g, '')
            }
            let msg = validate.single(lastName, constraints.name);
            if (msg) {
                return msg;
            } else {
                this.name.last = lastName;
            }
        } catch (e) {
            throw new Error(e)
        }
    }
    setEmail(email) {
        try {
            let msg = validate.single(email, constraints.email);
            if (msg) {
                return msg
            } else {
                this.email = email
                return
            }
        } catch (e) {
            throw new Error(e)
        }
    }
    async setPassword(password) {

        const saltRounds = 10;
        try {
            let msg = validate.single(password, constraints.password)
            if (msg) {
                return msg;
            } else {
                this.security.passwordHash = await bcrypt.hash(password, saltRounds);

                return;
            }
        } catch (e) {
            throw new Error(e)
        }
    }

}



export default user;
