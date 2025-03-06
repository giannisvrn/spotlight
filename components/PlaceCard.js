import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native"
import { Feather } from "@expo/vector-icons"

export default function PlaceCard({ place, onPress }) {
  // Calculate average rating
  const avgRating =
    place.reviews && place.reviews.length > 0
      ? place.reviews.reduce((sum, review) => sum + review.rating, 0) / place.reviews.length
      : 0

  // Format rating to one decimal place
  const formattedRating = avgRating.toFixed(1)

  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <Image source={{ uri: place.imageUrl || "https://placeholder.svg?height=120&width=120" }} style={styles.image} />
      <View style={styles.content}>
        <Text style={styles.name}>{place.name}</Text>
        <Text style={styles.category}>{place.category}</Text>
        <Text style={styles.address} numberOfLines={1}>
          {place.address}
        </Text>

        <View style={styles.ratingContainer}>
          <Feather name="star" size={16} color="#FFD700" />
          <Text style={styles.rating}>
            {formattedRating} ({place.reviews ? place.reviews.length : 0})
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 12,
    marginBottom: 15,
    padding: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  content: {
    flex: 1,
    marginLeft: 12,
    justifyContent: "space-between",
  },
  name: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  category: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  address: {
    fontSize: 14,
    color: "#888",
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  rating: {
    marginLeft: 4,
    fontSize: 14,
    color: "#333",
  },
})

