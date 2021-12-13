const db = require('../db_config/config');

class User {
    constructor(data){
        this.id = data.id
        this.username = data.username
        this.email = data.email 
        this.hpassword = data.hpassword
    }

    static create({ username, email, hpassword }){
        return new Promise(async (res, rej) => {
            try {
                let result = await db.query(`INSERT INTO users (username, email, hpassword)
                                            VALUES ($1, $2, $3) RETURNING *;`, [username, email, hpassword]);
                let user = new users(result.rows[0]);
                res(user)
            } catch (err) {
                rej(`Error creating user: ${err}`)
            }
        })
    }

    static findByEmail(email){
        return new Promise(async (res, rej) => {
            try {
                let result = await db.query(`SELECT * FROM users
                                            WHERE email = $1;`, [email]);
                let user = new User(result.rows[0])
                res(user)
            } catch (err) {
                rej(`Error retrieving user: ${err}`)
            }
        })
    }
    
}


module.exports = User;
