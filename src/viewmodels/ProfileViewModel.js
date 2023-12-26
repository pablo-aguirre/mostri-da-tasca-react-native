import CommunicationController from "../models/CommunicationController";
import AsyncStorage from "@react-native-async-storage/async-storage";
import StorageManager from "../models/StorageManager";


export async function getUser(sid) {
    const uid = parseInt(await AsyncStorage.getItem('uid'))
    return CommunicationController.userInformation(sid, uid)
}

export async function updateUser(sid, user) {
    const uid = parseInt(await AsyncStorage.getItem('uid'))
    await CommunicationController.updateUser(sid, uid, user.name, user.positionshare, user.picture)
}

export async function getArtifacts(user) {
    let artifacts = []
    for (let artifact of ['weapon', 'armor', 'amulet'])
        if (user[artifact]) {
            const artifactFromDB = await StorageManager.selectObjectFrom(user[artifact])
            artifacts.push(artifactFromDB[0])
        }
    return artifacts
}