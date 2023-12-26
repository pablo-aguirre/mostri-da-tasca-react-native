import {useEffect, useState} from "react";
import {BottomNavigation, PaperProvider} from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CommunicationController from "./models/CommunicationController";
import {CurrentLocation, SessionID} from "./Contexts";
import ObjectsScreen from "./screens/ObjectsScreen";
import * as Location from "expo-location";
import StorageManager from "./models/StorageManager";
import MapScreen from "./screens/MapScreen";
import RankingScreen from "./screens/RankingScreen";
import ProfileScreen from "./screens/ProfileScreen";

export default function App() {
    const [sid, setSid] = useState(null)
    const [location, setLocation] = useState({lat: 0, lon: 0})

    useEffect(() => {
        getSessionID().then(setSid)
        subscribeLocation(setLocation)
    }, []);

    const [index, setIndex] = useState(0)
    const [routes] = useState([
        {key: 'map', title: 'Map', focusedIcon: 'map', unfocusedIcon: 'map-outline'},
        {key: 'objects', title: 'Objects', focusedIcon: 'view-list', unfocusedIcon: 'view-list-outline'},
        {key: 'ranking', title: 'Ranking List', focusedIcon: 'trophy', unfocusedIcon: 'trophy-outline'},
        {key: 'profile', title: 'Profile', focusedIcon: 'account', unfocusedIcon: 'account-outline'},
    ])

    const renderScene = BottomNavigation.SceneMap({
        map: MapScreen,
        objects: ObjectsScreen,
        profile: ProfileScreen,
        ranking: RankingScreen
    })

    return (sid &&
        <CurrentLocation.Provider value={location}>
            <SessionID.Provider value={sid}>
                <PaperProvider>
                    <BottomNavigation
                        navigationState={{index, routes}}
                        onIndexChange={setIndex}
                        renderScene={renderScene}
                    />
                </PaperProvider>
            </SessionID.Provider>
        </CurrentLocation.Provider>
    )
}

async function getSessionID() {
    let sid = await AsyncStorage.getItem('sid')
    if (sid === null) {
        await StorageManager.initDB()
        const session = await CommunicationController.newSession()
        sid = session.sid
        await AsyncStorage.setItem('sid', session.sid)
        await AsyncStorage.setItem('uid', session.uid.toString())
    }
    console.log(`[getSessionID] sid: ${sid}`)
    return sid
}

async function subscribeLocation(setLocation) {
    const {status} = await Location.requestForegroundPermissionsAsync()
    if (status === 'granted') {
        await Location.watchPositionAsync(
            {
                accuracy: Location.Accuracy.Balanced,
                distanceInterval: 10
            },
            (newLocation) => {
                setLocation({lat: newLocation.coords.latitude, lon: newLocation.coords.longitude})
            }
        )
    } else {
        alert('Geolocation permissions not granted.')
    }
}