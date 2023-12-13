import CommunicationController from "../models/CommunicationController";

export default class ProfileViewModel {
    constructor(session) {
        this.sid = session.sid
        this.uid = session.uid
    }

    async getUser() {
        return CommunicationController.userInformation(this.sid, this.uid)
    }

    async updateUser(user) {
        await CommunicationController.updateUser(this.sid, this.uid, user.name, user.positionshare, user.picture)
    }

    async getArtifacts(user) {
        let artifacts = []
        for (let artifact of ['weapon', 'armor', 'amulet'])
            if (user[artifact])
                artifacts.push(await CommunicationController.objectInformation(this.sid, user[artifact]))
        return artifacts
    }
}