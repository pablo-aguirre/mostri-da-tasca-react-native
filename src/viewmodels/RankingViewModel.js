import CommunicationController from "../models/CommunicationController"
import {usersFromDB} from "./MapScreenViewModel";


export async function getRankingList(sid) {
    const rankingList = await CommunicationController.ranking(sid)
    return usersFromDB(sid, rankingList)
}