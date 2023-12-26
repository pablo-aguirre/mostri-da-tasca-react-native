import * as SQLite from "expo-sqlite";

export default class StorageManager {

    static async genericQuery(sql, args = []) {
        const db = SQLite.openDatabase('miaApp')
        let query = {args: args, sql: sql}
        console.log(`[StorageManager] ${JSON.stringify(query)}`)
        let result = await db.execAsync([query], false)
        db.closeAsync()
        return result[0].rows
    }

    static async initDB() {
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
            await StorageManager.genericQuery(query)
    }

    static async insertUser(user) {
        await StorageManager.genericQuery(
            'INSERT INTO users(uid, profileversion, name, picture) VALUES (?, ?, ?, ?)',
            [user.uid, user.profileversion, user.name, user.picture]
        )
    }

    static async updateUser(user) {
        await StorageManager.genericQuery(
            'UPDATE users SET profileversion = ?, name = ?, picture = ? WHERE uid = ?',
            [user.profileversion, user.name, user.picture, user.uid]
        )
    }

    static async selectUserFrom(uid) {
        return await StorageManager.genericQuery(
            'SELECT * FROM users WHERE uid = ?',
            [uid]
        )
    }

    static async insertObject(object) {
        return await StorageManager.genericQuery(
            'INSERT INTO objects(id, name, type, level, image) VALUES (?, ?, ?, ?, ?)',
            [object.id, object.name, object.type, object.level, object.image]
        )
    }

    static async selectObjectFrom(id) {
        return await StorageManager.genericQuery(
            'SELECT * FROM objects WHERE id = ?',
            [id]
        )
    }
}