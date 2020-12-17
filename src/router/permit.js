import router from './index.js'
import { getToken } from '../utils/cookie.js'
import { removeUsername, removeToken } from "../utils/cookie";
import store from '../store/'
// 白名单 ： 未登录状态下可以访问的路由
const writeRouter = ['/login', '/home', '/detail']

// 路由守卫的相关逻辑
router.beforeEach((to, from, next) => {
  // 判断登录的唯一标识就是togen是否登录
  if (getToken()) {
    // 如果访问的是login的话就是要重新登录
    if (to.path == '/login') {
      removeUsername()
      removeToken()
      // 清理vuex中的数据
      store.commit('app/SET_UERNAME', '')
      store.commit('app/SET_TOKEN', '')
    }
    //  存在，就是登陆了
    next()
  } else {
    if (writeRouter.indexOf(to.path) !== -1) {
      next()
    } else {
      // token不存在 就是未登录 跳转到登录，执行登陆
      next('/login')
    }
  }

})
