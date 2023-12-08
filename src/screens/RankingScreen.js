import {ActivityIndicator, FlatList, SafeAreaView, View} from "react-native";
import {Avatar, Card, Dialog, ListItem} from "@rneui/themed";
import React, {useEffect, useState} from "react";
import RankingViewModel from "../viewmodels/RankingViewModel";
import {globalStyles} from "../../styles/global";

export default function RankingScreen({sid}) {
    const [viewModel] = useState(new RankingViewModel(sid))
    const [rankingData, setRankingData] = useState([])
    const [dialogVisible, setDialogVisible] = useState(false)
    const [selectedUser, setSelectedUser] = useState()
    const toggleDialog = () => {
        setDialogVisible(!dialogVisible)
    }

    useEffect(() => {
        viewModel.getRanking().then(result => setRankingData(result)).catch(error => console.error(error))
    }, []);

    return (
        <SafeAreaView>
            {
                rankingData.length === 0 ? <ActivityIndicator size="large"/> :
                    <View>
                        <Dialog isVisible={dialogVisible} onBackdropPress={toggleDialog}>
                            <SingleUserInformation selectedUser={selectedUser}/>
                        </Dialog>
                        <FlatList data={rankingData} renderItem={({item}) =>
                            <SingleUserList
                                item={item}
                                toggleDialog={toggleDialog}
                                setSelectedUser={setSelectedUser}/>}
                        />
                    </View>
            }
        </SafeAreaView>
    );
}

function SingleUserList({item, toggleDialog, setSelectedUser}) {
    return (
        <ListItem bottomDivider
                  onPress={() => {
                      toggleDialog()
                      setSelectedUser(item)
                  }}>
            <Avatar rounded
                    size="large"
                    title={item.name.charAt(0)}
                    source={{uri: `data:image/jpg;base64,${item.picture}`}}
            />
            <ListItem.Content>
                <ListItem.Title>
                    {item.name}
                </ListItem.Title>
            </ListItem.Content>
            <ListItem.Content right>
                <ListItem.Subtitle>
                    {item.experience} XP
                </ListItem.Subtitle>
            </ListItem.Content>
        </ListItem>
    );
}

function SingleUserInformation({selectedUser}) {
    return (
        <View>
            <Card.Title>{selectedUser.name}</Card.Title>
            <Card.Divider/>
            <Avatar
                rounded
                containerStyle={globalStyles.avatar}
                size="xlarge"
                title={selectedUser.name.charAt(0)}
                source={{uri: `data:image/jpg;base64,${selectedUser.picture}`}}
            />
            <FlatList
                data={['life', 'experience']}
                renderItem={({item}) =>
                    <ListItem>
                        <ListItem.Content>
                            <ListItem.Title>
                                {item.charAt(0).toUpperCase() + item.slice(1)}
                            </ListItem.Title>
                        </ListItem.Content>
                        <ListItem.Content right>
                            <ListItem.Subtitle>
                                {selectedUser[item]}
                            </ListItem.Subtitle>
                        </ListItem.Content>
                    </ListItem>
                }
            />
        </View>
    );
}

