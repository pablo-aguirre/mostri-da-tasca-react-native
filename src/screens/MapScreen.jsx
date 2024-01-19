import React, {createContext, useContext, useEffect, useState} from "react";
import {Appbar, DefaultTheme, Icon} from "react-native-paper";
import MapView, {Marker} from "react-native-maps";
import {CurrentLocation, SessionID} from "../Contexts";

import {iconsObjects} from "../components/MyAvatar";
import {getNearbyUsers} from "../viewmodels/MapScreenViewModel";
import ObjectDialog from "../components/ObjectDialog";
import {getNearbyObjects} from "../viewmodels/ObjectsListViewModel";
import UserDialog from "../components/UserDialog";

const MapContext = createContext()

export default function MapScreen() {
    const [objectDialogVisible, setObjectDialogVisible] = useState(false)
    const [userDialogVisible, setUserDialogVisible] = useState(false)
    const [selection, setSelection] = useState({})

    return (
        <MapContext.Provider value={{setObjectDialogVisible, setUserDialogVisible, setSelection}}>
            <Appbar.Header mode='small' elevated>
                <Appbar.Content title="Map"/>
            </Appbar.Header>
            <MyMap/>

            <ObjectDialog visible={objectDialogVisible} setVisible={setObjectDialogVisible} object={selection}/>
            <UserDialog visible={userDialogVisible} setVisible={setUserDialogVisible} user={selection}/>
        </MapContext.Provider>
    )
}

function MyMap() {
    const sid = useContext(SessionID)
    const location = useContext(CurrentLocation)

    const [region, setRegion] = useState({
        latitude: location.lat,
        longitude: location.lon,
        latitudeDelta: 0.001,
        longitudeDelta: 0.001
    })

    const [objects, setObjects] = useState([])
    const [users, setUsers] = useState([])

    useEffect(() => {
        setRegion({...region, latitude: location.lat, longitude: location.lon})
        if (location.lat !== 0) {
            getNearbyObjects(sid, location.lat, location.lon)
                .then(setObjects)
                .catch(() => alert("Connection error, objects load impossible."))
            getNearbyUsers(sid, location.lat, location.lon)
                .then(setUsers)
                .catch(() => alert("Connection error, users load impossible."))
        }
    }, [location])

    return (
        <MapView
            style={{flex: 1}}
            showsMyLocationButton
            provider='google'
            showsUserLocation
            scrollEnabled={false}
            minZoomLevel={15}
            region={region}
            onRegionChangeComplete={setRegion}
        >
            {objects.map((object) => <MyMarker key={object.id} item={object}/>)}
            {users.map((user) => <MyMarker key={user.uid} item={user}/>)}
        </MapView>
    )
}

function MyMarker({item}) {
    const {setObjectDialogVisible, setUserDialogVisible, setSelection} = useContext(MapContext)

    const enableDialog = () => {
        setSelection(item)
        if (item.type)
            setObjectDialogVisible(true)
        else
            setUserDialogVisible(true)
    }

    return (
        <Marker coordinate={{latitude: item.lat, longitude: item.lon}} onPress={enableDialog}>
            <Icon size={40} color={DefaultTheme.colors.primary}
                  source={item.type ? iconsObjects[item.type] : 'account'}/>
        </Marker>
    )
}