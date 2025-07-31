import ReceiptOverview from "@/components/ReceiptOverview";
import { ThemedView } from "@/components/ThemedView";
import { useTheme } from "@/contexts/ThemeProvider";
import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/MaterialIcons";

const HomeScreen = () => {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const theme = useTheme()

  const styles = StyleSheet.create({
    HeaderContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 15,
    },
    AppName: {
      color: theme.USDColor,
      fontSize: 60,
    },
    ProfileIcon: {
      size: 70,
      color: theme.TextColor,
      right: 0,
    },
    ScanBtn: {
      backgroundColor: theme.USDColor,
      justifyContent: "space-between",
      alignItems: "center",
      flexDirection: "row",
      marginVertical: 15,
      borderRadius: theme.BorderRadius,
      paddingLeft: 40,
      paddingRight: 40,
      paddingTop: 10,
      paddingBottom: 10,
    },
    ScanBtnText: {
      color: theme.TextColor,
      fontSize: 35,
    },
    RecentLabel: {
      marginTop: 15,
      color: theme.TextColor,
      fontSize: 30,
      fontWeight: "bold",
    },
    ScrollContainer: {
      paddingBottom: insets.bottom + 40,
    },
  });

  const fetchReceiptHistory = () => {
    const receipts = [
      {
        place: "Goodfellas Pizza",
        date: "2024-10-3",
        total: 420.0,
        people: [
          "Doc",
          "Griff",
          "Buddy",
          "Baby",
          "Deborah",
          "Darling",
          "Bats",
          "Joseph",
          "J.D.",
        ],
      },
      {
        place: "Bacchanalia",
        date: "2024-7-9",
        total: 800.85,
        people: ["Doc", "Baby", "Deborah"],
      },
      {
        place: "Bo's Diner",
        date: "2024-10-3",
        total: 69.0,
        people: ["Buddy", "Baby", "Deborah", "Darling", "Bats"],
      },
      {
        place: "Bo's Diner",
        date: "2024-10-3",
        total: 69.0,
        people: ["Buddy", "Baby", "Deborah", "Darling", "Bats"],
      },
    ];

    return receipts;
  };

  return (
    <ThemedView contentContainerStyle={styles.ScrollContainer}>
      <View style={styles.HeaderContainer}>
        <Text style={styles.AppName}>SmartSplit</Text>
        <Icon
          name="account-circle"
          style={styles.ProfileIcon}
          color={styles.ProfileIcon.color}
          size={styles.ProfileIcon.size}
        />
      </View>
      <Pressable
        style={styles.ScanBtn}
        onPress={() => {
          router.push("/scan-flow");
        }}
      >
        <Icon
          name="photo-camera"
          style={styles.ProfileIcon}
          color={styles.ProfileIcon.color}
          size={styles.ProfileIcon.size}
        />
        <Text style={styles.ScanBtnText}>Scan Receipt</Text>
      </Pressable>
      <Text style={styles.RecentLabel}>Recent Receipts</Text>
      {fetchReceiptHistory().map((receipt, receiptIndex) => {
        return <ReceiptOverview key={receiptIndex} receipt={receipt} />;
      })}
    </ThemedView>
  );
};

export default HomeScreen;
