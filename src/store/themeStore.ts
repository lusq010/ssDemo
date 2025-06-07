import { create } from 'zustand'

interface ThemeState {
  mode: 'light' | 'dark'
  toggleMode: () => void
}

const getInitialMode = (): 'light' | 'dark' => {
  const saved = localStorage.getItem('theme-mode')
  return saved === 'dark' ? 'dark' : 'light'
}

const useThemeStore = create<ThemeState>((set) => ({
  mode: getInitialMode(),
  toggleMode: () => set((state) => {
    const newMode = state.mode === 'light' ? 'dark' : 'light'
    localStorage.setItem('theme-mode', newMode)
    return { mode: newMode }
  }),
}))

export default useThemeStore 