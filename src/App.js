import {ActivityIndicator, View} from 'react-native';
import {globalStyles} from "../styles/global";
import RankingScreen from "./screens/RankingScreen";
import {useEffect, useState} from "react";
import AppViewModel from "./viewmodels/AppViewModel";

export default function App() {
    const [viewModel] = useState(new AppViewModel())
    const [session, setSession] = useState({sid: undefined, uid: undefined})

    useEffect(() => {
        viewModel.getSid().then(result => {
            setSession(result)
        })
    }, []);

    return (
        <View style={globalStyles.container}>
            {
                session.sid === undefined ? <ActivityIndicator size='large'/> :
                <RankingScreen sid={session.sid}/>
            }
        </View>
    );
}
