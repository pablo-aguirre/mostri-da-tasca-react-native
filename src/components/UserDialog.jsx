import {Button, Dialog, List, Portal, Text} from "react-native-paper";
import {UserAvatar} from "./MyAvatar";


export default function UserDialog({visible, setVisible, user}) {

    return (
        <Portal>
            <Dialog visible={visible} onDismiss={() => setVisible(false)}>
                <Dialog.Title style={{textAlign: 'center'}}>{user.name}</Dialog.Title>
                <Dialog.Content>
                    <UserAvatar user={user} large/>
                    <List.Item
                        left={() => <List.Icon icon='heart'/>}
                        title={'Life'}
                        right={() => <Text>{user.life}</Text>}
                    />
                    <List.Item
                        left={() => <List.Icon icon='chart-bar'/>}
                        title={'Experience'}
                        right={() => <Text>{user.experience}</Text>}
                    />
                </Dialog.Content>
                <Dialog.Actions>
                    <Button onPress={() => setVisible(false)}>Close</Button>
                </Dialog.Actions>
            </Dialog>
        </Portal>
    )
}