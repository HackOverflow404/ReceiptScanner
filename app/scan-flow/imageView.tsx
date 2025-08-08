import CropTab from "@/components/CropTab";
import { useTheme } from "@/contexts/ThemeProvider";
import { useGlobalSearchParams } from "expo-router";
import { useState } from "react";
import {
  Image,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const TAB_SIZE = 60;
const START_MARGIN = 40;

export type Position = [number, number];

export default function ImageViewScreen() {
  const { scanImageUri } = useGlobalSearchParams<{ scanImageUri: string }>();
  const theme = useTheme();
  const { top } = useSafeAreaInsets();
  const { width: screenW, height: rawH } = useWindowDimensions();
  const screenH = rawH - top;

  // initialise 4 corner positions, subtracting TAB_SIZE for right/bottom
  const [positions, setPositions] = useState<Position[]>([
    [START_MARGIN, START_MARGIN], // top-left
    [screenW - START_MARGIN - TAB_SIZE, START_MARGIN], // top-right
    [screenW - START_MARGIN - TAB_SIZE, screenH - START_MARGIN - TAB_SIZE], // bottom-right
    [START_MARGIN, screenH - START_MARGIN - TAB_SIZE], // bottom-left
  ]);

  // safely update one of the four tuples without mutation
  const updatePosition = (index: number, newPos: Position) => {
    setPositions((prev) => {
      const next = [...prev];
      next[index] = newPos;
      return next;
    });
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.PageColor }]}>
      <View style={{ flex: 1, width: "100%", marginTop: top }}>
        {scanImageUri ? (
          <Image source={{ uri: scanImageUri }} style={styles.image} />
        ) : (
          <Text>Missing URI</Text>
        )}

        <View style={styles.overlay}>
          {positions.map(([xStart, yStart], idx) => (
            <CropTab
              key={idx}
              index={idx}
              xStart={xStart}
              yStart={yStart}
              xBound={screenW}
              yBound={screenH}
              tabSize={TAB_SIZE}
              onPositionChange={(index: number, position: [number, number]) =>
                updatePosition(idx, position)
              }
              nextPosition={positions[idx + 1 === positions.length ? 0 : idx + 1]}
              imageUri={scanImageUri}
              imgW={screenW}
              imgH={screenH}
            />
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  image: {
    width: "100%",
    height: "100%",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
  },
});
