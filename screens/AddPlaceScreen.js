"use client"

import { useState } from "react"
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
  Image,
} from "react-native"
import { Feather } from "@expo/vector-icons"
import { collection, addDoc, serverTimestamp } from "firebase/firestore"
import { ref, uploadBytes, getDownloadURL } from "firebase/storage"
import { db, storage } from "../firebase-config"
import { useAuth } from "../context/AuthContext"
import * as ImagePicker from "expo-image-picker"
import { Picker } from "@react-native-picker/picker"

const categories = ["Cafe", "Restaurant", "Bar", "Bakery", "Fast Food", "Fine Dining", "Food Truck", "Other"]

export default function AddPlaceScreen({ navigation }) {
  const [name, setName] = useState("")
  const [category, setCategory] = useState("Cafe")
  const [address, setAddress] = useState("")
  const [description, setDescription] = useState("")
  const [image, setImage] = useState(null)
  const [loading, setLoading] = useState(false)
  const { currentUser } = useAuth()

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync()

    if (status !== "granted") {
      Alert.alert("Permission Required", "Please allow access to your photo library to upload images.")
      return
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    })

    if (!result.canceled) {
      setImage(result.assets[0].uri)
    }
  }

  const handleSubmit = async () => {
    if (!name || !address) {
      Alert.alert("Error", "Please fill in all required fields")
      return
    }

    try {
      setLoading(true)

      // Upload image if selected
      let imageUrl = null
      if (image) {
        const response = await fetch(image)
        const blob = await response.blob()
        const imageName = `places/${Date.now()}-${currentUser.uid}`
        const storageRef = ref(storage, imageName)

        await uploadBytes(storageRef, blob)
        imageUrl = await getDownloadURL(storageRef)
      }

      // Add place to Firestore
      const placeData = {
        name,
        category,
        address,
        description,
        imageUrl,
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
          <Picker selectedValue={category} onValueChange={(itemValue) => setCategory(itemValue)} style={styles.picker}>
            {categories.map((cat) => (
              <Picker.Item key={cat} label={cat} value={cat} />
            ))}
          </Picker>
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

        <Text style={styles.label}>Image</Text>
        <TouchableOpacity style={styles.imagePickerButton} onPress={pickImage}>
          {image ? (
            <Image source={{ uri: image }} style={styles.previewImage} />
          ) : (
            <View style={styles.imagePlaceholder}>
              <Feather name="camera" size={24} color="#666" />
              <Text style={styles.imagePickerText}>Add Photo</Text>
            </View>
          )}
        </TouchableOpacity>

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
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    marginBottom: 20,
  },
  picker: {
    height: 50,
  },
  imagePickerButton: {
    marginBottom: 20,
  },
  imagePlaceholder: {
    height: 200,
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  imagePickerText: {
    marginTop: 8,
    color: "#666",
    fontSize: 16,
  },
  previewImage: {
    height: 200,
    borderRadius: 8,
    resizeMode: "cover",
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

