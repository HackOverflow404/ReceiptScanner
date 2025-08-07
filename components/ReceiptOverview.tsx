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

const splitteeIconColors = [
  "#558040",
  "#804040",
  "#807540",
  "#408060",
  "#406A80",
  "#4A4080",
  "#804080",
  "#80404A",
];

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    marginVertical: 15,
    padding: 10,
  },
  detailsContainer: {
    justifyContent: "space-between",
  },
  headerText: {
    fontSize: 20,
    margin: 10,
  },
  infoText: {
    fontSize: 15,
    margin: 10,
  },
  splitteeContainer: {
    flex: 1,
    alignItems: "flex-end",
  },
  gridItem: {
    width: 45,
    height: 45,
    alignItems: "center",
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalView: {
    padding: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 5,
    height: 600,
    width: 300,
  },
  modalHeader: {
    fontSize: 20,
    marginBottom: 10,
  },
  modalText: {
    fontSize: 18,
    marginTop: 10,
  },
  divider: {
    height: 0.5,
    width: "100%",
    marginVertical: 10,
  },
  buttonClose: {
    padding: 10,
    marginTop: 20,
    elevation: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    fontSize: 15,
  },
});

const ReceiptOverview: React.FC<ReceiptOverviewProps> = ({ receipt }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const theme = useTheme();

  const renderSplittee = ({ item, index }: { item: string; index: number }) => {
    const color =
      index < splitteeIconColors.length
        ? splitteeIconColors[index]
        : theme.TextColor;

    return (
      <View style={styles.gridItem}>
        <Icon
          name={
            index < splitteeIconColors.length ? "account-circle" : "more-horiz"
          }
          size={35}
          color={color}
        />
      </View>
    );
  };
  
  const openReceiptDetails = () => {}

  return (
    <Pressable
      style={[
        styles.container,
        {
          backgroundColor: theme.AccentColor,
          borderRadius: theme.BorderRadius,
        },
      ]}
      onPress={() => openReceiptDetails()}
    >
      {/* Details */}
      <View style={styles.detailsContainer}>
        <Text style={[styles.headerText, { color: theme.TextColor }]}>
          Place:
        </Text>
        <Text style={[styles.headerText, { color: theme.TextColor }]}>
          Date:
        </Text>
        <Text style={[styles.headerText, { color: theme.TextColor }]}>
          Total:
        </Text>
      </View>
      <View style={styles.detailsContainer}>
        <Text style={[styles.infoText, { color: theme.TextColor }]}>
          {receipt.place}
        </Text>
        <Text style={[styles.infoText, { color: theme.TextColor }]}>
          {receipt.date}
        </Text>
        <Text style={[styles.infoText, { color: theme.TextColor }]}>
          ${receipt.total.toFixed(2)}
        </Text>
      </View>

      {/* Splittees grid */}
      <Pressable onPress={() => setModalVisible(true)} style={styles.splitteeContainer}>
        <FlatList
          data={receipt.people}
          renderItem={renderSplittee}
          keyExtractor={(_, i) => i.toString()}
          numColumns={3}
        />
      </Pressable>

      {/* Modal */}
      <Modal
        animationType="slide"
        transparent
        visible={modalVisible}
        onRequestClose={() => {
          Alert.alert("Modal has been closed.");
          setModalVisible(false);
        }}
      >
        <View style={[styles.centeredView, { marginTop: theme.TopPadding }]}>
          <View
            style={[
              styles.modalView,
              {
                backgroundColor: theme.PageColor,
                borderRadius: theme.BorderRadius,
              },
            ]}
          >
            <Text style={[styles.modalHeader, { color: theme.TextColor }]}>
              Splittees
            </Text>

            <FlatList
              data={receipt.people}
              renderItem={({ item }) => (
                <>
                  <Text style={[styles.modalText, { color: theme.TextColor }]}>
                    {item}
                  </Text>
                  <View
                    style={[
                      styles.divider,
                      { backgroundColor: theme.USDColor },
                    ]}
                  />
                </>
              )}
              keyExtractor={(_, i) => i.toString()}
            />

            <Pressable
              style={[
                styles.buttonClose,
                {
                  borderRadius: theme.BorderRadius,
                  backgroundColor: theme.AccentColor,
                },
              ]}
              onPress={() => setModalVisible(false)}
            >
              <Text style={[styles.buttonText, { color: theme.TextColor }]}>
                Close
              </Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </Pressable>
  );
};

export default ReceiptOverview;
