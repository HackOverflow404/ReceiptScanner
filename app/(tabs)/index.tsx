import { Avatar } from "@/components/Avatar";
import ReceiptOverview from "@/components/ReceiptOverview";
import ThemedView from "@/components/ThemedView";
import { useTheme } from "@/contexts/ThemeProvider";
import { useRouter } from "expo-router";
import {
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/MaterialIcons";

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const theme = useTheme();

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
    <ThemedView contentContainerStyle={{ paddingBottom: insets.bottom + 40 }}>
      <View style={styles.headerContainer}>
        <Text style={[styles.appName, { color: theme.USDColor }]}>
          SmartSplit
        </Text>
        <TouchableOpacity onPress={() => router.push("/settings")}>
          <Avatar size={70}/>
        </TouchableOpacity>
      </View>
      <View style={styles.scanContainer}>
        <Pressable
          style={[
            styles.scanBtn,
            { backgroundColor: theme.USDColor, borderRadius: theme.BorderRadius },
          ]}
          onPress={() => {
            router.push("/scan-flow");
          }}
        >
          <Icon
            name="document-scanner"
            style={styles.profileIcon}
            color={theme.TextColor}
            size={30}
          />
          <Text style={[styles.scanBtnText, { color: theme.TextColor }]}>
            Scan Receipt
          </Text>
        </Pressable>
        <Pressable
          style={[
            styles.scanBtn,
            { backgroundColor: theme.USDColor, borderRadius: theme.BorderRadius },
          ]}
          onPress={() => {
            router.push("/scan-flow");
          }}
        >
          <Icon
            name="receipt"
            style={styles.profileIcon}
            color={theme.TextColor}
            size={30}
          />
          <Text style={[styles.scanBtnText, { color: theme.TextColor }]}>
            New Expense
          </Text>
        </Pressable>
      </View>
      <Text style={[styles.recentLabel, { color: theme.TextColor }]}>
        Recent Receipts
      </Text>
      {fetchReceiptHistory().map((receipt, receiptIndex) => {
        return <ReceiptOverview key={receiptIndex} receipt={receipt} />;
      })}
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  scanContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  appName: {
    fontSize: 60,
  },
  profileIcon: {
    right: 0,
  },
  scanBtn: {
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    marginVertical: 15,
    paddingTop: 10,
    paddingBottom: 10,
    width: "47.5%",
  },
  scanBtnText: {
    fontSize: 20,
  },
  recentLabel: {
    marginTop: 15,
    fontSize: 30,
    fontWeight: "bold",
  },
});