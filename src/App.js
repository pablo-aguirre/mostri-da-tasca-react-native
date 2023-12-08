import {View} from 'react-native';
import {globalStyles} from "../styles/global";
import RankingScreen from "./screens/RankingScreen";
import {useState} from "react";
import AppViewModel from "./viewmodels/AppViewModel";

export default function App() {
    const [viewModel] = useState(new AppViewModel())

    return (
        <View style={globalStyles.container}>
            <RankingScreen sid={viewModel.getSid()}/>
        </View>
    );
}
