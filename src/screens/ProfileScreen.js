import {Text} from "@rneui/themed";
import {View} from "react-native";

export default function ProfileScreen({sid}) {
    return (
        <View>
            <Text>
                Nome utente (modificabile)
            </Text>
            <Text>
                Immagine del profilo (modificabile)
            </Text>
            <Text>
                Posizione condivisa (booleano modificabile)
            </Text>
            <Text>
                Punti vita
            </Text>
            <Text>
                Punti esperienza
            </Text>
            <Text>
                ARTEFATTI
            </Text>
        </View>
    )
}