"use client"

import { useState, useEffect, useCallback } from "react"
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, ActivityIndicator, Alert } from "react-native"
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
      {place.imageUrl ? (
        <Image source={{ uri: place.imageUrl }} style={styles.image} />
      ) : (
        <View style={styles.imagePlaceholder}>
          <Feather name="image" size={50} color="#ccc" />
        </View>
      )}

      <View style={styles.content}>
        <Text style={styles.name}>{place.name}</Text>
        <View style={styles.categoryContainer}>
          <Text style={styles.category}>{place.category}</Text>
        </View>

        <View style={styles.ratingContainer}>
          <Feather name="star" size={20} color="#FFD700" />
          <Text style={styles.rating}>
            {calculateAverageRating()} ({place.reviews ? place.reviews.length : 0} reviews)
          </Text>
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
            <Text style={styles.sectionTitle}>Reviews</Text>
            <TouchableOpacity
              style={styles.addReviewButton}
              onPress={() => navigation.navigate("AddReview", { placeId: place.id })}
            >
              <Text style={styles.addReviewText}>Add Review</Text>
              <Feather name="plus" size={16} color="#FF6B6B" />
            </TouchableOpacity>
          </View>

          {place.reviews && place.reviews.length > 0 ? (
            place.reviews.map((review, index) => <ReviewCard key={index} review={review} />)
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
    backgroundColor: "#fff",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: "100%",
    height: 250,
    resizeMode: "cover",
  },
  imagePlaceholder: {
    width: "100%",
    height: 250,
    backgroundColor: "#f5f5f5",
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    padding: 20,
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  categoryContainer: {
    backgroundColor: "#f0f0f0",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    alignSelf: "flex-start",
    marginBottom: 12,
  },
  category: {
    fontSize: 14,
    color: "#666",
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  rating: {
    marginLeft: 8,
    fontSize: 16,
    color: "#333",
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 12,
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
  },
  addReviewText: {
    fontSize: 14,
    color: "#FF6B6B",
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

