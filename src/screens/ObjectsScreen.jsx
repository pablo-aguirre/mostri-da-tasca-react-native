import {Appbar, Chip, Divider, IconButton, List} from "react-native-paper";
import {FlatList} from "react-native";
import {useContext, useEffect, useState} from "react";
import {getNearbyObjects, isActivable} from "../viewmodels/ObjectsListViewModel";
import {CurrentLocation, SessionID} from "../Contexts";
import {ObjectAvatar} from "../components/MyAvatar";
import ObjectDialog from "../components/ObjectDialog";

export default function ObjectsScreen() {
    const sid = useContext(SessionID)
    const location = useContext(CurrentLocation)

    const [objects, setObjects] = useState([])
    const [selected, setSelected] = useState()
    const [visibleDialog, setVisibleDialog] = useState(false)

    useEffect(() => {
        updateObjects()
    }, []);

    const updateObjects = () => {
        getNearbyObjects(sid, location.lat, location.lon)
            .then(setObjects)
            .catch(() => alert("Connection error: objects load impossible."))
    }

    return (
        <>
            <Appbar.Header mode='small' elevated>
                <Appbar.Content title="Nearby objects"/>
                <Appbar.Action icon={'refresh'} onPress={updateObjects}/>
            </Appbar.Header>
            <FlatList
                data={objects}
                renderItem={({item}) => <SingleRow object={item} setSelected={setSelected}
                                                   setVisibleDialog={setVisibleDialog}/>}
            />
            {selected && <ObjectDialog visible={visibleDialog} object={selected} setVisible={setVisibleDialog}/>}
        </>
    )
}

function SingleRow({object, setSelected, setVisibleDialog}) {
    const location = useContext(CurrentLocation)
    const [nearMe, setNearMe] = useState(false)

    useEffect(() => {
        isActivable(location, object).then(setNearMe)
    }, [])

    return (
        <>
            <List.Item
                style={{paddingHorizontal: 10}}
                left={() => <ObjectAvatar object={object}/>}
                title={object.name}
                description={() => nearMe ? <Chip>Can be activated</Chip> : ''}
                right={() =>
                    <IconButton
                        style={{alignSelf: 'center'}}
                        icon={'information-outline'}
                        onPress={() => {
                            setSelected(object)
                            setVisibleDialog(true)
                        }}
                    />
                }
            />
            <Divider/>
        </>
    )
}