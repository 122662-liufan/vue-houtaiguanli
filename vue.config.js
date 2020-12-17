// 模块化导入path commn.js
const path = require("path");
// console.log('项目的绝对路径', _dirname);
// 输出绝对路径 C:\Users\平凡的世界\Desktop\vue-houtaiguanli\src\components~
// console.log('某个目录的绝对路径', path.resolve(__dirname, './src/components'));
module.exports = {
  // 基本路径
  publicPath: process.env.NODE_ENV == 'production' ? '' : '/',
  lintOnSave: false,//是否开启语法检测
  css: {
    // 是否使用css分离插件 ExtractTextPlugin
    extract: true,
    // 开启 CSS source maps?
    sourceMap: true,
    // css预设器配置项a
    loaderOptions: {
      scss: {
        prependData: `@import "./src/styles/main.scss";`
      }
    },
  },
  // 配置解析 svg 的 loder
  chainWebpack: (config) => {
    const svgRule = config.module.rule("svg");
    svgRule.uses.clear();
    svgRule
      .use("svg-sprite-loader")
      .loader("svg-sprite-loader")
      .options({
        symbolId: "icon-[name]",
        include: ["./src/icons"]
      });

  },
  // 配置目录别名
  configureWebpack: (config) => {
    config.resolve = {
      alias: {
        // 获取绝对路径  
        "@": path.resolve(__dirname, './src'),
        "@c": path.resolve(__dirname, './src/components'),
        "@a": path.resolve(__dirname, './src/assets'),
        "@p": path.resolve(__dirname, './public'),
        // 以vue结尾的
        vue$: "vue/dist/vue.esm.js"
      },
      // 引入文件的时候不写后缀，默认加载
      extensions: ['.js', '.json', '.vue']
    }
  },

  // 代理 devSever本地服务器的意思
  devServer: {
    port: 8080,
    open: true, //启动项目打开浏览器
    // 以 /api 都需要代理
    proxy: {
      // http://localhost:8010/api/getSms
      // http://www.web-jshtml.cn/productapi/
      // 需要替换成
      // http://www.web-jshtml.cn/productapi/api/getSms
      // Neteork 所展示的地址  /productapi/api/getSms 需要去掉 api
      // http://www.web-jshtml.cn/productapi/getSms 没有token业务的接口
      // http://www.web-jshtml.cn/productapi/token/getSms  有token业务的接口
      '/api': {
        // 启动的目标服务器
        // target: 'http://www.web-jshtml.cn/productapi/',没有token业务的接口  http://localhost:8010/api/getSms  目标接口
        // changeOrigin: true,  //是否跨域 自动生成一个localhost:8010 端口，域名下的node服务器，帮忙做代理
        // // 重新 url
        target: 'http://www.web-jshtml.cn/productapi/token/',
        pathRewrite: {
          '^/api': ''
        }
      }
    }
  }
}

