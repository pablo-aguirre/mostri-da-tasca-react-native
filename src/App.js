import {useEffect, useState} from "react";
import AppViewModel from "./viewmodels/AppViewModel";
import {BottomNavigation, PaperProvider} from "react-native-paper";
import RankingScreen from "./screens/RankingScreen";
import ProfileScreen from "./screens/ProfileScreen";

export default function App() {
    const [viewModel] = useState(new AppViewModel())
    const [sid, setSid] = useState(null)
    const [uid, setUid] = useState(null)

    useEffect(() => {
        viewModel.getSession().then(result => {
                setSid(result.sid)
                setUid(result.uid)
            }
        )
    }, []);

    const [index, setIndex] = useState(0)
    const [routes] = useState([
        {key: 'ranking', title: 'Ranking List', focusedIcon: 'trophy', unfocusedIcon: 'trophy-outline'},
        {key: 'profile', title: 'Profile', focusedIcon: 'account', unfocusedIcon: 'account-outline'},
    ])

    const renderScene = BottomNavigation.SceneMap({
        ranking: () => <RankingScreen sid={sid}/>,
        profile: () => <ProfileScreen session={{sid: sid, uid: uid}}/>
    })

    return (
        <PaperProvider>
            {sid &&
                <BottomNavigation
                    navigationState={{index, routes}}
                    onIndexChange={setIndex}
                    renderScene={renderScene}
                />
            }
        </PaperProvider>
    );
}