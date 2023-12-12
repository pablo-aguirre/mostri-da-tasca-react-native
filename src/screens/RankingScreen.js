import {FlatList} from "react-native";
import React, {useEffect, useState} from "react";
import RankingViewModel from "../viewmodels/RankingViewModel";
import {Appbar, Avatar, Dialog, Divider, IconButton, List, Portal, Text} from "react-native-paper";

export default function RankingScreen({sid}) {
    const [viewModel] = useState(new RankingViewModel(sid))
    const [rankingData, setRankingData] = useState([])
    const [dialogVisible, setDialogVisible] = useState(false)
    const showDialog = () => setDialogVisible(true);
    const hideDialog = () => setDialogVisible(false);

    const [selectedUser, setSelectedUser] = useState()
    const toggleDialog = () => {
        setDialogVisible(!dialogVisible)
    }

    useEffect(() => {
        viewModel.getRanking().then(result => setRankingData(result)).catch(error => console.error(error))
    }, []);

    return (
        <>
            {selectedUser &&
                <Portal>
                    <Dialog visible={dialogVisible} onDismiss={hideDialog}>
                        <Dialog.Title style={{textAlign: 'center'}}>{selectedUser.name}</Dialog.Title>
                        <Dialog.Content>
                            {selectedUser.picture ?
                                <Avatar.Image size={150} style={{alignSelf: 'center'}}
                                              source={{uri: `data:image/jpg;base64,${selectedUser.picture}`}}/> :
                                <Avatar.Text size={150} style={{alignSelf: 'center'}}
                                             label={selectedUser.name.charAt(0)}/>}
                            <List.Item
                                title={'Life points'}
                                right={() => <Text>{selectedUser.life}</Text>}
                            />
                            <List.Item
                                title={'Experience'}
                                right={() => <Text>{selectedUser.experience}</Text>}
                            />
                        </Dialog.Content>

                    </Dialog>
                </Portal>
            }

            <Appbar.Header mode='small'>
                <Appbar.Content title="Ranking list" disabled/>
            </Appbar.Header>
            <FlatList data={rankingData} renderItem={({item}) =>
                <>
                    <List.Item
                        title={item.name}
                        description={`${item.experience} XP`}
                        style={{paddingHorizontal: 10}}
                        left={() =>
                            item.picture ?
                                <Avatar.Image source={{uri: `data:image/jpg;base64,${item.picture}`}}/> :
                                <Avatar.Text label={item.name.charAt(0)}/>
                        }
                        right={() =>
                            <IconButton mode={"contained"} icon={"account-details"} onPress={() => {
                                setSelectedUser(item)
                                showDialog()
                            }}/>
                        }
                    />
                    <Divider/>
                </>
            }
            />
        </>
    );
}

