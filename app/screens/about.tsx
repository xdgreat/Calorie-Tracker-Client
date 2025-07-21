import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { IconSymbol } from "@/components/ui/IconSymbol.ios";
import { url } from "@/constants/Colors";
import { CameraType, useCameraPermissions } from "expo-camera";
import { useEffect, useState } from "react";
import { Button, StyleSheet, Text, View } from "react-native";

type UserInformation = {
  user_id: number;
  first_name: string;
  last_name: string;
  dob: string;
};

type ApiResponse<T> = {
  data?: T;
  error?: string;
  loading: boolean;
};

export default function TabThreeScreen() {
  const [facing, setFacing] = useState<CameraType>("back");
  const [permission, requestPermission] = useCameraPermissions();
  const [aiResponse, setAiResponse] = useState<ApiResponse<string>>({
    loading: true,
  });
  const [usersData, setUsersData] = useState<ApiResponse<UserInformation[]>>({
    loading: true,
  });

  useEffect(() => {
    // Fetch AI data
    const fetchAiData = async () => {
      try {
        const response = await fetch(`${url}/ai`);
        const data = await response.json();
        setAiResponse({
          data: data.response,
          loading: false,
        });
      } catch (err) {
        setAiResponse({
          error: err instanceof Error ? err.message : "Unknown error",
          loading: false,
        });
      }
    };

    // Fetch users data
    const fetchUsersData = async () => {
      try {
        const response = await fetch(`${url}/emojis`);
        const data = await response.json();
        setUsersData({
          data: data.data as UserInformation[],
          loading: false,
        });
      } catch (err) {
        setUsersData({
          error: err instanceof Error ? err.message : "Unknown error",
          loading: false,
        });
      }
    };

    fetchAiData();
    fetchUsersData();
  }, []);

  if (!permission) {
    return <Text>No camera device found</Text>;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>
          We need your permission to show the camera
        </Text>
        <Button onPress={requestPermission} title="Grant Permission" />
      </View>
    );
  }

  const toggleCameraFacing = () => {
    setFacing((current) => (current === "back" ? "front" : "back"));
  };

  const renderContent = () => {
    if (aiResponse.loading || usersData.loading) {
      return <Text>Loading...</Text>;
    }

    if (aiResponse.error || usersData.error) {
      return (
        <View>
          {aiResponse.error && <Text>AI Error: {aiResponse.error}</Text>}
          {usersData.error && <Text>Users Error: {usersData.error}</Text>}
        </View>
      );
    }

    return (
      <View>
        <ThemedText type="title">AI Response</ThemedText>
        <Text>{aiResponse.data}</Text>

        <ThemedText type="title" style={{ marginTop: 20 }}>
          Users
        </ThemedText>
        {usersData.data?.map((user) => (
          <View key={user.user_id} style={{ marginBottom: 10 }}>
            <Text>ID: {user.user_id}</Text>
            <Text>First Name: {user.first_name}</Text>
            <Text>Last Name: {user.last_name}</Text>
            <Text>DOB: {user.dob}</Text>
          </View>
        ))}
      </View>
    );
  };

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#D0D0D0", dark: "#353636" }}
      headerImage={
        <IconSymbol
          size={310}
          color="#808080"
          name="chevron.left.forwardslash.chevron.right"
          style={styles.headerImage}
        />
      }>
      <View style={styles.container}>{renderContent()}</View>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: "#808080",
    bottom: -90,
    left: -35,
    position: "absolute",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
  },
  message: {
    textAlign: "center",
    paddingBottom: 10,
  },
});
