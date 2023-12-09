import AsyncStorage from "@react-native-async-storage/async-storage";
import CommunicationController from "../models/CommunicationController";

export default class AppViewModel {

    async getSession() {
        try {
            let session = await AsyncStorage.getItem('session')
            if (!session) {
                session = await CommunicationController.newSession()
                await AsyncStorage.setItem('session', JSON.stringify(session))
            }
            console.log(`[getSession] ${session}`);
            return JSON.parse(session)
        } catch (e) {
            console.error(e)
            throw e
        }
    }
}

