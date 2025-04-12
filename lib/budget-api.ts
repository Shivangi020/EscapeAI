import { addDays } from "date-fns"

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

// Mock function to simulate budget API
export async function getBudgetEstimates(destination: string, days: number): Promise<BudgetData> {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Cost estimates based on destination (per day in USD)
      const costByDestination: Record<string, BudgetCategory> = {
        "Paris, France": {
          accommodation: 150,
          food: 80,
          transportation: 30,
          activities: 60,
          other: 40,
        },
        "New York, NY, USA": {
          accommodation: 200,
          food: 100,
          transportation: 40,
          activities: 80,
          other: 50,
        },
        "Bali, Indonesia": {
          accommodation: 50,
          food: 30,
          transportation: 15,
          activities: 40,
          other: 20,
        },
        "Sydney, NSW, Australia": {
          accommodation: 120,
          food: 70,
          transportation: 25,
          activities: 60,
          other: 35,
        },
        "Rome, Italy": {
          accommodation: 110,
          food: 70,
          transportation: 20,
          activities: 50,
          other: 30,
        },
        "Gazipur National Park": {
          accommodation: 80,
          food: 40,
          transportation: 30,
          activities: 50,
          other: 25,
        },
        "Galveston / USA": {
          accommodation: 120,
          food: 60,
          transportation: 25,
          activities: 45,
          other: 30,
        },
      }

      // Default costs if destination not found
      const defaultCosts: BudgetCategory = {
        accommodation: 100,
        food: 50,
        transportation: 25,
        activities: 40,
        other: 30,
      }

      // Get costs for the destination or use default
      const destinationCosts = costByDestination[destination] || defaultCosts

      // Calculate total per category
      const categories: BudgetCategory = {
        accommodation: destinationCosts.accommodation * days,
        food: destinationCosts.food * days,
        transportation: destinationCosts.transportation * days,
        activities: destinationCosts.activities * days,
        other: destinationCosts.other * days,
      }

      // Calculate total estimate
      const totalEstimate = Object.values(categories).reduce((sum, cost) => sum + cost, 0)

      // Generate daily breakdown
      const dailyBreakdown: DailyBudget[] = []
      const today = new Date()

      for (let i = 0; i < days; i++) {
        // Add some variation to daily costs (±20%)
        const variation = () => 0.8 + Math.random() * 0.4 // 0.8 to 1.2

        const accommodation = Math.round(destinationCosts.accommodation * variation())
        const food = Math.round(destinationCosts.food * variation())
        const transportation = Math.round(destinationCosts.transportation * variation())
        const activities = Math.round(destinationCosts.activities * variation())
        const other = Math.round(destinationCosts.other * variation())

        dailyBreakdown.push({
          day: i + 1,
          date: addDays(today, i),
          accommodation,
          food,
          transportation,
          activities,
          other,
          total: accommodation + food + transportation + activities + other,
        })
      }

      resolve({
        totalEstimate,
        categories,
        dailyBreakdown,
      })
    }, 700)
  })
}
