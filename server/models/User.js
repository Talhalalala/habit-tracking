const db = require('../db_config/config');
const SQL = require('sql-template-strings');

class User {
    constructor(data){
        this.username = data.username
        this.email = data.email 
        this.hpassword = data.hpassword
    }

    static create({ username, email, hpassword }){
        return new Promise(async (res, rej) => {
            try {
                let result = await db.run(SQL`INSERT INTO users (username, email, hpassword)
                                                VALUES (${username}, ${email}, ${hpassword}) RETURNING *;`);
                let users = new users(result.rows[0]);
                res(users)
            } catch (err) {
                rej(`Error creating user: ${err}`)
            }
        })
    }

    static findByEmail(email){
        return new Promise(async (res, rej) => {
            try {
                let result = await db.run(SQL`SELECT * FROM users
                                                WHERE email = ${email};`);
                let user = new User(result.rows[0])
                res(user)
            } catch (err) {
                rej(`Error retrieving user: ${err}`)
            }
        })
    }

    
}


module.exports = User
