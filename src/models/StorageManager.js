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
        console.log(`[insertUser] ${JSON.stringify(result)}`)
        return result
    }

    async updateUserName(uid, profileVersion, name) {
        let result = await this.genericQuery(
            'UPDATE users SET name = ?, profileversion = ? WHERE uid = ?',
            [name, profileVersion, uid]
        )
        console.log(`[updateUserName] ${JSON.stringify(result)}`)
        return result
    }

    async updateUserPicture(uid, profileVersion, picture) {
        let result = await this.genericQuery(
            'UPDATE users SET picture = ?, profileversion = ? WHERE uid = ?',
            [picture, profileVersion, uid]
        )
        console.log(`[updateUserPicture] ${JSON.stringify(result)}`)
        return result
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
        console.log(`[selectUserFrom] ${JSON.stringify(result)}`)
        return result
    }

}