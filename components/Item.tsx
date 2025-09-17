// Item.tsx
import { VeryfiLineItem } from "@/app/scan-flow/editReceipt";
import { useTheme } from "@/contexts/ThemeProvider";
import React, { useMemo } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import CurrencySymbol from "./CurrencySymbol";

type Props = {
  item: VeryfiLineItem;
  currencyCode?: string;
  splittees: string[]; // NEW: controlled by parent
  onPressAdd?: () => void; // NEW: open global picker
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

const ICON_SIZE = 32;
const MAX_ICONS = 4; // keep layout stable
const RIGHT_WIDTH = 140;
const CENTER_WIDTH = 70;

export default function Item({
  item,
  currencyCode = "USD",
  splittees,
  onPressAdd,
}: Props) {
  const qty = item.quantity ?? 1;
  const unit = item.price ?? (qty ? item.total / qty : item.total);
  const theme = useTheme();

  const fmt = useMemo(
    () =>
      new Intl.NumberFormat("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }),
    []
  );

  return (
    <View style={styles.row}>
      {/* LEFT (flexes) */}
      <View style={styles.left}>
        <View style={styles.dottedLine}>
          <TextInput
            style={[styles.name, { color: theme.TextColor }]}
            numberOfLines={1}
          >
            {item.description || "Item"}
          </TextInput>
        </View>
        <View style={styles.metaContainer}>
          <View style={styles.dottedLine}>
            <CurrencySymbol
              currencyCode={currencyCode}
              style={[styles.meta, { color: theme.TextColor + "80" }]}
            />
            <TextInput style={[styles.meta, { color: theme.TextColor + "80" }]}>
              {fmt.format(unit)}
            </TextInput>
          </View>
          <Text
            style={[styles.meta, { color: theme.TextColor + "80" }]}
            numberOfLines={1}
          >
            {" × "}
          </Text>
          <View style={styles.dottedLine}>
            <TextInput style={[styles.meta, { color: theme.TextColor + "80" }]}>
              {qty}
            </TextInput>
          </View>
        </View>
      </View>

      {/* CENTER (fixed width) */}
      <View style={styles.center}>
        <View style={{ flexDirection: "row" }}>
          <CurrencySymbol currencyCode={currencyCode} style={styles.total} />
          <Text style={styles.total}>{fmt.format(item.total)}</Text>
        </View>
      </View>

      {/* RIGHT (fixed width) */}
      <Pressable onPress={onPressAdd} style={styles.right}>
        {splittees.slice(0, MAX_ICONS).map((_, key) => {
          const color =
            key < splitteeIconColors.length
              ? splitteeIconColors[key]
              : theme.TextColor;
          return (
            <Icon
              key={key}
              name="account-circle"
              size={ICON_SIZE}
              color={color}
              style={styles.icon}
            />
          );
        })}
        <Icon
          name="person-add"
          size={ICON_SIZE}
          color="#FFFFFF"
          style={styles.icon}
        />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "rgba(255,255,255,0.08)",
    backgroundColor: "transparent",
    minHeight: 64,
  },
  left: { flex: 1, paddingRight: 12, minWidth: 0 },
  dottedLine: { flexDirection: "row" },
  name: { fontSize: 18, fontWeight: "600" },
  metaContainer: { flexDirection: "row" },
  meta: { marginTop: 2, fontSize: 14 },
  center: { width: CENTER_WIDTH, alignItems: "flex-end", flexShrink: 0 },
  right: {
    width: RIGHT_WIDTH,
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    flexShrink: 0,
  },
  icon: { marginLeft: 8 },
  total: { fontSize: 16, fontWeight: "700", color: "#ffffff" },
});
