"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Globe, ArrowLeft, ArrowRight, Paperclip } from "lucide-react"
import { AssessmentFormData } from "./types"
import { sendPersonalDetailsEmail, sendFormCompletionEmail, sendThankYouEmail } from "../lib/email-service"

// Add language type
type Language = 'en' | 'ar';

// Add translations
const translations = {
  en: {
    // Section titles
    sections: [
      "Personal Information",
      "Basic Company Information",
      "Organizational Structure", 
      "Corporate Culture and Values",
      "Strategic Direction",
      "Training Experience"
    ],
    // Navigation buttons
    navigation: {
      previous: "Previous",
      next: "Next",
      submit: "Submit Assessment"
    },
    // Form labels
    labels: {
      // Personal Information
      fullName: "Full Name",
      jobTitle: "Job Title",
      department: "Department / Division",
      email: "Email",
      phone: "Phone Number",
      dateCompleted: "Date",

      // Basic Company Information
      companyName: "Full company name",
      industry: "Industry/Sector",
      industryPlaceholder: "e.g., Industrial, Service, Healthcare, Education",
      yearEstablished: "Year established",
      location: "Geographic location",
      locationPlaceholder: "Please specify main office and branches if any",
      ownershipType: "Ownership type",
      ownershipOptions: ["Government", "Private", "Mixed", "Group subsidiary"],

      // Organizational Structure
      employeeCount: "Total number of employees",
      employeeDistribution: "Employee distribution by department",
      uploadEmployeeDistribution: "Upload employee distribution",
      orgLevels: "Organizational levels",
      orgLevelsOptions: ["Top Management", "Middle Management", "Operational"],
      orgLevelsPlaceholder: "Top management / Middle management / Operational",
      orgChartAvailable: "Is a formal organizational chart available?",
      uploadOrgChart: "Upload organizational chart",
      yes: "Yes",
      no: "No",

      // Corporate Culture and Values
      vision: "Company vision",
      mission: "Company mission",
      coreValues: "Core values",
      coreValuesPlaceholder: "e.g., Innovation, Teamwork, Quality, Sustainability",
      policies: "Policy and Procedures",
      policiesPlaceholder: "e.g., Training & Development",

      // Strategic Direction
      objectives: "Current strategic objectives",
      challenges: "Key challenges facing the company",
      projects: "Ongoing or planned development projects",

      // Training Experience
      hasTrainingDept: "Does the company have a dedicated training department?",
      trainingPrograms: "Types of training programs previously delivered",
      evaluatedTraining: "Has training impact been evaluated before?",
      evaluationMethod: "How was the training impact evaluated?"
    }
  },
  ar: {
    // Section titles
    sections: [
      "المعلومات الشخصية",
      "الهوية الأساسية",
      "الهيكل والتنظيم",
      "الثقافة والقيم",
      "التوجه الاستراتيجي",
      "الخبرة مع التدريب"
    ],
    // Navigation buttons
    navigation: {
      previous: "السابق",
      next: "التالي",
      submit: "تقديم التقييم"
    },
    // Form labels
    labels: {
      // Personal Information
      fullName: "الاسم الكامل",
      jobTitle: "المسمى الوظيفي",
      department: "القسم / الإدارة",
      email: "البريد الإلكتروني",
      phone: "رقم الهاتف",
      dateCompleted: "تاريخ تعبئة النموذج",

      // Basic Company Information
      companyName: "اسم الشركة الكامل",
      industry: "القطاع أو المجال",
      industryPlaceholder: "مثلاً: صناعي، خدمي، صحي، تعليمي",
      yearEstablished: "سنة التأسيس",
      location: "الموقع الجغرافي",
      locationPlaceholder: "يرجى تحديد المقر الرئيسي والفروع إن وجدت",
      ownershipType: "نوع الملكية",
      ownershipOptions: ["حكومية", "خاصة", "مختلطة", "تابعة لمجموعة"],

      // Organizational Structure
      employeeCount: "عدد الموظفين الإجمالي",
      employeeDistribution: "توزيع الموظفين حسب الإدارات",
      uploadEmployeeDistribution: "تحميل ملف توزيع الموظفين",
      orgLevels: "المستويات الوظيفية",
      orgLevelsOptions: ["الإدارة العليا", "الإدارة المتوسطة", "الإدارة التشغيلية"],
      orgLevelsPlaceholder: "الإدارة العليا / المتوسطة / التشغيلية",
      orgChartAvailable: "هل يتوفر مخطط هيكلي رسمي؟",
      uploadOrgChart: "تحميل المخطط الهيكلي",
      yes: "نعم",
      no: "لا",

      // Corporate Culture and Values
      vision: "الرؤية المؤسسية",
      mission: "الرسالة المؤسسية",
      coreValues: "القيم الجوهرية",
      coreValuesPlaceholder: "مثلاً: الابتكار، العمل الجماعي، الجودة، الاستدامة",
      policies: "السياسات والإجراءات",
      policiesPlaceholder: "مثلاً: سياسة التدريب والتطوير",

      // Strategic Direction
      objectives: "الأهداف الاستراتيجية الحالية",
      challenges: "التحديات الرئيسية التي تواجه الشركة",
      projects: "مشروعات تطوير حالية أو مستقبلية",

      // Training Experience
      hasTrainingDept: "هل يوجد قسم تدريب داخل الشركة؟",
      trainingPrograms: "نوع الدورات التي قدمت سابقًا",
      evaluatedTraining: "هل تم تقييم أثر التدريب سابقًا؟",
      evaluationMethod: "كيف تم تقييم أثر التدريب؟"
    }
  }
};

