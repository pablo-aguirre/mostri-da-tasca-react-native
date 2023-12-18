import {useEffect, useState} from "react";
import {BottomNavigation, PaperProvider} from "react-native-paper";
import RankingScreen from "./screens/RankingScreen";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CommunicationController from "./models/CommunicationController";
import {DB, SessionID} from "./Contexts";
import StorageManager from "./models/StorageManager";
import ProfileScreen from "./screens/ProfileScreen";

export default function App() {
    const [sid, setSid] = useState(null)

    useEffect(() => {
        getSessionID().then(result => setSid(result))
    }, []);

    const [index, setIndex] = useState(0)
    const [routes] = useState([
        {key: 'profile', title: 'Profile', focusedIcon: 'account', unfocusedIcon: 'account-outline'},
        {key: 'ranking', title: 'Ranking List', focusedIcon: 'trophy', unfocusedIcon: 'trophy-outline'},
    ])

    const renderScene = BottomNavigation.SceneMap({
        profile: () => <ProfileScreen/>,
        ranking: () => <RankingScreen/>,
    })

    return (
        sid &&
        <SessionID.Provider value={sid}>
            <DB.Provider value={new StorageManager()}>
                <PaperProvider>
                    <BottomNavigation
                        navigationState={{index, routes}}
                        onIndexChange={setIndex}
                        renderScene={renderScene}
                    />
                </PaperProvider>
            </DB.Provider>
        </SessionID.Provider>
    )
}

async function getSessionID() {
    let sid = await AsyncStorage.getItem('sid')
    if (sid === null) {
        const session = await CommunicationController.newSession()
        sid = session.sid
        await AsyncStorage.setItem('sid', session.sid)
        await AsyncStorage.setItem('uid', session.uid.toString())
    }
    console.log(`[getSessionID] sid: ${sid}`)
    return sid
}