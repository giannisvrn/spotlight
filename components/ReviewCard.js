import { View, Text, StyleSheet } from "react-native"
import { Feather } from "@expo/vector-icons"

export default function ReviewCard({ review }) {
  // Format date
  const formatDate = (timestamp) => {
    if (!timestamp) return ""

    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  // Render stars based on rating
  const renderStars = (rating) => {
    const stars = []
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Feather
          key={i}
          name={i <= rating ? "star" : "star"}
          size={16}
          color={i <= rating ? "#FFD700" : "#e0e0e0"}
          style={{ marginRight: 2 }}
        />,
      )
    }
    return stars
  }

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.username}>{review.username}</Text>
        <Text style={styles.date}>{formatDate(review.createdAt)}</Text>
      </View>

      <View style={styles.ratingContainer}>{renderStars(review.rating)}</View>

      {review.comment && <Text style={styles.comment}>{review.comment}</Text>}

      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Feather name="repeat" size={14} color="#666" />
          <Text style={styles.statText}>{review.willReturn ? "Will return" : "Won't return"}</Text>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#f9f9f9",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  username: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  date: {
    fontSize: 12,
    color: "#888",
  },
  ratingContainer: {
    flexDirection: "row",
    marginBottom: 12,
  },
  comment: {
    fontSize: 14,
    color: "#555",
    lineHeight: 20,
    marginBottom: 12,
  },
  statsContainer: {
    flexDirection: "row",
    borderTopWidth: 1,
    borderTopColor: "#eee",
    paddingTop: 12,
  },
  statItem: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 16,
  },
  statText: {
    fontSize: 12,
    color: "#666",
    marginLeft: 4,
  },
})

