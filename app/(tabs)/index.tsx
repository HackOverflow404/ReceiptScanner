import { Avatar } from "@/components/Avatar";
import ReceiptOverview from "@/components/ReceiptOverview";
import { ThemedView } from "@/components/ThemedView";
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

const HomeScreen = () => {
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
      <View style={styles.HeaderContainer}>
        <Text style={[styles.AppName, { color: theme.USDColor }]}>
          SmartSplit
        </Text>
        <TouchableOpacity onPress={() => router.push("/settings")}>
          <Avatar size={70}/>
        </TouchableOpacity>
      </View>
      <Pressable
        style={[
          styles.ScanBtn,
          { backgroundColor: theme.USDColor, borderRadius: theme.BorderRadius },
        ]}
        onPress={() => {
          router.push("/scan-flow");
        }}
      >
        <Icon
          name="photo-camera"
          style={styles.ProfileIcon}
          color={theme.TextColor}
          size={70}
        />
        <Text style={[styles.ScanBtnText, { color: theme.TextColor }]}>
          Scan Receipt
        </Text>
      </Pressable>
      <Text style={[styles.RecentLabel, { color: theme.TextColor }]}>
        Recent Receipts
      </Text>
      {fetchReceiptHistory().map((receipt, receiptIndex) => {
        return <ReceiptOverview key={receiptIndex} receipt={receipt} />;
      })}
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  HeaderContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  AppName: {
    fontSize: 60,
  },
  ProfileIcon: {
    right: 0,
  },
  ScanBtn: {
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
    marginVertical: 15,
    paddingLeft: 40,
    paddingRight: 40,
    paddingTop: 10,
    paddingBottom: 10,
  },
  ScanBtnText: {
    fontSize: 35,
  },
  RecentLabel: {
    marginTop: 15,
    fontSize: 30,
    fontWeight: "bold",
  },
});

export default HomeScreen;
