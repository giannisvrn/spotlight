import { View, Text, StyleSheet, TouchableOpacity } from "react-native"
import { Feather } from "@expo/vector-icons"

export default function PlaceCard({ place, onPress }) {
  // Render stars based on the single review's rating
  const renderStars = (rating) => {
    const stars = []
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Feather
          key={i}
          name="star"
          size={16}
          color={i <= rating ? "#FFD700" : "#e0e0e0"}
          style={{ marginRight: 2 }}
        />
      )
    }
    return stars
  }

  const review = place.reviews ? Object.values(place.reviews)[0] : null

  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={styles.content}>
        <Text style={styles.name}>{place.name}</Text>
        <Text style={styles.category}>{place.category}</Text>
        <Text style={styles.address} numberOfLines={1}>
          {place.address}
        </Text>
        <View style={styles.ratingContainer}>
          {review ? renderStars(review.rating) : <Text style={styles.noReviewsText}>No reviews yet</Text>}
        </View>
        {review && (
          <Text style={[styles.expensiveness, getExpensivenessStyle(review.expensiveness)]}>
            {getExpensivenessLabel(review.expensiveness)}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  )
}

const getExpensivenessLabel = (expensiveness) => {
  switch (expensiveness) {
    case 1: return 'Cheap';
    case 2: return 'Affordable';
    case 3: return 'Fair priced';
    case 4: return 'Expensive';
    case 5: return 'Really Expensive';
    default: return 'Unknown';
  }
};

const getExpensivenessStyle = (expensiveness) => {
  switch (expensiveness) {
    case 1: return { color: "#4CAF50" }; 
    case 2: return { color: "#8BC34A" };
    case 3: return { color: "#FFC107" }; 
    case 4: return { color: "#FF9800" }; 
    case 5: return { color: "#F44336" };
    default: return { color: "#999" };
  }
};

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 12,
    marginBottom: 15,
    padding: 14,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  content: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 2,
  },
  category: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  address: {
    fontSize: 12,
    color: "#999",
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  noReviewsText: {
    fontSize: 14,
    color: "#999",
    fontStyle: "italic",
  },
  expensiveness: {
    fontSize: 14,
    fontWeight: "bold",
  },
})

