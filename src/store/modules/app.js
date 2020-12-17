import { do_login } from "../../api/login.js";
import {
  setUsername,
  setToken,
  getUsername,
  getToken,
  removeUsername,
  removeToken
} from "../../utils/cookie";
const state = {
  // 存在用本地，不存在false
  isCollapse: JSON.parse(sessionStorage.getItem("isCollapse")) || false, //展开
  token: getToken() || "",
  username: getUsername() || ""
};
const getters = {
  isCollapse: () => state.isCollapse
};
const mutations = {
  SET_COLLAPSE (state, payload) {
    state.isCollapse = !state.isCollapse;
    // 将此时的状态保存在本地存储
    // localStorage
    sessionStorage.setItem("isCollapse", JSON.stringify(state.isCollapse));
  },

  // 设置用户
  SET_USERNAME (state, value) {
    state.username = value;
  },
  // 设置token
  SET_TOKEN (state, value) {
    state.token = value;
  }
};

const actions = {
  // 登录 action
  login ({ commit }, data) {
    // 发起网络请求
    // console.log(data)
    return new Promise((resolve, reject) => {
      // 发起网络请求
      do_login(data)
        .then(res => {
          const { username, token } = res.data.data;
          // 通过同步的方式将数据更新到  state 中
          commit("SET_USERNAME", username);
          commit("SET_TOKEN", token);
          console.log(res);
          // 以cook的方式存放到浏览器缓存
          setUsername(username);
          setToken(token);
          resolve(res);
        })
        .catch(err => {
          // reject(err)
        });
    });
  },
  exit ({ commit }) {
    return new Promise((resolve, reject) => {
      removeUsername();
      removeToken();
      commit("SET_USERNAME", "");
      commit("SET_TOKEN", "");
      resolve();
    });
  }
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
};
