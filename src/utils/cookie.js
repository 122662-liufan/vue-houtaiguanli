import cookie from 'cookie_js'

const username = 'admin_username'
const token = 'admin_token'
// 设置用户
export const setUsername = (value) => {
  return cookie.set(username, value)
}
// 获取用户
export const getUsername = () => {
  return cookie.get(username)
}
// 清空用户
export const removeUsername = () => {
  return cookie.remove(username)
}

// 设置token
export const setToken = (value) => {
  return cookie.set(token, value)
}
// 获取token
export const getToken = () => {
  return cookie.get(token)
}
// 清空token
export const removeToken = () => {
  return cookie.remove(token)
}
