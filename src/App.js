import {useEffect, useState} from "react";
import AppViewModel from "./viewmodels/AppViewModel";
import {BottomNavigation, PaperProvider} from "react-native-paper";
import RankingScreen from "./screens/RankingScreen";
import ProfileScreen from "./screens/ProfileScreen";
import {Prova} from "./viewmodels/Prova";

export default function App() {
    const [viewModel] = useState(new AppViewModel())
    const [session, setSession] = useState(null)

    useEffect(() => {
        viewModel.getSession().then(result => {
            setSession(result)
        })
    }, []);

    const [index, setIndex] = useState(0)
    const [routes] = useState([
        {key: 'prova', title: 'Prova'},
        {key: 'ranking', title: 'Ranking List', focusedIcon: 'trophy', unfocusedIcon: 'trophy-outline'},
        {key: 'profile', title: 'Profile', focusedIcon: 'account', unfocusedIcon: 'account-outline'},
    ])

    const renderScene = BottomNavigation.SceneMap({
        prova: () => <Prova/>,
        ranking: () => <RankingScreen sid={session.sid}/>,
        profile: () => <ProfileScreen session={session}/>
    })

    return (
        <PaperProvider>
            {session &&
                <BottomNavigation
                    navigationState={{index, routes}}
                    onIndexChange={setIndex}
                    renderScene={renderScene}
                />
            }
        </PaperProvider>
    );
}