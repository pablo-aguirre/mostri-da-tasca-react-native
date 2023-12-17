import CommunicationController from "../models/CommunicationController"
import StorageManager from "../models/StorageManager";

export default class RankingViewModel {
    constructor(sid, db) {
        this.sid = sid
        this.db = db
    }

    async getRanking() {
        const rankingList = await CommunicationController.ranking(this.sid)
        let users = []
        for (const user of rankingList) {
            let userFromDB = await this.db.selectUserFrom(user.uid)
            if (userFromDB.length === 0) {
                let userFromServer = await CommunicationController.userInformation(this.sid, user.uid)
                await this.db.insertUser(userFromServer)
            } else if (userFromDB[0].profileversion !== user.profileversion) {
                let userFromServer = await CommunicationController.userInformation(this.sid, user.uid)
                await this.db.updateUser(userFromServer)
            }
            userFromDB = await this.db.selectUserFrom(user.uid)
            users.push({...userFromDB[0], life: user.life, experience: user.experience})
        }
        return users
    }
}