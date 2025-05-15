"use client"

import { useRouter } from "next/navigation"
import { CheckCircle, Globe } from "lucide-react"
import { useEffect, useState } from "react"

// Define language type
type Language = 'en' | 'ar';

// Add translations
const translations = {
  en: {
    title: "Thank You for Completing the Assessment",
    message: "Your submission has been received. Our team will review your information and get back to you shortly.",
    returnButton: "Return to Home"
  },
  ar: {
    title: "شكرًا لإكمال التقييم",
    message: "تم استلام مشاركتك. سيقوم فريقنا بمراجعة معلوماتك والرد عليك قريبًا.",
    returnButton: "العودة إلى الصفحة الرئيسية"
  }
};

export default function ThankYou() {
  const router = useRouter()
  const [language, setLanguage] = useState<Language>('en')

  // Get language from localStorage on component mount
  useEffect(() => {
    const savedLanguage = localStorage.getItem('formLanguage') as Language
    if (savedLanguage) {
      setLanguage(savedLanguage)
    }
  }, [])

  // Save language to localStorage when changed
  const handleLanguageChange = (newLanguage: Language) => {
    setLanguage(newLanguage)
    localStorage.setItem('formLanguage', newLanguage)
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-white">
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

          {/* Thank You Container */}
          <div className="bg-white rounded-lg rounded-b-xl p-10 mb-8 mt-4 shadow-lg font-sans text-center">
            <div className="flex justify-center mb-6">
              <CheckCircle className="h-20 w-20 text-green-500" />
            </div>
            <h2 className="text-2xl font-bold mb-4">{translations[language].title}</h2>
            <p className="text-gray-600 mb-6">
              {translations[language].message}
            </p>
            <button
              onClick={() => router.push("/")}
              className="px-6 py-3 text-white font-medium rounded-lg bg-gradient-to-r from-blue-500 to-teal-400 shadow-md hover:from-blue-600 hover:to-teal-500 transition-all"
            >
              {translations[language].returnButton}
            </button>
          </div>
        </div>
      </div>
    </main>
  )
}
