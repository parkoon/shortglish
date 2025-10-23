import { create } from 'zustand'

type IsSentenceUpdatedStore = {
  isSentenceUpdated: boolean
  setIsSentenceUpdated: (isSentenceUpdated: boolean) => void
}

export const useIsSentenceUpdatedStore = create<IsSentenceUpdatedStore>(set => ({
  isSentenceUpdated: false,
  setIsSentenceUpdated: isSentenceUpdated => set({ isSentenceUpdated }),
}))

export const useIsSentenceUpdated = () => {
  const { isSentenceUpdated, setIsSentenceUpdated } = useIsSentenceUpdatedStore()
  return { isSentenceUpdated, setIsSentenceUpdated }
}
