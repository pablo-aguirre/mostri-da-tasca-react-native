import AsyncStorage from "@react-native-async-storage/async-storage";
import CommunicationController from "../models/CommunicationController";

export default class AppViewModel {
    async getSession() {
        let sid = await AsyncStorage.getItem('sid')
        let uid = await AsyncStorage.getItem('uid')
        if (sid === null || uid === null) {
            let session = await CommunicationController.newSession()
            sid = session.sid
            uid = session.uid
            await AsyncStorage.setItem('sid', sid)
            await AsyncStorage.setItem('uid', uid)
        }
        return {sid: sid, uid: uid}
    }
}

