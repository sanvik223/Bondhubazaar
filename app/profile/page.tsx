"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { User, Mail, Phone, MapPin, Briefcase, Shield, Edit, Save, X } from "lucide-react"
import Header from "@/components/common/header"
import Footer from "@/components/common/footer"
import { districts, userRoles, db, dbUtils } from "@/lib/firebase"

interface UserProfile {
  name: string
  email: string
  phone: string
  role: string
  district: string
  walletBalance: number
  isActive: boolean
  joinDate: Date
  totalOrders: number
  totalSpent: number
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile>({
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "+880 1XXX-XXXXXX",
    role: "Personal User",
    district: "Dhaka",
    walletBalance: 5000,
    isActive: true,
    joinDate: new Date("2024-01-01"),
    totalOrders: 12,
    totalSpent: 45000,
  })

  const [editing, setEditing] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [agentApplication, setAgentApplication] = useState({
    experience: "",
    reason: "",
    availability: "",
  })
  const [applyingAgent, setApplyingAgent] = useState(false)

  const handleInputChange = (field: keyof UserProfile, value: string) => {
    setProfile({ ...profile, [field]: value })
    setError("")
  }

  const handleSaveProfile = async () => {
    setLoading(true)
    setError("")

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Update profile in Firestore
      const userId = localStorage.getItem("userId")
      if (userId) {
        await dbUtils.updateDoc(dbUtils.doc(db, "users", userId), {
          name: profile.name,
          phone: profile.phone,
          role: profile.role,
          district: profile.district,
          updatedAt: new Date(),
        })
      }

      setEditing(false)
      setSuccess("Profile updated successfully!")
    } catch (error: any) {
      setError(error.message || "Failed to update profile. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleAgentApplication = async () => {
    if (!agentApplication.experience || !agentApplication.reason) {
      setError("Please fill in all required fields")
      return
    }

    setApplyingAgent(true)
    setError("")

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Submit agent application to Firestore
      await dbUtils.addDoc(dbUtils.collection(db, "agent_applications"), {
        userId: localStorage.getItem("userId") || "guest",
        userProfile: profile,
        application: agentApplication,
        status: "pending",
        submittedAt: new Date(),
      })

      setSuccess("Agent application submitted successfully! We'll review it within 2-3 business days.")
      setAgentApplication({ experience: "", reason: "", availability: "" })
    } catch (error: any) {
      setError(error.message || "Failed to submit application. Please try again.")
    } finally {
      setApplyingAgent(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <div className="container mx-auto px-4 py-8 flex-1">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-primary">My Profile</h1>
            {!editing && (
              <Button onClick={() => setEditing(true)} variant="outline">
                <Edit className="w-4 h-4 mr-2" />
                Edit Profile
              </Button>
            )}
          </div>

          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="mb-6">
              <AlertDescription className="text-green-600">{success}</AlertDescription>
            </Alert>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Profile Information */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <User className="w-5 h-5 mr-2" />
                    Personal Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="name"
                          value={profile.name}
                          onChange={(e) => handleInputChange("name", e.target.value)}
                          disabled={!editing}
                          className="pl-10"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input id="email" value={profile.email} disabled className="pl-10 bg-muted" />
                      </div>
                      <p className="text-xs text-muted-foreground">Email cannot be changed</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="phone"
                          value={profile.phone}
                          onChange={(e) => handleInputChange("phone", e.target.value)}
                          disabled={!editing}
                          className="pl-10"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="district">District</Label>
                      <Select
                        value={profile.district}
                        onValueChange={(value) => handleInputChange("district", value)}
                        disabled={!editing}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="max-h-48">
                          {districts.map((district) => (
                            <SelectItem key={district} value={district}>
                              {district}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="role">Role</Label>
                    <Select
                      value={profile.role}
                      onValueChange={(value) => handleInputChange("role", value)}
                      disabled={!editing}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {userRoles.map((role) => (
                          <SelectItem key={role} value={role}>
                            {role}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {editing && (
                    <div className="flex gap-2 pt-4">
                      <Button
                        onClick={handleSaveProfile}
                        disabled={loading}
                        className="bg-gradient-to-r from-primary to-secondary"
                      >
                        <Save className="w-4 h-4 mr-2" />
                        {loading ? "Saving..." : "Save Changes"}
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => {
                          setEditing(false)
                          setError("")
                        }}
                      >
                        <X className="w-4 h-4 mr-2" />
                        Cancel
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Agent Application */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Briefcase className="w-5 h-5 mr-2" />
                    Become an Agent
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">
                    Join our agent network and earn by helping customers in your area with deliveries and support.
                  </p>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="experience">Relevant Experience</Label>
                      <Input
                        id="experience"
                        placeholder="Describe your relevant experience..."
                        value={agentApplication.experience}
                        onChange={(e) => setAgentApplication({ ...agentApplication, experience: e.target.value })}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="reason">Why do you want to become an agent?</Label>
                      <Input
                        id="reason"
                        placeholder="Tell us why you're interested..."
                        value={agentApplication.reason}
                        onChange={(e) => setAgentApplication({ ...agentApplication, reason: e.target.value })}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="availability">Availability</Label>
                      <Select
                        value={agentApplication.availability}
                        onValueChange={(value) => setAgentApplication({ ...agentApplication, availability: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select your availability" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="full-time">Full Time</SelectItem>
                          <SelectItem value="part-time">Part Time</SelectItem>
                          <SelectItem value="weekends">Weekends Only</SelectItem>
                          <SelectItem value="flexible">Flexible</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <Button
                    onClick={handleAgentApplication}
                    disabled={applyingAgent}
                    className="w-full bg-gradient-to-r from-secondary to-primary"
                  >
                    {applyingAgent ? "Submitting..." : "Apply to Become Agent"}
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Profile Stats */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Shield className="w-5 h-5 mr-2" />
                    Account Status
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span>Status</span>
                    <Badge variant={profile.isActive ? "default" : "destructive"}>
                      {profile.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Member Since</span>
                    <span className="text-sm text-muted-foreground">{profile.joinDate.toLocaleDateString()}</span>
                  </div>
                  <Separator />
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span>Wallet Balance</span>
                      <span className="font-bold text-primary">৳{profile.walletBalance.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Total Orders</span>
                      <span className="font-semibold">{profile.totalOrders}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Total Spent</span>
                      <span className="font-semibold">৳{profile.totalSpent.toLocaleString()}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button variant="outline" className="w-full justify-start bg-transparent">
                    <MapPin className="w-4 h-4 mr-2" />
                    Manage Addresses
                  </Button>
                  <Button variant="outline" className="w-full justify-start bg-transparent">
                    <Shield className="w-4 h-4 mr-2" />
                    Privacy Settings
                  </Button>
                  <Button variant="outline" className="w-full justify-start bg-transparent">
                    <Mail className="w-4 h-4 mr-2" />
                    Notification Settings
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
