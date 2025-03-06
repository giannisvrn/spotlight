// HomeScreen.js with pull-to-refresh added
"use client"

import { useState, useEffect, useCallback } from "react"
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, ActivityIndicator, RefreshControl } from "react-native"
import { collection, getDocs, query, orderBy, limit } from "firebase/firestore"
import { db } from "../firebase-config"
import { useAuth } from "../context/AuthContext"
import { SafeAreaView } from "react-native-safe-area-context"
import { Feather } from "@expo/vector-icons"
import PlaceCard from "../components/PlaceCard"
import { useFocusEffect } from '@react-navigation/native';

export default function HomeScreen({ navigation }) {
  const [places, setPlaces] = useState([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false) // Add refreshing state
  const [searchQuery, setSearchQuery] = useState("")
  const { currentUser, logout } = useAuth()

  useEffect(() => {
    fetchPlaces()
  }, [])

  useFocusEffect(
    useCallback(() => {
      fetchPlaces();
    }, [])
  );

  const fetchPlaces = async () => {
    try {
      setLoading(true)
      const placesQuery = query(collection(db, "places"), orderBy("createdAt", "desc"), limit(20))
      const querySnapshot = await getDocs(placesQuery)

      const placesList = []
      querySnapshot.forEach((doc) => {
        placesList.push({
          id: doc.id,
          ...doc.data(),
        })
      })

      setPlaces(placesList)
    } catch (error) {
      console.error("Error fetching places:", error)
    } finally {
      setLoading(false)
      setRefreshing(false) // Make sure to reset refreshing state
    }
  }

  // Add onRefresh function for pull-to-refresh
  const onRefresh = useCallback(() => {
    setRefreshing(true)
    fetchPlaces()
  }, [])

  const handleLogout = async () => {
    try {
      await logout()
      navigation.replace("Login")
    } catch (error) {
      console.error("Logout error:", error)
    }
  }

  const filteredPlaces = places.filter(
    (place) =>
      place.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      place.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      place.category.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>PlaceReview</Text>
        <View style={styles.headerButtons}>
          <TouchableOpacity style={styles.iconButton} onPress={() => navigation.navigate("Profile")}>
            <Feather name="user" size={24} color="#333" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton} onPress={handleLogout}>
            <Feather name="log-out" size={24} color="#333" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.searchContainer}>
        <Feather name="search" size={20} color="#666" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search places..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {loading && !refreshing ? ( // Only show loading indicator if not refreshing
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FF6B6B" />
        </View>
      ) : (
        <>
          <FlatList
            data={filteredPlaces}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <PlaceCard place={item} onPress={() => navigation.navigate("PlaceDetails", { placeId: item.id })} />
            )}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>No places found</Text>
                <Text style={styles.emptySubText}>Be the first to add a place!</Text>
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

          <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate("AddPlace")}>
            <Feather name="plus" size={24} color="#fff" />
          </TouchableOpacity>
        </>
      )}
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
  },
  headerButtons: {
    flexDirection: "row",
  },
  iconButton: {
    marginLeft: 15,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    marginHorizontal: 20,
    marginVertical: 15,
    paddingHorizontal: 15,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
  },
  listContent: {
    padding: 15,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 30,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  emptySubText: {
    fontSize: 14,
    color: "#666",
  },
  addButton: {
    position: "absolute",
    bottom: 20,
    right: 20,
    backgroundColor: "#FF6B6B",
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
})

