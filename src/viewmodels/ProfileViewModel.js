import CommunicationController from "../models/CommunicationController";

export default class ProfileViewModel {
    constructor(session) {
        this.sid = session.sid
        this.uid = session.uid
    }

    async getUser() {
        return CommunicationController.userInformation(this.sid, this.uid)
    }

    updateUser(user) {
        CommunicationController.updateUser(this.sid, this.uid, user.name, user.positionshare, user.picture).catch(error => console.error(error))
    }
}