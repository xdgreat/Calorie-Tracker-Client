import { StyleSheet } from "react-native";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { MaterialIcons, MaterialCommunityIcons } from "@expo/vector-icons";

export default function HomeScreen() {
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#A1CEDC", dark: "#1D3D47" }}
      headerImage={
        <MaterialCommunityIcons 
          name="food-apple" 
          size={120} 
          color="#fff" 
          style={styles.headerIcon}
        />
      }>
      
      <ThemedView style={styles.headerContainer}>
        <ThemedText type="title" style={styles.headerTitle}>PantryPal</ThemedText>
        <ThemedText style={styles.headerSubtitle}>Your smart kitchen organizer</ThemedText>
      </ThemedView>

      <ThemedView style={styles.featuresContainer}>
        <ThemedView style={styles.featureCard}>
          <MaterialIcons name="kitchen" size={32} color="#4a6fa5" />
          <ThemedText type="subtitle" style={styles.featureTitle}>Pantry Tracking</ThemedText>
          <ThemedText style={styles.featureText}>
            Track ingredients, quantities, and expiration dates effortlessly
          </ThemedText>
        </ThemedView>

        <ThemedView style={styles.featureCard}>
          <MaterialCommunityIcons name="chef-hat" size={32} color="#4a6fa5" />
          <ThemedText type="subtitle" style={styles.featureTitle}>Smart Recipes</ThemedText>
          <ThemedText style={styles.featureText}>
            Get meal suggestions based on what you have available
          </ThemedText>
        </ThemedView>

        <ThemedView style={styles.featureCard}>
          <MaterialCommunityIcons name="cart" size={32} color="#4a6fa5" />
          <ThemedText type="subtitle" style={styles.featureTitle}>Grocery Lists</ThemedText>
          <ThemedText style={styles.featureText}>
            Automatic shopping lists that save you time and money
          </ThemedText>
        </ThemedView>
      </ThemedView>

      <ThemedView style={styles.tipContainer}>
        <MaterialIcons name="lightbulb" size={24} color="#FFD700" />
        <ThemedText style={styles.tipText}>
          Pro Tip: Add ingredients as you unpack groceries for best results!
        </ThemedText>
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    alignItems: 'center',
    paddingBottom: 24,
  },
  headerTitle: {
    fontSize: 36,
    fontWeight: '700',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 18,
    opacity: 0.8,
  },
  headerIcon: {
    marginBottom: -30,
  },
  featuresContainer: {
    gap: 20,
    marginBottom: 24,
  },
  featureCard: {
    backgroundColor: 'rgba(74, 111, 165, 0.1)',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
  },
  featureTitle: {
    marginTop: 12,
    marginBottom: 8,
    color: '#4a6fa5',
  },
  featureText: {
    textAlign: 'center',
    lineHeight: 22,
  },
  tipContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
    padding: 16,
    borderRadius: 16,
    gap: 12,
  },
  tipText: {
    flex: 1,
    fontStyle: 'italic',
  },
});