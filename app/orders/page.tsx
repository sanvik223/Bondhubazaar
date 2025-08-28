"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import { Package, Clock, CheckCircle, XCircle, Truck, MapPin, Eye, RotateCcw } from "lucide-react"
import Header from "@/components/common/header"
import Footer from "@/components/common/footer"

interface OrderItem {
  id: string
  name: string
  price: number
  image: string
  quantity: number
  type: "product" | "service"
}

interface Order {
  id: string
  items: OrderItem[]
  status: "pending" | "confirmed" | "processing" | "shipped" | "delivered" | "cancelled"
  total: number
  orderDate: Date
  deliveryAddress: string
  paymentMethod: string
  trackingNumber?: string
  estimatedDelivery?: Date
  otpRequired?: boolean
}

export default function OrdersPage() {
  const searchParams = useSearchParams()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [otp, setOtp] = useState("")
  const [verifyingOtp, setVerifyingOtp] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  useEffect(() => {
    loadOrders()

    // Check for success parameter
    if (searchParams.get("success") === "true") {
      setSuccess("Order placed successfully!")
    }
  }, [searchParams])

  const loadOrders = async () => {
    try {
      // Mock orders data
      const mockOrders: Order[] = [
        {
          id: "ORD001",
          items: [
            {
              id: "1",
              name: "Samsung Galaxy A54",
              price: 35000,
              image: "/samsung-galaxy-a54.png",
              quantity: 1,
              type: "product",
            },
          ],
          status: "delivered",
          total: 35050,
          orderDate: new Date("2024-01-10"),
          deliveryAddress: "123 Main Street, Dhanmondi, Dhaka",
          paymentMethod: "Wallet",
          trackingNumber: "TRK123456789",
        },
        {
          id: "ORD002",
          items: [
            {
              id: "2",
              name: "Professional Photography",
              price: 5000,
              image: "/professional-photographer-camera.png",
              quantity: 1,
              type: "service",
            },
          ],
          status: "confirmed",
          total: 5000,
          orderDate: new Date("2024-01-12"),
          deliveryAddress: "456 Park Avenue, Gulshan, Dhaka",
          paymentMethod: "Cash on Delivery",
          estimatedDelivery: new Date("2024-01-20"),
        },
        {
          id: "ORD003",
          items: [
            {
              id: "3",
              name: "Cotton Casual Shirt",
              price: 1200,
              image: "/cotton-casual-shirt-fashion.png",
              quantity: 2,
              type: "product",
            },
          ],
          status: "shipped",
          total: 2450,
          orderDate: new Date("2024-01-14"),
          deliveryAddress: "789 Green Road, Panthapath, Dhaka",
          paymentMethod: "Wallet",
          trackingNumber: "TRK987654321",
          estimatedDelivery: new Date("2024-01-18"),
          otpRequired: true,
        },
      ]

      setOrders(mockOrders)
      setLoading(false)
    } catch (error) {
      console.error("Error loading orders:", error)
      setLoading(false)
    }
  }

  const getStatusIcon = (status: string) => {
    const icons = {
      pending: <Clock className="w-4 h-4 text-yellow-600" />,
      confirmed: <CheckCircle className="w-4 h-4 text-blue-600" />,
      processing: <Package className="w-4 h-4 text-purple-600" />,
      shipped: <Truck className="w-4 h-4 text-orange-600" />,
      delivered: <CheckCircle className="w-4 h-4 text-green-600" />,
      cancelled: <XCircle className="w-4 h-4 text-red-600" />,
    }
    return icons[status as keyof typeof icons] || icons.pending
  }

  const getStatusBadge = (status: string) => {
    const variants = {
      pending: "secondary",
      confirmed: "default",
      processing: "secondary",
      shipped: "secondary",
      delivered: "default",
      cancelled: "destructive",
    } as const

    return (
      <Badge variant={variants[status as keyof typeof variants] || "secondary"}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    )
  }

  const handleVerifyOtp = async (order: Order) => {
    if (!otp || otp.length !== 6) {
      setError("Please enter a valid 6-digit OTP")
      return
    }

    setVerifyingOtp(true)
    setError("")

    try {
      // Simulate OTP verification
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Update order status
      const updatedOrders = orders.map((o) =>
        o.id === order.id ? { ...o, status: "delivered" as const, otpRequired: false } : o,
      )
      setOrders(updatedOrders)
      setSelectedOrder(null)
      setOtp("")
      setSuccess("Order delivered successfully!")
    } catch (error: any) {
      setError("Invalid OTP. Please try again.")
    } finally {
      setVerifyingOtp(false)
    }
  }

  const currentOrders = orders.filter((order) =>
    ["pending", "confirmed", "processing", "shipped"].includes(order.status),
  )
  const pastOrders = orders.filter((order) => ["delivered", "cancelled"].includes(order.status))

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading orders...</p>
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
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-primary mb-8">My Orders</h1>

          {success && (
            <Alert className="mb-6">
              <AlertDescription className="text-green-600">{success}</AlertDescription>
            </Alert>
          )}

          <Tabs defaultValue="current" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="current">Current Orders ({currentOrders.length})</TabsTrigger>
              <TabsTrigger value="history">Order History ({pastOrders.length})</TabsTrigger>
            </TabsList>

            {/* Current Orders */}
            <TabsContent value="current" className="space-y-4">
              {currentOrders.length === 0 ? (
                <Card>
                  <CardContent className="text-center py-12">
                    <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-muted-foreground mb-2">No current orders</h3>
                    <p className="text-muted-foreground mb-6">Start shopping to see your orders here</p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                      <Link href="/products">
                        <Button className="bg-gradient-to-r from-primary to-secondary">Browse Products</Button>
                      </Link>
                      <Link href="/services">
                        <Button variant="outline">Browse Services</Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                currentOrders.map((order) => (
                  <Card key={order.id} className="overflow-hidden">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="text-lg">Order #{order.id}</CardTitle>
                          <p className="text-sm text-muted-foreground">
                            Placed on {order.orderDate.toLocaleDateString()}
                          </p>
                        </div>
                        <div className="text-right">
                          {getStatusBadge(order.status)}
                          <p className="text-lg font-bold text-primary mt-1">৳{order.total.toLocaleString()}</p>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* Order Items */}
                      <div className="space-y-3">
                        {order.items.map((item) => (
                          <div key={item.id} className="flex items-center space-x-3">
                            <div className="relative w-12 h-12 rounded-lg overflow-hidden">
                              <Image
                                src={item.image || "/placeholder.svg"}
                                alt={item.name}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <div className="flex-1">
                              <p className="font-medium text-sm text-pretty">{item.name}</p>
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

                      {/* Order Details */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div className="space-y-2">
                          <div className="flex items-start space-x-2">
                            <MapPin className="w-4 h-4 text-muted-foreground mt-0.5" />
                            <div>
                              <p className="font-medium">Delivery Address</p>
                              <p className="text-muted-foreground text-pretty">{order.deliveryAddress}</p>
                            </div>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            {getStatusIcon(order.status)}
                            <div>
                              <p className="font-medium">Status</p>
                              <p className="text-muted-foreground">
                                {order.status === "shipped" && order.estimatedDelivery
                                  ? `Estimated delivery: ${order.estimatedDelivery.toLocaleDateString()}`
                                  : `Order ${order.status}`}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex flex-col sm:flex-row gap-2 pt-2">
                        <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                          <Eye className="w-4 h-4 mr-2" />
                          View Details
                        </Button>
                        {order.trackingNumber && (
                          <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                            <Truck className="w-4 h-4 mr-2" />
                            Track Order
                          </Button>
                        )}
                        {order.otpRequired && order.status === "shipped" && (
                          <Button
                            onClick={() => setSelectedOrder(order)}
                            size="sm"
                            className="flex-1 bg-gradient-to-r from-primary to-secondary"
                          >
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Confirm Delivery
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </TabsContent>

            {/* Order History */}
            <TabsContent value="history" className="space-y-4">
              {pastOrders.length === 0 ? (
                <Card>
                  <CardContent className="text-center py-12">
                    <RotateCcw className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-muted-foreground mb-2">No order history</h3>
                    <p className="text-muted-foreground">Your completed orders will appear here</p>
                  </CardContent>
                </Card>
              ) : (
                pastOrders.map((order) => (
                  <Card key={order.id} className="overflow-hidden">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="text-lg">Order #{order.id}</CardTitle>
                          <p className="text-sm text-muted-foreground">
                            Placed on {order.orderDate.toLocaleDateString()}
                          </p>
                        </div>
                        <div className="text-right">
                          {getStatusBadge(order.status)}
                          <p className="text-lg font-bold text-primary mt-1">৳{order.total.toLocaleString()}</p>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* Order Items */}
                      <div className="space-y-3">
                        {order.items.map((item) => (
                          <div key={item.id} className="flex items-center space-x-3">
                            <div className="relative w-12 h-12 rounded-lg overflow-hidden">
                              <Image
                                src={item.image || "/placeholder.svg"}
                                alt={item.name}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <div className="flex-1">
                              <p className="font-medium text-sm text-pretty">{item.name}</p>
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

                      {/* Action Buttons */}
                      <div className="flex flex-col sm:flex-row gap-2 pt-2">
                        <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                          <Eye className="w-4 h-4 mr-2" />
                          View Details
                        </Button>
                        <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                          <RotateCcw className="w-4 h-4 mr-2" />
                          Reorder
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* OTP Verification Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <CardTitle className="text-xl text-primary">Confirm Delivery</CardTitle>
              <p className="text-muted-foreground">
                Enter the OTP provided by the delivery agent to confirm receipt of your order
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="delivery-otp">Delivery OTP</Label>
                <Input
                  id="delivery-otp"
                  type="text"
                  placeholder="000000"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  className="text-center text-2xl tracking-widest"
                  maxLength={6}
                />
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setSelectedOrder(null)
                    setOtp("")
                    setError("")
                  }}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => handleVerifyOtp(selectedOrder)}
                  disabled={verifyingOtp || otp.length !== 6}
                  className="flex-1 bg-gradient-to-r from-primary to-secondary"
                >
                  {verifyingOtp ? "Verifying..." : "Confirm"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <Footer />
    </div>
  )
}
