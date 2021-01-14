import { get_roles } from "@/api/login";
import { roleRouter, defaultRoutes } from '@/router/index'
// import router from "../../router";
const checkRouter = (router, roles) => {
  // router.meta.role ==> ['salesman']
  // roles ==> ['salesman', 'technology']
  return roles.some(role => {
    return router.meta.role.indexOf(role) >= 0
  })
}
const changeButton = (arr, flag_arr = ['user', 'info']) => {
  let _arr = []
  arr.map(item => {
    flag_arr.map(flag => {
      if (item.split('.')[0] == flag) {
        if (!_arr.includes(`${flag}.index`)) {
          _arr.push(`${flag}.index`)
        }
      }
    })
    _arr.push(item)

  })
  return _arr
}
const state = {
  addRouter: [], //根据权限过滤后的路由信息
  allRouter: defaultRoutes, //所有的路由
  premButton: []
};
const getters = {
  addRouter: state => state.addRouter,
  allRouter: state => state.allRouter,
  premButton: state => state.premButton
};
const mutations = {
  SET_ROUTER (state, data) {
    state.addRouter = data
    state.allRouter = [...state.allRouter, ...data]
  },
  SET_PREMBUTTON (state, data) {
    state.premButton = data
  }
};

const actions = {
  // 获取用户的角色
  getRoles ({ commit }) {
    return new Promise((resolve, reject) => {

      get_roles({}).then(res => {
        // console.log(res.data.data);
        // {
        // btnPerm: []
        // button: (2) ["info.edit", "info.delete","info.index","user.delete","user.index"]
        // role: ["admin"]  // admin 管理员 salesman 业务员 technology 技术员 manager 经理
        // }
        resolve({
          btnPerm: [],
          button: ['info.edit', 'info.delete', 'info.cate', 'user.delete', 'user.add', 'user.cate'],
          role: ["salesman"]
        })
      })
    })
  },
  createdRole ({ commit }, roles) {
    return new Promise((resolve, reject) => {
      //根据 只要有修改或删除或新增就有查看的权限  info:index
      roles.button = changeButton(roles.button)
      commit('SET_PREMBUTTON', roles.button)
      let tmpRouters = []
      //业务：筛选 根据 roles 的权限 结合 动态路由 生成 可以访问的路由
      if (roles.role.includes('admin')) {
        tmpRouters = roleRouter
      } else {
        tmpRouters = roleRouter.filter(item => {
          if (checkRouter(item, roles.role)) {
            if (item.children && item.children.length > 0) {

              item.children = item.children.filter(item_ => {
                if (checkRouter(item_, roles.button)) {
                  return item_
                }
              })
            }
            return item
          }
        })
      }
      // tmpRouters = [roleRouter[1]]
      commit('SET_ROUTER', tmpRouters)
      resolve()

    })
  }

};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
};