const initialFormData: AssessmentFormData = {
  // Personal Information
  fullName: "",
  jobTitle: "",
  department: "",
  email: "",
  phone: "",
  dateCompleted: new Date().toISOString().split("T")[0],

  // Basic Company Information
  companyName: "",
  industry: "",
  yearEstablished: "",
  location: "",
  ownershipType: "",

  // Organizational Structure
  employeeCount: "",
  employeeDistribution: "",
  orgLevels: "",
  orgChartAvailable: "",
  orgChartFile: null,
  employeeDistributionFile: null,

  // Corporate Culture and Values
  vision: "",
  mission: "",
  coreValues: "",
  policies: "",

  // Strategic Direction
  objectives: "",
  challenges: "",
  projects: "",

  // Training Experience
  hasTrainingDept: "",
  trainingPrograms: "",
  evaluatedTraining: "",
  evaluationMethod: "",
}

export default function Home() {
  const router = useRouter()
  const [language, setLanguage] = useState<Language>('en')
  const [currentSection, setCurrentSection] = useState(0)
  const [formData, setFormData] = useState<AssessmentFormData>(initialFormData)
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<{[key: string]: string}>({})
  
  // Get sections from translations based on current language
  const sections = translations[language].sections

  // Add useEffect to get language from localStorage on component mount
  useEffect(() => {
    const savedLanguage = localStorage.getItem('formLanguage') as Language
    if (savedLanguage) {
      setLanguage(savedLanguage)
    }
  }, [])

  // Update language setter to also save to localStorage
  const handleLanguageChange = (newLanguage: Language) => {
    setLanguage(newLanguage)
    localStorage.setItem('formLanguage', newLanguage)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    
    // Clear error for this field if value changes
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target
    if (files && files.length > 0) {
      setFormData((prev) => ({ ...prev, [name]: files[0] }))
    }
  }

  const handleRadioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      // Validate all required fields before submission
      const allErrors = validateAllFields(formData);
      
      if (Object.keys(allErrors).length > 0) {
        setErrors(allErrors);
        return; // Don't proceed if there are validation errors
      }
      
      // Show loading state
      setIsLoading(true)
      
      // Create a copy of form data to handle file attachments
      const emailFormData = { ...formData };
      
      // Convert file attachments to base64 for email transmission
      if (formData.orgChartFile) {
        const orgChartBase64 = await fileToBase64(formData.orgChartFile);
        // @ts-ignore - we know this is safe to add
        emailFormData.orgChartFileData = {
          name: formData.orgChartFile.name,
          type: formData.orgChartFile.type,
          size: formData.orgChartFile.size,
          base64: orgChartBase64
        };
      }
      
      if (formData.employeeDistributionFile) {
        const distributionBase64 = await fileToBase64(formData.employeeDistributionFile);
        // @ts-ignore - we know this is safe to add
        emailFormData.employeeDistributionFileData = {
          name: formData.employeeDistributionFile.name,
          type: formData.employeeDistributionFile.type,
          size: formData.employeeDistributionFile.size,
          base64: distributionBase64
        };
      }
      
      // Send email with all form data through service
      const result = await sendFormCompletionEmail(emailFormData);
      
      if (result.success) {
        console.log("Form submitted and email sent:", formData)
        
        // Send thank you email to the user
        try {
          await sendThankYouEmail({
            fullName: formData.fullName,
            email: formData.email,
            language: language
          });
          console.log("Thank you email sent to user");
        } catch (emailError) {
          console.error("Error sending thank you email:", emailError);
          // Continue with redirection even if thank you email fails
        }
        
        // Direct redirect to thank you page without showing alert
        router.push("/thank-you")
      } else {
        throw new Error(result.error || 'Error sending form completion email');
      }
    } catch (error) {
      console.error("Error submitting form:", error)
      alert("There was an error submitting your form. Please try again.")
      // Hide loading state if there's an error
      setIsLoading(false)
    }
  }

  // Helper function to convert files to base64
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  }

  const nextSection = async () => {
    if (currentSection < sections.length - 1) {
      // Validate fields if this is the first section (Personal Information)
      if (currentSection === 0) {
        const validationErrors = validatePersonalInfo(formData);
        
        if (Object.keys(validationErrors).length > 0) {
          setErrors(validationErrors);
          return; // Don't proceed if there are validation errors
        }
        
        try {
          // Show loading state while sending email
          setIsLoading(true)
          
          // Send email notification with personal details through service
          const result = await sendPersonalDetailsEmail({
            fullName: formData.fullName,
            jobTitle: formData.jobTitle,
            department: formData.department,
            email: formData.email,
            phone: formData.phone,
            dateCompleted: formData.dateCompleted
          });
          
          if (result.success) {
            console.log("Personal details email notification sent");
          } else {
            throw new Error(result.error || 'Error sending personal details email');
          }
        } catch (error) {
          console.error("Error sending personal details notification:", error);
          // Continue with form even if email fails
        } finally {
          // Hide loading state after email is sent (or failed)
          setIsLoading(false)
        }
      }
      
      setCurrentSection((prev) => prev + 1)
      window.scrollTo(0, 0)
    }
  }

  // Validation function for Personal Information
  const validatePersonalInfo = (data: AssessmentFormData) => {
    const errors: {[key: string]: string} = {};

    // Validate full name
    if (!data.fullName.trim()) {
      errors.fullName = language === 'ar' ? 'الاسم الكامل مطلوب' : 'Full name is required';
    } else if (data.fullName.trim().length < 3) {
      errors.fullName = language === 'ar' ? 'يجب أن يتكون الاسم من 3 أحرف على الأقل' : 'Name must be at least 3 characters';
    }

    // Validate job title
    if (!data.jobTitle.trim()) {
      errors.jobTitle = language === 'ar' ? 'المسمى الوظيفي مطلوب' : 'Job title is required';
    }

    // Validate department
    if (!data.department.trim()) {
      errors.department = language === 'ar' ? 'القسم/الإدارة مطلوب' : 'Department is required';
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!data.email.trim()) {
      errors.email = language === 'ar' ? 'البريد الإلكتروني مطلوب' : 'Email is required';
    } else if (!emailRegex.test(data.email)) {
      errors.email = language === 'ar' ? 'يرجى إدخال بريد إلكتروني صحيح' : 'Please enter a valid email address';
    }

    // Validate phone
    // Allows formats like: +1234567890, 123-456-7890, (123) 456-7890, etc.
    const phoneRegex = /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/;
    if (!data.phone.trim()) {
      errors.phone = language === 'ar' ? 'رقم الهاتف مطلوب' : 'Phone number is required';
    } else if (!phoneRegex.test(data.phone)) {
      errors.phone = language === 'ar' ? 'يرجى إدخال رقم هاتف صحيح' : 'Please enter a valid phone number';
    }

    // Validate date
    if (!data.dateCompleted) {
      errors.dateCompleted = language === 'ar' ? 'التاريخ مطلوب' : 'Date is required';
    }

    return errors;
  }

  // Function to validate all required fields
  const validateAllFields = (data: AssessmentFormData) => {
    // Start with personal info validation
    const errors = validatePersonalInfo(data);
    
    // Validate company information
    if (!data.companyName.trim()) {
      errors.companyName = language === 'ar' ? 'اسم الشركة مطلوب' : 'Company name is required';
    }
    
    if (!data.industry.trim()) {
      errors.industry = language === 'ar' ? 'القطاع أو المجال مطلوب' : 'Industry/Sector is required';
    }
    
    if (!data.yearEstablished.trim()) {
      errors.yearEstablished = language === 'ar' ? 'سنة التأسيس مطلوبة' : 'Year established is required';
    }
    
    if (!data.location.trim()) {
      errors.location = language === 'ar' ? 'الموقع الجغرافي مطلوب' : 'Geographic location is required';
    }
    
    if (!data.ownershipType.trim()) {
      errors.ownershipType = language === 'ar' ? 'نوع الملكية مطلوب' : 'Ownership type is required';
    }
    
    // Validate organizational structure
    if (!data.employeeCount.trim()) {
      errors.employeeCount = language === 'ar' ? 'عدد الموظفين مطلوب' : 'Employee count is required';
    }
    
    if (!data.orgLevels.trim()) {
      errors.orgLevels = language === 'ar' ? 'المستويات الوظيفية مطلوبة' : 'Organizational levels are required';
    }
    
    if (!data.orgChartAvailable.trim()) {
      errors.orgChartAvailable = language === 'ar' ? 'يرجى تحديد ما إذا كان المخطط الهيكلي متوفرًا' : 'Please specify if org chart is available';
    }
    
    // Validate corporate culture and values
    if (!data.vision.trim()) {
      errors.vision = language === 'ar' ? 'الرؤية المؤسسية مطلوبة' : 'Company vision is required';
    }
    
    if (!data.mission.trim()) {
      errors.mission = language === 'ar' ? 'الرسالة المؤسسية مطلوبة' : 'Company mission is required';
    }
    
    if (!data.coreValues.trim()) {
      errors.coreValues = language === 'ar' ? 'القيم الجوهرية مطلوبة' : 'Core values are required';
    }
    
    if (!data.policies.trim()) {
      errors.policies = language === 'ar' ? 'السياسات والإجراءات مطلوبة' : 'Policies and procedures are required';
    }
    
    // Validate strategic direction
    if (!data.objectives.trim()) {
      errors.objectives = language === 'ar' ? 'الأهداف الاستراتيجية مطلوبة' : 'Strategic objectives are required';
    }
    
    if (!data.challenges.trim()) {
      errors.challenges = language === 'ar' ? 'التحديات مطلوبة' : 'Challenges are required';
    }
    
    if (!data.projects.trim()) {
      errors.projects = language === 'ar' ? 'المشروعات مطلوبة' : 'Projects are required';
    }
    
    // Validate training experience
    if (!data.hasTrainingDept.trim()) {
      errors.hasTrainingDept = language === 'ar' ? 'يرجى تحديد ما إذا كان هناك قسم تدريب' : 'Please specify if there is a training department';
    }
    
    if (!data.trainingPrograms.trim()) {
      errors.trainingPrograms = language === 'ar' ? 'برامج التدريب مطلوبة' : 'Training programs are required';
    }
    
    if (!data.evaluatedTraining.trim()) {
      errors.evaluatedTraining = language === 'ar' ? 'يرجى تحديد ما إذا تم تقييم التدريب' : 'Please specify if training has been evaluated';
    }
    
    // If evaluatedTraining is 'Yes', require evaluation method
    if (data.evaluatedTraining === 'Yes' && !data.evaluationMethod.trim()) {
      errors.evaluationMethod = language === 'ar' ? 'طريقة التقييم مطلوبة' : 'Evaluation method is required';
    }
    
    return errors;
  }

  const prevSection = () => {
    if (currentSection > 0) {
      setCurrentSection((prev) => prev - 1)
      window.scrollTo(0, 0)
    }
  }

  const renderSection = () => {
    switch (currentSection) {
      case 0:
        return (
          <div className="form-section bg-white px-6 py-5 rounded-lg border border-gray-100 shadow-sm">
            <h2 className="text-xl font-semibold mb-5 text-gray-800">{translations[language].sections[0]}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1 required">
                  {translations[language].labels.fullName}
                </label>
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  required
                  value={formData.fullName}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 bg-white border ${errors.fullName ? 'border-red-500' : 'border-gray-200'} rounded-md shadow-xs text-gray-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-100 transition-all duration-200 hover:border-gray-300 outline-none text-sm`}
                />
                {errors.fullName && <p className="mt-1 text-xs text-red-500">{errors.fullName}</p>}
              </div>

              <div className="space-y-1.5">
                <label htmlFor="jobTitle" className="block text-sm font-medium text-gray-700 mb-1 required">
                  {translations[language].labels.jobTitle}
                </label>
                <input
                  id="jobTitle"
                  name="jobTitle"
                  type="text"
                  required
                  value={formData.jobTitle}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 bg-white border ${errors.jobTitle ? 'border-red-500' : 'border-gray-200'} rounded-md shadow-xs text-gray-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-100 transition-all duration-200 hover:border-gray-300 outline-none text-sm`}
                />
                {errors.jobTitle && <p className="mt-1 text-xs text-red-500">{errors.jobTitle}</p>}
              </div>

              <div className="space-y-1.5">
                <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-1 required">
                  {translations[language].labels.department}
                </label>
                <input
                  id="department"
                  name="department"
                  type="text"
                  required
                  value={formData.department}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 bg-white border ${errors.department ? 'border-red-500' : 'border-gray-200'} rounded-md shadow-xs text-gray-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-100 transition-all duration-200 hover:border-gray-300 outline-none text-sm`}
                />
                {errors.department && <p className="mt-1 text-xs text-red-500">{errors.department}</p>}
              </div>

              <div className="space-y-1.5">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1 required">
                  {translations[language].labels.email}
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 bg-white border ${errors.email ? 'border-red-500' : 'border-gray-200'} rounded-md shadow-xs text-gray-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-100 transition-all duration-200 hover:border-gray-300 outline-none text-sm`}
                />
                {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
              </div>

              <div className="space-y-1.5">
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1 required">
                  {translations[language].labels.phone}
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 bg-white border ${errors.phone ? 'border-red-500' : 'border-gray-200'} rounded-md shadow-xs text-gray-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-100 transition-all duration-200 hover:border-gray-300 outline-none text-sm`}
                />
                {errors.phone && <p className="mt-1 text-xs text-red-500">{errors.phone}</p>}
              </div>

              <div className="space-y-1.5">
                <label htmlFor="dateCompleted" className="block text-sm font-medium text-gray-700 mb-1 required">
                  {translations[language].labels.dateCompleted}
                </label>
                <input
                  id="dateCompleted"
                  name="dateCompleted"
                  type="date"
                  required
                  value={formData.dateCompleted}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 bg-white border ${errors.dateCompleted ? 'border-red-500' : 'border-gray-200'} rounded-md shadow-xs text-gray-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-100 transition-all duration-200 hover:border-gray-300 outline-none text-sm`}
                />
                {errors.dateCompleted && <p className="mt-1 text-xs text-red-500">{errors.dateCompleted}</p>}
              </div>
            </div>
          </div>
        )

      case 1:
        return (
          <div className="form-section bg-white px-6 py-5 rounded-lg border border-gray-100 shadow-sm">
            <h2 className="text-xl font-semibold mb-5 text-gray-800">{translations[language].sections[1]}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label htmlFor="companyName" className="block text-sm font-medium text-gray-700 mb-1 required">
                  {translations[language].labels.companyName}
                </label>
                <input
                  id="companyName"
                  name="companyName"
                  type="text"
                  required
                  value={formData.companyName}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 bg-white border ${errors.companyName ? 'border-red-500' : 'border-gray-200'} rounded-md shadow-xs text-gray-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-100 transition-all duration-200 hover:border-gray-300 outline-none text-sm`}
                />
                {errors.companyName && <p className="mt-1 text-xs text-red-500">{errors.companyName}</p>}
              </div>

              <div className="space-y-1.5">
                <label htmlFor="industry" className="block text-sm font-medium text-gray-700 mb-1 required">
                  {translations[language].labels.industry}
                </label>
                <input
                  id="industry"
                  name="industry"
                  type="text"
                  placeholder={translations[language].labels.industryPlaceholder}
                  required
                  value={formData.industry}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 bg-white border ${errors.industry ? 'border-red-500' : 'border-gray-200'} rounded-md shadow-xs text-gray-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-100 transition-all duration-200 hover:border-gray-300 outline-none text-sm`}
                />
                {errors.industry && <p className="mt-1 text-xs text-red-500">{errors.industry}</p>}
              </div>

              <div className="space-y-1.5">
                <label htmlFor="yearEstablished" className="block text-sm font-medium text-gray-700 mb-1 required">
                  {translations[language].labels.yearEstablished}
                </label>
                <input
                  id="yearEstablished"
                  name="yearEstablished"
                  type="text"
                  required
                  value={formData.yearEstablished}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 bg-white border ${errors.yearEstablished ? 'border-red-500' : 'border-gray-200'} rounded-md shadow-xs text-gray-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-100 transition-all duration-200 hover:border-gray-300 outline-none text-sm`}
                />
                {errors.yearEstablished && <p className="mt-1 text-xs text-red-500">{errors.yearEstablished}</p>}
              </div>

              <div className="space-y-1.5">
                <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1 required">
                  {translations[language].labels.location}
                </label>
                <input
                  id="location"
                  name="location"
                  type="text"
                  placeholder={translations[language].labels.locationPlaceholder}
                  required
                  value={formData.location}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 bg-white border ${errors.location ? 'border-red-500' : 'border-gray-200'} rounded-md shadow-xs text-gray-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-100 transition-all duration-200 hover:border-gray-300 outline-none text-sm`}
                />
                {errors.location && <p className="mt-1 text-xs text-red-500">{errors.location}</p>}
              </div>

              <div className="space-y-1.5 md:col-span-2">
                <label htmlFor="ownershipType" className="block text-sm font-medium text-gray-700 mb-1 required">
                  {translations[language].labels.ownershipType}
                </label>
                <div className="flex flex-wrap gap-3">
                  {translations[language].labels.ownershipOptions.map((option) => (
                    <div
                      key={option}
                      className={`
                        flex-1 min-w-[160px] relative border rounded-md px-3 py-2 cursor-pointer transition-all duration-200
                        ${formData.ownershipType === option ? 'border-blue-500 bg-blue-50/50' : errors.ownershipType ? 'border-red-500' : 'border-gray-200 hover:bg-gray-50'}
                      `}
                      onClick={() => {
                        setFormData((prev) => ({ ...prev, ownershipType: option }));
                        if (errors.ownershipType) setErrors(prev => ({ ...prev, ownershipType: '' }));
                      }}
                    >
                      <input
                        type="radio"
                        name="ownershipType"
                        value={option}
                        checked={formData.ownershipType === option}
                        onChange={handleRadioChange}
                        className="absolute opacity-0"
                      />
                      <div className="flex items-center">
                        <div
                          className={`
                            h-4 w-4 rounded-full border-2 mr-2 flex items-center justify-center
                            ${formData.ownershipType === option ? 'border-blue-500' : 'border-gray-300'}
                          `}
                        >
                          {formData.ownershipType === option && (
                            <div className="h-2 w-2 rounded-full bg-blue-500" />
                          )}
                        </div>
                        <span className="text-sm text-gray-700">{option}</span>
                      </div>
                    </div>
                  ))}
                </div>
                {errors.ownershipType && <p className="mt-1 text-xs text-red-500">{errors.ownershipType}</p>}
              </div>
            </div>
          </div>
        )

      case 2:
        return (
          <div className="form-section bg-white px-6 py-5 rounded-lg border border-gray-100 shadow-sm">
            <h2 className="text-xl font-semibold mb-5 text-gray-800">{translations[language].sections[2]}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label htmlFor="employeeCount" className="block text-sm font-medium text-gray-700 mb-1 required">
                  {translations[language].labels.employeeCount}
                </label>
                <input
                  id="employeeCount"
                  name="employeeCount"
                  type="text"
                  required
                  value={formData.employeeCount}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-white border border-gray-200 rounded-md shadow-xs text-gray-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-100 transition-all duration-200 hover:border-gray-300 outline-none text-sm"
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="employeeDistribution" className="block text-sm font-medium text-gray-700 mb-1">
                  {translations[language].labels.employeeDistribution}
                </label>
                <div className="flex items-center space-x-2">
                  <div className="flex-1">
                    <label
                      htmlFor="employeeDistributionFile"
                      className="flex items-center justify-center px-4 py-2 border border-dashed border-gray-300 rounded-md hover:border-blue-400 hover:bg-blue-50/50 transition-all duration-200 cursor-pointer group text-gray-400 hover:text-blue-500"
                    >
                      <Paperclip className="h-4 w-4 mr-2 group-hover:text-blue-500" />
                      <span className="text-sm font-medium group-hover:text-blue-600">
                        {translations[language].labels.uploadEmployeeDistribution}
                      </span>
                      <input
                        id="employeeDistributionFile"
                        name="employeeDistributionFile"
                        type="file"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>
                {formData.employeeDistributionFile && (
                  <div className="text-xs text-green-600 mt-1">
                    {formData.employeeDistributionFile.name}
                  </div>
                )}
              </div>

              {/* Organizational Levels - Full width with checkboxes */}
              <div className="space-y-1.5 md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1 required">
                  {translations[language].labels.orgLevels}
                </label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                  {translations[language].labels.orgLevelsOptions.map((level) => (
                    <div 
                      key={level}
                      className="flex items-center space-x-2 border border-gray-200 p-2 rounded-md hover:bg-gray-50 transition-all duration-200 cursor-pointer"
                      onClick={() => {
                        // Toggle the level in a comma-separated list
                        const currentLevels = formData.orgLevels ? formData.orgLevels.split(',').map(l => l.trim()) : [];
                        let newLevels;
                        
                        if (currentLevels.includes(level)) {
                          // Remove level if already selected
                          newLevels = currentLevels.filter(l => l !== level);
                        } else {
                          // Add level if not selected
                          newLevels = [...currentLevels, level];
                        }
                        
                        setFormData(prev => ({ 
                          ...prev, 
                          orgLevels: newLevels.join(', ')
                        }));
                      }}
                    >
                      <div className={`w-5 h-5 flex-shrink-0 border rounded ${formData.orgLevels && formData.orgLevels.includes(level) ? 'bg-blue-500 border-blue-500' : 'border-gray-300'} flex items-center justify-center`}>
                        {formData.orgLevels && formData.orgLevels.includes(level) && (
                          <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                          </svg>
                        )}
                      </div>
                      <span className="text-sm text-gray-700">{level}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Organizational Chart Availability - Full width */}
              <div className="space-y-1.5 md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1 required">
                  {translations[language].labels.orgChartAvailable}
                </label>
                <div className="flex items-center space-x-6">
                  {[translations[language].labels.yes, translations[language].labels.no].map((option) => (
                    <div 
                      key={option} 
                      className="relative flex items-center space-x-2.5 px-3 py-2 border border-gray-200 rounded-md hover:bg-gray-50/50 transition-all duration-200 group cursor-pointer"
                      onClick={() => {
                        const input = document.getElementById(`orgChart-${option === translations[language].labels.yes ? 'yes' : 'no'}`);
                        if (input) {
                          (input as HTMLInputElement).click();
                        }
                      }}
                    >
                      <input
                        id={`orgChart-${option === translations[language].labels.yes ? 'yes' : 'no'}`}
                        name="orgChartAvailable"
                        type="radio"
                        value={option === translations[language].labels.yes ? 'Yes' : 'No'}
                        checked={formData.orgChartAvailable === (option === translations[language].labels.yes ? 'Yes' : 'No')}
                        onChange={handleRadioChange}
                        className="peer appearance-none h-4 w-4 border-2 border-gray-300 rounded-full checked:border-blue-500 checked:bg-blue-500 checked:border-4 focus:outline-none focus:ring-0 focus:ring-offset-0 cursor-pointer transition-all duration-200"
                      />
                      <label 
                        htmlFor={`orgChart-${option === translations[language].labels.yes ? 'yes' : 'no'}`}
                        className="flex-1 text-gray-700 text-sm cursor-pointer select-none group-hover:text-gray-900 transition-colors duration-200"
                      >
                        {option}
                      </label>
                    </div>
                  ))}
                </div>

                {formData.orgChartAvailable === 'Yes' && (
                  <div className="mt-3">
                    <label
                      htmlFor="orgChartFile"
                      className="flex items-center justify-center px-4 py-2 border border-dashed border-gray-300 rounded-md hover:border-blue-400 hover:bg-blue-50/50 transition-all duration-200 cursor-pointer group text-gray-400 hover:text-blue-500"
                    >
                      <Paperclip className="h-4 w-4 mr-2 group-hover:text-blue-500" />
                      <span className="text-sm font-medium group-hover:text-blue-600">
                        {translations[language].labels.uploadOrgChart}
                      </span>
                      <input
                        id="orgChartFile"
                        name="orgChartFile"
                        type="file"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                    </label>
                    {formData.orgChartFile && (
                      <div className="text-xs text-green-600 mt-1">{formData.orgChartFile.name}</div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )

      case 3:
        return (
          <div className="form-section bg-white px-6 py-5 rounded-lg border border-gray-100 shadow-sm">
            <h2 className="text-xl font-semibold mb-5 text-gray-800">{translations[language].sections[3]}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label htmlFor="vision" className="block text-sm font-medium text-gray-700 mb-1 required">
                  {translations[language].labels.vision}
                </label>
                <textarea
                  id="vision"
                  name="vision"
                  rows={3}
                  required
                  value={formData.vision}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-white border border-gray-200 rounded-md shadow-xs text-gray-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-100 transition-all duration-200 hover:border-gray-300 outline-none text-sm resize-none"
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="mission" className="block text-sm font-medium text-gray-700 mb-1 required">
                  {translations[language].labels.mission}
                </label>
                <textarea
                  id="mission"
                  name="mission"
                  rows={3}
                  required
                  value={formData.mission}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-white border border-gray-200 rounded-md shadow-xs text-gray-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-100 transition-all duration-200 hover:border-gray-300 outline-none text-sm resize-none"
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="coreValues" className="block text-sm font-medium text-gray-700 mb-1 required">
                  {translations[language].labels.coreValues}
                </label>
                <textarea
                  id="coreValues"
                  name="coreValues"
                  rows={3}
                  placeholder={translations[language].labels.coreValuesPlaceholder}
                  required
                  value={formData.coreValues}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-white border border-gray-200 rounded-md shadow-xs text-gray-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-100 transition-all duration-200 hover:border-gray-300 outline-none text-sm resize-none"
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="policies" className="block text-sm font-medium text-gray-700 mb-1 required">
                  {translations[language].labels.policies}
                </label>
                <textarea
                  id="policies"
                  name="policies"
                  rows={3}
                  placeholder={translations[language].labels.policiesPlaceholder}
                  required
                  value={formData.policies}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-white border border-gray-200 rounded-md shadow-xs text-gray-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-100 transition-all duration-200 hover:border-gray-300 outline-none text-sm resize-none"
                />
              </div>
            </div>
          </div>
        )

      case 4:
        return (
          <div className="form-section bg-white px-6 py-5 rounded-lg border border-gray-100 shadow-sm">
            <h2 className="text-xl font-semibold mb-5 text-gray-800">{translations[language].sections[4]}</h2>
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-1.5">
                <label htmlFor="objectives" className="block text-sm font-medium text-gray-700 mb-1 required">
                  {translations[language].labels.objectives}
                </label>
                <textarea
                  id="objectives"
                  name="objectives"
                  rows={3}
                  required
                  value={formData.objectives}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-white border border-gray-200 rounded-md shadow-xs text-gray-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-100 transition-all duration-200 hover:border-gray-300 outline-none text-sm resize-none"
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="challenges" className="block text-sm font-medium text-gray-700 mb-1 required">
                  {translations[language].labels.challenges}
                </label>
                <textarea
                  id="challenges"
                  name="challenges"
                  rows={3}
                  required
                  value={formData.challenges}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-white border border-gray-200 rounded-md shadow-xs text-gray-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-100 transition-all duration-200 hover:border-gray-300 outline-none text-sm resize-none"
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="projects" className="block text-sm font-medium text-gray-700 mb-1 required">
                  {translations[language].labels.projects}
                </label>
                <textarea
                  id="projects"
                  name="projects"
                  rows={3}
                  required
                  value={formData.projects}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-white border border-gray-200 rounded-md shadow-xs text-gray-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-100 transition-all duration-200 hover:border-gray-300 outline-none text-sm resize-none"
                />
              </div>
            </div>
          </div>
        )

      case 5:
        return (
          <div className="form-section bg-white px-6 py-5 rounded-lg border border-gray-100 shadow-sm">
            <h2 className="text-xl font-semibold mb-5 text-gray-800">{translations[language].sections[5]}</h2>
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-gray-700 mb-1 required">
                  {translations[language].labels.hasTrainingDept}
                </label>
                <div className="flex items-center space-x-6">
                  {[translations[language].labels.yes, translations[language].labels.no].map((option) => (
                    <div 
                      key={option} 
                      className="relative flex items-center space-x-2.5 px-3 py-2 border border-gray-200 rounded-md hover:bg-gray-50/50 transition-all duration-200 group cursor-pointer"
                      onClick={() => {
                        const input = document.getElementById(`trainingDept-${option === translations[language].labels.yes ? 'yes' : 'no'}`);
                        if (input) {
                          (input as HTMLInputElement).click();
                        }
                      }}
                    >
                      <input
                        id={`trainingDept-${option === translations[language].labels.yes ? 'yes' : 'no'}`}
                        name="hasTrainingDept"
                        type="radio"
                        value={option === translations[language].labels.yes ? 'Yes' : 'No'}
                        checked={formData.hasTrainingDept === (option === translations[language].labels.yes ? 'Yes' : 'No')}
                        onChange={handleRadioChange}
                        className="peer appearance-none h-4 w-4 border-2 border-gray-300 rounded-full checked:border-blue-500 checked:bg-blue-500 checked:border-4 focus:outline-none focus:ring-0 focus:ring-offset-0 cursor-pointer transition-all duration-200"
                      />
                      <label 
                        htmlFor={`trainingDept-${option === translations[language].labels.yes ? 'yes' : 'no'}`} 
                        className="flex-1 text-gray-700 text-sm cursor-pointer select-none group-hover:text-gray-900 transition-colors duration-200"
                      >
                        {option}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-gray-700 mb-1 required">
                  {translations[language].labels.trainingPrograms}
                </label>
                <textarea
                  id="trainingPrograms"
                  name="trainingPrograms"
                  rows={3}
                  required
                  value={formData.trainingPrograms}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-white border border-gray-200 rounded-md shadow-xs text-gray-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-100 transition-all duration-200 hover:border-gray-300 outline-none text-sm"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-gray-700 mb-1 required">{translations[language].labels.evaluatedTraining}</label>
                <div className="flex items-center space-x-6">
                  {[translations[language].labels.yes, translations[language].labels.no].map((option) => (
                    <div 
                      key={option} 
                      className="relative flex items-center space-x-2.5 px-3 py-2 border border-gray-200 rounded-md hover:bg-gray-50/50 transition-all duration-200 group cursor-pointer"
                      onClick={() => {
                        const input = document.getElementById(`evaluated-${option === translations[language].labels.yes ? 'yes' : 'no'}`);
                        if (input) {
                          (input as HTMLInputElement).click();
                        }
                      }}
                    >
                      <input
                        id={`evaluated-${option === translations[language].labels.yes ? 'yes' : 'no'}`}
                        name="evaluatedTraining"
                        type="radio"
                        value={option === translations[language].labels.yes ? 'Yes' : 'No'}
                        checked={formData.evaluatedTraining === (option === translations[language].labels.yes ? 'Yes' : 'No')}
                        onChange={handleRadioChange}
                        className="peer appearance-none h-4 w-4 border-2 border-gray-300 rounded-full checked:border-blue-500 checked:bg-blue-500 checked:border-4 focus:outline-none focus:ring-0 focus:ring-offset-0 cursor-pointer transition-all duration-200"
                      />
                      <label 
                        htmlFor={`evaluated-${option === translations[language].labels.yes ? 'yes' : 'no'}`} 
                        className="flex-1 text-gray-700 text-sm cursor-pointer select-none group-hover:text-gray-900 transition-colors duration-200"
                      >
                        {option}
                      </label>
                    </div>
                  ))}
                </div>

                {formData.evaluatedTraining === 'Yes' && (
                  <div className="mt-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1 required">
                      {translations[language].labels.evaluationMethod}
                    </label>
                    <textarea
                      id="evaluationMethod"
                      name="evaluationMethod"
                      rows={3}
                      required
                      value={formData.evaluationMethod}
                      onChange={handleChange}
                      className="w-full px-3 py-2 bg-white border border-gray-200 rounded-md shadow-xs text-gray-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-100 transition-all duration-200 hover:border-gray-300 outline-none text-sm"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-white">
      <div className="pt-6"></div>
      <div className="relative w-full max-w-4xl mx-auto bg-gradient-to-br from-blue-900 via-teal-800 to-blue-900 rounded-xl shadow-xl overflow-hidden">
        {/* Banner Image at the Top */}
        <img src="/banner.png" alt="Banner" className="w-full object-cover h-48 rounded-t-xl" />

        {/* Main Content */}
        <div className={`pt-4 pb-10 px-8 ${language === 'ar' ? 'rtl' : 'ltr'}`} dir={language === 'ar' ? 'rtl' : 'ltr'}>
          {/* Language Selector - Matching the provided design */}
          <div className={`flex ${language === 'ar' ? 'justify-start' : 'justify-end'} mb-4`}>
            <div className="inline-flex items-center bg-white rounded-[4px] border border-gray-200 px-3 py-1.5 hover:bg-gray-50 transition-colors duration-200">
              <Globe className="h-4 w-4 text-gray-600 mx-1.5" />
              <select
                value={language}
                onChange={(e) => handleLanguageChange(e.target.value as Language)}
                className="appearance-none bg-transparent border-none text-sm font-medium text-gray-600 focus:outline-none cursor-pointer"
                style={{ backgroundImage: 'none' }}
              >
                <option value="en">EN</option>
                <option value="ar">AR</option>
              </select>
            </div>
          </div>

          {/* Form Container */}
          <div className="bg-white rounded-lg rounded-b-xl p-10 mb-8 shadow-lg font-sans">
            <form onSubmit={currentSection === sections.length - 1 ? handleSubmit : (e) => e.preventDefault()}>
              {renderSection()}

              <div className="flex justify-between mt-8">
                {currentSection > 0 ? (
                  <button
                    type="button"
                    onClick={prevSection}
                    className="flex items-center px-4 py-2 bg-white border border-gray-200 rounded-[4px] text-gray-700 text-sm font-medium hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 focus:outline-none focus:ring-1 focus:ring-gray-200"
                    disabled={isLoading}
                  >
                    {language === 'ar' ? (
                      <>
                        {translations[language].navigation.previous}
                        <ArrowRight className="h-4 w-4 mr-2 text-gray-500" />
                      </>
                    ) : (
                      <>
                        <ArrowLeft className="h-4 w-4 mr-2 text-gray-500" />
                        {translations[language].navigation.previous}
                      </>
                    )}
                  </button>
                ) : (
                  <div></div> // Empty div to maintain flex spacing
                )}

                {currentSection < sections.length - 1 ? (
                  <button
                    type="button"
                    onClick={nextSection}
                    disabled={isLoading}
                    className="flex items-center px-4 py-2 border-none rounded-[4px] text-white text-sm font-medium transition-all duration-200 focus:outline-none bg-[#009CDD] hover:bg-[#0089c4] shadow-sm"
                  >
                    {isLoading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        {language === 'ar' ? translations[language].navigation.next : translations[language].navigation.next}
                      </>
                    ) : (
                      language === 'ar' ? (
                        <>
                          <ArrowLeft className="h-4 w-4 ml-2" />
                          {translations[language].navigation.next}
                        </>
                      ) : (
                        <>
                          {translations[language].navigation.next}
                          <ArrowRight className="h-4 w-4 ml-2" />
                        </>
                      )
                    )}
                  </button>
                ) : (
                  <button 
                    type="submit" 
                    disabled={isLoading}
                    className="flex items-center px-5 py-2 border-none rounded-[4px] text-white text-sm font-medium transition-all duration-200 focus:outline-none bg-[#009CDD] hover:bg-[#0089c4] shadow-sm"
                  >
                    {isLoading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        {translations[language].navigation.submit}
                      </>
                    ) : (
                      translations[language].navigation.submit
                    )}
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* Progress Bar */}
          <div className="px-4">
            <div className="progress-bar">
              <div
                className="progress-bar-fill bg-[#009CDD]"
                style={{ width: `${((currentSection + 1) / sections.length) * 100}%` }}
              ></div>
            </div>
            <div className="progress-dots">
              {Array.from({ length: sections.length }).map((_, i) => {
                let dotClass = "progress-dot"
                if (i < currentSection) {
                  dotClass += " completed"
                } else if (i === currentSection) {
                  dotClass += " active"
                }
                return <div key={i} className={dotClass}></div>
              })}
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
