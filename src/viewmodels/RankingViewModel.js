import CommunicationController from "../models/CommunicationController"
import StorageManager from "../models/StorageManager";

export default class RankingViewModel {
    constructor(sid) {
        this.sid = sid
        this.sm = new StorageManager()
    }

    async getRanking() {
        const rankingList = await CommunicationController.ranking(this.sid)
        let users = []
        for (const user of rankingList) {
            let userFromDB = await this.sm.selectUserFrom(user.uid)
            if (userFromDB.length === 0 || userFromDB[0].profileversion !== user.profileversion) {
                let userFromServer = await CommunicationController.userInformation(this.sid, user.uid)
                await this.sm.insertUser(userFromServer)
            }
            userFromDB = await this.sm.selectUserFrom(user.uid)
            users.push({...userFromDB[0], life: user.life, experience: user.experience})
        }
        return users
    }
}