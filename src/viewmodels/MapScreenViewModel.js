import CommunicationController from "../models/CommunicationController";
import StorageManager from "../models/StorageManager";

export async function usersFromDB(sid, usersFromServer) {
    let users = []
    for (const user of usersFromServer) {
        let userFromDB = await StorageManager.selectUserFrom(user.uid)
        if (userFromDB.length === 0) {
            let userFromServer = await CommunicationController.userInformation(sid, user.uid)
            await StorageManager.insertUser(userFromServer)
        } else if (userFromDB[0].profileversion !== user.profileversion) {
            let userFromServer = await CommunicationController.userInformation(sid, user.uid)
            await StorageManager.updateUser(userFromServer)
        }
        userFromDB = await StorageManager.selectUserFrom(user.uid)
        users.push({
            ...userFromDB[0],
            life: user.life,
            experience: user.experience,
            positionshare: user.positionshare,
            lat: user.lat,
            lon: user.lon
        })
    }
    return users
}

export async function getNearbyUsers(sid, lat, lon) {
    const usersFromServer = await CommunicationController.nearbyUsers(sid, lat, lon)
    return await usersFromDB(sid, usersFromServer)
}