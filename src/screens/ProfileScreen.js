import {Button, Card, Input} from "@rneui/themed";
import {ActivityIndicator, SafeAreaView, View} from "react-native";
import React, {useEffect, useState} from "react";
import ProfileViewModel from "../viewmodels/ProfileViewModel";


/** TODO
 *  - immagine del profilo (modificabile)
 *  - nome utente (modificabile)
 *  - posizione condivisa (booleano modificabile)
 *  - punti vita
 *  - punti esperienza
 *  - artefatti
 */
export default function ProfileScreen({session}) {
    const [viewModel] = useState(new ProfileViewModel(session))
    const [user, setUser] = useState()
    const [editing, setEditing] = useState(false)

    useEffect(() => {
        viewModel.getUser().then(result => setUser(result))
    }, []);

    const toggleEdit = () => {
        setEditing(!editing)
    }

    return (
        <>
            {
                user === undefined ? <ActivityIndicator/> :
                    <>
                        {editing ?
                            <View >
                                <Input value={user.name} onChangeText={(text) => setUser({...user, name: text})}/>
                                <Button title='OK' onPress={() => {
                                    viewModel.updateName(user.name)
                                    toggleEdit()
                                }}/>
                            </View> :
                            <>
                                <Card.Title> {user.name}</Card.Title>
                                <Button title='Modifica' onPress={() => toggleEdit()}/>
                            </>
                        }
                    </>
            }
        </>
    )
}