import CommunicationController from "../models/CommunicationController";

export class MapScreenViewModel {
    constructor(sid, db) {
        this.sid = sid
        this.db = db
    }

    async getObjects(lat, lon) {
        const objectsFromServer = await CommunicationController.nearbyObjects(this.sid, lat, lon)

        let objects = []
        for (let object of objectsFromServer) {
            let objectFromDB = await this.db.selectObjectFrom(object.id)
            if (objectFromDB.length === 0) {
                let objectFromServer = await CommunicationController.objectInformation(this.sid, object.id)
                await this.db.insertObject(objectFromServer)
            }
            objectFromDB = await this.db.selectObjectFrom(object.id)
            objects.push({...objectFromDB[0], lat: object.lat, lon: object.lon})
        }
        return objects
    }

    async getUsers(lat, lon) {
        const usersFromServer = await CommunicationController.nearbyUsers(this.sid, lat, lon)
        let users = []

        for (const user of usersFromServer) {
            let userFromDB = await this.db.selectUserFrom(user.uid)
            if (userFromDB.length === 0) {
                let userFromServer = await CommunicationController.userInformation(this.sid, user.uid)
                await this.db.insertUser(userFromServer)
            } else if (userFromDB[0].profileversion !== user.profileversion) {
                let userFromServer = await CommunicationController.userInformation(this.sid, user.uid)
                await this.db.updateUser(userFromServer)
            }
            userFromDB = await this.db.selectUserFrom(user.uid)
            users.push({...userFromDB[0], life: user.life, experience: user.experience, lat: user.lat, lon: user.lon})
        }
        return users
    }
}