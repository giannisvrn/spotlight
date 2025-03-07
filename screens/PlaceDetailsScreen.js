"use client"

import { useState, useEffect, useCallback } from "react"
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Alert } from "react-native"
import { doc, getDoc } from "firebase/firestore"
import { db } from "../firebase-config"
import { Feather } from "@expo/vector-icons"
import { useAuth } from "../context/AuthContext"
import ReviewCard from "../components/ReviewCard"
import { useFocusEffect } from '@react-navigation/native';

export default function PlaceDetailsScreen({ route, navigation }) {
  const { placeId } = route.params
  const [place, setPlace] = useState(null)
  const [loading, setLoading] = useState(true)
  const { currentUser } = useAuth()

  useEffect(() => {
    fetchPlaceDetails()
  }, [placeId])

  useFocusEffect(
    useCallback(() => {
      fetchPlaceDetails();
    }, [placeId])
  );

  const fetchPlaceDetails = async () => {
    try {
      setLoading(true)
      const docRef = doc(db, "places", placeId)
      const docSnap = await getDoc(docRef)

      if (docSnap.exists()) {
        setPlace({
          id: docSnap.id,
          ...docSnap.data(),
        })
      } else {
        Alert.alert("Error", "Place not found")
        navigation.goBack()
      }
    } catch (error) {
      console.error("Error fetching place details:", error)
      Alert.alert("Error", "Failed to load place details")
    } finally {
      setLoading(false)
    }
  }

  const calculateAverageRating = () => {
    if (!place.reviews || place.reviews.length === 0) return 0

    const sum = place.reviews.reduce((total, review) => total + review.rating, 0)
    return (sum / place.reviews.length).toFixed(1)
  }

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF6B6B" />
      </View>
    )
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.name}>{place.name}</Text>
        <View style={styles.categoryContainer}>
          <Text style={styles.category}>{place.category}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Address</Text>
          <Text style={styles.address}>{place.address}</Text>
        </View>

        {place.description && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Description</Text>
            <Text style={styles.description}>{place.description}</Text>
          </View>
        )}

        <View style={styles.section}>
          <View style={styles.reviewHeader}>
            <Text style={styles.sectionTitle}>Your Review</Text>
            <TouchableOpacity
              style={styles.addReviewButton}
              onPress={() => navigation.navigate("AddReview", { placeId: place.id })}
            >
              <Text style={styles.addReviewText}>
                {place.reviews && place.reviews[currentUser.uid] ? "Edit Review" : "Add Review"}
              </Text>
              <Feather name={place.reviews && place.reviews[currentUser.uid] ? "edit" : "plus"} size={16} color="#fff" />
            </TouchableOpacity>
          </View>

          {place.reviews && place.reviews[currentUser.uid] ? (
            <ReviewCard review={place.reviews[currentUser.uid]} />
          ) : (
            <Text style={styles.noReviews}>No reviews yet. Be the first to review!</Text>
          )}
        </View>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 10,
    margin: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  name: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  categoryContainer: {
    backgroundColor: "#e0e0e0",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    alignSelf: "flex-start",
    marginBottom: 12,
  },
  category: {
    fontSize: 14,
    color: "#555",
  },
  section: {
    marginBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    paddingBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  address: {
    fontSize: 16,
    color: "#666",
    lineHeight: 24,
  },
  description: {
    fontSize: 16,
    color: "#666",
    lineHeight: 24,
  },
  reviewHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  addReviewButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FF6B6B",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
  },
  addReviewText: {
    fontSize: 14,
    color: "#fff",
    fontWeight: "bold",
    marginRight: 4,
  },
  noReviews: {
    fontSize: 16,
    color: "#888",
    fontStyle: "italic",
    textAlign: "center",
    marginTop: 20,
  },
})

