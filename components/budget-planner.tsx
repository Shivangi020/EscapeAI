"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Progress } from "@/components/ui/progress"
import { format } from "date-fns"
import { DollarSign, AlertCircle, CheckCircle, TrendingDown } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface BudgetCategory {
  accommodation: number
  food: number
  transportation: number
  activities: number
  other: number
}

interface DailyBudget extends BudgetCategory {
  day: number
  date: Date
  total: number
}

interface BudgetData {
  totalEstimate: number
  categories: BudgetCategory
  dailyBreakdown: DailyBudget[]
}

interface BudgetPlannerProps {
  budget: BudgetData
  userBudget: number
  onBudgetChange: (budget: number) => void
  destination: string
  duration: number
}

export default function BudgetPlanner({
  budget,
  userBudget,
  onBudgetChange,
  destination,
  duration,
}: BudgetPlannerProps) {
  const [allocations, setAllocations] = useState<BudgetCategory>({
    accommodation: 40,
    food: 20,
    transportation: 15,
    activities: 15,
    other: 10,
  })

  const [optimizedBudget, setOptimizedBudget] = useState<BudgetData | null>(null)
  const [showOptimized, setShowOptimized] = useState(false)

  useEffect(() => {
    // Create an optimized budget when user budget changes
    if (budget) {
      const ratio = userBudget / budget.totalEstimate

      // If user budget is less than estimated, create optimized version
      if (ratio < 1) {
        const optimized = {
          ...budget,
          totalEstimate: userBudget,
          categories: {
            accommodation: Math.round(budget.categories.accommodation * ratio),
            food: Math.round(budget.categories.food * ratio),
            transportation: Math.round(budget.categories.transportation * ratio),
            activities: Math.round(budget.categories.activities * ratio),
            other: Math.round(budget.categories.other * ratio),
          },
          dailyBreakdown: budget.dailyBreakdown.map((day) => ({
            ...day,
            accommodation: Math.round(day.accommodation * ratio),
            food: Math.round(day.food * ratio),
            transportation: Math.round(day.transportation * ratio),
            activities: Math.round(day.activities * ratio),
            other: Math.round(day.other * ratio),
            total: Math.round(day.total * ratio),
          })),
        }
        setOptimizedBudget(optimized)
      } else {
        setOptimizedBudget(null)
      }
    }
  }, [budget, userBudget])

  const handleAllocationChange = (category: keyof BudgetCategory, value: number[]) => {
    const newValue = value[0]
    const oldValue = allocations[category]
    const diff = newValue - oldValue

    // Adjust other categories proportionally
    const otherCategories = Object.keys(allocations).filter((key) => key !== category) as Array<keyof BudgetCategory>
    const totalOtherValues = otherCategories.reduce((sum, key) => sum + allocations[key], 0)

    const newAllocations = { ...allocations, [category]: newValue }

    otherCategories.forEach((key) => {
      const proportion = allocations[key] / totalOtherValues
      newAllocations[key] = Math.max(0, Math.round(allocations[key] - diff * proportion))
    })

    // Ensure total is 100%
    const total = Object.values(newAllocations).reduce((sum, val) => sum + val, 0)
    if (total !== 100) {
      const lastKey = otherCategories[otherCategories.length - 1]
      newAllocations[lastKey] += 100 - total
    }

    setAllocations(newAllocations)
  }

  const calculateDailyBudget = () => {
    return Math.round(userBudget / duration)
  }

  const getBudgetStatus = () => {
    const ratio = userBudget / budget.totalEstimate
    if (ratio >= 1.2) return { status: "high", message: "Your budget is generous for this destination" }
    if (ratio >= 0.8) return { status: "good", message: "Your budget is appropriate for this destination" }
    if (ratio >= 0.6) return { status: "tight", message: "Your budget is tight but manageable with some compromises" }
    return {
      status: "low",
      message:
        "Your budget is low for this destination. Consider extending your trip duration or choosing more budget-friendly options",
    }
  }

  const budgetStatus = getBudgetStatus()

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-xl">Your Budget</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-end gap-4">
              <div className="flex-1">
                <label htmlFor="budget" className="text-sm font-medium mb-1 block">
                  Total Budget (USD)
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="budget"
                    type="number"
                    value={userBudget}
                    onChange={(e) => onBudgetChange(Number(e.target.value))}
                    className="pl-9"
                  />
                </div>
              </div>
              <Button
                variant={showOptimized ? "default" : "outline"}
                onClick={() => setShowOptimized(!showOptimized)}
                className="mb-0.5"
              >
                <TrendingDown className="mr-2 h-4 w-4" />
                {showOptimized ? "Hide Optimized" : "Optimize Budget"}
              </Button>
            </div>

            <div className="flex items-center gap-2 p-3 rounded-lg bg-gray-50">
              {budgetStatus.status === "low" && <AlertCircle className="h-5 w-5 text-red-500" />}
              {budgetStatus.status === "tight" && <AlertCircle className="h-5 w-5 text-yellow-500" />}
              {budgetStatus.status === "good" && <CheckCircle className="h-5 w-5 text-green-500" />}
              {budgetStatus.status === "high" && <CheckCircle className="h-5 w-5 text-green-500" />}
              <p className="text-sm">{budgetStatus.message}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="text-sm text-gray-500 mb-1">Estimated Cost</div>
                <div className="text-2xl font-bold">${budget.totalEstimate}</div>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="text-sm text-gray-500 mb-1">Daily Budget</div>
                <div className="text-2xl font-bold">${calculateDailyBudget()}</div>
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium">Budget Status</span>
                <span className="text-sm font-medium">
                  ${userBudget} / ${budget.totalEstimate}
                </span>
              </div>
              <Progress
                value={(userBudget / budget.totalEstimate) * 100}
                className="h-2"
                indicatorClassName={
                  budgetStatus.status === "low"
                    ? "bg-red-500"
                    : budgetStatus.status === "tight"
                      ? "bg-yellow-500"
                      : "bg-green-500"
                }
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-xl">Budget Allocation</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <label className="text-sm font-medium">Accommodation ({allocations.accommodation}%)</label>
                  <span className="text-sm font-medium">
                    ${Math.round((userBudget * allocations.accommodation) / 100)}
                  </span>
                </div>
                <Slider
                  value={[allocations.accommodation]}
                  max={80}
                  step={1}
                  onValueChange={(value) => handleAllocationChange("accommodation", value)}
                />
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <label className="text-sm font-medium">Food ({allocations.food}%)</label>
                  <span className="text-sm font-medium">${Math.round((userBudget * allocations.food) / 100)}</span>
                </div>
                <Slider
                  value={[allocations.food]}
                  max={50}
                  step={1}
                  onValueChange={(value) => handleAllocationChange("food", value)}
                />
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <label className="text-sm font-medium">Transportation ({allocations.transportation}%)</label>
                  <span className="text-sm font-medium">
                    ${Math.round((userBudget * allocations.transportation) / 100)}
                  </span>
                </div>
                <Slider
                  value={[allocations.transportation]}
                  max={50}
                  step={1}
                  onValueChange={(value) => handleAllocationChange("transportation", value)}
                />
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <label className="text-sm font-medium">Activities ({allocations.activities}%)</label>
                  <span className="text-sm font-medium">
                    ${Math.round((userBudget * allocations.activities) / 100)}
                  </span>
                </div>
                <Slider
                  value={[allocations.activities]}
                  max={50}
                  step={1}
                  onValueChange={(value) => handleAllocationChange("activities", value)}
                />
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <label className="text-sm font-medium">Other ({allocations.other}%)</label>
                  <span className="text-sm font-medium">${Math.round((userBudget * allocations.other) / 100)}</span>
                </div>
                <Slider
                  value={[allocations.other]}
                  max={30}
                  step={1}
                  onValueChange={(value) => handleAllocationChange("other", value)}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-xl">Daily Cost Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Day</TableHead>
                <TableHead>Accommodation</TableHead>
                <TableHead>Food</TableHead>
                <TableHead>Transport</TableHead>
                <TableHead>Activities</TableHead>
                <TableHead>Other</TableHead>
                <TableHead className="text-right">Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {(showOptimized && optimizedBudget ? optimizedBudget.dailyBreakdown : budget.dailyBreakdown).map(
                (day) => (
                  <TableRow key={day.day}>
                    <TableCell className="font-medium">
                      Day {day.day}
                      <div className="text-xs text-gray-500">{format(day.date, "MMM d")}</div>
                    </TableCell>
                    <TableCell>${day.accommodation}</TableCell>
                    <TableCell>${day.food}</TableCell>
                    <TableCell>${day.transportation}</TableCell>
                    <TableCell>${day.activities}</TableCell>
                    <TableCell>${day.other}</TableCell>
                    <TableCell className="text-right font-medium">${day.total}</TableCell>
                  </TableRow>
                ),
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {showOptimized && optimizedBudget && (
        <Card className="border-green-100 bg-green-50">
          <CardHeader className="pb-3">
            <CardTitle className="text-xl flex items-center">
              <TrendingDown className="mr-2 h-5 w-5 text-green-600" />
              Budget Optimization Suggestions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 shrink-0" />
                <span>
                  Consider budget accommodations like hostels or guesthouses instead of luxury hotels to save up to 50%
                  on lodging costs.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 shrink-0" />
                <span>Use public transportation instead of taxis or rental cars when possible.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 shrink-0" />
                <span>Look for free or discounted attractions and activities. Many museums have free entry days.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 shrink-0" />
                <span>
                  Eat at local markets and street food vendors instead of restaurants for authentic and affordable
                  meals.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 shrink-0" />
                <span>
                  Travel during shoulder season (just before or after peak season) for better rates on everything.
                </span>
              </li>
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
