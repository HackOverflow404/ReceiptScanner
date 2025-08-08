import DoubleTap from "@/components/DoubleTap";
import { CameraType, CameraView, useCameraPermissions } from "expo-camera";
import { useFocusEffect, useRouter } from "expo-router";
import React, { useCallback, useRef, useState } from "react";
import {
  Button,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";

export default function ScanScreen() {
  const [facing, setFacing] = useState<CameraType>("back");
  const [permission, requestPermission] = useCameraPermissions();
  const [uri, setUri] = useState<string | undefined>(undefined);
  const ref = useRef<CameraView>(null);
  const [shutterDisabled, setShutterDisabled] = useState(false);
  const router = useRouter();

  useFocusEffect(
    useCallback(() => {
      setShutterDisabled(false);
      return () => {};
    }, [])
  );

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>
          We need your permission to show the camera
        </Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
  }

  function toggleCameraFacing() {
    setFacing((current) => (current === "back" ? "front" : "back"));
  }

  async function takePicture() {
    setShutterDisabled(true);
    const photo = await ref.current?.takePictureAsync();
    if (!photo) {
      return;
    }
    setUri(photo?.uri);
    router.push({
      pathname: "/scan-flow/imageView",
      params: { scanImageUri: photo.uri },
    });
  }

  return (
    <View style={styles.container}>
      <DoubleTap onDoubleTap={toggleCameraFacing}>
        <CameraView
          ref={ref}
          mode="picture"
          style={styles.camera}
          facing={facing}
        >
          <View style={styles.shutterContainer}>
            <View style={{ width: 80 }} />
            <Pressable disabled={shutterDisabled} onPress={takePicture}>
              {({ pressed }) => (
                <View
                  style={[
                    styles.shutterBtn,
                    {
                      opacity: pressed ? 0.5 : 1,
                    },
                  ]}
                >
                  <View style={styles.shutterBtnInner} />
                </View>
              )}
            </Pressable>
            <TouchableOpacity onPress={toggleCameraFacing}>
              <Icon name="flip-camera-ios" color="white" size={80} />
            </TouchableOpacity>
          </View>
        </CameraView>
      </DoubleTap>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  message: {
    textAlign: "center",
    paddingBottom: 10,
  },
  camera: {
    flex: 1,
    width: "100%",
  },
  shutterContainer: {
    position: "absolute",
    bottom: 44,
    left: 0,
    width: "100%",
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 40,
  },
  shutterBtn: {
    backgroundColor: "transparent",
    borderWidth: 5,
    borderColor: "white",
    width: 85,
    height: 85,
    borderRadius: 45,
    alignItems: "center",
    justifyContent: "center",
  },
  shutterBtnInner: {
    width: 70,
    height: 70,
    borderRadius: 50,
    backgroundColor: "white",
  },
});
