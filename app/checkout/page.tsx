"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { MapPin, CreditCard, Wallet, Truck, Shield, ArrowLeft } from "lucide-react"
import Header from "@/components/common/header"
import Footer from "@/components/common/footer"
import { db, dbUtils } from "@/lib/firebase"

interface CartItem {
  id: string
  name: string
  price: number
  image: string
  category: string
  district: string
  seller?: string
  provider?: string
  quantity: number
  type: "product" | "service"
}

interface Address {
  name: string
  phone: string
  address: string
  district: string
  area: string
}

export default function CheckoutPage() {
  const router = useRouter()
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const [shippingAddress, setShippingAddress] = useState<Address>({
    name: "",
    phone: "",
    address: "",
    district: "",
    area: "",
  })

  const [paymentMethod, setPaymentMethod] = useState("wallet")
  const [specialInstructions, setSpecialInstructions] = useState("")
  const [otpStep, setOtpStep] = useState(false)
  const [otp, setOtp] = useState("")

  useEffect(() => {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]")
    if (cart.length === 0) {
      router.push("/cart")
      return
    }
    setCartItems(cart)
    setLoading(false)

    // Load user data if logged in
    const userId = localStorage.getItem("userId")
    if (userId) {
      // In a real app, fetch user profile and addresses
      setShippingAddress({
        name: "John Doe",
        phone: "+880 1XXX-XXXXXX",
        address: "123 Main Street",
        district: "Dhaka",
        area: "Dhanmondi",
      })
    }
  }, [router])

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const deliveryFee = 50
  const total = subtotal + deliveryFee

  const handleAddressChange = (field: keyof Address, value: string) => {
    setShippingAddress({ ...shippingAddress, [field]: value })
    setError("")
  }

  const validateForm = () => {
    if (!shippingAddress.name || !shippingAddress.phone || !shippingAddress.address || !shippingAddress.district) {
      setError("Please fill in all required address fields")
      return false
    }
    if (!paymentMethod) {
      setError("Please select a payment method")
      return false
    }
    return true
  }

  const handlePlaceOrder = async () => {
    if (!validateForm()) return

    setSubmitting(true)
    setError("")

    try {
      // Simulate order placement
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Create order in Firestore
      const orderData = {
        userId: localStorage.getItem("userId") || "guest",
        items: cartItems,
        shippingAddress,
        paymentMethod,
        specialInstructions,
        subtotal,
        deliveryFee,
        total,
        status: "pending",
        createdAt: new Date(),
        otpRequired: true,
        otp: Math.floor(100000 + Math.random() * 900000).toString(), // Generate 6-digit OTP
      }

      await dbUtils.addDoc(dbUtils.collection(db, "orders"), orderData)

      setSuccess("Order placed successfully! Please verify with OTP.")
      setOtpStep(true)
    } catch (error: any) {
      setError(error.message || "Failed to place order. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  const handleOtpVerification = async () => {
    if (!otp || otp.length !== 6) {
      setError("Please enter a valid 6-digit OTP")
      return
    }

    setSubmitting(true)
    try {
      // Simulate OTP verification
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Clear cart and redirect
      localStorage.removeItem("cart")
      window.dispatchEvent(new Event("cartUpdated"))
      router.push("/orders?success=true")
    } catch (error: any) {
      setError("Invalid OTP. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading checkout...</p>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  if (otpStep) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="container mx-auto px-4 py-8 flex-1">
          <div className="max-w-md mx-auto">
            <Card>
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-8 h-8 text-green-600" />
                </div>
                <CardTitle className="text-2xl text-primary">Verify Your Order</CardTitle>
                <p className="text-muted-foreground">
                  We've sent a 6-digit OTP to your phone number for order verification
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <div className="space-y-2">
                  <Label htmlFor="otp">Enter OTP</Label>
                  <Input
                    id="otp"
                    type="text"
                    placeholder="000000"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                    className="text-center text-2xl tracking-widest"
                    maxLength={6}
                  />
                </div>

                <Button
                  onClick={handleOtpVerification}
                  disabled={submitting || otp.length !== 6}
                  className="w-full bg-gradient-to-r from-primary to-secondary"
                >
                  {submitting ? "Verifying..." : "Verify & Complete Order"}
                </Button>

                <div className="text-center">
                  <Button variant="link" onClick={() => setOtpStep(false)}>
                    Back to Order Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <div className="container mx-auto px-4 py-8 flex-1">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center mb-8">
            <Button variant="ghost" onClick={() => router.back()} className="mr-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <h1 className="text-3xl font-bold text-primary">Checkout</h1>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Checkout Form */}
            <div className="lg:col-span-2 space-y-6">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {success && (
                <Alert>
                  <AlertDescription className="text-green-600">{success}</AlertDescription>
                </Alert>
              )}

              {/* Shipping Address */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <MapPin className="w-5 h-5 mr-2" />
                    Shipping Address
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name *</Label>
                      <Input
                        id="name"
                        value={shippingAddress.name}
                        onChange={(e) => handleAddressChange("name", e.target.value)}
                        placeholder="Enter your full name"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number *</Label>
                      <Input
                        id="phone"
                        value={shippingAddress.phone}
                        onChange={(e) => handleAddressChange("phone", e.target.value)}
                        placeholder="+880 1XXX-XXXXXX"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="address">Address *</Label>
                    <Textarea
                      id="address"
                      value={shippingAddress.address}
                      onChange={(e) => handleAddressChange("address", e.target.value)}
                      placeholder="House/Flat no, Road, Area"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="district">District *</Label>
                      <Input
                        id="district"
                        value={shippingAddress.district}
                        onChange={(e) => handleAddressChange("district", e.target.value)}
                        placeholder="Select district"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="area">Area</Label>
                      <Input
                        id="area"
                        value={shippingAddress.area}
                        onChange={(e) => handleAddressChange("area", e.target.value)}
                        placeholder="Area/Thana"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Payment Method */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <CreditCard className="w-5 h-5 mr-2" />
                    Payment Method
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                    <div className="flex items-center space-x-2 p-4 border rounded-lg">
                      <RadioGroupItem value="wallet" id="wallet" />
                      <Label htmlFor="wallet" className="flex items-center cursor-pointer flex-1">
                        <Wallet className="w-5 h-5 mr-3 text-primary" />
                        <div>
                          <div className="font-medium">Bondhubazaar Wallet</div>
                          <div className="text-sm text-muted-foreground">Pay securely using your wallet balance</div>
                        </div>
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 p-4 border rounded-lg">
                      <RadioGroupItem value="cod" id="cod" />
                      <Label htmlFor="cod" className="flex items-center cursor-pointer flex-1">
                        <Truck className="w-5 h-5 mr-3 text-secondary" />
                        <div>
                          <div className="font-medium">Cash on Delivery</div>
                          <div className="text-sm text-muted-foreground">Pay when you receive your order</div>
                        </div>
                      </Label>
                    </div>
                  </RadioGroup>
                </CardContent>
              </Card>

              {/* Special Instructions */}
              <Card>
                <CardHeader>
                  <CardTitle>Special Instructions</CardTitle>
                </CardHeader>
                <CardContent>
                  <Textarea
                    value={specialInstructions}
                    onChange={(e) => setSpecialInstructions(e.target.value)}
                    placeholder="Any special delivery instructions..."
                    rows={3}
                  />
                </CardContent>
              </Card>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <Card className="sticky top-24">
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Items */}
                  <div className="space-y-3">
                    {cartItems.map((item) => (
                      <div key={item.id} className="flex items-center space-x-3">
                        <div className="relative w-12 h-12 rounded-lg overflow-hidden">
                          <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm truncate">{item.name}</p>
                          <p className="text-xs text-muted-foreground">
                            Qty: {item.quantity} × ৳{item.price.toLocaleString()}
                          </p>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {item.type}
                        </Badge>
                      </div>
                    ))}
                  </div>

                  <Separator />

                  {/* Totals */}
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span>৳{subtotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Delivery Fee</span>
                      <span>৳{deliveryFee.toLocaleString()}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total</span>
                      <span className="text-primary">৳{total.toLocaleString()}</span>
                    </div>
                  </div>

                  <Button
                    onClick={handlePlaceOrder}
                    disabled={submitting}
                    className="w-full bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90"
                  >
                    {submitting ? "Placing Order..." : "Place Order"}
                  </Button>

                  <div className="text-xs text-muted-foreground text-center">
                    By placing this order, you agree to our Terms of Service and Privacy Policy
                  </div>
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
