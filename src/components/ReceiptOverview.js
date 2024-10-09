import { View, Pressable, Text, StyleSheet, FlatList } from 'react-native'
import { useTheme } from "./ThemeProvider"
import Icon from 'react-native-vector-icons/MaterialIcons';

const ReceiptOverview = ({ navigation, receipt }) => {
    const spliteeIconColors = ["#558040", "#804040", "#807540", "#408060", "#406A80", "#4A4080", "#804080", "#80404A"];
    const theme = useTheme();

    const styles = StyleSheet.create({
        Container: {
            flexDirection: "row",
            backgroundColor: useTheme().AccentColor,
            marginTop: 15,
            marginBottom: 15,
            padding: 10,
            borderRadius: useTheme().BorderRadius,
        },
        DetailsContainer: {
            justifyContent: "space-between",
        },
        HeaderTextStyle: {
            fontSize: 20,
            color: useTheme().TextColor,
            margin: 10,
        },
        InfoTextStyle: {
            fontSize: 15,
            color: useTheme().TextColor,
            margin: 10,
        },
        SpliteeContainer: {
            flex: 1,
            alignItems: 'flex-end',
        },
        gridItem: {
            width: 45,
            height: 45,
            alignItems: "center",
        },
    });

    const renderItem = ({ item, index }) => (
        index < 8 ?
            <View style={styles.gridItem}>
                <Icon
                    name="account-circle"
                    color={spliteeIconColors[index]}
                    size={35}
                />
            </View>
            :
            index == 8 ?
                <View style={styles.gridItem}>
                    <Icon
                        name="more-horiz"
                        color={theme.TextColor}
                        size={35}
                    />
                </View> : <></>
    );

    return (
        <Pressable style={styles.Container}>
            <View style={styles.DetailsContainer}>
                <Text style={styles.HeaderTextStyle}>
                    Place:
                </Text>
                <Text style={styles.HeaderTextStyle}>
                    Date:
                </Text>
                <Text style={styles.HeaderTextStyle}>
                    Total:
                </Text>
            </View>
            <View style={styles.DetailsContainer}>
                <Text style={styles.InfoTextStyle}>
                    {receipt.place}
                </Text>
                <Text style={styles.InfoTextStyle}>
                    {receipt.date}
                </Text>
                <Text style={styles.InfoTextStyle}>
                    {"$ " + receipt.total.toFixed(2)}
                </Text>
            </View>
            <View style={styles.SpliteeContainer}>
                <FlatList
                    data={receipt.people}
                    renderItem={renderItem}
                    keyExtractor={(item, index) => index.toString()}
                    numColumns={3}
                />
            </View>
        </Pressable>
    )
}

export default ReceiptOverview;