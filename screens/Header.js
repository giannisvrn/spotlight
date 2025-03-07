import { useState } from "react"
import { View, Text, TouchableOpacity, StyleSheet, Modal } from "react-native"
import { Feather } from "@expo/vector-icons"
import { useAuth } from "../context/AuthContext"

export default function Header({ title, navigation }) {
  const { logout } = useAuth()
  const [modalVisible, setModalVisible] = useState(false)

  const handleLogout = async () => {
    try {
      await logout()
      navigation.replace("Login")
    } catch (error) {
      console.error("Logout error:", error)
    }
  }

  return (
    <View style={styles.header}>
      <Text style={styles.headerTitle}>{title}</Text>
      <TouchableOpacity style={styles.iconButton} onPress={() => setModalVisible(true)}>
        <Feather name="log-out" size={24} color="#333" />
      </TouchableOpacity>

      {/* Confirmation Modal */}
      <Modal
        transparent={true}
        animationType="fade"
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>Are you sure you want to log out?</Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.cancelButton} onPress={() => setModalVisible(false)}>
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                <Text style={styles.logoutText}>Log Out</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  )
}

const styles = StyleSheet.create({
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
  iconButton: {
    marginLeft: 15,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    width: "80%",
    alignItems: "center",
  },
  modalText: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  cancelButton: {
    padding: 10,
    borderRadius: 5,
    backgroundColor: "#ccc",
    flex: 1,
    marginRight: 10,
    alignItems: "center",
  },
  cancelText: {
    fontSize: 16,
    color: "#333",
  },
  logoutButton: {
    padding: 10,
    borderRadius: 5,
    backgroundColor: "#FF6B6B",
    flex: 1,
    marginLeft: 10,
    alignItems: "center",
  },
  logoutText: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "bold",
  },
})
