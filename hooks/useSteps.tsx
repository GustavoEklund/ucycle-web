import React from 'react'
import { useRouter } from 'next/router'

type UseStepReturnType = {
  activeStep: number
  isLastStep: boolean
  nextStep: () => void
  prevStep: () => void
  setStep: (step: number) => void
  reset: () => void
}

export const useSteps = (props: {
  initialStep: number
  maxSteps: number
}): UseStepReturnType => {
  const router = useRouter()
  const [activeStep, setActiveStep] = React.useState(props.initialStep)
  const routerRef = React.useRef(router)

  const isLastStep = activeStep === props.maxSteps - 1

  const nextStep = () => {
    setActiveStep((prevStep) => Math.min(prevStep + 1, props.maxSteps))
  }

  const prevStep = () => {
    setActiveStep((prevStep) => Math.max(prevStep - 1, 1))
  }

  const setStep = (step: number) => {
    setActiveStep(Math.min(Math.max(step, 1), props.maxSteps))
  }

  const reset = () => {
    setActiveStep(props.initialStep)
  }

  React.useEffect(() => {
    const path = `${routerRef.current.pathname}?step=${activeStep}`
    routerRef.current.push(path, undefined, { shallow: true }).then(() => Promise.resolve())
  }, [activeStep])

  React.useEffect(() => {
    const step = parseInt(String(router.query.step))
    if (step >= 1 && step <= props.maxSteps) {
      return setActiveStep(step)
    }
    setActiveStep(props.initialStep)
  }, [props.initialStep, props.maxSteps, router])

  return {
    activeStep,
    isLastStep,
    nextStep,
    prevStep,
    setStep,
    reset,
  }
}

export default useSteps
