import React, { useState } from "react";
import { Pressable, StyleSheet } from "react-native";

const DoubleTap = ({
  onDoubleTap,
  children,
}: {
  onDoubleTap: () => void;
  children: any;
}) => {
  const [last, setLast] = useState(0);
  const onPress = () => {
    const now = Date.now();
    if (now - last < 300) onDoubleTap();
    setLast(now);
  };
  return (
    <Pressable onPress={onPress} style={styles.fill}>
      {children}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  fill: {
    flex: 1,
  },
});

export default DoubleTap;
