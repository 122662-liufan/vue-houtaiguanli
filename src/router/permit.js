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
      store.commit('app/SET_USERNAME', '')
      store.commit('app/SET_TOKEN', '')
      //  存在，就是登陆了
      next()
    } else {
      // 权限判断 --> 创建动态路由
      // 1.时机 ： ok
      // 2.条件： 当前用户有什么权限 --> 
      if (store.getters['role/addRouter'].length == 0) {
        store.dispatch('role/getRoles').then(res => {

          // 获取权限
          const roles = res
          // 根据权限结合路由 创建动态路由
          store.dispatch('role/createdRole', roles).then(res => {
            // 获取经过过滤的该用户的路由对象
            const addRouter = store.getters['role/addRouter']
            const allRouter = store.getters['role/allRouter']
            router.options.routes = allRouter
            // console.log('-->>>>>>', allRouter);
            // 添加到全局的路由对象
            router.addRoutes(addRouter)
            //  存在，就是登陆了
            next({ ...to })
          })
        })
      } else {
        //  存在，就是登陆了
        next()
      }

    }

  } else {
    if (writeRouter.indexOf(to.path) !== -1) {
      next()
    } else {
      // token不存在 就是未登录 跳转到登录，执行登陆
      next('/login')
    }
  }
})
// LiuFan122662@qq.com