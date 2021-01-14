export const getCity = (key) => {
  return localStorage.getItem(key)
}
export const setCity = (key, value) => {
  localStorage.setItem(key, value)
}
