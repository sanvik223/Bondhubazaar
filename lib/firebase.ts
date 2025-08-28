import { initializeApp } from "firebase/app"
import { getAnalytics } from "firebase/analytics"
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
} from "firebase/auth"
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  doc,
  getDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
} from "firebase/firestore"
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage"

const firebaseConfig = {
  apiKey: "AIzaSyB8a_-SplyFvsqKaus58nN6aQoZOst11TE",
  authDomain: "bondhubazaar-15abe.firebaseapp.com",
  projectId: "bondhubazaar-15abe",
  storageBucket: "bondhubazaar-15abe.firebasestorage.app",
  messagingSenderId: "739312334974",
  appId: "1:739312334974:web:eec93aa2115fae1525c02f",
  measurementId: "G-4F1W8H7431",
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const analytics = typeof window !== "undefined" ? getAnalytics(app) : null
const auth = getAuth(app)
const db = getFirestore(app)
const storage = getStorage(app)

// Export Firebase services
export { auth, db, storage, analytics }

// Auth utilities
export const authUtils = {
  signUp: createUserWithEmailAndPassword,
  signIn: signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
}

// Firestore utilities
export const dbUtils = {
  collection,
  addDoc,
  getDocs,
  doc,
  getDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
}

// Storage utilities
export const storageUtils = {
  ref,
  uploadBytes,
  getDownloadURL,
}

// Districts data for Bangladesh
export const districts = [
  "Dhaka",
  "Chittagong",
  "Rajshahi",
  "Khulna",
  "Barisal",
  "Sylhet",
  "Rangpur",
  "Mymensingh",
  "Comilla",
  "Narayanganj",
  "Gazipur",
  "Tangail",
  "Munshiganj",
  "Manikganj",
  "Kishoreganj",
  "Narsingdi",
  "Faridpur",
  "Gopalganj",
  "Madaripur",
  "Shariatpur",
  "Rajbari",
  "Cox's Bazar",
  "Feni",
  "Lakshmipur",
  "Noakhali",
  "Brahmanbaria",
  "Chandpur",
  "Bandarban",
  "Rangamati",
  "Khagrachhari",
  "Bogra",
  "Joypurhat",
  "Naogaon",
  "Natore",
  "Chapainawabganj",
  "Pabna",
  "Sirajganj",
  "Jessore",
  "Jhenaidah",
  "Kushtia",
  "Magura",
  "Meherpur",
  "Narail",
  "Chuadanga",
  "Satkhira",
  "Bhola",
  "Jhalokati",
  "Patuakhali",
  "Pirojpur",
  "Barguna",
  "Habiganj",
  "Moulvibazar",
  "Sunamganj",
  "Kurigram",
  "Lalmonirhat",
  "Nilphamari",
  "Panchagarh",
  "Thakurgaon",
  "Dinajpur",
  "Gaibandha",
  "Jamalpur",
  "Netrokona",
  "Sherpur",
]

// User roles
export const userRoles = [
  "Personal User",
  "Shop Owner",
  "Homemaker",
  "Driver",
  "Photographer",
  "Makeup Artist/Decorator",
]

// Product categories
export const categories = [
  "Electronics",
  "Fashion & Clothing",
  "Home & Garden",
  "Health & Beauty",
  "Sports & Outdoors",
  "Books & Education",
  "Food & Beverages",
  "Automotive",
  "Services",
  "Others",
]
