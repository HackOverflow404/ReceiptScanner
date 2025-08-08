import { Position } from "@/app/scan-flow/imageView";
import { useTheme } from "@/contexts/ThemeProvider";
import React, { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  runOnJS,
  useAnimatedProps,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";
import Svg, { Line as RawLine } from "react-native-svg";

const AnimatedLine = Animated.createAnimatedComponent(RawLine);
const MAG_ZOOM = 10;
const MAG_SIZE = 120;
const GAP = 12;

type CropTabProps = {
  xStart: number;
  yStart: number;
  xBound: number;
  yBound: number;
  tabSize: number;
  index: number;
  onPositionChange: (index: number, position: Position) => void;
  nextPosition: Position;
  imageUri: string;
  imgW: number;
  imgH: number;
};

export default function CropTab({
  xStart,
  yStart,
  xBound,
  yBound,
  tabSize,
  index,
  onPositionChange,
  nextPosition,
  imageUri,
  imgW,
  imgH,
}: CropTabProps) {
  const theme = useTheme();

  const translateX = useSharedValue(xStart);
  const translateY = useSharedValue(yStart);
  const startX = useSharedValue(xStart);
  const startY = useSharedValue(yStart);
  const isDragging = useSharedValue(0);

  // make the “next” corner reactive, too
  const nextX = useSharedValue(nextPosition[0]);
  const nextY = useSharedValue(nextPosition[1]);

  useEffect(() => {
    nextX.value = nextPosition[0];
    nextY.value = nextPosition[1];
  }, [nextX, nextY, nextPosition]);

  const maxX = xBound - tabSize;
  const maxY = yBound - tabSize;

  const panGesture = Gesture.Pan()
    .onStart(() => {
      isDragging.value = 1;
      startX.value = translateX.value;
      startY.value = translateY.value;
    })
    .onUpdate((e) => {
      "worklet";
      const rawX = startX.value + e.translationX;
      const rawY = startY.value + e.translationY;
      const newX = Math.min(Math.max(rawX, 0), maxX);
      const newY = Math.min(Math.max(rawY, 0), maxY);

      translateX.value = newX;
      translateY.value = newY;

      // lift to React so parent keeps authoritative state
      runOnJS(onPositionChange)(index, [newX, newY]);
    })
    .onEnd((e) => {
      isDragging.value = 0;
    });

  const handleStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
    ],
  }));

  const lineProps = useAnimatedProps(() => ({
    x1: translateX.value + tabSize / 2,
    y1: translateY.value + tabSize / 2,
    x2: nextX.value + tabSize / 2,
    y2: nextY.value + tabSize / 2,
  }));

  const magContainerStyle = useAnimatedStyle(() => {
    "worklet";

    let dx = 0;
    let dy = 0;

    switch (index) {
      case 0:                         // top-left → bubble down-right
        dx = tabSize + GAP;
        dy = tabSize + GAP;
        break;
      case 1:                         // top-right → bubble down-left
        dx = -(MAG_SIZE + GAP);
        dy = tabSize + GAP;
        break;
      case 2:                         // bottom-left → bubble up-right
        dx = -(MAG_SIZE + GAP);
        dy = -(MAG_SIZE + GAP);
        break;
      case 3:                         // bottom-right → bubble up-left
        dx = tabSize + GAP;
        dy = -(MAG_SIZE + GAP);
        break;
    }

    return {
      opacity: isDragging.value,      // 0→1 while dragging
      transform: [
        { translateX: translateX.value + dx },
        { translateY: translateY.value + dy },
        { scale: isDragging.value },  // pop-in / pop-out
      ],
    };
  });

  const innerImageStyle = useAnimatedStyle(() => ({
    // oversize image, then pan it so the pixel under the tab
    // lands in the centre of the bubble
    width: imgW * MAG_ZOOM,
    height: imgH * MAG_ZOOM,
    transform: [
      {
        translateX:
          -translateX.value * MAG_ZOOM +
          MAG_SIZE / 2 -
          (tabSize / 2) * MAG_ZOOM,
      },
      {
        translateY:
          -translateY.value * MAG_ZOOM +
          MAG_SIZE / 2 -
          (tabSize / 2) * MAG_ZOOM,
      },
    ],
  }));

  return (
    <View style={StyleSheet.absoluteFillObject} pointerEvents="box-none">
      <View style={{ zIndex: 10 }}>
        <GestureDetector gesture={panGesture}>
          <Animated.View
            style={[
              styles.tab,
              {
                width: tabSize,
                height: tabSize,
                borderRadius: tabSize / 2,
                borderColor: theme.USDColor,
              },
              handleStyle,
            ]}
          />
        </GestureDetector>
      </View>
      <Svg style={StyleSheet.absoluteFillObject} pointerEvents="none">
        <AnimatedLine
          animatedProps={lineProps}
          stroke={theme.USDColor}
          strokeWidth={4}
          strokeLinecap="round"
        />
      </Svg>
      <Animated.View
        style={[
          {
            position: "absolute",
            width: MAG_SIZE,
            height: MAG_SIZE,
            borderRadius: MAG_SIZE / 2,
            overflow: "hidden",
            borderWidth: 2,
            borderColor: theme.USDColor,
            backgroundColor: "#000", // optional contrast backdrop
          },
          magContainerStyle,
        ]}
        pointerEvents="none"
      >
        <Animated.Image
          source={{ uri: imageUri }}
          style={innerImageStyle}
          resizeMode="cover"
        />
        <Svg style={StyleSheet.absoluteFillObject} pointerEvents="none">
          {/* vertical line */}
          <RawLine
            x1={MAG_SIZE / 2}
            y1={0}
            x2={MAG_SIZE / 2}
            y2={MAG_SIZE}
            stroke={theme.AccentColor}        // white @ 50 % opacity
            strokeWidth={1.5}
          />
          {/* horizontal line */}
          <RawLine
            x1={0}
            y1={MAG_SIZE / 2}
            x2={MAG_SIZE}
            y2={MAG_SIZE / 2}
            stroke={theme.AccentColor}
            strokeWidth={1.5}
          />
        </Svg>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  tab: {
    position: "absolute",
    borderWidth: 5,
  },
});
