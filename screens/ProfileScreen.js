// ProfileScreen.js with pull-to-refresh added
"use client"

import { useState, useEffect, useCallback } from "react"
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, Image, RefreshControl } from "react-native"
import { collection, query, where, getDocs } from "firebase/firestore"
import { db } from "../firebase-config"
import { useAuth } from "../context/AuthContext"
import { Feather } from "@expo/vector-icons"
import PlaceCard from "../components/PlaceCard"
import { useFocusEffect } from '@react-navigation/native';

export default function ProfileScreen({ navigation }) {
  const [userPlaces, setUserPlaces] = useState([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false) // Add refreshing state
  const [activeTab, setActiveTab] = useState("places")
  const { currentUser } = useAuth()

  useEffect(() => {
    fetchUserData()
  }, [])

  useFocusEffect(
    useCallback(() => {
      fetchUserData();
    }, [])
  );

  const fetchUserData = async () => {
    try {
      setLoading(true)

      // Fetch places created by the user
      const placesQuery = query(collection(db, "places"), where("createdBy", "==", currentUser.uid))

      const placesSnapshot = await getDocs(placesQuery)
      const placesData = []

      placesSnapshot.forEach((doc) => {
        placesData.push({
          id: doc.id,
          ...doc.data(),
        })
      })

      setUserPlaces(placesData)
    } catch (error) {
      console.error("Error fetching user data:", error)
    } finally {
      setLoading(false)
      setRefreshing(false) // Make sure to reset refreshing state
    }
  }

  // Add onRefresh function for pull-to-refresh
  const onRefresh = useCallback(() => {
    setRefreshing(true)
    fetchUserData()
  }, [])

  if (loading && !refreshing) { // Only show loading indicator if not refreshing
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF6B6B" />
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <View style={styles.profileHeader}>
        <View style={styles.profileImageContainer}>
          <Image source={{ uri: "https://placeholder.svg?height=100&width=100" }} style={styles.profileImage} />
        </View>
        <Text style={styles.username}>{currentUser.profile?.username || "User"}</Text>
        <Text style={styles.email}>{currentUser.email}</Text>
      </View>

      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === "places" && styles.activeTab]}
          onPress={() => setActiveTab("places")}
        >
          <Text style={[styles.tabText, activeTab === "places" && styles.activeTabText]}>My Places</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.contentContainer}>
        {activeTab === "places" && (
          <FlatList
            data={userPlaces}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <PlaceCard place={item} onPress={() => navigation.navigate("PlaceDetails", { placeId: item.id })} />
            )}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Feather name="map-pin" size={50} color="#ccc" />
                <Text style={styles.emptyText}>You haven't added any places yet</Text>
                <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate("AddPlace")}>
                  <Text style={styles.addButtonText}>Add a Place</Text>
                </TouchableOpacity>
              </View>
            }
            contentContainerStyle={styles.listContent}
            refreshControl={ // Add RefreshControl component
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                colors={["#FF6B6B"]}
                tintColor="#FF6B6B"
              />
            }
          />
        )}
      </View>
    </View>
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
  profileHeader: {
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  profileImageContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#f5f5f5",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
    overflow: "hidden",
  },
  profileImage: {
    width: 100,
    height: 100,
  },
  username: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  email: {
    fontSize: 14,
    color: "#666",
  },
  tabsContainer: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  tab: {
    flex: 1,
    paddingVertical: 15,
    alignItems: "center",
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: "#FF6B6B",
  },
  tabText: {
    fontSize: 16,
    color: "#666",
  },
  activeTabText: {
    color: "#FF6B6B",
    fontWeight: "bold",
  },
  contentContainer: {
    flex: 1,
  },
  listContent: {
    padding: 15,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
  },
  emptyText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginTop: 16,
    marginBottom: 24,
  },
  addButton: {
    backgroundColor: "#FF6B6B",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  addButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
})

