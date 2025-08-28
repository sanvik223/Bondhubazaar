"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Search, Filter, Star, MapPin, ShoppingCart } from "lucide-react"
import Header from "@/components/common/header"
import Footer from "@/components/common/footer"
import { categories, districts } from "@/lib/firebase"

interface Product {
  id: string
  name: string
  price: number
  image: string
  category: string
  district: string
  rating: number
  seller: string
  description: string
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedDistricts, setSelectedDistricts] = useState<string[]>([])
  const [sortBy, setSortBy] = useState("newest")
  const [priceRange, setPriceRange] = useState({ min: "", max: "" })

  useEffect(() => {
    // Mock products data
    const mockProducts: Product[] = [
      {
        id: "1",
        name: "Samsung Galaxy A54",
        price: 35000,
        image: "/samsung-galaxy-a54.png",
        category: "Electronics",
        district: "Dhaka",
        rating: 4.5,
        seller: "Tech Store BD",
        description: "Latest Samsung Galaxy A54 with 128GB storage and 6GB RAM",
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
        description: "Premium cotton casual shirt for men, available in multiple colors",
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
        description: "Premium organic rice, pesticide-free and naturally grown",
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
        description: "Modern LED table lamp with adjustable brightness",
      },
      {
        id: "5",
        name: "Wireless Headphones",
        price: 2500,
        image: "/wireless-headphones-bluetooth.png",
        category: "Electronics",
        district: "Dhaka",
        rating: 4.6,
        seller: "Audio World",
        description: "High-quality wireless headphones with noise cancellation",
      },
      {
        id: "6",
        name: "Women's Kurti",
        price: 1800,
        image: "/women-kurti-traditional-dress.png",
        category: "Fashion & Clothing",
        district: "Sylhet",
        rating: 4.4,
        seller: "Traditional Wear",
        description: "Beautiful traditional kurti with embroidered design",
      },
    ]

    setProducts(mockProducts)
    setFilteredProducts(mockProducts)

    // Load selected districts from localStorage
    const saved = localStorage.getItem("selectedDistricts")
    if (saved) {
      setSelectedDistricts(JSON.parse(saved))
    }
  }, [])

  useEffect(() => {
    let filtered = products

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.description.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    // Category filter
    if (selectedCategory !== "all") {
      filtered = filtered.filter((product) => product.category === selectedCategory)
    }

    // District filter
    if (selectedDistricts.length > 0) {
      filtered = filtered.filter((product) => selectedDistricts.includes(product.district))
    }

    // Price range filter
    if (priceRange.min) {
      filtered = filtered.filter((product) => product.price >= Number.parseInt(priceRange.min))
    }
    if (priceRange.max) {
      filtered = filtered.filter((product) => product.price <= Number.parseInt(priceRange.max))
    }

    // Sort
    switch (sortBy) {
      case "price-low":
        filtered.sort((a, b) => a.price - b.price)
        break
      case "price-high":
        filtered.sort((a, b) => b.price - a.price)
        break
      case "rating":
        filtered.sort((a, b) => b.rating - a.rating)
        break
      case "newest":
      default:
        // Keep original order for newest
        break
    }

    setFilteredProducts(filtered)
  }, [products, searchQuery, selectedCategory, selectedDistricts, sortBy, priceRange])

  const handleDistrictToggle = (district: string) => {
    const updated = selectedDistricts.includes(district)
      ? selectedDistricts.filter((d) => d !== district)
      : [...selectedDistricts, district]
    setSelectedDistricts(updated)
  }

  const addToCart = (product: Product) => {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]")
    const existingItem = cart.find((item: any) => item.id === product.id)

    if (existingItem) {
      existingItem.quantity += 1
    } else {
      cart.push({ ...product, quantity: 1, type: "product" })
    }

    localStorage.setItem("cart", JSON.stringify(cart))
    // Trigger cart update in header
    window.dispatchEvent(new Event("cartUpdated"))
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <div className="container mx-auto px-4 py-8 flex-1">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="lg:w-1/4">
            <Card className="p-6 sticky top-24">
              <h3 className="font-semibold text-lg mb-4 flex items-center">
                <Filter className="w-5 h-5 mr-2" />
                Filters
              </h3>

              {/* Search */}
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">Search</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    type="text"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Category */}
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">Category</label>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Districts */}
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">Districts</label>
                <div className="max-h-48 overflow-y-auto space-y-2">
                  {districts.slice(0, 10).map((district) => (
                    <div key={district} className="flex items-center space-x-2">
                      <Checkbox
                        id={district}
                        checked={selectedDistricts.includes(district)}
                        onCheckedChange={() => handleDistrictToggle(district)}
                      />
                      <label htmlFor={district} className="text-sm cursor-pointer">
                        {district}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">Price Range (৳)</label>
                <div className="flex gap-2">
                  <Input
                    type="number"
                    placeholder="Min"
                    value={priceRange.min}
                    onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })}
                  />
                  <Input
                    type="number"
                    placeholder="Max"
                    value={priceRange.max}
                    onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
                  />
                </div>
              </div>
            </Card>
          </div>

          {/* Products Grid */}
          <div className="lg:w-3/4">
            {/* Sort and Results */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
              <div>
                <h1 className="text-2xl font-bold text-primary mb-2">Products</h1>
                <p className="text-muted-foreground">
                  Showing {filteredProducts.length} of {products.length} products
                </p>
              </div>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="rating">Highest Rated</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <Card key={product.id} className="hover:shadow-lg transition-all duration-300 hover:scale-105 group">
                  <div className="relative overflow-hidden rounded-t-lg">
                    <Link href={`/products/${product.id}`}>
                      <Image
                        src={product.image || "/placeholder.svg"}
                        alt={product.name}
                        width={300}
                        height={300}
                        className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    </Link>
                    <Badge className="absolute top-2 right-2 bg-primary/90">
                      <MapPin className="w-3 h-3 mr-1" />
                      {product.district}
                    </Badge>
                  </div>
                  <CardContent className="p-4">
                    <Link href={`/products/${product.id}`}>
                      <h3 className="font-semibold text-lg mb-2 hover:text-primary transition-colors text-pretty">
                        {product.name}
                      </h3>
                    </Link>
                    <p className="text-muted-foreground text-sm mb-2">by {product.seller}</p>
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{product.description}</p>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-2xl font-bold text-primary">৳{product.price.toLocaleString()}</span>
                      <div className="flex items-center">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="text-sm text-muted-foreground ml-1">{product.rating}</span>
                      </div>
                    </div>
                    <Button
                      onClick={() => addToCart(product)}
                      className="w-full bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90"
                    >
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      Add to Cart
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredProducts.length === 0 && (
              <div className="text-center py-12">
                <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-12 h-12 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-semibold text-muted-foreground mb-2">No products found</h3>
                <p className="text-muted-foreground">Try adjusting your filters or search terms</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
