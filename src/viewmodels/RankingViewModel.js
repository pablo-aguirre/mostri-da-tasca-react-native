import CommunicationController from "../models/CommunicationController"
import {usersFromDB} from "./MapScreenViewModel";

export default class RankingViewModel {
    constructor(sid, db) {
        this.sid = sid
        this.db = db
    }

    async getRanking() {
        const rankingList = await CommunicationController.ranking(this.sid)
        return usersFromDB(rankingList)
    }
}