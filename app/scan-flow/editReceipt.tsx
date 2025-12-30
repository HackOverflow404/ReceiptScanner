import Item from "@/components/Item";
import ThemedView from "@/components/ThemedView";
import { useTheme } from "@/contexts/ThemeProvider";
import { supabase } from "@/lib/supabase";
import { Buffer } from "buffer";
import { File } from "expo-file-system";
import { useGlobalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import Icon from "react-native-vector-icons/MaterialIcons";

export type VeryfiLineItem = {
  id: number;
  description: string | null;
  full_description?: string | null;
  quantity: number | null;
  price: number | null;
  total: number;
  sku?: string | null;
};

type VeryfiReceipt = {
  vendor?: { name?: string | null };
  date?: string | null;
  currency_code?: string | null;
  subtotal?: number | null;
  tax?: number | null;
  total: number;
  line_items: VeryfiLineItem[];
};

type Opener = "global" | number | null;

const data = [
  {
    label: "AED",
    value: "AED",
  },
  {
    label: "AFN",
    value: "AFN",
  },
  {
    label: "ALL",
    value: "ALL",
  },
  {
    label: "AMD",
    value: "AMD",
  },
  {
    label: "AOA",
    value: "AOA",
  },
  {
    label: "ARS",
    value: "ARS",
  },
  {
    label: "AUD",
    value: "AUD",
  },
  {
    label: "AWG",
    value: "AWG",
  },
  {
    label: "AZN",
    value: "AZN",
  },
  {
    label: "BAM",
    value: "BAM",
  },
  {
    label: "BBD",
    value: "BBD",
  },
  {
    label: "BDT",
    value: "BDT",
  },
  {
    label: "BGN",
    value: "BGN",
  },
  {
    label: "BHD",
    value: "BHD",
  },
  {
    label: "BIF",
    value: "BIF",
  },
  {
    label: "BMD",
    value: "BMD",
  },
  {
    label: "BND",
    value: "BND",
  },
  {
    label: "BOB",
    value: "BOB",
  },
  {
    label: "BOV",
    value: "BOV",
  },
  {
    label: "BRL",
    value: "BRL",
  },
  {
    label: "BSD",
    value: "BSD",
  },
  {
    label: "BTN",
    value: "BTN",
  },
  {
    label: "BWP",
    value: "BWP",
  },
  {
    label: "BYN",
    value: "BYN",
  },
  {
    label: "BZD",
    value: "BZD",
  },
  {
    label: "CAD",
    value: "CAD",
  },
  {
    label: "CDF",
    value: "CDF",
  },
  {
    label: "CHE",
    value: "CHE",
  },
  {
    label: "CHF",
    value: "CHF",
  },
  {
    label: "CHW",
    value: "CHW",
  },
  {
    label: "CLF",
    value: "CLF",
  },
  {
    label: "CLP",
    value: "CLP",
  },
  {
    label: "CNY",
    value: "CNY",
  },
  {
    label: "COP",
    value: "COP",
  },
  {
    label: "COU",
    value: "COU",
  },
  {
    label: "CRC",
    value: "CRC",
  },
  {
    label: "CUP",
    value: "CUP",
  },
  {
    label: "CVE",
    value: "CVE",
  },
  {
    label: "CZK",
    value: "CZK",
  },
  {
    label: "DJF",
    value: "DJF",
  },
  {
    label: "DKK",
    value: "DKK",
  },
  {
    label: "DOP",
    value: "DOP",
  },
  {
    label: "DZD",
    value: "DZD",
  },
  {
    label: "EGP",
    value: "EGP",
  },
  {
    label: "ERN",
    value: "ERN",
  },
  {
    label: "ETB",
    value: "ETB",
  },
  {
    label: "EUR",
    value: "EUR",
  },
  {
    label: "FJD",
    value: "FJD",
  },
  {
    label: "FKP",
    value: "FKP",
  },
  {
    label: "GBP",
    value: "GBP",
  },
  {
    label: "GEL",
    value: "GEL",
  },
  {
    label: "GHS",
    value: "GHS",
  },
  {
    label: "GIP",
    value: "GIP",
  },
  {
    label: "GMD",
    value: "GMD",
  },
  {
    label: "GNF",
    value: "GNF",
  },
  {
    label: "GTQ",
    value: "GTQ",
  },
  {
    label: "GYD",
    value: "GYD",
  },
  {
    label: "HKD",
    value: "HKD",
  },
  {
    label: "HNL",
    value: "HNL",
  },
  {
    label: "HTG",
    value: "HTG",
  },
  {
    label: "HUF",
    value: "HUF",
  },
  {
    label: "labelR",
    value: "valueR",
  },
  {
    label: "ILS",
    value: "ILS",
  },
  {
    label: "INR",
    value: "INR",
  },
  {
    label: "IQD",
    value: "IQD",
  },
  {
    label: "IRR",
    value: "IRR",
  },
  {
    label: "ISK",
    value: "ISK",
  },
  {
    label: "JMD",
    value: "JMD",
  },
  {
    label: "JOD",
    value: "JOD",
  },
  {
    label: "JPY",
    value: "JPY",
  },
  {
    label: "KES",
    value: "KES",
  },
  {
    label: "KGS",
    value: "KGS",
  },
  {
    label: "KHR",
    value: "KHR",
  },
  {
    label: "KMF",
    value: "KMF",
  },
  {
    label: "KPW",
    value: "KPW",
  },
  {
    label: "KRW",
    value: "KRW",
  },
  {
    label: "KWD",
    value: "KWD",
  },
  {
    label: "KYD",
    value: "KYD",
  },
  {
    label: "KZT",
    value: "KZT",
  },
  {
    label: "LAK",
    value: "LAK",
  },
  {
    label: "LBP",
    value: "LBP",
  },
  {
    label: "LKR",
    value: "LKR",
  },
  {
    label: "LRD",
    value: "LRD",
  },
  {
    label: "LSL",
    value: "LSL",
  },
  {
    label: "LYD",
    value: "LYD",
  },
  {
    label: "MAD",
    value: "MAD",
  },
  {
    label: "MDL",
    value: "MDL",
  },
  {
    label: "MGA",
    value: "MGA",
  },
  {
    label: "MKD",
    value: "MKD",
  },
  {
    label: "MMK",
    value: "MMK",
  },
  {
    label: "MNT",
    value: "MNT",
  },
  {
    label: "MOP",
    value: "MOP",
  },
  {
    label: "MRU",
    value: "MRU",
  },
  {
    label: "MUR",
    value: "MUR",
  },
  {
    label: "MVR",
    value: "MVR",
  },
  {
    label: "MWK",
    value: "MWK",
  },
  {
    label: "MXN",
    value: "MXN",
  },
  {
    label: "MXV",
    value: "MXV",
  },
  {
    label: "MYR",
    value: "MYR",
  },
  {
    label: "MZN",
    value: "MZN",
  },
  {
    label: "NAD",
    value: "NAD",
  },
  {
    label: "NGN",
    value: "NGN",
  },
  {
    label: "NIO",
    value: "NIO",
  },
  {
    label: "NOK",
    value: "NOK",
  },
  {
    label: "NPR",
    value: "NPR",
  },
  {
    label: "NZD",
    value: "NZD",
  },
  {
    label: "OMR",
    value: "OMR",
  },
  {
    label: "PAB",
    value: "PAB",
  },
  {
    label: "PEN",
    value: "PEN",
  },
  {
    label: "PGK",
    value: "PGK",
  },
  {
    label: "PHP",
    value: "PHP",
  },
  {
    label: "PKR",
    value: "PKR",
  },
  {
    label: "PLN",
    value: "PLN",
  },
  {
    label: "PYG",
    value: "PYG",
  },
  {
    label: "QAR",
    value: "QAR",
  },
  {
    label: "RON",
    value: "RON",
  },
  {
    label: "RSD",
    value: "RSD",
  },
  {
    label: "RUB",
    value: "RUB",
  },
  {
    label: "RWF",
    value: "RWF",
  },
  {
    label: "SAR",
    value: "SAR",
  },
  {
    label: "SBD",
    value: "SBD",
  },
  {
    label: "SCR",
    value: "SCR",
  },
  {
    label: "SDG",
    value: "SDG",
  },
  {
    label: "SEK",
    value: "SEK",
  },
  {
    label: "SGD",
    value: "SGD",
  },
  {
    label: "SHP",
    value: "SHP",
  },
  {
    label: "SLE",
    value: "SLE",
  },
  {
    label: "SOS",
    value: "SOS",
  },
  {
    label: "SRD",
    value: "SRD",
  },
  {
    label: "SSP",
    value: "SSP",
  },
  {
    label: "STN",
    value: "STN",
  },
  {
    label: "SVC",
    value: "SVC",
  },
  {
    label: "SYP",
    value: "SYP",
  },
  {
    label: "SZL",
    value: "SZL",
  },
  {
    label: "THB",
    value: "THB",
  },
  {
    label: "TJS",
    value: "TJS",
  },
  {
    label: "TMT",
    value: "TMT",
  },
  {
    label: "TND",
    value: "TND",
  },
  {
    label: "TOP",
    value: "TOP",
  },
  {
    label: "TRY",
    value: "TRY",
  },
  {
    label: "TTD",
    value: "TTD",
  },
  {
    label: "TWD",
    value: "TWD",
  },
  {
    label: "TZS",
    value: "TZS",
  },
  {
    label: "UAH",
    value: "UAH",
  },
  {
    label: "UGX",
    value: "UGX",
  },
  {
    label: "USD",
    value: "USD",
  },
  {
    label: "USN",
    value: "USN",
  },
  {
    label: "UYI",
    value: "UYI",
  },
  {
    label: "UYU",
    value: "UYU",
  },
  {
    label: "UYW",
    value: "UYW",
  },
  {
    label: "UZS",
    value: "UZS",
  },
  {
    label: "VED",
    value: "VED",
  },
  {
    label: "VES",
    value: "VES",
  },
  {
    label: "VND",
    value: "VND",
  },
  {
    label: "VUV",
    value: "VUV",
  },
  {
    label: "WST",
    value: "WST",
  },
  {
    label: "XAD",
    value: "XAD",
  },
  {
    label: "XAF",
    value: "XAF",
  },
  {
    label: "XAG",
    value: "XAG",
  },
  {
    label: "XAU",
    value: "XAU",
  },
  {
    label: "XBA",
    value: "XBA",
  },
  {
    label: "XBB",
    value: "XBB",
  },
  {
    label: "XBC",
    value: "XBC",
  },
  {
    label: "XBD",
    value: "XBD",
  },
  {
    label: "XCD",
    value: "XCD",
  },
  {
    label: "XCG",
    value: "XCG",
  },
  {
    label: "XDR",
    value: "XDR",
  },
  {
    label: "XOF",
    value: "XOF",
  },
  {
    label: "XPD",
    value: "XPD",
  },
  {
    label: "XPF",
    value: "XPF",
  },
  {
    label: "XPT",
    value: "XPT",
  },
  {
    label: "XSU",
    value: "XSU",
  },
  {
    label: "XTS",
    value: "XTS",
  },
  {
    label: "XUA",
    value: "XUA",
  },
  {
    label: "XXX",
    value: "XXX",
  },
  {
    label: "YER",
    value: "YER",
  },
  {
    label: "ZAR",
    value: "ZAR",
  },
  {
    label: "ZMW",
    value: "ZMW",
  },
  {
    label: "ZWG",
    value: "ZWG",
  },
];

export default function EditScreen() {
  const theme = useTheme();
  const router = useRouter();
  const { imageDataUri: image } = useGlobalSearchParams<{
    imageDataUri: string;
  }>();

  const [receiptData, setReceiptData] = useState<VeryfiReceipt | null>();
  const [errMsg, setErrMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [currency, setCurrency] = useState(receiptData?.currency_code || "USD");
  const [isFocus, setIsFocus] = useState(false);

  const [splittees, setSplittees] = useState<string[]>([]);
  const [splitModalVisible, setSplitModalVisible] = useState<{
    state: boolean;
    opener: Opener;
  }>({ state: false, opener: null });
  const [contacts, setContacts] = useState<
    { name: string; selected: boolean }[]
  >([]);

  useEffect(() => {
    setContacts(getContacts());
  }, []);

  function getContacts() {
    return [
      { name: "Doc", selected: false },
      { name: "Griff", selected: false },
      { name: "Buddy", selected: false },
      { name: "Baby", selected: false },
      { name: "Deborah", selected: false },
      { name: "Darling", selected: false },
      { name: "Bats", selected: false },
      { name: "Joseph", selected: false },
      { name: "J.D.", selected: false },
    ];
  }

  function toggleSplittee(
    item: { name: string; selected: boolean },
    index: number
  ) {
    // update global list
    setSplittees((prev) =>
      item.selected ? prev.filter((n) => n !== item.name) : [...prev, item.name]
    );
    // update local selection state for UI
    setContacts((prev) =>
      prev.map((c, i) => (i === index ? { ...c, selected: !c.selected } : c))
    );
  }

  function toggleSplitteeItem(
    item: { name: string; selected: boolean },
    index: number
  ) {}

  async function fileUriToBase64(uri: string): Promise<string> {
    // If you ever pass a data: URL here, just strip the payload.
    if (uri.startsWith("data:")) {
      const payload = uri.split(",")[1] ?? "";
      if (!payload) throw new Error("Invalid data URI (missing base64 payload).");
      return payload;
    }

    const file = new File(uri);
    if (!file.exists) {
      throw new Error(`File does not exist or not readable: ${uri}`);
    }

    const ab = await file.arrayBuffer();
    return Buffer.from(ab).toString("base64");
  }


  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setErrMsg(null);

        if (!image) throw new Error("Missing imageDataUri param");

        const imageData = await fileUriToBase64(image);

        console.log("Firing API call with image data");

        const { data, error } = await supabase.functions.invoke("VeryfiScan", {
          body: {
            file_name: "Document",
            file_data: imageData,
          },
        });

        if (error) throw error;

        setReceiptData(data);
      } catch (error) {
        console.log("Err: ", error);
        setErrMsg(String(error));
      } finally {
        setLoading(false);
      }
    })();
  }, [image]);

  useEffect(() => {
    if (receiptData?.currency_code) setCurrency(receiptData.currency_code);
  }, [receiptData]);

  const items = receiptData?.line_items ?? [];

  if (loading) {
    return (
      <ThemedView
        style={{
          flex: 1,
          height: "100%",
          width: "100%",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <ActivityIndicator style={{ margin: "auto" }} />
      </ThemedView>
    );
  }

  return (
    <ThemedView>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Icon name="navigate-before" size={28} color={theme.TextColor} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: theme.USDColor }]}>
          Receipt Details
        </Text>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Icon name="navigate-next" size={28} color={theme.TextColor} />
        </TouchableOpacity>
      </View>

      {/* CURRENCY BAR */}
      <View style={styles.currencyRow}>
        <Text style={[styles.currencyLabel, { color: theme.TextColor }]}>
          Currency
        </Text>
        <Dropdown
          style={[
            styles.dropdown,
            { backgroundColor: theme.AccentColor },
            isFocus && { borderColor: theme.USDColor },
          ]}
          containerStyle={[
            styles.dropdown,
            { backgroundColor: theme.AccentColor },
          ]}
          itemTextStyle={{ color: theme.TextColor }}
          selectedTextStyle={[styles.selectedText, { color: theme.TextColor }]}
          inputSearchStyle={[styles.inputSearch, { color: theme.TextColor }]}
          data={data}
          search
          maxHeight={300}
          labelField="label"
          valueField="value"
          searchPlaceholder="Search..."
          value={currency}
          onFocus={() => setIsFocus(true)}
          onBlur={() => setIsFocus(false)}
          onChange={(item: any) => {
            setCurrency(item.value);
            setIsFocus(false);
          }}
        />
      </View>

      {/* GLOBAL SPLIT BAR */}
      <View style={[styles.splitBar, { borderColor: theme.USDColor + "55" }]}>
        <Text style={[styles.splitLabel, { color: theme.TextColor }]}>
          Split all items
        </Text>

        <View style={styles.splitIcons}>
          {splittees.slice(0, 4).map((name, idx) => (
            <Icon
              key={name + idx}
              name="account-circle"
              size={24}
              color="#FFFFFF"
              style={{ marginLeft: idx === 0 ? 0 : 6 }}
            />
          ))}
          {splittees.length > 4 && (
            <Text style={{ marginLeft: 8, color: theme.TextColor + "AA" }}>
              +{splittees.length - 4}
            </Text>
          )}
        </View>

        <TouchableOpacity
          onPress={() =>
            setSplitModalVisible({ state: true, opener: "global" })
          }
          style={[
            styles.splitButton,
            { backgroundColor: theme.AccentColor, borderRadius: 12 },
          ]}
        >
          <Icon name="group-add" size={18} color="#FFF" />
          <Text style={styles.splitButtonText}>Choose</Text>
        </TouchableOpacity>
      </View>

      {/* ITEMS */}
      <View>
        {(receiptData?.line_items ?? []).map((item, key) => (
          <Item
            key={key}
            item={item}
            currencyCode={currency}
            splittees={splittees} // <-- global list
            onPressAdd={() =>
              setSplitModalVisible({ state: true, opener: key })
            } // open same modal
          />
        ))}
      </View>

      {/* GLOBAL SPLITTEES MODAL */}
      <Modal
        animationType="slide"
        transparent
        visible={splitModalVisible.state}
        onRequestClose={() =>
          setSplitModalVisible({ state: false, opener: null })
        }
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
              Select Splittees
            </Text>

            <FlatList
              data={contacts}
              renderItem={({ item, index }) => (
                <View>
                  <TouchableOpacity
                    style={[
                      styles.contact,
                      {
                        backgroundColor: item.selected
                          ? theme.AccentColor
                          : "transparent",
                      },
                    ]}
                    onPress={() => toggleSplittee(item, index)}
                  >
                    <Text
                      style={[styles.modalText, { color: theme.TextColor }]}
                    >
                      {item.name}
                    </Text>
                  </TouchableOpacity>
                  <View
                    style={[
                      styles.divider,
                      { backgroundColor: theme.USDColor },
                    ]}
                  />
                </View>
              )}
              keyExtractor={(_, i) => i.toString()}
            />

            <TouchableOpacity
              style={[
                styles.buttonClose,
                {
                  borderRadius: theme.BorderRadius,
                  backgroundColor: theme.AccentColor,
                },
              ]}
              onPress={() =>
                setSplitModalVisible({ state: false, opener: null })
              }
            >
              <Text style={[styles.buttonText, { color: theme.TextColor }]}>
                Done
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 30,
  },
  backButton: {
    padding: 4,
    borderRadius: 24,
  },
  title: {
    fontSize: 36,
    fontWeight: "700",
  },
  currencyRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  currencyLabel: {
    fontSize: 18,
    fontWeight: "600",
    marginRight: 12,
  },
  dropdown: {
    flex: 1,
    height: 50,
    borderColor: "transparent",
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  selectedText: {
    fontSize: 16,
    fontWeight: "500",
  },
  iconStyle: {
    width: 20,
    height: 20,
    tintColor: "white",
  },
  inputSearch: {
    height: 40,
    fontSize: 16,
    borderRadius: 8,
  },
  splitBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderRadius: 14,
    marginBottom: 16,
  },
  splitLabel: {
    fontSize: 16,
    fontWeight: "600",
  },
  splitIcons: {
    flexDirection: "row",
    marginLeft: 10,
    flex: 1,
  },
  splitButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  splitButtonText: {
    color: "#FFF",
    fontWeight: "600",
    marginLeft: 6,
  },
  centeredView: { flex: 1, justifyContent: "center", alignItems: "center" },
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
  modalHeader: { fontSize: 20, marginBottom: 10 },
  modalText: { fontSize: 18 },
  contact: { borderRadius: 15, paddingVertical: 10, paddingHorizontal: 15 },
  divider: {
    height: StyleSheet.hairlineWidth,
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
  buttonText: { fontSize: 15 },
});
