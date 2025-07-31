import { useTheme } from "@/contexts/ThemeProvider";
import React, { useState } from "react";
import {
  Alert,
  FlatList,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";

type ReceiptOverviewProps = {
  receipt: {
    place: string;
    date: string;
    total: number;
    people: string[];
  };
};

const ReceiptOverview: React.FC<ReceiptOverviewProps> = ({ receipt }) => {
  const [modalVisible, setModalVisible] = useState(false);

  const spliteeIconColors = [
    "#558040",
    "#804040",
    "#807540",
    "#408060",
    "#406A80",
    "#4A4080",
    "#804080",
    "#80404A",
  ];
  const theme = useTheme();

  const styles = StyleSheet.create({
    Container: {
      flexDirection: "row",
      backgroundColor: useTheme().AccentColor,
      marginVertical: 15,
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
      alignItems: "flex-end",
    },
    GridItem: {
      width: 45,
      height: 45,
      alignItems: "center",
    },
    CenteredView: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      marginTop: useTheme().TopPadding,
    },
    ModalView: {
      backgroundColor: useTheme().PageColor,
      borderRadius: useTheme().BorderRadius,
      padding: 30,
      shadowColor: "#000000",
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 5,
      elevation: 5,
      height: 600,
      width: 300,
    },
    ModalHeader: {
      color: useTheme().TextColor,
      fontSize: 20,
      marginBottom: 10,
    },
    ModalText: {
      fontSize: 18,
      color: useTheme().TextColor,
      marginTop: 10,
    },
    Divider: {
      height: 0.5,
      backgroundColor: useTheme().USDColor,
      width: "100%",
      marginVertical: 10,
    },
    ButtonClose: {
      borderRadius: useTheme().BorderRadius,
      padding: 10,
      marginTop: 20,
      elevation: 2,
      backgroundColor: useTheme().AccentColor,
      alignItems: "center",
      justifyContent: "center",
    },
    ButtonTextStyle: {
      color: useTheme().TextColor,
      fontSize: 15,
    },
  });

  const renderItem = ({ item, index }: { item: string; index: number }) =>
    index < 8 ? (
      <View style={styles.GridItem}>
        <Icon
          name="account-circle"
          color={spliteeIconColors[index]}
          size={35}
        />
      </View>
    ) : index === 8 ? (
      <View style={styles.GridItem}>
        <Icon name="more-horiz" color={theme.TextColor} size={35} />
      </View>
    ) : (
      <></>
    );

  return (
    <Pressable style={styles.Container}>
      <View style={styles.DetailsContainer}>
        <Text style={styles.HeaderTextStyle}>Place:</Text>
        <Text style={styles.HeaderTextStyle}>Date:</Text>
        <Text style={styles.HeaderTextStyle}>Total:</Text>
      </View>
      <View style={styles.DetailsContainer}>
        <Text style={styles.InfoTextStyle}>{receipt.place}</Text>
        <Text style={styles.InfoTextStyle}>{receipt.date}</Text>
        <Text style={styles.InfoTextStyle}>
          {"$ " + receipt.total.toFixed(2)}
        </Text>
      </View>
      <Pressable onPress={() => setModalVisible(true)}>
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            Alert.alert("Modal has been closed.");
            setModalVisible(!modalVisible);
          }}
        >
          <View style={styles.CenteredView}>
            <View style={styles.ModalView}>
              <Text style={styles.ModalHeader}>Splitees</Text>
              <FlatList
                data={receipt.people}
                renderItem={({ item }) => (
                  <View>
                    <Text style={styles.ModalText}>{item}</Text>
                    <View style={styles.Divider} />
                  </View>
                )}
                keyExtractor={(item, index) => index.toString()}
              />
              <Pressable
                style={styles.ButtonClose}
                onPress={() => setModalVisible(!modalVisible)}
              >
                <Text style={styles.ButtonTextStyle}>Close</Text>
              </Pressable>
            </View>
          </View>
        </Modal>
        <View style={styles.SpliteeContainer}>
          <FlatList
            data={receipt.people}
            renderItem={renderItem}
            keyExtractor={(item, index) => index.toString()}
            numColumns={3}
          />
        </View>
      </Pressable>
    </Pressable>
  );
};

export default ReceiptOverview;
