import * as SQLite from "expo-sqlite";

export default class StorageManager {
    constructor() {
        this.db = SQLite.openDatabase('users')
        this.initDB()
    }

    async genericQuery(sql, args = []) {
        let query = {args: args, sql: sql}
        let result
        try {
            result = await this.db.execAsync([query], false)
        } catch (e) {
            console.error(`[genericQuery: ${query.sql}] ${e}`)
        }
        return result[0].rows
    }

    async initDB() {
        let queries = [
            //'DROP TABLE users',
            //'DROP TABLE objects',
            `CREATE TABLE IF NOT EXISTS users (
                    uid INTEGER PRIMARY KEY,
                    profileversion INTEGER,
                    name TEXT,
                    picture TEXT
                    )`,
            `CREATE TABLE IF NOT EXISTS objects (
                    id INTEGER PRIMARY KEY,
                    name TEXT,
                    type TEXT,
                    level INTEGER,
                    image TEXT
                    )`
        ]
        for (let query of queries)
            await this.genericQuery(query)
    }

    async insertUser(user) {
        await this.genericQuery(
            'INSERT INTO users(uid, profileversion, name, picture) VALUES (?, ?, ?, ?)',
            [user.uid, user.profileversion, user.name, user.picture]
        )
    }

    async updateUser(user) {
        await this.genericQuery(
            'UPDATE users SET profileversion = ?, name = ?, picture = ? WHERE uid = ?',
            [user.profileversion, user.name, user.picture, user.uid]
        )
    }

    async selectUserFrom(uid) {
        return await this.genericQuery(
            'SELECT * FROM users WHERE uid = ?',
            [uid]
        )
    }

    async insertObject(object) {
        return await this.genericQuery(
            'INSERT INTO objects(id, name, type, level, image) VALUES (?, ?, ?, ?, ?)',
            [object.id, object.name, object.type, object.level, object.image]
        )
    }

    async selectObjectFrom(id) {
        return await this.genericQuery(
            'SELECT * FROM objects WHERE id = ?',
            [id]
        )
    }
}