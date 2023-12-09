import {ActivityIndicator, View} from 'react-native';
import {globalStyles} from "../styles/global";
import RankingScreen from "./screens/RankingScreen";
import {useEffect, useState} from "react";
import AppViewModel from "./viewmodels/AppViewModel";
import ProfileScreen from "./screens/ProfileScreen";

export default function App() {
    const [viewModel] = useState(new AppViewModel())
    const [session, setSession] = useState({sid: undefined, uid: undefined})

    useEffect(() => {
        viewModel.getSession().then(result => {
            setSession(result)
        })
    }, []);

    return (
        <View style={globalStyles.container}>
            {
                session.sid === undefined ? <ActivityIndicator size='large'/> :
                <ProfileScreen session={session}/>
            }
        </View>
    );
}
