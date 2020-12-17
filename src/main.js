import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
// 导入路由权限限制
import './router/permit.js'
// 全局引用 element-ui
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
// vue3.0 
import VueCompositionApi from '@vue/composition-api';
// 导入全局图标组件
import './icons/'
Vue.use(ElementUI);
Vue.use(VueCompositionApi);
// 系统默认的环境变量
// console.log(process.env)
/*
可以自定义环境变量
如果是线下 npm run serve
 -----默认读取 .env.development
如果是线上 npm run build
 -----默认读取 .env.production
*/


// 声明一个全局组件
// Vue.component('Demo', {
//   template: `
//     <div>
//       <button @click="getMes">{{ msg }}</button>
//     </div>`,
//   data: function () {
//     return {
//       msg: '后台管理系统'
//     }
//   },
//   methods: {
//     getMes: function () {
//       // 执行函数
//       console.log('xxx');
//     }
//   }
// });


Vue.config.productionTip = false;

// const originalPush = VueRouter.prototype.push;
// VueRouter.prototype.push = function push (location) {
//   return originalPush.call(this, location).catch(err => err)
// }
// 可以删除
// import './styles/main.scss'

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");

