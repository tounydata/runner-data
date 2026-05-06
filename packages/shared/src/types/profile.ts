export interface Profile {
  id: string
  name: string | null
  age: number | null
  sex: 'M' | 'F' | null
  birthdate: string | null
  weight: number | null
  height: number | null
  vo2max: number | null
  fc_max: number | null
  lactate_threshold: number | null
  lactate_pace: string | null
  mass_fat: number | null
  mass_muscle: number | null
  pain_zones: string[] | null
  goals: string | null
  prs: PersonalRecords | null
  nutrition_products: NutritionProduct[] | null
  avatar_url: string | null
  created_at: string
  updated_at: string
}

export interface PersonalRecords {
  '5k'?: string
  '10k'?: string
  half?: string
  marathon?: string
  [distance: string]: string | undefined
}

export interface NutritionProduct {
  name: string
  brand: string | null
  type: 'gel' | 'bar' | 'drink' | 'solid' | 'other'
  carbs_per_unit: number
  notes: string | null
}

export type ProfileUpdate = Partial<Omit<Profile, 'id' | 'created_at' | 'updated_at'>>
