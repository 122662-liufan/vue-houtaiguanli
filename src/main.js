import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";

// 全局引用 element-ui
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
Vue.use(ElementUI);

Vue.config.productionTip = false;

// 可以删除
// import './styles/main.scss'

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount("#app");
