export type AssessmentFormData = {
  // Personal Information
  fullName: string
  jobTitle: string
  department: string
  email: string
  phone: string
  dateCompleted: string

  // Basic Company Information
  companyName: string
  industry: string
  yearEstablished: string
  location: string
  ownershipType: string

  // Organizational Structure
  employeeCount: string
  employeeDistribution: string
  orgLevels: string
  orgChartAvailable: string
  orgChartFile: File | null
  employeeDistributionFile: File | null

  // Corporate Culture and Values
  vision: string
  mission: string
  coreValues: string
  policies: string

  // Strategic Direction
  objectives: string
  challenges: string
  projects: string

  // Training Experience
  hasTrainingDept: string
  trainingPrograms: string
  evaluatedTraining: string
  evaluationMethod: string
} 