import CommunicationController from "../models/CommunicationController";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default class ProfileViewModel {
    constructor(sid, db) {
        this.sid = sid
        this.db = db
    }

    async getUser() {
        const uid = parseInt(await AsyncStorage.getItem('uid'))
        return CommunicationController.userInformation(this.sid, uid)
    }

    async updateUser(user) {
        const uid = parseInt(await AsyncStorage.getItem('uid'))
        await CommunicationController.updateUser(this.sid, uid, user.name, user.positionshare, user.picture)
    }

    async getArtifacts(user) {
        let artifacts = []
        for (let artifact of ['weapon', 'armor', 'amulet'])
            if (user[artifact]) {
                const artifactFromDB = await this.db.selectObjectFrom(user[artifact])
                artifacts.push(artifactFromDB[0])
            }
        return artifacts
    }
}