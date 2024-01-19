import {FlatList} from "react-native";
import React, {createContext, useContext, useEffect, useState} from "react";
import {ActivityIndicator, Appbar, DefaultTheme, Divider, IconButton, List} from "react-native-paper";
import {SessionID} from "../Contexts";
import {UserAvatar} from "../components/MyAvatar";
import {getRankingList} from "../viewmodels/RankingViewModel";
import UserDialog from "../components/UserDialog";

const RankingListContext = createContext()

export default function RankingScreen() {
    const sid = useContext(SessionID)
    const [rankingData, setRankingData] = useState([])
    const [dialogVisible, setDialogVisible] = useState(false)
    const [selectedUser, setSelectedUser] = useState(undefined)


    useEffect(() => {
        updateRankingList()
    }, [])

    const updateRankingList = () => {
        getRankingList(sid)
            .then(setRankingData)
            .catch(() => alert("Connection error, users load impossible."))
    }

    return (
        <RankingListContext.Provider value={{setDialogVisible, setSelectedUser}}>
            <Appbar.Header mode='small' elevated>
                <Appbar.Content title="Ranking List"/>
                <Appbar.Action icon={'refresh'} onPress={() => updateRankingList()}/>
            </Appbar.Header>

            {rankingData.length === 0 ? <ActivityIndicator size='large' style={{flex: 1}}/> :
                <FlatList
                data={rankingData}
                renderItem={({item}) =>
                    <SingleRow
                        user={item}
                        setSelectedUser={setSelectedUser}
                        setDialogVisible={setDialogVisible}
                    />
                }
            />}
            {selectedUser && <UserDialog user={selectedUser} visible={dialogVisible} setVisible={setDialogVisible}/>}
        </RankingListContext.Provider>
    )
}

function SingleRow({user}) {
    const {setSelectedUser, setDialogVisible} = useContext(RankingListContext)
    return (
        <>
            <List.Item
                style={{paddingHorizontal: 10}}
                title={user.name}
                description={`${user.experience} XP`}
                left={() => <UserAvatar user={user}/>}
                right={() =>
                    <IconButton
                        style={{alignSelf: 'center'}}
                        iconColor={DefaultTheme.colors.primary}
                        icon={"information-outline"}
                        onPress={() => {
                            setSelectedUser(user)
                            setDialogVisible(true)
                        }}
                    />
                }
            />
            <Divider/>
        </>
    )
}
