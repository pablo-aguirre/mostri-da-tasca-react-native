import CommunicationController from "../models/CommunicationController"

export default class RankingViewModel {
    constructor(sid) {
        this.sid = sid
    }

    async getRanking() {
        const ranking = await CommunicationController.ranking(this.sid)
        let result = []
        for (const rankingElement of ranking) {
            result.push(await CommunicationController.userInformation(this.sid, rankingElement.uid))
        }
        return result
    }
}