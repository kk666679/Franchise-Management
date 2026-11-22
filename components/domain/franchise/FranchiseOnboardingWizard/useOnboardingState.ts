'use client'

import { useCallback, useState } from 'react'
import type { OnboardingStep, OnboardingValues } from './FranchiseOnboardingWizard.types'

const ORDER: OnboardingStep[] = ['organization', 'franchise', 'territory', 'contract', 'review']

export function useOnboardingState(initial?: Partial<OnboardingValues>) {
  const [step, setStep] = useState<OnboardingStep>('organization')
  const [values, setValues] = useState<Partial<OnboardingValues>>(initial ?? {})

  const index = ORDER.indexOf(step)
  const canBack = index > 0
  const canNext = index < ORDER.length - 1

  const next = useCallback(() => canNext && setStep(ORDER[index + 1]), [canNext, index])
  const back = useCallback(() => canBack && setStep(ORDER[index - 1]), [canBack, index])
  const merge = useCallback(
    <K extends keyof OnboardingValues>(key: K, val: OnboardingValues[K]) =>
      setValues((v) => ({ ...v, [key]: val })),
    [],
  )

  return { step, steps: ORDER, values, next, back, merge }
}
