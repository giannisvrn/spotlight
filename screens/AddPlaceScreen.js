"use client"

import React, { useState } from "react"
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  ScrollView,
} from "react-native"
import { Feather } from "@expo/vector-icons"
import { collection, addDoc, serverTimestamp } from "firebase/firestore"
import { ref, uploadBytes, getDownloadURL } from "firebase/storage"
import { db, storage } from "../firebase-config"
import { useAuth } from "../context/AuthContext"
import InputSelect from 'react-native-input-select'

const categories = [
  { label: "Cafe", value: "Cafe" },
  { label: "Restaurant", value: "Restaurant" },
  { label: "Bar", value: "Bar" },
  { label: "Bakery", value: "Bakery" },
  { label: "Fast Food", value: "Fast Food" },
  { label: "Other", value: "Other" }
]

export default function AddPlaceScreen({ navigation }) {
  const [name, setName] = useState("")
  const [category, setCategory] = useState("")
  const [address, setAddress] = useState("")
  const [description, setDescription] = useState("")
  const [loading, setLoading] = useState(false)
  const { currentUser } = useAuth()

  const handleSubmit = async () => {
    if (!name || !address || !category) {
      Alert.alert("Error", "Please fill in all required fields")
      return
    }

    try {
      setLoading(true)

      // Add place to Firestore
      const placeData = {
        name,
        category,
        address,
        description,
        createdBy: currentUser.uid,
        createdAt: serverTimestamp(),
        reviews: [],
      }

      await addDoc(collection(db, "places"), placeData)

      Alert.alert("Success", "Place added successfully!")
      navigation.goBack()
    } catch (error) {
      console.error("Error adding place:", error)
      Alert.alert("Error", "Failed to add place. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.formContainer}>
        <Text style={styles.label}>Name *</Text>
        <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="Place name" />

        <Text style={styles.label}>Category *</Text>
        <View style={styles.pickerContainer}>
          <InputSelect
            options={categories}
            selectedValue={category}
            onValueChange={(value) => setCategory(value)}
            placeholder="Select a category..."
            style={inputSelectStyles}
          />
        </View>
        
        <Text style={styles.label}>Address *</Text>
        <TextInput
          style={styles.input}
          value={address}
          onChangeText={setAddress}
          placeholder="Full address"
          multiline
        />

        <Text style={styles.label}>Description</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={description}
          onChangeText={setDescription}
          placeholder="Tell us about this place..."
          multiline
          numberOfLines={4}
        />

        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit} disabled={loading}>
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.submitButtonText}>Add Place</Text>}
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
    marginBottom: 8,
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
  pickerContainer: {
    marginBottom: 20,
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