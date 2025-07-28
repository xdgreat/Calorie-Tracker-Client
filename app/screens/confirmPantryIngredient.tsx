import { useState } from "react";
import {
  StyleSheet,
  View,
  ScrollView,
  TextInput,
  Alert,
  Pressable,
} from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useLocalSearchParams, useRouter } from "expo-router";
import { url } from "@/constants/Colors";

export default function ConfirmPantryIngredients() {
  const router = useRouter();
  type IngredientData = {
    name: string | null;
    userID: number | null;
    serving_size: number;
    servingUnit: string;
    calories: number;
    isKcal: boolean;
    protein: string;
    fats: string;
    carbs: string;
    sugar: string;
    fiber: string;
    sodium: string;
    ingredients: string[] | null;
    tags: string[] | null;
    allergens: string[];
    isApproximate: boolean | null;
  };

  const params = useLocalSearchParams();
  const initialData: IngredientData = params.data
    ? JSON.parse(params.data as string)
    : {
        name: null,
        userID: null,
        serving_size: 0,
        servingUnit: "g",
        calories: 0,
        isKcal: true,
        protein: "0g",
        fats: "0g",
        carbs: "0g",
        sugar: "0g",
        fiber: "0g",
        sodium: "0mg",
        ingredients: [] as string[] | null,
        tags: null,
        allergens: [],
        isApproximate: null,
      };

  const [editableData, setEditableData] = useState<IngredientData>(initialData);
  const [isSaving, setIsSaving] = useState(false);

  const handleChange = (field: keyof IngredientData, value: any) => {
    setEditableData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const item = [];
      item.push(editableData);
      item.push(editableData);

      console.log(item);

      const response: any = await fetch(url + "/users/1/pantry", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ items: item }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to save ingredient");
      }

      const result = await response.json();
      console.log("Ingredient saved:", result);
      // Show success message
      Alert.alert("Success", "Ingredient saved successfully");
      router.navigate("/(tabs)/pantry");
    } catch (error: any) {
      console.log("Error saving ingredient:", error);
      Alert.alert("Error", error.message || "Failed to save ingredient");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <ThemedView style={styles.card}>
        <ThemedText type="title" style={styles.title}>
          Confirm Ingredient Details
        </ThemedText>

        <View style={styles.divider} />

        <View style={styles.detailRow}>
          <ThemedText type="defaultSemiBold">Product:</ThemedText>
          <TextInput
            style={styles.input}
            value={editableData.name || ""}
            onChangeText={(text) => handleChange("name", text)}
            placeholder="Enter product name"
          />
        </View>

        <View style={styles.detailRow}>
          <ThemedText type="defaultSemiBold">Serving Size:</ThemedText>
          <View style={styles.inputRow}>
            <TextInput
              style={[styles.input, styles.numericInput]}
              value={editableData.serving_size.toString()}
              onChangeText={(text) =>
                handleChange("serving_size", Number(text))
              }
              keyboardType="numeric"
              placeholder="0"
            />
            <ThemedText>{editableData.servingUnit}</ThemedText>
          </View>
        </View>

        <View style={styles.detailRow}>
          <ThemedText type="defaultSemiBold">Calories:</ThemedText>
          <View style={styles.inputRow}>
            <TextInput
              style={[styles.input, styles.numericInput]}
              value={editableData.calories.toString()}
              onChangeText={(text) => handleChange("calories", Number(text))}
              keyboardType="numeric"
              placeholder="0"
            />
            <ThemedText>kcal</ThemedText>
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.nutritionSection}>
          <ThemedText type="subtitle">Nutrition Facts</ThemedText>
          <View style={styles.nutritionGrid}>
            <View style={styles.nutritionItem}>
              <ThemedText type="defaultSemiBold">Protein</ThemedText>
              <TextInput
                style={styles.smallInput}
                value={editableData.protein}
                onChangeText={(text) => handleChange("protein", text)}
                placeholder="0g"
              />
            </View>
            <View style={styles.nutritionItem}>
              <ThemedText type="defaultSemiBold">Carbs</ThemedText>
              <TextInput
                style={styles.smallInput}
                value={editableData.carbs}
                onChangeText={(text) => handleChange("carbs", text)}
                placeholder="0g"
              />
            </View>
            <View style={styles.nutritionItem}>
              <ThemedText type="defaultSemiBold">Fats</ThemedText>
              <TextInput
                style={styles.smallInput}
                value={editableData.fats}
                onChangeText={(text) => handleChange("fats", text)}
                placeholder="0g"
              />
            </View>
          </View>
        </View>

        {/* Additional editable fields */}
        <View style={styles.section}>
          <ThemedText type="subtitle">Ingredients</ThemedText>
          <TextInput
            style={[styles.input, styles.multilineInput]}
            value={editableData.ingredients?.join(", ") || ""}
            onChangeText={(text) =>
              handleChange(
                "ingredients",
                text.split(",").map((i) => i.trim())
              )
            }
            placeholder="Comma separated ingredients"
            multiline
          />
        </View>

        {/* Save button */}
        <View style={styles.buttonContainer}>
          <Pressable
            style={({ pressed }) => [
              styles.confirmButton,
              (isSaving || pressed) && styles.disabledButton,
            ]}
            onPress={!isSaving ? handleSave : undefined}
            disabled={isSaving}>
            <ThemedText style={styles.buttonText}>
              {isSaving ? "Saving..." : "Confirm & Saves"}
            </ThemedText>
          </Pressable>
        </View>
      </ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 16,
    backgroundColor: "#f5f5f5",
  },
  card: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 22,
    marginBottom: 16,
    textAlign: "center",
  },
  divider: {
    height: 1,
    backgroundColor: "#e0e0e0",
    marginVertical: 16,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
    paddingHorizontal: 8,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 8,
    padding: 10,
    minWidth: 100,
    backgroundColor: "#fff",
  },
  smallInput: {
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 8,
    padding: 8,
    width: 80,
    textAlign: "center",
    backgroundColor: "#fff",
  },
  numericInput: {
    width: 60,
    textAlign: "right",
  },
  multilineInput: {
    minHeight: 80,
    textAlignVertical: "top",
    marginTop: 8,
  },
  nutritionSection: {
    marginTop: 8,
  },
  nutritionGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
  },
  nutritionItem: {
    alignItems: "center",
    flex: 1,
    padding: 8,
    gap: 8,
  },
  section: {
    marginTop: 16,
  },
  buttonContainer: {
    marginTop: 24,
  },
  confirmButton: {
    backgroundColor: "#4a6fa5",
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: "center",
  },
  disabledButton: {
    backgroundColor: "#cccccc",
  },
  buttonText: {
    color: "white",
    fontWeight: "600",
  },
});
