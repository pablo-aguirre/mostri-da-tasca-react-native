import {Button, DefaultTheme, Dialog, Icon, List, Portal, Text} from "react-native-paper";
import {UserAvatar} from "./MyAvatar";
import MapView, {Marker} from "react-native-maps";


export default function UserDialog({visible, setVisible, user}) {

    return (
        <Portal>
            <Dialog visible={visible} onDismiss={() => setVisible(false)}>
                <Dialog.Title style={{textAlign: 'center'}}>{user.name}</Dialog.Title>
                <Dialog.Content>
                    <UserAvatar user={user} large/>
                    <List.Item
                        left={() => <List.Icon icon='heart' color={DefaultTheme.colors.primary}/>}
                        title={'Life'}
                        right={() => <Text>{user.life}</Text>}
                    />
                    <List.Item
                        left={() => <List.Icon icon='chart-bar' color={DefaultTheme.colors.primary}/>}
                        title={'Experience'}
                        right={() => <Text>{user.experience}</Text>}
                    />
                    {user.positionshare &&
                        <MapView
                            style={{height: 150}}
                            provider='google'
                            region={{
                                latitude: user.lat,
                                longitude: user.lon,
                                latitudeDelta: 0.003,
                                longitudeDelta: 0.003
                            }}
                            scrollEnabled={false}
                            minZoomLevel={10}
                        >
                            <Marker coordinate={{latitude: user.lat, longitude: user.lon}}>
                                <Icon size={40} source='account'/>
                            </Marker>
                        </MapView>
                    }
                </Dialog.Content>
                <Dialog.Actions>
                    <Button onPress={() => setVisible(false)}>Close</Button>
                </Dialog.Actions>
            </Dialog>
        </Portal>
    )
}