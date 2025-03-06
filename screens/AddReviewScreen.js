"use client"

import { useState } from "react"
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from "react-native"
import { doc, getDoc, updateDoc, arrayUnion } from "firebase/firestore"
import { db } from "../firebase-config"
import { useAuth } from "../context/AuthContext"
import { Feather } from "@expo/vector-icons"

export default function AddReviewScreen({ route, navigation }) {
  const { placeId } = route.params
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState("")
  const [willReturn, setWillReturn] = useState(true)
  const [loading, setLoading] = useState(false)
  const { currentUser } = useAuth()

  const handleSubmit = async () => {
    if (rating === 0) {
      Alert.alert("Error", "Please select a rating")
      return
    }

    try {
      setLoading(true)

      // Get user profile data
      const userDoc = await getDoc(doc(db, "users", currentUser.uid))
      const username = userDoc.data()?.username || "Anonymous"

      // Create review object
      const reviewData = {
        userId: currentUser.uid,
        username,
        rating,
        comment,
        willReturn,
        createdAt: new Date().toISOString(),
      }

      // Update place document with new review
      const placeRef = doc(db, "places", placeId)
      await updateDoc(placeRef, {
        reviews: arrayUnion(reviewData),
      })

      Alert.alert("Success", "Your review has been added!")
      navigation.goBack()
    } catch (error) {
      console.error("Error adding review:", error)
      Alert.alert("Error", "Failed to add review. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const renderStars = () => {
    const stars = []
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <TouchableOpacity key={i} onPress={() => setRating(i)} style={styles.starButton}>
          <Feather name="star" size={32} color={i <= rating ? "#FFD700" : "#e0e0e0"} />
        </TouchableOpacity>,
      )
    }
    return stars
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.formContainer}>
        <Text style={styles.label}>Rating *</Text>
        <View style={styles.ratingContainer}>{renderStars()}</View>

        <Text style={styles.label}>Your Review</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={comment}
          onChangeText={setComment}
          placeholder="Share your experience..."
          multiline
          numberOfLines={4}
        />

        <Text style={styles.label}>Would you visit again?</Text>
        <View style={styles.toggleContainer}>
          <TouchableOpacity
            style={[styles.toggleButton, willReturn ? styles.toggleButtonActive : null]}
            onPress={() => setWillReturn(true)}
          >
            <Text style={willReturn ? styles.toggleTextActive : styles.toggleText}>Yes</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.toggleButton, !willReturn ? styles.toggleButtonActive : null]}
            onPress={() => setWillReturn(false)}
          >
            <Text style={!willReturn ? styles.toggleTextActive : styles.toggleText}>No</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit} disabled={loading}>
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.submitButtonText}>Submit Review</Text>}
        </TouchableOpacity>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  formContainer: {
    padding: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 12,
  },
  ratingContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 24,
  },
  starButton: {
    padding: 8,
  },
  input: {
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    padding: 15,
    marginBottom: 20,
    fontSize: 16,
  },
  textArea: {
    height: 120,
    textAlignVertical: "top",
  },
  toggleContainer: {
    flexDirection: "row",
    marginBottom: 24,
  },
  toggleButton: {
    flex: 1,
    padding: 12,
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    marginRight: 8,
    borderRadius: 8,
  },
  toggleButtonActive: {
    backgroundColor: "#FF6B6B",
  },
  toggleText: {
    color: "#666",
    fontWeight: "bold",
  },
  toggleTextActive: {
    color: "#fff",
    fontWeight: "bold",
  },
  submitButton: {
    backgroundColor: "#FF6B6B",
    borderRadius: 8,
    padding: 15,
    alignItems: "center",
    marginTop: 10,
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
})

