import React, {useContext} from 'react';
import {Button, Dialog, List, Portal, Text} from 'react-native-paper';
import {ObjectAvatar, UserAvatar} from './MyAvatar';
import {Alert} from 'react-native';
import CommunicationController from "../models/CommunicationController";
import {SessionID} from "../Contexts";

export default function MyDialog({data, isVisible, setIsVisible, object}) {
    const fields = object ? ['type', 'level'] : ['life', 'experience'];
    const icons = object ? ['ab-testing', 'chevron-double-up'] : ['heart', 'chart-bar'];

    const renderItem = (value, index) => (
        <List.Item
            key={value}
            left={() => <List.Icon icon={icons[index]}/>}
            title={value}
            right={() => <Text>{data[value]}</Text>}
        />
    );

    return (
        <Portal>
            <Dialog visible={isVisible} onDismiss={() => setIsVisible(false)}>
                <Dialog.Title style={{textAlign: 'center'}}>{data.name}</Dialog.Title>
                <Dialog.Content>
                    {object ? <ObjectAvatar object={data} large/> : <UserAvatar user={data} large/>}
                    {fields.map(renderItem)}
                </Dialog.Content>
                {object && <ActiveObject object={data}/>}
            </Dialog>
        </Portal>
    );
}

function ActiveObject({object}) {
    const sid = useContext(SessionID)
    const buttonText = {
        candy: 'Eat',
        monster: 'Attack',
        weapon: 'Equip',
        armor: 'Equip',
        amulet: 'Equip',
    }[object.type];

    const customMessage = () => {
        if (object.type === 'candy')
            return `You will increase your life in a range of ${object.level} to ${object.level * 2}.`;
        if (object.type === 'monster')
            return `You will lose life and gain experience in a range of ${object.level} to ${object.level * 2}.`;
        return `You will substitute your current ${object.type} with this one.`;
    };

    const handleActivation = (action, result) => {
        Alert.alert(
            `${action}`,
            `Your current life is ${result.life} and your current experience is ${result.experience}`,
            [{text: 'Ok'}]
        )
    };

    const handleButtonPress = () => {
        Alert.alert(
            `Are you sure you want to ${buttonText.toLowerCase()} this ${object.type}?`,
            customMessage(),
            [
                {text: 'Cancel'},
                {text: 'Ok', onPress: () => CommunicationController.activateObject(sid, object.id).then(result => handleActivation(buttonText, result))},
            ]
        );
    };

    return (
        <Dialog.Actions>
            <Button onPress={handleButtonPress}>{buttonText}</Button>
        </Dialog.Actions>
    );
}
