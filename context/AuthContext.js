"use client"

import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth, db } from "../firebase-config"
import { onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from "firebase/auth"
import { doc, setDoc, getDoc } from "firebase/firestore"

const AuthContext = createContext()

export const useAuth = () => {
  return useContext(AuthContext)
}

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // Sign in with email and password
  const login = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password)
  }

  // Register a new user
  const register = async (email, password) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password)

    // Create a user profile in Firestore
    await setDoc(doc(db, "users", userCredential.user.uid), {
      email,
      createdAt: new Date().toISOString(),
    })

    return userCredential
  }

  // Sign out
  const logout = async () => {
    try {
      await signOut(auth)
    } catch (error) {
      console.error("Error logging out:", error)
    }
  }

  // Get user profile data
  const getUserProfile = async (userId) => {
    const docRef = doc(db, "users", userId)
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()) {
      return docSnap.data()
    } else {
      return null
    }
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user)
      setLoading(false)
    })

    return unsubscribe
  }, [])

  const value = {
    currentUser,
    login,
    register,
    logout,
    getUserProfile,
  }

  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>
}

