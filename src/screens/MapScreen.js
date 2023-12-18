import {Button} from "react-native-paper";
import {SafeAreaView} from "react-native";
import {useState} from "react";
import CommunicationController from "../models/CommunicationController";

import * as Location from 'expo-location';
import MapView, {Marker} from 'react-native-maps'

export function MapScreen() {
    const [coords, setCoords] = useState()
    const [data, setData] = useState([])

    const updateData = async () => {
        setData(await CommunicationController.nearbyUsers('vKFPFt1XC0L0i1fzV7eY', coords.lat, coords.lon))
        data.map((value) => console.log(value))
    }

    const locationPermissionAsync = async () => {
        let canUseLocation = false
        const grantedPermission = await Location.getForegroundPermissionsAsync()
        if (grantedPermission.status === "granted") {
            canUseLocation = true
        } else {
            const permissionResponse = await Location.requestForegroundPermissionsAsync()
            if (permissionResponse.status === "granted") {
                canUseLocation = true
            }
        }
        console.log(canUseLocation ? 'Ho i permessi' : 'Non ho i permessi')
    }

    const currentPosition = async () => {
        const location = await Location.getCurrentPositionAsync()
        setCoords({
            lat: location.coords.latitude,
            lon: location.coords.longitude,
            latitude: location.coords.latitude,
            longitude: location.coords.longitude
        })
        console.log(coords)
    }

    return (
        <SafeAreaView>
            <Button onPress={() => updateData()}>
                Users near me
            </Button>
            <Button onPress={() => locationPermissionAsync()}>
                Get Permissions
            </Button>
            <Button onPress={() => currentPosition()}>
                Update Position
            </Button>
            <MapView
                showsUserLocation
                style={{width:'100%', height:'100%'}}
            >
                {data.map((user) =>
                    <Marker key={user.uid} coordinate={{latitude:user.lat, longitude: user.lon}}/>
                )}
            </MapView>
        </SafeAreaView>
    )
}