import React, {createContext, useContext, useEffect, useState} from "react";
import {Appbar, Icon} from "react-native-paper";
import MapView, {Marker} from "react-native-maps";
import {DB, SessionID} from "../Contexts";

import {iconsObjects} from "../components/MyAvatar";
import MyDialog from "../components/MyDialog";
import {MapScreenViewModel} from "../viewmodels/MapScreenViewModel";

const MapContext = createContext()

export function MapScreen() {
    const [dialogVisible, setDialogVisible] = useState(false)
    const [selected, setSelected] = useState(null)

    return (
        <MapContext.Provider
            value={{dialogVisible, setDialogVisible, selected, setSelected}}>
            <Appbar.Header mode='small' elevated>
                <Appbar.Content title="Map"/>
            </Appbar.Header>
            <MyMap/>
            {selected && <MyDialog data={selected} isVisible={dialogVisible} setIsVisible={setDialogVisible}
                                   object={selected.type}/>}
        </MapContext.Provider>
    )
}

function MyMap() {
    const sid = useContext(SessionID)
    const db = useContext(DB)
    const viewModel = new MapScreenViewModel(sid, db)

    const [currentLocation, setCurrentLocation] = useState({lat: 0, lon: 0})
    const [region, setRegion] = useState({
        latitude: currentLocation.lat,
        longitude: currentLocation.lon,
        latitudeDelta: 0.001,
        longitudeDelta: 0.001
    })

    const [objects, setObjects] = useState([])
    const [users, setUsers] = useState([])

    useEffect(() => {
        setRegion({...region, latitude: currentLocation.lat, longitude: currentLocation.lon})
        if (currentLocation.lat !== 0) {
            viewModel.getObjects(currentLocation.lat, currentLocation.lon)
                .then(value => setObjects(value))
            viewModel.getUsers(currentLocation.lat, currentLocation.lon)
                .then(value => setUsers(value))
        }
    }, [currentLocation]);

    return (
        <MapView
            style={{flex: 1}}
            provider={"google"}
            showsUserLocation
            scrollEnabled={false}
            minZoomLevel={15}
            region={region}
            onRegionChangeComplete={(newRegion) => setRegion(newRegion)}
            onUserLocationChange={(event) => setCurrentLocation({
                lat: event.nativeEvent.coordinate.latitude,
                lon: event.nativeEvent.coordinate.longitude
            })}
        >
            {objects.map((object) => <MyMarker key={object.id} item={object}/>)}
            {users.map((user) => <MyMarker key={user.uid} item={user}/>)}
        </MapView>
    )
}

function MyMarker({item}) {
    const {setDialogVisible, setSelected} = useContext(MapContext)

    return (
        <Marker
            coordinate={{latitude: item.lat, longitude: item.lon}}
            onPress={() => {
                setSelected(item)
                setDialogVisible(true)
            }}
        >
            <Icon size={40} source={item.type ? iconsObjects[item.type] : 'account'}/>
        </Marker>
    )
}