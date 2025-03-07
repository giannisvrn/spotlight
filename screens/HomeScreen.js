"use client"

import { useState, useEffect, useCallback } from "react"
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, ActivityIndicator, RefreshControl, Modal } from "react-native"
import { collection, getDocs, query, orderBy, limit, where } from "firebase/firestore"
import { db } from "../firebase-config"
import { useAuth } from "../context/AuthContext"
import { SafeAreaView } from "react-native-safe-area-context"
import { Feather } from "@expo/vector-icons"
import PlaceCard from "../components/PlaceCard"
import { useFocusEffect } from '@react-navigation/native';

export default function HomeScreen({ navigation }) {
  const [places, setPlaces] = useState([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const { currentUser, logout } = useAuth()
  const [logoutModalVisible, setLogoutModalVisible] = useState(false) // Logout confirmation modal

  useEffect(() => {
    fetchPlaces()
  }, [])

  useFocusEffect(
    useCallback(() => {
      fetchPlaces();
    }, [])
  );

  const fetchPlaces = async () => {
    if (!currentUser || !currentUser.uid) {
      console.error("User is not authenticated or UID is missing")
      return
    }

    try {
      setLoading(true)
      const placesQuery = query(
        collection(db, "places"),
        where("createdBy", "==", currentUser.uid),
        orderBy("createdAt", "desc"),
        limit(20)
      )
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
      setRefreshing(false)
    }
  }

  const onRefresh = useCallback(() => {
    setRefreshing(true)
    fetchPlaces()
  }, [])

  const handleLogoutPress = () => {
    setLogoutModalVisible(true) // Show confirmation modal
  }

  const confirmLogout = async () => {
    setLogoutModalVisible(false) // Hide modal
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
        <Text style={styles.headerTitle}>Spotlight</Text>
        <View style={styles.headerButtons}>
          <TouchableOpacity style={styles.iconButton} onPress={handleLogoutPress}>
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

      {loading && !refreshing ? (
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
            refreshControl={
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

      {/* Logout Confirmation Modal */}
      <Modal transparent={true} animationType="fade" visible={logoutModalVisible}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Are you sure you want to logout?</Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.cancelButton} onPress={() => setLogoutModalVisible(false)}>
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.confirmButton} onPress={confirmLogout}>
                <Text style={styles.buttonText}>Logout</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContainer: {
    width: 300,
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
    marginBottom: 15,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  cancelButton: {
    flex: 1,
    backgroundColor: "#ccc",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginRight: 5,
  },
  confirmButton: {
    flex: 1,
    backgroundColor: "#FF6B6B",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginLeft: 5,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
})

