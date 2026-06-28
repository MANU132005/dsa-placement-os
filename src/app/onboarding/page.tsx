'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '@/context/AuthContext'
import { 
  Building2, 
  Target, 
  Calendar, 
  Moon, 
  Sun, 
  ArrowRight, 
  ArrowLeft, 
  Check, 
  Sparkles,
  Trophy
} from 'lucide-react'

export default function OnboardingPage() {
  const { completeOnboarding, user } = useAuth()
  const [step, setStep] = useState(1)

  // Step States
  const [dailyGoal, setDailyGoal] = useState<number>(10)
  const [customGoal, setCustomGoal] = useState<string>('')
  const [useCustomGoal, setUseCustomGoal] = useState(false)
  const [selectedCompanies, setSelectedCompanies] = useState<string[]>([
    'Accenture', 'Infosys', 'Capgemini', 'Deloitte', 'EY'
  ])
  const [currentYear, setCurrentYear] = useState('3rd Year')
  const [theme, setTheme] = useState<'light' | 'dark'>('dark')

  const availableCompanies = [
    'Accenture', 'Infosys', 'Capgemini', 'Deloitte', 'EY', 
    'Cognizant', 'Oracle', 'JP Morgan', 'Virtusa', 'LTIMindtree'
  ]

  const handleCompanyToggle = (company: string) => {
    if (selectedCompanies.includes(company)) {
      setSelectedCompanies(selectedCompanies.filter((c) => c !== company))
    } else {
      setSelectedCompanies([...selectedCompanies, company])
    }
  }

  const handleNext = () => {
    setStep((s) => s + 1)
  }

  const handleBack = () => {
    setStep((s) => s - 1)
  }

  const handleFinish = () => {
    const finalGoal = useCustomGoal ? (parseInt(customGoal) || 10) : dailyGoal
    completeOnboarding(finalGoal, selectedCompanies, currentYear, theme)
  }

  // Animation variants
  const slideVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 }
  }

  return (
    <div className="fixed inset-0 bg-background flex items-center justify-center p-4 transition-colors duration-200">
      
      {/* Background Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent -z-10 pointer-events-none" />

      {/* Main card */}
      <div className="w-full max-w-lg bg-card border border-border rounded-xl p-8 shadow-xl min-h-[420px] flex flex-col justify-between">
        
        {/* Progress bar */}
        <div className="w-full h-1 bg-secondary rounded-full overflow-hidden">
          <div 
            className="h-full bg-primary transition-all duration-300"
            style={{ width: `${(step / 5) * 100}%` }}
          />
        </div>

        {/* Dynamic Wizard Steps */}
        <div className="my-6 flex-1 flex flex-col justify-center">
          <AnimatePresence mode="wait">
            
            {/* STEP 1: Welcome */}
            {step === 1 && (
              <motion.div
                key="step1"
                variants={slideVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ duration: 0.2 }}
                className="flex flex-col gap-4 text-center items-center"
              >
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <Sparkles className="w-6 h-6 animate-pulse" />
                </div>
                <h2 className="text-2xl font-black text-foreground tracking-tight">
                  Welcome to Placement OS
                </h2>
                <p className="text-sm text-muted-foreground leading-relaxed max-w-sm">
                  Hello {user?.name || 'Developer'}! Let's personalize your prep goals, watchlist targets, and layout configurations.
                </p>
              </motion.div>
            )}

            {/* STEP 2: Daily Goal */}
            {step === 2 && (
              <motion.div
                key="step2"
                variants={slideVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ duration: 0.2 }}
                className="flex flex-col gap-4"
              >
                <div className="flex items-center gap-2 border-b border-border/50 pb-2">
                  <Target className="w-5 h-5 text-primary" />
                  <h3 className="text-lg font-bold text-foreground">Set Daily Target</h3>
                </div>
                <p className="text-xs text-muted-foreground">
                  How many coding problems do you want to solve every day?
                </p>

                <div className="grid grid-cols-2 gap-2 text-xs font-semibold mt-1">
                  {[5, 10, 15, 20].map((goal) => (
                    <button
                      key={goal}
                      type="button"
                      onClick={() => {
                        setDailyGoal(goal)
                        setUseCustomGoal(false)
                      }}
                      className={`py-3 rounded-lg border text-center transition-all ${
                        dailyGoal === goal && !useCustomGoal
                          ? 'border-primary bg-accent text-accent-foreground shadow-sm'
                          : 'border-border bg-card text-muted-foreground hover:bg-secondary'
                      }`}
                    >
                      {goal} Problems
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => setUseCustomGoal(true)}
                    className={`py-3 rounded-lg border text-center transition-all ${
                      useCustomGoal
                        ? 'border-primary bg-accent text-accent-foreground shadow-sm'
                        : 'border-border bg-card text-muted-foreground hover:bg-secondary'
                    }`}
                  >
                    Custom Goal
                  </button>
                </div>

                {useCustomGoal && (
                  <input
                    type="number"
                    min={1}
                    placeholder="Enter custom count..."
                    value={customGoal}
                    onChange={(e) => setCustomGoal(e.target.value)}
                    className="w-full bg-secondary/30 border border-border rounded-lg px-3 py-2 text-xs focus:outline-none mt-2"
                  />
                )}
              </motion.div>
            )}

            {/* STEP 3: Target Companies */}
            {step === 3 && (
              <motion.div
                key="step3"
                variants={slideVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ duration: 0.2 }}
                className="flex flex-col gap-4"
              >
                <div className="flex items-center gap-2 border-b border-border/50 pb-2">
                  <Building2 className="w-5 h-5 text-primary" />
                  <h3 className="text-lg font-bold text-foreground">Select Target Companies</h3>
                </div>
                <p className="text-xs text-muted-foreground">
                  Select which companies you are targeting for campus placements (Multi-select)
                </p>

                <div className="flex flex-wrap gap-2 text-xs font-semibold mt-1 max-h-[160px] overflow-y-auto pr-1">
                  {availableCompanies.map((comp) => {
                    const isSelected = selectedCompanies.includes(comp)
                    return (
                      <button
                        key={comp}
                        type="button"
                        onClick={() => handleCompanyToggle(comp)}
                        className={`px-3 py-2 rounded-lg border transition-all flex items-center gap-1.5 ${
                          isSelected
                            ? 'border-primary bg-accent text-accent-foreground shadow-sm'
                            : 'border-border bg-card text-muted-foreground hover:bg-secondary'
                        }`}
                      >
                        {isSelected && <Check className="w-3.5 h-3.5" />}
                        {comp}
                      </button>
                    )
                  })}
                </div>
              </motion.div>
            )}

            {/* STEP 4: Academic Year */}
            {step === 4 && (
              <motion.div
                key="step4"
                variants={slideVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ duration: 0.2 }}
                className="flex flex-col gap-4"
              >
                <div className="flex items-center gap-2 border-b border-border/50 pb-2">
                  <Calendar className="w-5 h-5 text-primary" />
                  <h3 className="text-lg font-bold text-foreground">Academic Year</h3>
                </div>
                <p className="text-xs text-muted-foreground">
                  Which academic year are you currently studying in?
                </p>

                <div className="flex flex-col gap-2 font-semibold text-xs mt-1">
                  {['2nd Year', '3rd Year', '4th Year'].map((year) => (
                    <button
                      key={year}
                      type="button"
                      onClick={() => setCurrentYear(year)}
                      className={`w-full py-3 rounded-lg border text-left px-4 transition-all ${
                        currentYear === year
                          ? 'border-primary bg-accent text-accent-foreground shadow-sm'
                          : 'border-border bg-card text-muted-foreground hover:bg-secondary'
                      }`}
                    >
                      {year}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* STEP 5: Theme selection */}
            {step === 5 && (
              <motion.div
                key="step5"
                variants={slideVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ duration: 0.2 }}
                className="flex flex-col gap-4"
              >
                <div className="flex items-center gap-2 border-b border-border/50 pb-2">
                  <Sun className="w-5 h-5 text-primary" />
                  <h3 className="text-lg font-bold text-foreground">Preferred Theme</h3>
                </div>
                <p className="text-xs text-muted-foreground">
                  Select your interface theme preference (Light/Dark mode)
                </p>

                <div className="grid grid-cols-2 gap-4 mt-2">
                  {/* Light theme */}
                  <button
                    type="button"
                    onClick={() => setTheme('light')}
                    className={`flex flex-col items-center gap-2 p-5 border rounded-xl font-bold text-xs transition-all ${
                      theme === 'light'
                        ? 'border-primary bg-accent text-accent-foreground shadow-sm'
                        : 'border-border bg-card text-muted-foreground hover:bg-secondary'
                    }`}
                  >
                    <Sun className="w-6 h-6 text-amber-500" />
                    <span>Light Mode</span>
                  </button>

                  {/* Dark theme */}
                  <button
                    type="button"
                    onClick={() => setTheme('dark')}
                    className={`flex flex-col items-center gap-2 p-5 border rounded-xl font-bold text-xs transition-all ${
                      theme === 'dark'
                        ? 'border-primary bg-accent text-accent-foreground shadow-sm'
                        : 'border-border bg-card text-muted-foreground hover:bg-secondary'
                    }`}
                  >
                    <Moon className="w-6 h-6 text-blue-500" />
                    <span>Dark Mode</span>
                  </button>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>

        {/* Bottom Actions */}
        <div className="flex justify-between items-center border-t border-border pt-4 text-xs font-semibold mt-2">
          {step > 1 ? (
            <button
              onClick={handleBack}
              className="flex items-center gap-1 px-4 py-2 border border-border rounded-lg text-muted-foreground hover:bg-secondary transition-all"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>
          ) : (
            <div />
          )}

          {step < 5 ? (
            <button
              onClick={handleNext}
              className="flex items-center gap-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg shadow hover:opacity-90 transition-all"
            >
              <span>Continue</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              onClick={handleFinish}
              className="flex items-center gap-1.5 px-4 py-2 bg-primary text-primary-foreground rounded-lg shadow hover:opacity-90 transition-all"
            >
              <Check className="w-4 h-4" />
              <span>Complete Setup</span>
            </button>
          )}
        </div>

      </div>
    </div>
  )
}
