import CropTab from "@/components/CropTab";
import { useTheme } from "@/contexts/ThemeProvider";
import { File, Paths } from "expo-file-system";
import { useGlobalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/MaterialIcons";

const TAB_SIZE = 60;
const START_MARGIN = 40;
const HEADER_MARGIN = 20;

export type Position = [number, number];

export default function ImageViewScreen() {
  const { scanImageUri } = useGlobalSearchParams<{ scanImageUri: string }>();
  const theme = useTheme();
  const { top } = useSafeAreaInsets();
  const { width: screenW, height: screenH } = useWindowDimensions();
  const imageW = screenW;
  const imageH = screenH - top * 2 - HEADER_MARGIN;
  const router = useRouter();

  const [positions, setPositions] = useState<Position[]>([
    [START_MARGIN, START_MARGIN],
    [imageW - START_MARGIN - TAB_SIZE, START_MARGIN],
    [imageW - START_MARGIN - TAB_SIZE, imageH - START_MARGIN - TAB_SIZE],
    [START_MARGIN, imageH - START_MARGIN - TAB_SIZE],
  ]);

  const updatePosition = (index: number, newPos: Position) => {
    setPositions((prev) => {
      const next = [...prev];
      next[index] = newPos;
      return next;
    });
  };

  const handleNext = async () => {
    if (!scanImageUri) return;

    // Destination file in cache (modern API)
    const dest = new File(Paths.cache, "receipt_cropped.jpg");

    // Overwrite if it already exists
    if (dest.exists) dest.delete();

    try {
      if (scanImageUri.startsWith("data:")) {
        // data: URL -> bytes -> write
        // (fetch(dataUrl) works in modern RN/Expo)
        const ab = await (await fetch(scanImageUri)).arrayBuffer();
        dest.create();
        dest.write(new Uint8Array(ab));
      } else {
        // file:// or content://
        const src = new File(scanImageUri);

        // Fast path: copy
        try {
          src.copy(dest);
        } catch {
          // Fallback: read bytes then write
          const bytes = await src.bytes();
          dest.create();
          dest.write(bytes);
        }
      }

      router.push({
        pathname: "/scan-flow/editReceipt",
        params: { imageDataUri: dest.uri },
      });
    } catch (e) {
      console.error("Failed to stage image for next screen:", e);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.PageColor }]}>
      <View style={[styles.confirmContainer, { top }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Icon name="navigate-before" size={28} color={theme.TextColor} />
        </TouchableOpacity>

        <Text style={[styles.title, { color: theme.USDColor }]}>Crop</Text>

        <TouchableOpacity onPress={handleNext} style={styles.backButton}>
          <Icon name="navigate-next" size={28} color={theme.TextColor} />
        </TouchableOpacity>
      </View>

      <View style={[styles.editContainer, { marginTop: top }]}>
        {scanImageUri ? (
          <Image source={{ uri: scanImageUri }} style={styles.image} />
        ) : (
          <Text>Missing URI</Text>
        )}

        <View style={StyleSheet.absoluteFillObject}>
          {positions.map(([xStart, yStart], idx) => (
            <CropTab
              key={idx}
              index={idx}
              xStart={xStart}
              yStart={yStart}
              xBound={imageW}
              yBound={imageH}
              tabSize={TAB_SIZE}
              onPositionChange={(_index: number, position: [number, number]) =>
                updatePosition(idx, position)
              }
              nextPosition={positions[idx + 1 === positions.length ? 0 : idx + 1]}
              imageUri={scanImageUri}
              imgW={imageW}
              imgH={imageH}
            />
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  image: { width: "100%", height: "100%" },
  confirmContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: HEADER_MARGIN,
    marginHorizontal: HEADER_MARGIN,
  },
  backButton: { padding: 4, borderRadius: 24 },
  title: { fontSize: 36, fontWeight: "700" },
  editContainer: { flex: 1, width: "100%" },
});