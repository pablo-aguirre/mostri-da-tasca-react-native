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
}