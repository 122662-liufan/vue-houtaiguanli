
import Vue from "vue";
import SvgIcon from './components/SvgIcon.vue'
// 声明全局组件
Vue.component("svg-icon", SvgIcon)

// 读取 svg 文件  .svg/名字.svg
/*
第一个：目录
第二个：是否遍历子级目录
第三个：定义遍历文件规则
*/
// 1. 读取 svg /名字.svg  转化成wedpack能访问的资源（对象）
const req = require.context('./svg', false, /\.svg$/)
// console.log(req.keys())  //所有个数
// 解析遍历svg文件
req.keys().map(req)
// 2.配置wedpack

// 3.下载loder
// npm install svg-sprite-loader -S
// yarn add svg-sprite-loader -D
// yarn add svg-sprite-loader -S



