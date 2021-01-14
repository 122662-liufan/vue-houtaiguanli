import Vue from "vue";
import VueRouter from "vue-router";


Vue.use(VueRouter);
export const defaultRoutes = [
  // 都能访问的公共路由
  {
    path: "/",
    redirect: "/home",
    // 隐藏
    hidden: true,
    meta: {
      name: ""
    },
  },
  {
    path: "/login",
    name: "Login",
    // 隐藏
    hidden: true,
    meta: {
      name: "登录"
    },
    component: () => import("../views/Login/index.vue")
  },
  {
    path: "/home",
    name: "Home",
    // 显示
    hidden: false,
    // 自定义属性
    meta: {
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
        meta: {
          name: "首页",
          // 代表要缓存，不需要缓存的话设置 false
          keep: true

        },
        component: () => import("../views/Home/index.vue"),
      }
    ]
  },
];

export const roleRouter = [
  // 权限选择的路由

  {
    path: "/info",
    name: "Info",
    // 显示
    hidden: false,
    // 自定义属性
    meta: {
      name: "信息管理",
      icon: 'info',
      role: ['salesman']
    },
    component: () => import("../views/Layout/index.vue"),
    children: [
      {
        path: "/info",
        name: "infoIndex",
        meta: {
          name: "信息列表",
          // 代表要缓存
          keep: true,
          role: ['info.index']
        },
        component: () => import("../views/Info/index.vue"),
      },
      {
        path: "/infoCate",
        name: "infoCate",
        meta: {
          name: "信息分类",
          // 代表要缓存
          keep: true,
          role: ['info.cate']
        },
        component: () => import("../views/Info/cate.vue"),
      },
      {
        path: "/infoDetail",
        name: "infoDetail",
        // 隐藏
        hidden: true,
        meta: {
          name: "消息详情",
          // 代表要缓存
          keep: true,
          role: ['info.detail']
        },
        component: () => import("../views/Info/detail.vue"),
      }

    ]
  },
  {
    path: "/user",
    name: "User",
    // 显示
    hidden: false,
    // 自定义属性
    meta: {
      name: "用户管理",
      icon: 'user',
      role: ['salesman']
    },
    component: () => import("../views/Layout/index.vue"),
    children: [
      {
        path: "/userIndex",
        name: "userIndex",
        meta: {
          name: "用户管理",
          // 代表不要缓存
          keep: false,
          role: ['user.index']
        },
        component: () => import("../views/User/index.vue"),
      },
      {
        path: "/userCate",
        name: "userCate",
        meta: {
          name: "用户分类",
          // 代表要缓存 
          keep: true,
          role: ['user.cate']
        },
        component: () => import("../views/User/cate.vue"),
      }
    ]
  }
]

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes: defaultRoutes
});

export default router;
