import CommunicationController from "../models/CommunicationController";
import AsyncStorage from "@react-native-async-storage/async-storage";
import StorageManager from "../models/StorageManager";

export async function getNearbyObjects(sid, lat, lon) {
    const objectsFromServer = await CommunicationController.nearbyObjects(sid, lat, lon)

    let objects = []
    for (let object of objectsFromServer) {
        let objectFromDB = await StorageManager.selectObjectFrom(object.id)
        if (objectFromDB.length === 0) {
            let objectFromServer = await CommunicationController.objectInformation(sid, object.id)
            await StorageManager.insertObject(objectFromServer)
            objectFromDB = [objectFromServer]
        }
        objects.push({...objectFromDB[0], lat: object.lat, lon: object.lon})
    }
    return objects
}

function haversine(lat1, lon1, lat2, lon2) {
    const R = 6371; // Raggio medio della Terra in chilometri
    const dLat = toRadians(lat2 - lat1)
    const dLon = toRadians(lon2 - lon1)

    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2)

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

    return R * c * 1000 // distanza in metri
}

function toRadians(degrees) {
    return degrees * (Math.PI / 180);
}

export async function isActivable(myLocation, object) {
    const distance = haversine(myLocation.lat, myLocation.lon, object.lat, object.lon)
    let amuletBonus = await AsyncStorage.getItem('amulet')
    amuletBonus = amuletBonus ? parseInt(amuletBonus) : 0
    return distance <= 100 + amuletBonus
}

export function activationType(object) {
    switch (object.type) {
        case 'monster':
            return 'Attack'
        case 'candy':
            return 'Eat'
        default:
            return 'Equip'
    }
}

export function confirmationText(object) {
    switch (object.type) {
        case 'monster':
            return `You could loose life and gain experience in a range of ${object.level} to ${object.level * 2}.\nIf you die, you will lose experience, equipment and your life will be reset to 100.`
        case 'candy':
            return `You could increase your life in a range of ${object.level} to ${object.level * 2}.`
        default:
            return `You will substitute your current ${object.type} with this one.`
    }
}

export function titleText(object) {
    return `Are you sure you want to ${activationType(object).toLowerCase()} this ${object.type}?`
}

export async function activate(sid, object) {
    // salvare in async storage l'oggetto equipaggiato, se è di tipo amulet salvare il bonus
    if (object.type === 'amulet')
        await AsyncStorage.setItem('amulet', object.level.toString())

    return await CommunicationController.activateObject(sid, object.id)
}