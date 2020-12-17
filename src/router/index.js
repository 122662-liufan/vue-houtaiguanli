import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);
const routes = [
  {
    path: "/",
    redirect: "/home",
    // 隐藏
    hidden: true,
    mate: {
      name: ""
    },
  },
  {
    path: "/home",
    name: "Home",
    // 显示
    hidden: false,
    // 自定义属性
    mate: {
      name: "控制台",
      icon: 'console'
    },
    component: () => import("../views/Layout/index.vue"),
    // 默认的首页
    redirect: "/index",
    children: [
      {
        path: "/index",
        name: "HomeIndex",
        mate: {
          name: "首页"
        },
        component: () => import("../views/Home/index.vue"),
      }
    ]
  },
  {
    path: "/info",
    name: "Info",
    // 显示
    hidden: false,
    // 自定义属性
    mate: {
      name: "信息管理",
      icon: 'info'
    },
    component: () => import("../views/Layout/index.vue"),
    children: [
      {
        path: "/info",
        name: "infoIndex",
        mate: {
          name: "信息列表"
        },
        component: () => import("../views/Info/index.vue"),
      },
      {
        path: "/infoCate",
        name: "infoCate",
        mate: {
          name: "信息分类"
        },
        component: () => import("../views/Info/cate.vue"),
      }
    ]
  },
  {
    path: "/user",
    name: "User",
    // 显示
    hidden: false,
    // 自定义属性
    mate: {
      name: "用户管理",
      icon: 'user'
    },
    component: () => import("../views/Layout/index.vue"),
    children: [
      {
        path: "/userIndex",
        name: "userIndex",
        mate: {
          name: "用户管理"
        },
        component: () => import("../views/User/index.vue"),
      },
      {
        path: "/userCate",
        name: "userCate",
        mate: {
          name: "用户分类"
        },
        component: () => import("../views/User/cate.vue"),
      }
    ]
  },
  {
    path: "/login",
    name: "Login",
    // 隐藏
    hidden: true,
    mate: {
      name: "登录"
    },
    component: () => import("../views/Login/index.vue")
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

export default router;
