import React, {createContext, useContext, useEffect, useState} from "react";
import {Appbar, Icon} from "react-native-paper";
import * as Location from 'expo-location';
import MapView, {Marker} from "react-native-maps";
import CommunicationController from "../models/CommunicationController";
import {SessionID} from "../Contexts";

import {iconsObjects} from "../components/MyAvatar";
import MyDialog from "../components/MyDialog";

const MapContext = createContext()

export function MapScreen() {
    const [currentLocation, setCurrentLocation] = useState()
    const [dialogVisible, setDialogVisible] = useState(false)
    const [selectedObject, setSelectedObject] = useState(null)

    useEffect(() => {
        const periodicPosition = async () => {
            let {status} = await Location.requestForegroundPermissionsAsync()
            if (status === 'granted')
                Location.watchPositionAsync(
                    {
                        accuracy: Location.Accuracy.Balanced,
                        distanceInterval: 10
                    },
                    (newLocation) => {
                        setCurrentLocation({
                            lat: newLocation.coords.latitude,
                            lon: newLocation.coords.longitude
                        })
                    }
                )
        }
        periodicPosition()
    }, []);

    return (currentLocation &&
        <MapContext.Provider
            value={{currentLocation, dialogVisible, setDialogVisible, selectedObject, setSelectedObject}}>
            <Appbar.Header mode='small' elevated>
                <Appbar.Content title="Map"/>
            </Appbar.Header>
            <MyMap/>
            {selectedObject &&
                <MyDialog data={selectedObject} isVisible={dialogVisible} setIsVisible={setDialogVisible} object/>}
        </MapContext.Provider>
    )
}

function MyMap() {
    const {currentLocation} = useContext(MapContext)
    const sid = useContext(SessionID)
    const [region, setRegion] = useState({
        latitude: currentLocation.lat,
        longitude: currentLocation.lon,
        latitudeDelta: 0.0004,
        longitudeDelta: 0.0004
    })
    const [objects, setObjects] = useState([])

    useEffect(() => {
        setRegion({
            ...region,
            latitude: currentLocation.lat,
            longitude: currentLocation.lon
        })
        CommunicationController.nearbyObjects(sid, currentLocation.lat, currentLocation.lon)
            .then((result) => setObjects(result))
    }, [currentLocation])

    return (
        <MapView
            style={{width: '100%', height: '86%'}}
            provider={"google"}
            showsUserLocation
            //scrollEnabled={false}
            //minZoomLevel={15}
            showsMyLocationButton={true}
            region={region}
            onRegionChangeComplete={(newRegion) => setRegion(newRegion)}
        >
            {objects.map((object) => <MyMarker virtualObject={object}/>)}
        </MapView>
    )
}

function MyMarker({virtualObject}) {
    const sid = useContext(SessionID)
    const {setDialogVisible, setSelectedObject} = useContext(MapContext)

    const [details, setDetails] = useState()

    useEffect(() => {
        CommunicationController.objectInformation(sid, virtualObject.id)
            .then(result => setDetails(result))
    }, []);

    return (details &&
        <Marker
            key={details.id}
            coordinate={{latitude: details.lat, longitude: details.lon}}
            onPress={() => {
                setSelectedObject(details)
                setDialogVisible(true)
            }}
        >
            <Icon size={40} source={iconsObjects[details.type]}/>
        </Marker>
    )
}