import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useTheme } from "../components/ThemeProvider"
import Icon from 'react-native-vector-icons/MaterialIcons';
import ReceiptOverview from '../components/ReceiptOverview';

const HomeScreen = ({ navigation }) => {
    const styles = StyleSheet.create({
        ScreenStyle: {
            flex: 1,
            backgroundColor: useTheme().PageColor,
            paddingTop: useTheme().TopPadding,
            padding: useTheme().PagePadding,
        },
        HeaderContainer: {
            flexDirection: "row",
            justifyContent: 'space-between',
            alignItems: "center",
            marginBottom: 15
        },
        AppName: {
            color: useTheme().USDColor,
            fontSize: 60,
        },
        ProfileIcon: {
            size: 70,
            color: useTheme().TextColor,
            right: 0,
        },
        ScanBtn: {
            backgroundColor: useTheme().USDColor,
            justifyContent: "space-between",
            alignItems: "center",
            flexDirection: "row",
            marginTop: 15,
            marginBottom: 15,
            borderRadius: useTheme().BorderRadius,
            paddingLeft: 40,
            paddingRight: 40,
            paddingTop: 10,
            paddingBottom: 10,
        },
        ScanBtnText: {
            color: useTheme().TextColor,
            fontSize: 35,
        },
        RecentLabel: {
            marginTop: 15,
            color: useTheme().TextColor,
            fontSize: 30,
        },
    });

    const fetchReceiptHistory = () => {
        const receipts = [{
            place: "Goodfellas Pizza",
            date: "2024-10-3",
            total: 420.00,
            people: ["Doc", "Griff", "Buddy", "Baby", "Deborah", "Darling", "Bats", "Joseph", "J.D."]
        }, {
            place: "Bacchanalia",
            date: "2024-7-9",
            total: 800.85,
            people: ["Doc", "Baby", "Deborah"]
        }, {
            place: "Bo's Diner",
            date: "2024-10-3",
            total: 69.00,
            people: ["Buddy", "Baby", "Deborah", "Darling", "Bats"]
        }];

        return receipts;
    }

    return (
        <View style={styles.ScreenStyle}>
            <View style={styles.HeaderContainer}>
                <Text style={styles.AppName}>SmartSplit</Text>
                <Icon name="account-circle" style={styles.ProfileIcon} color={styles.ProfileIcon.color} size={styles.ProfileIcon.size}  />
            </View>
            <Pressable style={styles.ScanBtn}>
                <Icon name="photo-camera" style={styles.ProfileIcon} color={styles.ProfileIcon.color} size={styles.ProfileIcon.size}  />
                <Text style={styles.ScanBtnText}>Scan Receipt</Text>
            </Pressable>
            <Text style={styles.RecentLabel}>Recent Receipts</Text>
            {fetchReceiptHistory().map((receipt, receiptIndex) => {
                return (<ReceiptOverview key={receiptIndex} navigation={navigation} receipt={receipt}/>);
            })}
        </View>
    )
}

export default HomeScreen;