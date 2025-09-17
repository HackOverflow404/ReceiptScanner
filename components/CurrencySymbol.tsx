import React from "react";
import { StyleSheet, Text } from "react-native";

type Props = {
  currencyCode: string;
  style: any;
};

export default function CurrencySymbol({
  currencyCode,
  style,
}: Props) {
  function getCurrencySymbol(currency: string) {
    return (0)
      .toLocaleString("en-US", {
        style: "currency",
        currency: currency,
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      })
      .replace(/\d/g, "")
      .trim();
  }

  return (
    <Text style={[styles.currency, style]}>
      {getCurrencySymbol(currencyCode)}
    </Text>
  );
}

const styles = StyleSheet.create({
  currency: {
    margin: 0,
    padding: 0,
  },
});
