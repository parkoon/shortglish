import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type OnBoardingStore = {
  isFirstSaveDialogue: boolean
  setFirstSaveDialogue: (value: boolean) => void

  isFirstPageView: boolean
  setFirstPageView: (value: boolean) => void
}

export const useOnBoardingStore = create<OnBoardingStore>()(
  persist(
    set => ({
      isFirstSaveDialogue: true,
      setFirstSaveDialogue: (value: boolean) => set({ isFirstSaveDialogue: value }),

      isFirstPageView: true,
      setFirstPageView: (value: boolean) => set({ isFirstPageView: value }),
    }),
    {
      name: 'bandi.onboarding',
    },
  ),
)

export const useOnBoarding = () => {
  const { isFirstSaveDialogue, setFirstSaveDialogue, isFirstPageView, setFirstPageView } =
    useOnBoardingStore()
  return { isFirstSaveDialogue, setFirstSaveDialogue, isFirstPageView, setFirstPageView }
}
