import CommunicationController from "../models/CommunicationController";

export default class AppViewModel {

    getSid() {
        let result = CommunicationController.newSession()
        result.then(result => console.log(result))
        return result;
    }
}