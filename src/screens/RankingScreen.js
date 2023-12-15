import {FlatList} from "react-native";
import React, {useEffect, useState} from "react";
import RankingViewModel from "../viewmodels/RankingViewModel";
import {ActivityIndicator, Appbar, Avatar, Dialog, Divider, IconButton, List, Portal, Text} from "react-native-paper";
import {globalStyles} from "../../styles/global";

export default function RankingScreen({sid}) {
    const [viewModel] = useState(new RankingViewModel(sid))
    const [rankingData, setRankingData] = useState([])
    const [dialogVisible, setDialogVisible] = useState(false)
    const [selectedUser, setSelectedUser] = useState()

    const toggleDialog = () => setDialogVisible(!dialogVisible);


    useEffect(() => {
        viewModel.getRanking()
            .then(result => setRankingData(result))
            .catch(error => console.error(`[RankingScreen] ${error}`))
    }, []);


    console.log(selectedUser);
    return (
        <>
            {selectedUser &&
                <Portal>
                    <Dialog visible={dialogVisible} onDismiss={() => {
                        toggleDialog()
                        setSelectedUser(undefined)
                    }}>
                        <Dialog.Title style={{textAlign: 'center'}}>{selectedUser.name}</Dialog.Title>
                        <Dialog.Content>
                            {(!selectedUser.picture || !/^[A-Za-z0-9+/]*={0,2}$/.test(selectedUser.picture)) ?
                                <Avatar.Text label={selectedUser.name.charAt(0).toUpperCase()}
                                             style={globalStyles.avatar} size={150}/> :
                                <Avatar.Image source={{uri: `data:image/png;base64,${selectedUser.picture}`}}
                                              style={globalStyles.avatar} size={150}/>
                            }
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

            <Appbar.Header mode='small' elevated>
                <Appbar.Content title="Ranking List"/>
            </Appbar.Header>
            {rankingData.length === 0 ? <ActivityIndicator size='large' style={{alignSelf: 'center'}}/> :
                <FlatList data={rankingData} renderItem={({item}) =>
                    <>
                        <List.Item
                            title={item.name}
                            description={`${item.experience} XP`}
                            style={{paddingHorizontal: 10}}
                            left={() =>
                                (!item.picture || !/^[A-Za-z0-9+/]*={0,2}$/.test(item.picture)) ?
                                    <Avatar.Text label={item.name.charAt(0).toUpperCase()}
                                                 style={globalStyles.avatar}/> :
                                    <Avatar.Image source={{uri: `data:image/png;base64,${item.picture}`}}
                                                  style={globalStyles.avatar}/>
                            }
                            right={() =>
                                <IconButton mode={"contained"} icon={"account-details"} onPress={() => {
                                    setSelectedUser(item)
                                    toggleDialog()
                                }}/>
                            }
                        />
                        <Divider/>
                    </>
                }
                />
            }
        </>
    );
}

