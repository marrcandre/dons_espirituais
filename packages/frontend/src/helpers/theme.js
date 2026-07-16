export function syncTheme(theme) {
  document.documentElement.classList.toggle('dark', theme === 'dark')
}
