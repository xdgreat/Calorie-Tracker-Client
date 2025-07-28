import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { url } from "@/constants/Colors";

type PantryItem = {
  id: string;
  name: string;
  user_id: number;
  serving_size: number;
  quantity: number;
  unit: string;
  expiresAt: any;
  nutrition?: {
    calories?: number;
    protein?: number;
    carbs?: number;
    fats?: number;
  };
};

export default function PantryScreen() {
  const { userID } = useLocalSearchParams();
  const router = useRouter();
  const [items, setItems] = useState<PantryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "active" | "expired">("all");
  const [sortBy, setSortBy] = useState<"added" | "expiry" | "name">("added");
  const formatDate = (date: Date) => {
    const day = date.getDate();
    const month = date.toLocaleString("default", { month: "long" });
    const year = date.getFullYear();

    // Add ordinal suffix to day
    const suffix =
      day % 10 === 1 && day !== 11
        ? "st"
        : day % 10 === 2 && day !== 12
        ? "nd"
        : day % 10 === 3 && day !== 13
        ? "rd"
        : "th";

    return `${day}${suffix} ${month} ${year}`;
  };
  useEffect(() => {
    const fetchPantryItems = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${url}/users/${1}/pantry`);

        if (!response.ok) throw new Error("Failed to fetch pantry items");

        const data = await response.json();
        setItems(data.items);
      } catch (err: any) {
        setError(err.message || "Error loading pantry");
      } finally {
        setLoading(false);
      }
    };

    fetchPantryItems();
  }, [userID, filter, sortBy]);

  const handleAddItem = () => {
    const pathName: any = `/pantry/add-item?userID=${userID}`;
    router.navigate({ pathname: pathName });
  };
  const renderItem = ({ item }: { item: PantryItem }) => (
    <View style={styles.itemContainer}>
      <View style={styles.itemHeader}>
        <Text style={styles.itemName}>{item.name}</Text>
        <Text style={styles.itemQuantity}>
          {item.quantity ?? 600}
          {item.unit ?? "ml"}
        </Text>
      </View>
      <View style={styles.expiryRow}>
        {
          (item.expiresAt =
            item.expiresAt ||
            new Date(
              new Date().setDate(new Date().getDate() + 14)
            ).toISOString())
        }
        <MaterialIcons
          name="hourglass-bottom"
          size={16}
          color={
            new Date(item.expiresAt) < new Date()
              ? colors.danger
              : colors.primary
          }
        />
        <Text
          style={[
            styles.expiryText,
            new Date(item.expiresAt) < new Date() && styles.expiredText,
          ]}>
          {formatDate(new Date(item.expiresAt))}
        </Text>
      </View>
      {item.nutrition && (
        <View style={styles.nutritionRow}>
          <View style={styles.nutritionPill}>
            <Text style={styles.nutritionText}>
              🍞 {item.nutrition.carbs || 0}g
            </Text>
          </View>
          <View style={styles.nutritionPill}>
            <Text style={styles.nutritionText}>
              🥩 {item.nutrition.protein || 0}g
            </Text>
          </View>
          <View style={styles.nutritionPill}>
            <Text style={styles.nutritionText}>
              🥑 {item.nutrition.fats || 0}g
            </Text>
          </View>
          <View style={styles.nutritionPill}>
            <Text style={styles.nutritionText}>
              🔥 {item.nutrition.calories || 0}kcal
            </Text>
          </View>
        </View>
      )}
    </View>
  );

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity
          style={styles.retryButton}
          onPress={() => {
            setError(null);
            setLoading(true);
          }}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My Pantry</Text>
      </View>

      <View style={styles.filterContainer}>
        <TouchableOpacity
          style={[styles.filterButton, filter === "all" && styles.activeFilter]}
          onPress={() => setFilter("all")}>
          <Text
            style={
              filter === "all" ? styles.activeFilterText : styles.filterText
            }>
            All
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.filterButton,
            filter === "active" && styles.activeFilter,
          ]}
          onPress={() => setFilter("active")}>
          <Text
            style={
              filter === "active" ? styles.activeFilterText : styles.filterText
            }>
            Active
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.filterButton,
            filter === "expired" && styles.activeFilter,
          ]}
          onPress={() => setFilter("expired")}>
          <Text
            style={
              filter === "expired" ? styles.activeFilterText : styles.filterText
            }>
            Expired
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.sortContainer}>
        <Text style={styles.sortLabel}>Sort by:</Text>
        <TouchableOpacity
          style={[styles.sortButton, sortBy === "added" && styles.activeSort]}
          onPress={() => setSortBy("added")}>
          <Text
            style={
              sortBy === "added" ? styles.activeSortText : styles.sortText
            }>
            Added
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.sortButton, sortBy === "expiry" && styles.activeSort]}
          onPress={() => setSortBy("expiry")}>
          <Text
            style={
              sortBy === "expiry" ? styles.activeSortText : styles.sortText
            }>
            Expiry
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.sortButton, sortBy === "name" && styles.activeSort]}
          onPress={() => setSortBy("name")}>
          <Text
            style={sortBy === "name" ? styles.activeSortText : styles.sortText}>
            Name
          </Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={items}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <MaterialIcons name="kitchen" size={48} color={colors.lightGray} />
            <Text style={styles.emptyText}>Your pantry is empty</Text>
            <Text style={styles.emptySubtext}>Add items to get started</Text>
          </View>
        }
      />

      <TouchableOpacity style={styles.addButton} onPress={handleAddItem}>
        <MaterialIcons name="add" size={28} color="white" />
      </TouchableOpacity>
    </View>
  );
}

const colors = {
  primary: "#4a6fa5",
  primaryLight: "#e1e8f5",
  danger: "#ff6b6b",
  dangerLight: "#ffebee",
  success: "#66bb6a",
  warning: "#ffa726",
  background: "#f8f9fa",
  text: "#333",
  lightText: "#666",
  lightGray: "#e0e0e0",
  white: "#fff",
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 16,
    marginBlock: 85,
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: colors.text,
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.background,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
  },
  listContainer: {
    paddingBottom: 20,
  },
  itemContainer: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  itemHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  itemName: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.text,
  },
  itemQuantity: {
    fontSize: 16,
    color: colors.lightText,
  },
  expiryRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
    padding: 6,
    borderRadius: 6,
    backgroundColor: colors.primaryLight,
    alignSelf: "flex-start",
  },
  expiryText: {
    marginLeft: 6,
    fontSize: 14,
    color: colors.primary,
  },
  expiredText: {
    color: colors.danger,
  },
  nutritionRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.lightGray,
    gap: 8,
  },
  nutritionPill: {
    backgroundColor: colors.primaryLight,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
  },
  nutritionText: {
    fontSize: 12,
    color: colors.primary,
    fontWeight: "500",
  },
  filterContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
    backgroundColor: colors.lightGray,
    borderRadius: 10,
    padding: 4,
  },
  filterButton: {
    flex: 1,
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  activeFilter: {
    backgroundColor: colors.primary,
  },
  filterText: {
    color: colors.text,
    fontWeight: "500",
  },
  activeFilterText: {
    color: colors.white,
    fontWeight: "600",
  },
  sortContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  sortLabel: {
    fontSize: 14,
    color: colors.lightText,
    marginRight: 8,
  },
  sortButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    backgroundColor: colors.lightGray,
    marginLeft: 8,
  },
  activeSort: {
    backgroundColor: colors.primary,
  },
  sortText: {
    color: colors.text,
    fontSize: 14,
  },
  activeSortText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: "500",
  },
  addButton: {
    position: "absolute",
    right: 24,
    bottom: 24,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
  },
  errorText: {
    color: colors.danger,
    marginBottom: 16,
    fontSize: 16,
  },
  retryButton: {
    padding: 12,
    paddingHorizontal: 24,
    backgroundColor: colors.primary,
    borderRadius: 8,
  },
  retryButtonText: {
    color: colors.white,
    fontWeight: "500",
  },
  emptyText: {
    color: colors.lightText,
    fontSize: 18,
    fontWeight: "600",
    marginTop: 16,
  },
  emptySubtext: {
    color: colors.lightText,
    fontSize: 14,
    marginTop: 4,
  },
});
