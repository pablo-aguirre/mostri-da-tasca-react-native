import {Button, Dialog, List, Portal, Text} from "react-native-paper";
import {iconsObjects, ObjectAvatar} from "./MyAvatar";
import {activate, activationType, confirmationText, isActivable, titleText} from "../viewmodels/ObjectsListViewModel";
import {useContext, useEffect, useState} from "react";
import {CurrentLocation, SessionID} from "../Contexts";

export default function ObjectDialog({visible, setVisible, object}) {
    const sid = useContext(SessionID)
    const location = useContext(CurrentLocation)

    const [nearMe, setNearMe] = useState(false)

    const [confirmationDialogVisible, setConfirmationDialogVisible] = useState(false)
    const [resultDialogVisible, setResultDialogVisible] = useState(false)
    const [state, setState] = useState()

    useEffect(() => {
        isActivable(location, object).then(setNearMe)
    }, [object])

    const hideDialogs = () => {
        setVisible(false)
        setConfirmationDialogVisible(false)
        setResultDialogVisible(false)
    }

    return (
        <Portal>

            <Dialog visible={visible} onDismiss={hideDialogs}>
                <Dialog.Title style={{textAlign: 'center'}}>{object.name}</Dialog.Title>
                <Dialog.Content>
                    <ObjectAvatar object={object} large/>
                    <List.Item
                        left={() => <List.Icon icon='alphabetical-variant'/>}
                        title={'Type'}
                        right={() => <Text>{object.type}</Text>}
                    />
                    <List.Item
                        left={() => <List.Icon icon='arm-flex'/>}
                        title={'Level'}
                        right={() => <Text>{object.level}</Text>}
                    />
                </Dialog.Content>
                <Dialog.Actions>
                    <Button onPress={() => hideDialogs()}>Close</Button>
                    <Button disabled={!nearMe}
                            onPress={() => {
                                setConfirmationDialogVisible(true)
                                setVisible(false)
                            }}>{activationType(object)}</Button>
                </Dialog.Actions>
            </Dialog>

            <Dialog visible={confirmationDialogVisible} onDismiss={hideDialogs}>
                <Dialog.Icon icon={iconsObjects[object.type]}/>
                <Dialog.Title style={{textAlign: 'center'}}>{titleText(object)}</Dialog.Title>
                <Dialog.Content>
                    <Text variant="bodyLarge">{confirmationText(object)}</Text>
                </Dialog.Content>
                <Dialog.Actions>
                    <Button onPress={() => {
                        setVisible(true)
                        setConfirmationDialogVisible(false)
                    }}>Close</Button>
                    <Button
                        onPress={() => {
                            activate(sid, object)
                                .then((value) => {
                                    setState(value)
                                    setConfirmationDialogVisible(false)
                                    setResultDialogVisible(true)
                                }).catch(alert)
                        }}>Confirm</Button>
                </Dialog.Actions>
            </Dialog>

            <Dialog visible={resultDialogVisible} onDismiss={hideDialogs}>
                <Dialog.Title style={{textAlign: 'center'}}>Your current state</Dialog.Title>
                <Dialog.Content>
                    <List.Item
                        left={() => <List.Icon icon='heart'/>}
                        title={'Life'}
                        right={() => <Text>{state.life}</Text>}
                    />
                    <List.Item
                        left={() => <List.Icon icon='chart-bar'/>}
                        title={'Experience'}
                        right={() => <Text>{state.experience}</Text>}
                    />
                </Dialog.Content>
                <Dialog.Actions>
                    <Button onPress={hideDialogs}>Ok</Button>
                </Dialog.Actions>
            </Dialog>

        </Portal>
    )
}