import CommunicationController from "../models/CommunicationController";

export default class ProfileViewModel {
    constructor(session) {
        this.sid = session.sid
        this.uid = session.uid
    }

    async getUser() {
        return CommunicationController.userInformation(this.sid, this.uid)
    }

    updateName(name) {
        CommunicationController.updateUser(this.sid, this.uid, name).catch(error => console.error(error))
    }
}