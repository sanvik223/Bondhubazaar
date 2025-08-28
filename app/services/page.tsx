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
import { Search, Filter, Star, MapPin, Calendar } from "lucide-react"
import Header from "@/components/common/header"
import Footer from "@/components/common/footer"
import { districts } from "@/lib/firebase"

interface Service {
  id: string
  name: string
  price: number
  image: string
  category: string
  district: string
  rating: number
  provider: string
  description: string
}

const serviceCategories = [
  "Photography",
  "Home Services",
  "Beauty Services",
  "Logistics",
  "Tutoring",
  "Repair Services",
  "Event Planning",
  "Healthcare",
  "Legal Services",
  "Others",
]

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([])
  const [filteredServices, setFilteredServices] = useState<Service[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedDistricts, setSelectedDistricts] = useState<string[]>([])
  const [sortBy, setSortBy] = useState("newest")
  const [priceRange, setPriceRange] = useState({ min: "", max: "" })

  useEffect(() => {
    // Mock services data
    const mockServices: Service[] = [
      {
        id: "1",
        name: "Professional Photography",
        price: 5000,
        image: "/professional-photographer-camera.png",
        category: "Photography",
        district: "Dhaka",
        rating: 4.9,
        provider: "Photo Pro BD",
        description: "Professional photography for weddings, events, and portraits",
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
        description: "Complete home cleaning service with professional equipment",
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
        description: "Professional bridal makeup and beauty services",
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
        description: "Fast and reliable delivery service across the city",
      },
      {
        id: "5",
        name: "Math Tutoring",
        price: 800,
        image: "/math-tutor-teaching.png",
        category: "Tutoring",
        district: "Rajshahi",
        rating: 4.8,
        provider: "Edu Expert",
        description: "Expert math tutoring for students of all levels",
      },
      {
        id: "6",
        name: "AC Repair Service",
        price: 1200,
        image: "/ac-repair-technician.png",
        category: "Repair Services",
        district: "Khulna",
        rating: 4.5,
        provider: "Cool Tech",
        description: "Professional AC repair and maintenance service",
      },
    ]

    setServices(mockServices)
    setFilteredServices(mockServices)

    // Load selected districts from localStorage
    const saved = localStorage.getItem("selectedDistricts")
    if (saved) {
      setSelectedDistricts(JSON.parse(saved))
    }
  }, [])

  useEffect(() => {
    let filtered = services

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (service) =>
          service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          service.description.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    // Category filter
    if (selectedCategory !== "all") {
      filtered = filtered.filter((service) => service.category === selectedCategory)
    }

    // District filter
    if (selectedDistricts.length > 0) {
      filtered = filtered.filter((service) => selectedDistricts.includes(service.district))
    }

    // Price range filter
    if (priceRange.min) {
      filtered = filtered.filter((service) => service.price >= Number.parseInt(priceRange.min))
    }
    if (priceRange.max) {
      filtered = filtered.filter((service) => service.price <= Number.parseInt(priceRange.max))
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

    setFilteredServices(filtered)
  }, [services, searchQuery, selectedCategory, selectedDistricts, sortBy, priceRange])

  const handleDistrictToggle = (district: string) => {
    const updated = selectedDistricts.includes(district)
      ? selectedDistricts.filter((d) => d !== district)
      : [...selectedDistricts, district]
    setSelectedDistricts(updated)
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
                    placeholder="Search services..."
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
                    {serviceCategories.map((category) => (
                      <SelectItem key={category} value={category.toLowerCase()}>
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

          {/* Services Grid */}
          <div className="lg:w-3/4">
            {/* Sort and Results */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
              <div>
                <h1 className="text-2xl font-bold text-secondary mb-2">Services</h1>
                <p className="text-muted-foreground">
                  Showing {filteredServices.length} of {services.length} services
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

            {/* Services Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredServices.map((service) => (
                <Card key={service.id} className="hover:shadow-lg transition-all duration-300 hover:scale-105 group">
                  <div className="relative overflow-hidden rounded-t-lg">
                    <Link href={`/services/${service.id}`}>
                      <Image
                        src={service.image || "/placeholder.svg"}
                        alt={service.name}
                        width={300}
                        height={300}
                        className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    </Link>
                    <Badge className="absolute top-2 right-2 bg-secondary/90">
                      <MapPin className="w-3 h-3 mr-1" />
                      {service.district}
                    </Badge>
                  </div>
                  <CardContent className="p-4">
                    <Link href={`/services/${service.id}`}>
                      <h3 className="font-semibold text-lg mb-2 hover:text-secondary transition-colors text-pretty">
                        {service.name}
                      </h3>
                    </Link>
                    <p className="text-muted-foreground text-sm mb-2">by {service.provider}</p>
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{service.description}</p>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-2xl font-bold text-secondary">৳{service.price.toLocaleString()}</span>
                      <div className="flex items-center">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="text-sm text-muted-foreground ml-1">{service.rating}</span>
                      </div>
                    </div>
                    <Link href={`/services/${service.id}`}>
                      <Button className="w-full bg-gradient-to-r from-secondary to-primary hover:from-secondary/90 hover:to-primary/90">
                        <Calendar className="w-4 h-4 mr-2" />
                        Book Now
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredServices.length === 0 && (
              <div className="text-center py-12">
                <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-12 h-12 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-semibold text-muted-foreground mb-2">No services found</h3>
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
