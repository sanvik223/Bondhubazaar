"use client"

import { useState, useEffect } from "react"
import type { User } from "firebase/auth"
import { auth, authUtils, db, dbUtils } from "@/lib/firebase"

interface UserProfile {
  uid: string
  name: string
  phone: string
  email: string
  role: string
  district: string
  walletBalance: number
  isActive: boolean
  createdAt: Date
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = authUtils.onAuthStateChanged(auth, async (user) => {
      setUser(user)

      if (user) {
        try {
          // Fetch user profile from Firestore
          const userQuery = dbUtils.query(dbUtils.collection(db, "users"), dbUtils.where("uid", "==", user.uid))
          const userSnapshot = await dbUtils.getDocs(userQuery)

          if (!userSnapshot.empty) {
            const userData = userSnapshot.docs[0].data() as UserProfile
            setUserProfile(userData)
          }
        } catch (error) {
          console.error("Error fetching user profile:", error)
        }
      } else {
        setUserProfile(null)
      }

      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const signOut = async () => {
    try {
      await authUtils.signOut(auth)
      localStorage.removeItem("isLoggedIn")
      localStorage.removeItem("userId")
      setUser(null)
      setUserProfile(null)
    } catch (error) {
      console.error("Error signing out:", error)
    }
  }

  return {
    user,
    userProfile,
    loading,
    signOut,
    isAuthenticated: !!user,
  }
}
