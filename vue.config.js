// 模块化导入path commn.js
const path = require("path");
// console.log('项目的绝对路径', _dirname);
// 输出绝对路径 C:\Users\平凡的世界\Desktop\vue-houtaiguanli\src\components~
// console.log('某个目录的绝对路径', path.resolve(__dirname, './src/components'));
module.exports = {
    lintOnSave: false,//是否开启语法检测
    css: {
        // 是否使用css分离插件 ExtractTextPlugin
        extract: true,
        // 开启 CSS source maps?
        sourceMap: true,
        // css预设器配置项
        loaderOptions: {
            scss: {
                prependData: `@import "./src/styles/main.scss";`
            }
        },
    },
    // 配置目录别名
    configureWebpack: (config) => {
        config.resolve = {
            alias: {
                // 获取绝对路径
                "@c": path.resolve(__dirname, './src/components'),
                "@a": path.resolve(__dirname, './src/assets'),
                "@p": path.resolve(__dirname, './public'),
                // 以vue结尾的
                vue$: "vue/dist/vue.esm.js"
            },
            // 引入文件的时候不写后缀，默认加载
            extensions: ['.js', '.json', '.vue']
        }
    }
}