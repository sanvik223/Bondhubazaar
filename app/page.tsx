"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Search, ShoppingBag, Users, Truck, Star, ArrowRight, MapPin } from "lucide-react"
import Header from "@/components/common/header"
import Footer from "@/components/common/footer"
import { categories } from "@/lib/firebase"

interface Product {
  id: string
  name: string
  price: number
  image: string
  category: string
  district: string
  rating: number
  seller: string
}

interface Service {
  id: string
  name: string
  price: number
  image: string
  category: string
  district: string
  rating: number
  provider: string
}

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedDistricts, setSelectedDistricts] = useState<string[]>([])
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([])
  const [featuredServices, setFeaturedServices] = useState<Service[]>([])

  useEffect(() => {
    // Load selected districts from localStorage
    const saved = localStorage.getItem("selectedDistricts")
    if (saved) {
      setSelectedDistricts(JSON.parse(saved))
    }

    // Mock featured products
    setFeaturedProducts([
      {
        id: "1",
        name: "Samsung Galaxy A54",
        price: 35000,
        image: "/samsung-galaxy-a54.png",
        category: "Electronics",
        district: "Dhaka",
        rating: 4.5,
        seller: "Tech Store BD",
      },
      {
        id: "2",
        name: "Cotton Casual Shirt",
        price: 1200,
        image: "/cotton-casual-shirt-fashion.png",
        category: "Fashion & Clothing",
        district: "Chittagong",
        rating: 4.2,
        seller: "Fashion Hub",
      },
      {
        id: "3",
        name: "Organic Rice 5kg",
        price: 450,
        image: "/organic-rice-bag-food.png",
        category: "Food & Beverages",
        district: "Rajshahi",
        rating: 4.8,
        seller: "Organic Farm",
      },
      {
        id: "4",
        name: "LED Table Lamp",
        price: 800,
        image: "/led-table-lamp-home-decor.png",
        category: "Home & Garden",
        district: "Khulna",
        rating: 4.3,
        seller: "Home Decor Plus",
      },
    ])

    // Mock featured services
    setFeaturedServices([
      {
        id: "1",
        name: "Professional Photography",
        price: 5000,
        image: "/professional-photographer-camera.png",
        category: "Photography",
        district: "Dhaka",
        rating: 4.9,
        provider: "Photo Pro BD",
      },
      {
        id: "2",
        name: "Home Cleaning Service",
        price: 1500,
        image: "/home-cleaning-service.png",
        category: "Home Services",
        district: "Chittagong",
        rating: 4.6,
        provider: "Clean Home BD",
      },
      {
        id: "3",
        name: "Makeup & Bridal",
        price: 8000,
        image: "/bridal-makeup-artist.png",
        category: "Beauty Services",
        district: "Sylhet",
        rating: 4.7,
        provider: "Beauty Expert",
      },
      {
        id: "4",
        name: "Delivery Service",
        price: 100,
        image: "/delivery-service-motorcycle.png",
        category: "Logistics",
        district: "Dhaka",
        rating: 4.4,
        provider: "Fast Delivery",
      },
    ])
  }, [])

  const filteredProducts = featuredProducts.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesDistrict = selectedDistricts.length === 0 || selectedDistricts.includes(product.district)
    return matchesSearch && matchesDistrict
  })

  const filteredServices = featuredServices.filter((service) => {
    const matchesSearch = service.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesDistrict = selectedDistricts.length === 0 || selectedDistricts.includes(service.district)
    return matchesSearch && matchesDistrict
  })

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/10 via-background to-secondary/10 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold text-primary mb-6 text-balance">
              Welcome to{" "}
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Bondhubazaar
              </span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 text-pretty">
              Your trusted marketplace connecting buyers and sellers across Bangladesh with secure wallet transactions
              and agent network support.
            </p>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto mb-8">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
                <Input
                  type="text"
                  placeholder="Search products and services..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 pr-4 py-6 text-lg rounded-xl border-2 focus:border-primary"
                />
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto">
              <div className="text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-2">
                  <ShoppingBag className="w-6 h-6 text-primary" />
                </div>
                <div className="text-2xl font-bold text-primary">10K+</div>
                <div className="text-sm text-muted-foreground">Products</div>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-secondary/10 rounded-xl flex items-center justify-center mx-auto mb-2">
                  <Users className="w-6 h-6 text-secondary" />
                </div>
                <div className="text-2xl font-bold text-secondary">5K+</div>
                <div className="text-sm text-muted-foreground">Users</div>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-2">
                  <Truck className="w-6 h-6 text-primary" />
                </div>
                <div className="text-2xl font-bold text-primary">64</div>
                <div className="text-sm text-muted-foreground">Districts</div>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-secondary/10 rounded-xl flex items-center justify-center mx-auto mb-2">
                  <Star className="w-6 h-6 text-secondary" />
                </div>
                <div className="text-2xl font-bold text-secondary">4.8</div>
                <div className="text-sm text-muted-foreground">Rating</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-primary mb-4">Browse Categories</h2>
            <p className="text-muted-foreground text-lg">Discover products and services across all categories</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {categories.slice(0, 10).map((category, index) => (
              <Link key={category} href={`/products?category=${encodeURIComponent(category)}`}>
                <Card className="hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer group">
                  <CardContent className="p-6 text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:from-primary/20 group-hover:to-secondary/20 transition-colors">
                      <ShoppingBag className="w-8 h-8 text-primary" />
                    </div>
                    <h3 className="font-semibold text-sm text-center text-pretty">{category}</h3>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl font-bold text-primary mb-2">Featured Products</h2>
              <p className="text-muted-foreground">Discover the best products from trusted sellers</p>
            </div>
            <Link href="/products">
              <Button variant="outline" className="group bg-transparent">
                View All
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <Link key={product.id} href={`/products/${product.id}`}>
                <Card className="hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer group">
                  <div className="relative overflow-hidden rounded-t-lg">
                    <Image
                      src={product.image || "/placeholder.svg"}
                      alt={product.name}
                      width={200}
                      height={200}
                      className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <Badge className="absolute top-2 right-2 bg-primary/90">
                      <MapPin className="w-3 h-3 mr-1" />
                      {product.district}
                    </Badge>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-lg mb-2 text-pretty">{product.name}</h3>
                    <p className="text-muted-foreground text-sm mb-2">by {product.seller}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-primary">৳{product.price.toLocaleString()}</span>
                      <div className="flex items-center">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="text-sm text-muted-foreground ml-1">{product.rating}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Services */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl font-bold text-primary mb-2">Featured Services</h2>
              <p className="text-muted-foreground">Professional services from verified providers</p>
            </div>
            <Link href="/services">
              <Button variant="outline" className="group bg-transparent">
                View All
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredServices.map((service) => (
              <Link key={service.id} href={`/services/${service.id}`}>
                <Card className="hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer group">
                  <div className="relative overflow-hidden rounded-t-lg">
                    <Image
                      src={service.image || "/placeholder.svg"}
                      alt={service.name}
                      width={200}
                      height={200}
                      className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <Badge className="absolute top-2 right-2 bg-secondary/90">
                      <MapPin className="w-3 h-3 mr-1" />
                      {service.district}
                    </Badge>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-lg mb-2 text-pretty">{service.name}</h3>
                    <p className="text-muted-foreground text-sm mb-2">by {service.provider}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-secondary">৳{service.price.toLocaleString()}</span>
                      <div className="flex items-center">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="text-sm text-muted-foreground ml-1">{service.rating}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-primary to-secondary">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-primary-foreground mb-4">Ready to Start Selling?</h2>
          <p className="text-primary-foreground/90 text-lg mb-8 max-w-2xl mx-auto text-pretty">
            Join thousands of sellers on Bondhubazaar and reach customers across Bangladesh with our secure platform and
            agent network.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register">
              <Button size="lg" variant="secondary" className="bg-white text-primary hover:bg-white/90">
                Become a Seller
              </Button>
            </Link>
            <Link href="/agent-network">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 bg-transparent">
                Join Agent Network
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
