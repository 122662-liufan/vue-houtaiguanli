const state = {
  id: '' || sessionStorage.getItem('id'),
  content: '' || sessionStorage.getItem('content'),
};

const mutations = {
  CACHE_PARAMS (state, params) {
    for (let item in params) {
      state[item] = params[item].value
      if (params[item].session) {
        // 保存到session
        sessionStorage.setItem(params[item].key, params[item].value)
      }
    }
  }
};
const getters = {
  id: state => state.id,
  content: state => state.content
};
const actions = {

};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
};
