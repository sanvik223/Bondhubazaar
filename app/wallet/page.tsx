"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import { Wallet, Plus, ArrowUpRight, ArrowDownLeft, Smartphone, Building2, TrendingUp, Eye, EyeOff } from "lucide-react"
import Header from "@/components/common/header"
import Footer from "@/components/common/footer"
import { db, dbUtils } from "@/lib/firebase"

interface Transaction {
  id: string
  type: "credit" | "debit"
  amount: number
  description: string
  date: Date
  status: "completed" | "pending" | "failed"
  reference?: string
}

export default function WalletPage() {
  const [balance, setBalance] = useState(5000)
  const [showBalance, setShowBalance] = useState(true)
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [addFundsAmount, setAddFundsAmount] = useState("")
  const [addingFunds, setAddingFunds] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  useEffect(() => {
    loadWalletData()
  }, [])

  const loadWalletData = async () => {
    try {
      // Mock transaction data
      const mockTransactions: Transaction[] = [
        {
          id: "1",
          type: "credit",
          amount: 2000,
          description: "Added funds via bKash",
          date: new Date("2024-01-15"),
          status: "completed",
          reference: "TXN123456789",
        },
        {
          id: "2",
          type: "debit",
          amount: 1200,
          description: "Purchase - Cotton Casual Shirt",
          date: new Date("2024-01-14"),
          status: "completed",
          reference: "ORD987654321",
        },
        {
          id: "3",
          type: "credit",
          amount: 500,
          description: "Refund - LED Table Lamp",
          date: new Date("2024-01-13"),
          status: "completed",
          reference: "REF456789123",
        },
        {
          id: "4",
          type: "debit",
          amount: 5000,
          description: "Service booking - Professional Photography",
          date: new Date("2024-01-12"),
          status: "completed",
          reference: "SRV789123456",
        },
        {
          id: "5",
          type: "credit",
          amount: 8700,
          description: "Added funds via Nagad",
          date: new Date("2024-01-10"),
          status: "completed",
          reference: "TXN321654987",
        },
      ]

      setTransactions(mockTransactions)
      setLoading(false)
    } catch (error) {
      console.error("Error loading wallet data:", error)
      setLoading(false)
    }
  }

  const handleAddFunds = async () => {
    const amount = Number.parseFloat(addFundsAmount)
    if (!amount || amount < 10) {
      setError("Minimum amount is ৳10")
      return
    }

    setAddingFunds(true)
    setError("")

    try {
      // Simulate payment processing
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Add transaction to Firestore
      const newTransaction: Transaction = {
        id: Date.now().toString(),
        type: "credit",
        amount,
        description: "Added funds via Mobile Banking",
        date: new Date(),
        status: "completed",
        reference: `TXN${Date.now()}`,
      }

      await dbUtils.addDoc(dbUtils.collection(db, "wallet_transactions"), {
        userId: localStorage.getItem("userId") || "guest",
        ...newTransaction,
      })

      setBalance(balance + amount)
      setTransactions([newTransaction, ...transactions])
      setAddFundsAmount("")
      setSuccess(`৳${amount.toLocaleString()} added successfully!`)
    } catch (error: any) {
      setError(error.message || "Failed to add funds. Please try again.")
    } finally {
      setAddingFunds(false)
    }
  }

  const getTransactionIcon = (type: string) => {
    return type === "credit" ? (
      <ArrowDownLeft className="w-4 h-4 text-green-600" />
    ) : (
      <ArrowUpRight className="w-4 h-4 text-red-600" />
    )
  }

  const getStatusBadge = (status: string) => {
    const variants = {
      completed: "default",
      pending: "secondary",
      failed: "destructive",
    } as const

    return (
      <Badge variant={variants[status as keyof typeof variants] || "secondary"}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading wallet...</p>
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
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-primary">My Wallet</h1>
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm" onClick={() => setShowBalance(!showBalance)}>
                {showBalance ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </Button>
            </div>
          </div>

          {/* Wallet Balance Card */}
          <Card className="mb-8 bg-gradient-to-r from-primary to-secondary text-primary-foreground">
            <CardContent className="p-8">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center space-x-2 mb-2">
                    <Wallet className="w-6 h-6" />
                    <span className="text-lg font-medium">Available Balance</span>
                  </div>
                  <div className="text-4xl font-bold">{showBalance ? `৳${balance.toLocaleString()}` : "৳****"}</div>
                </div>
                <div className="text-right">
                  <div className="flex items-center space-x-1 text-sm opacity-90 mb-2">
                    <TrendingUp className="w-4 h-4" />
                    <span>This Month</span>
                  </div>
                  <div className="text-2xl font-semibold">+৳2,500</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Tabs defaultValue="transactions" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="transactions">Transactions</TabsTrigger>
              <TabsTrigger value="add-funds">Add Funds</TabsTrigger>
            </TabsList>

            {/* Transactions Tab */}
            <TabsContent value="transactions" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Transactions</CardTitle>
                </CardHeader>
                <CardContent>
                  {transactions.length === 0 ? (
                    <div className="text-center py-8">
                      <Wallet className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">No transactions yet</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {transactions.map((transaction, index) => (
                        <div key={transaction.id}>
                          <div className="flex items-center justify-between py-3">
                            <div className="flex items-center space-x-3">
                              <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                                {getTransactionIcon(transaction.type)}
                              </div>
                              <div>
                                <p className="font-medium text-pretty">{transaction.description}</p>
                                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                                  <span>{transaction.date.toLocaleDateString()}</span>
                                  {transaction.reference && (
                                    <>
                                      <span>•</span>
                                      <span>{transaction.reference}</span>
                                    </>
                                  )}
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              <p
                                className={`font-semibold ${
                                  transaction.type === "credit" ? "text-green-600" : "text-red-600"
                                }`}
                              >
                                {transaction.type === "credit" ? "+" : "-"}৳{transaction.amount.toLocaleString()}
                              </p>
                              {getStatusBadge(transaction.status)}
                            </div>
                          </div>
                          {index < transactions.length - 1 && <Separator />}
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Add Funds Tab */}
            <TabsContent value="add-funds" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Add Funds to Wallet</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
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

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="amount">Amount (৳)</Label>
                      <Input
                        id="amount"
                        type="number"
                        placeholder="Enter amount"
                        value={addFundsAmount}
                        onChange={(e) => {
                          setAddFundsAmount(e.target.value)
                          setError("")
                          setSuccess("")
                        }}
                        min="10"
                        step="10"
                      />
                      <p className="text-sm text-muted-foreground">Minimum amount: ৳10</p>
                    </div>

                    {/* Quick Amount Buttons */}
                    <div className="grid grid-cols-3 gap-2">
                      {[500, 1000, 2000, 5000, 10000, 20000].map((amount) => (
                        <Button
                          key={amount}
                          variant="outline"
                          onClick={() => setAddFundsAmount(amount.toString())}
                          className="text-sm"
                        >
                          ৳{amount.toLocaleString()}
                        </Button>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  {/* Payment Methods */}
                  <div className="space-y-4">
                    <h3 className="font-semibold">Select Payment Method</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Card className="cursor-pointer hover:shadow-md transition-shadow border-2 hover:border-primary">
                        <CardContent className="p-4 text-center">
                          <Smartphone className="w-8 h-8 text-primary mx-auto mb-2" />
                          <p className="font-medium">bKash</p>
                          <p className="text-sm text-muted-foreground">Mobile Banking</p>
                        </CardContent>
                      </Card>
                      <Card className="cursor-pointer hover:shadow-md transition-shadow border-2 hover:border-primary">
                        <CardContent className="p-4 text-center">
                          <Smartphone className="w-8 h-8 text-secondary mx-auto mb-2" />
                          <p className="font-medium">Nagad</p>
                          <p className="text-sm text-muted-foreground">Mobile Banking</p>
                        </CardContent>
                      </Card>
                      <Card className="cursor-pointer hover:shadow-md transition-shadow border-2 hover:border-primary">
                        <CardContent className="p-4 text-center">
                          <Building2 className="w-8 h-8 text-primary mx-auto mb-2" />
                          <p className="font-medium">Bank Transfer</p>
                          <p className="text-sm text-muted-foreground">Direct Transfer</p>
                        </CardContent>
                      </Card>
                    </div>
                  </div>

                  <Button
                    onClick={handleAddFunds}
                    disabled={addingFunds || !addFundsAmount}
                    className="w-full bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    {addingFunds ? "Processing..." : `Add ৳${addFundsAmount || "0"} to Wallet`}
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <Footer />
    </div>
  )
}
