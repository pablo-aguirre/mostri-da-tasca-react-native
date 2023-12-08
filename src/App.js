import {View} from 'react-native';
import {globalStyles} from "../styles/global";
import RankingScreen from "./screens/RankingScreen";

export default function App() {
  return (
      <View style={globalStyles.container}>
        <RankingScreen />
      </View>
  );
}
