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
          name="star"
          size={16}
          color={i <= rating ? "#FFD700" : "#e0e0e0"}
          style={{ marginRight: 2 }}
        />
      )
    }
    return stars
  }

  // Get formatted expensiveness label
  const getExpensivenessLabel = (expensiveness) => {
    switch (expensiveness) {
      case 1: return 'Cheap'
      case 2: return 'Affordable'
      case 3: return 'Fair priced'
      case 4: return 'Expensive'
      case 5: return 'Really expensive'
      default: return 'Unknown'
    }
  }

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.ratingContainer}>{renderStars(review.rating)}</View>
        <Text style={styles.date}>{formatDate(review.createdAt)}</Text>
      </View>

      {review.comment && <Text style={styles.comment}>{review.comment}</Text>}

      {/* Expensiveness Label */}
      <View style={styles.expensivenessContainer}>
        <Text style={styles.expensivenessText}>{getExpensivenessLabel(review.expensiveness)}</Text>
      </View>

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
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: "row",
  },
  date: {
    fontSize: 12,
    color: "#888",
  },
  comment: {
    fontSize: 14,
    color: "#555",
    lineHeight: 20,
    marginBottom: 12,
  },
  expensivenessContainer: {
    backgroundColor: "#eee",
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    marginBottom: 12,
  },
  expensivenessText: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#444",
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
