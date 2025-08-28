"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { MapPin, Menu, ShoppingCart, User, Wallet, Package } from "lucide-react"
import { districts } from "@/lib/firebase"

export default function Header() {
  const [selectedDistricts, setSelectedDistricts] = useState<string[]>([])
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [cartCount, setCartCount] = useState(0)

  useEffect(() => {
    // Load selected districts from localStorage
    const saved = localStorage.getItem("selectedDistricts")
    if (saved) {
      setSelectedDistricts(JSON.parse(saved))
    }

    // Check auth status (placeholder)
    const authStatus = localStorage.getItem("isLoggedIn")
    setIsLoggedIn(authStatus === "true")

    // Load cart count
    const cart = localStorage.getItem("cart")
    if (cart) {
      const cartItems = JSON.parse(cart)
      setCartCount(cartItems.length)
    }
  }, [])

  const handleDistrictToggle = (district: string) => {
    const updated = selectedDistricts.includes(district)
      ? selectedDistricts.filter((d) => d !== district)
      : [...selectedDistricts, district]

    setSelectedDistricts(updated)
    localStorage.setItem("selectedDistricts", JSON.stringify(updated))
  }

  const NavLinks = () => (
    <>
      <Link href="/" className="text-foreground hover:text-primary transition-colors">
        Home
      </Link>
      <Link href="/products" className="text-foreground hover:text-primary transition-colors">
        Products
      </Link>
      <Link href="/services" className="text-foreground hover:text-primary transition-colors">
        Services
      </Link>
      {isLoggedIn && (
        <>
          <Link href="/wallet" className="text-foreground hover:text-primary transition-colors">
            Wallet
          </Link>
          <Link href="/orders" className="text-foreground hover:text-primary transition-colors">
            Orders
          </Link>
        </>
      )}
    </>
  )

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-r from-primary to-secondary rounded-lg flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-sm">B</span>
          </div>
          <span className="font-bold text-xl text-primary">Bondhubazaar</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <NavLinks />
        </nav>

        {/* District Selector & Actions */}
        <div className="flex items-center space-x-2">
          {/* District Selector */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="hidden sm:flex bg-transparent">
                <MapPin className="w-4 h-4 mr-2" />
                {selectedDistricts.length > 0 ? (
                  <Badge variant="secondary" className="ml-1">
                    {selectedDistricts.length}
                  </Badge>
                ) : (
                  "Select District"
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 max-h-64 overflow-y-auto">
              {districts.map((district) => (
                <DropdownMenuItem
                  key={district}
                  onClick={() => handleDistrictToggle(district)}
                  className="flex items-center justify-between"
                >
                  <span>{district}</span>
                  {selectedDistricts.includes(district) && (
                    <Badge variant="default" className="ml-2">
                      ✓
                    </Badge>
                  )}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Cart */}
          <Link href="/cart">
            <Button variant="outline" size="sm" className="relative bg-transparent">
              <ShoppingCart className="w-4 h-4" />
              {cartCount > 0 && (
                <Badge
                  variant="destructive"
                  className="absolute -top-2 -right-2 w-5 h-5 flex items-center justify-center text-xs"
                >
                  {cartCount}
                </Badge>
              )}
            </Button>
          </Link>

          {/* User Menu */}
          {isLoggedIn ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <User className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link href="/profile" className="flex items-center">
                    <User className="w-4 h-4 mr-2" />
                    Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/wallet" className="flex items-center">
                    <Wallet className="w-4 h-4 mr-2" />
                    Wallet
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/orders" className="flex items-center">
                    <Package className="w-4 h-4 mr-2" />
                    Orders
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    localStorage.removeItem("isLoggedIn")
                    setIsLoggedIn(false)
                    window.location.href = "/"
                  }}
                  className="text-destructive"
                >
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link href="/login">
              <Button size="sm" className="bg-gradient-to-r from-primary to-secondary">
                Sign In
              </Button>
            </Link>
          )}

          {/* Mobile Menu */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="sm" className="md:hidden bg-transparent">
                <Menu className="w-4 h-4" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80">
              <div className="flex flex-col space-y-4 mt-8">
                <NavLinks />
                {!isLoggedIn && (
                  <Link href="/login">
                    <Button className="w-full bg-gradient-to-r from-primary to-secondary">Sign In</Button>
                  </Link>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
