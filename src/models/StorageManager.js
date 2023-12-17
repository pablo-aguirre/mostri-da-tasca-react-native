import * as SQLite from "expo-sqlite";

export default class StorageManager {
    constructor() {
        this.db = SQLite.openDatabase('users')
        this.initDB()
    }

    async genericQuery(sql, args = []) {
        let query = {args: args, sql: sql}
        let result = await this.db.execAsync([query], false).catch(error => `[genericQuery] ${error}`)
        return result[0].rows
    }

    async initDB() {
        let queries = [
            //'DROP TABLE users',
            `CREATE TABLE IF NOT EXISTS users (
                    uid INTEGER PRIMARY KEY,
                    profileversion INTEGER,
                    name TEXT,
                    picture TEXT
                )`
        ]
        for (let query of queries) {
            let result = await this.genericQuery(query)
            console.log(`[initDB] ${JSON.stringify(result)}`)
        }
    }

    async insertUser(user) {
        let result = await this.genericQuery(
            'INSERT INTO users(uid, profileversion, name, picture) VALUES (?, ?, ?, ?)',
            [user.uid, user.profileversion, user.name, user.picture]
        )
        console.log(`[insertUser ${user.name}] ${JSON.stringify(result)}`)
        return result
    }

    async updateUser(user) {
        let result = await this.genericQuery(
            'UPDATE users SET profileversion = ?, name = ?, picture = ? WHERE uid = ?',
            [user.profileversion, user.name, user.picture, user.uid]
        )
        console.log(`[updateUser ${user.name}]`)
    }

    async selectAllUsers() {
        let result = await this.genericQuery(
            'SELECT * FROM users'
        )
        console.log(`[selectAllUsers] ${JSON.stringify(result)}`)
        return result
    }

    async selectUserFrom(uid) {
        let result = await this.genericQuery(
            'SELECT * FROM users WHERE uid = ?',
            [uid]
        )
        // console.log(`[selectUserFrom] ${JSON.stringify(result)}`)
        return result
    }

}