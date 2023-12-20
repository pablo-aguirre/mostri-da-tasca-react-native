import {FlatList, View} from "react-native";
import React, {createContext, useContext, useEffect, useState} from "react";
import RankingViewModel from "../viewmodels/RankingViewModel";
import {Appbar, Dialog, Divider, IconButton, List, Portal, Text} from "react-native-paper";
import {DB, SessionID} from "../Contexts";
import {UserAvatar} from "../components/MyAvatar";

const RankingListContext = createContext()

export default function RankingScreen() {
    const sid = useContext(SessionID)
    const db = useContext(DB)
    const viewModel = new RankingViewModel(sid, db)

    const [rankingData, setRankingData] = useState([])
    const [dialogVisible, setDialogVisible] = useState(false)
    const [selectedUser, setSelectedUser] = useState(undefined)

    const updateRankingList = async () => {
        console.log('[updateRankingList] updating rankingData...')
        setRankingData(await viewModel.getRanking())
    }

    useEffect(() => {
        updateRankingList()
    }, [])

    return (
        <RankingListContext.Provider value={{setDialogVisible, setSelectedUser, dialogVisible, selectedUser}}>
            <Appbar.Header mode='small' elevated>
                <Appbar.Content title="Ranking List"/>
                <Appbar.Action icon={'refresh'} onPress={() => updateRankingList()}/>
            </Appbar.Header>

            <FlatList
                data={rankingData}
                renderItem={({item}) =>
                    <SingleRow
                        user={item}
                        setSelectedUser={setSelectedUser}
                        setDialogVisible={setDialogVisible}
                    />
                }
            />

            {selectedUser !== undefined && <DialogSelectedUser/>}
        </RankingListContext.Provider>
    )
}

function SingleRow({user}) {
    const {setSelectedUser, setDialogVisible} = useContext(RankingListContext)
    return (
        <View>
            <List.Item
                style={{paddingHorizontal: 10}}
                title={user.name}
                description={`${user.experience} XP`}
                left={() => <UserAvatar user={user}/>}
                right={() =>
                    <IconButton
                        mode={"contained"}
                        icon={"account-details"}
                        onPress={() => {
                            setSelectedUser(user)
                            setDialogVisible(true)
                        }}
                    />
                }
            />
            <Divider/>
        </View>
    )
}

function DialogSelectedUser() {
    const {dialogVisible, selectedUser, setDialogVisible, setSelectedUser} = useContext(RankingListContext)
    return (
        <Portal>
            <Dialog
                visible={dialogVisible}
                onDismiss={() => {
                    setSelectedUser(undefined)
                    setDialogVisible(false)
                }}>
                <Dialog.Title style={{textAlign: 'center'}}>{selectedUser.name}</Dialog.Title>
                <Dialog.Content>
                    <UserAvatar user={selectedUser} large/>
                    <List.Item
                        left={() => <List.Icon icon={'heart'}/>}
                        title={'Life points'}
                        right={() => <Text>{selectedUser.life}</Text>}
                    />
                    <List.Item
                        left={() => <List.Icon icon={'chart-bar'}/>}
                        title={'Experience'}
                        right={() => <Text>{selectedUser.experience}</Text>}
                    />
                </Dialog.Content>
            </Dialog>
        </Portal>
    )
}
