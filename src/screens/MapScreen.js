import React, {useEffect, useState} from "react";

import * as Location from 'expo-location';
import MapView from 'react-native-maps'
import {Appbar} from "react-native-paper";

export function MapScreen() {
    const [location, setLocation] = useState()
    const [region, setRegion] = useState()

    useEffect(() => {
        Location.requestForegroundPermissionsAsync()
            .then(result => console.log(`[MapScreen] permissions: ${JSON.stringify(result)}`))
        Location.watchPositionAsync(
            {
                accuracy: Location.Accuracy.High,
                distanceInterval: 1
            },
            (newLocation) => {
                console.log(`[MapScreen] new location: ${JSON.stringify(newLocation)}`)
                setLocation(newLocation.coords)
            }
        )
    }, []);

    useEffect(() => {
        setRegion({...location, latitudeDelta: 0.005, longitudeDelta: 0.005})
    }, [location]);

    console.log(location);
    console.log(region);
    return (
        <>
            <Appbar.Header mode='small' elevated>
                <Appbar.Content title="Map"/>
            </Appbar.Header>
            <MapView
                showsUserLocation
                region={region}
                style={{width: '100%', height: '86%'}}
            />
        </>
    )
}