import React, { useRef, useState } from "react";
import {
  CameraView,
  useCameraPermissions,
  CameraType,
  CameraMode,
} from "expo-camera";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
  Button,
  Image as RNImage,
} from "react-native";
import { Image } from "expo-image";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { url } from "@/constants/Colors";
import { Router, useRouter } from "expo-router";
import { NavigationAction } from "@react-navigation/native";

const { width } = Dimensions.get("window");

export default function CameraScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const ref = useRef<CameraView>(null);
  const [uri, setUri] = useState<string | null>(null);
  const [facing, setFacing] = useState<CameraType>("back");
  const [flash, setFlash] = useState(false);
  const [zoom, setZoom] = useState(0);
  const [uploading, setUploading] = useState(false);
  const navigation = useRouter();
  if (!permission) {
    return null;
  }

  if (!permission.granted) {
    return (
      <View style={styles.permissionContainer}>
        <MaterialIcons name="photo-camera" size={80} color="#4a6fa5" />
        <Text style={styles.permissionTitle}>Camera Access Needed</Text>
        <Text style={styles.permissionText}>
          To capture food photos and nutrition labels, we need access to your
          camera.
        </Text>
        <View style={styles.permissionButton}>
          <Button
            onPress={requestPermission}
            title="Grant Permission"
            color="#4a6fa5"
          />
        </View>
      </View>
    );
  }

  const takePicture = async () => {
    const photo = await ref.current?.takePictureAsync();
    setUri(photo?.uri || null);
  };

  const toggleFacing = () => {
    setFacing((prev) => (prev === "back" ? "front" : "back"));
  };

  const toggleFlash = () => {
    setFlash((prev) => !prev);
  };

  const adjustZoom = (direction: "in" | "out") => {
    setZoom((prev) => {
      if (direction === "in" && prev < 1) return +(prev + 0.1).toFixed(1);
      if (direction === "out" && prev > 0) return +(prev - 0.1).toFixed(1);
      return prev;
    });
  };

  const uploadImage = async () => {
    if (!uri) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("image", {
        uri,
        name: `food-${Date.now()}.jpg`,
        type: "image/jpeg",
      } as any);

      const response = await fetch(url + "/upload", {
        method: "POST",
        body: formData,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      type resultType = {
        userID: number;
        success: Boolean;
        message: String;
        data: {
          name?: string;
          servingSize?: string;
          caloriesPerServing?: string;
          protein?: string;
          carbs?: string;
          fats?: string;
          imageUrl?: string;
        };
      };
      const result: any = await response.json();

      console.log(result.data);
      console.log(typeof result.data);

      console.log(result.data);
      if (result.success) {
        navigation.navigate({
          pathname: "/screens/confirmPantryIngredient",
          params: {
            data: result.data,
          },
        });
      }
    } catch (error) {
      console.error("Upload error:", error);
    } finally {
      setUploading(false);
    }
  };

  const renderPicture = () => {
    if (uploading) {
      return (
        <View style={styles.uploadingContainer}>
          <ActivityIndicator size="large" color="#4a6fa5" />
          <Text style={styles.uploadingText}>Uploading your food photo...</Text>
        </View>
      );
    }

    return (
      <View style={styles.previewContainer}>
        <Image source={uri} contentFit="contain" style={styles.previewImage} />
        <View style={styles.previewButtons}>
          <Pressable style={styles.previewButton} onPress={() => setUri(null)}>
            <Text style={styles.previewButtonText}>Retake</Text>
          </Pressable>
          <Pressable
            style={[styles.previewButton, styles.acceptButton]}
            onPress={uploadImage}
            disabled={uploading}>
            <Text style={styles.previewButtonText}>
              {uploading ? "Uploading..." : "Use Photo"}
            </Text>
          </Pressable>
        </View>
      </View>
    );
  };

  const renderCamera = () => {
    return (
      <View style={styles.cameraWrapper}>
        <CameraView
          style={styles.camera}
          ref={ref}
          mode="picture"
          facing={facing}
          flash={flash ? "on" : "off"}
          zoom={zoom}
          mute={false}
          responsiveOrientationWhenOrientationLocked>
          <View style={styles.guideOverlay}>
            <View style={styles.guideFrame}>
              <View style={styles.guideCornerTopLeft} />
              <View style={styles.guideCornerTopRight} />
              <View style={styles.guideCornerBottomLeft} />
              <View style={styles.guideCornerBottomRight} />
              <Text style={styles.guideText}>
                Align food or label within frame
              </Text>
            </View>
          </View>

          <View style={styles.topControls}>
            <Pressable onPress={toggleFlash}>
              <MaterialIcons
                name={flash ? "flash-on" : "flash-off"}
                size={32}
                color="white"
              />
            </Pressable>
            <Pressable onPress={() => adjustZoom("out")}>
              <MaterialIcons name="zoom-out" size={32} color="white" />
            </Pressable>
            <Pressable onPress={() => adjustZoom("in")}>
              <MaterialIcons name="zoom-in" size={32} color="white" />
            </Pressable>
          </View>

          <View style={styles.bottomControls}>
            <Pressable onPress={toggleFacing} style={styles.flipButton}>
              <FontAwesome6 name="rotate-left" size={24} color="white" />
              <Text style={styles.modeText}>Flip</Text>
            </Pressable>

            <Pressable onPress={takePicture} style={styles.shutterButton}>
              <View style={styles.shutterOuter}>
                <View style={styles.shutterInner} />
              </View>
            </Pressable>
          </View>
        </CameraView>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {uri ? renderPicture() : renderCamera()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    marginBottom: 100,
  },
  permissionContainer: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  permissionTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginVertical: 16,
    color: "#333",
  },
  permissionText: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 24,
    color: "#666",
    lineHeight: 24,
  },
  permissionButton: {
    width: "80%",
  },
  cameraWrapper: {
    flex: 1,
    backgroundColor: "#000",
  },
  camera: {
    flex: 1,
  },
  guideOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent",
  },
  guideFrame: {
    width: width * 0.8,
    height: width * 0.8,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  guideCornerTopLeft: {
    position: "absolute",
    top: -2,
    left: -2,
    width: 30,
    height: 30,
    borderLeftWidth: 3,
    borderTopWidth: 3,
    borderColor: "white",
  },
  guideCornerTopRight: {
    position: "absolute",
    top: -2,
    right: -2,
    width: 30,
    height: 30,
    borderRightWidth: 3,
    borderTopWidth: 3,
    borderColor: "white",
  },
  guideCornerBottomLeft: {
    position: "absolute",
    bottom: -2,
    left: -2,
    width: 30,
    height: 30,
    borderLeftWidth: 3,
    borderBottomWidth: 3,
    borderColor: "white",
  },
  guideCornerBottomRight: {
    position: "absolute",
    bottom: -2,
    right: -2,
    width: 30,
    height: 30,
    borderRightWidth: 3,
    borderBottomWidth: 3,
    borderColor: "white",
  },
  guideText: {
    position: "absolute",
    bottom: -40,
    color: "white",
    fontSize: 16,
    textAlign: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
    padding: 8,
    borderRadius: 8,
  },
  topControls: {
    position: "absolute",
    top: 40,
    right: 20,
    flexDirection: "column",
    alignItems: "center",
    gap: 20,
  },
  bottomControls: {
    position: "absolute",
    bottom: 40,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 40,
  },
  flipButton: {
    alignItems: "center",
    justifyContent: "center",
    width: 60,
  },
  modeText: {
    color: "white",
    fontSize: 12,
    marginTop: 4,
  },
  shutterButton: {
    alignItems: "center",
    justifyContent: "center",
  },
  shutterOuter: {
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 3,
    borderColor: "white",
    justifyContent: "center",
    alignItems: "center",
  },
  shutterInner: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "white",
  },
  previewContainer: {
    flex: 1,
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
  },
  previewImage: {
    width: "100%",
    height: "80%",
  },
  previewButtons: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    paddingHorizontal: 40,
    marginTop: 30,
  },
  previewButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 24,
    backgroundColor: "rgba(255,255,255,0.2)",
  },
  acceptButton: {
    backgroundColor: "#4a6fa5",
  },
  previewButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "500",
  },
  uploadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000",
  },
  uploadingText: {
    color: "white",
    marginTop: 20,
    fontSize: 16,
  },
});
