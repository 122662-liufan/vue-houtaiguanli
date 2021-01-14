import { MessageBox } from 'element-ui';
// 某个方法需要频繁用到，又不想每次都引入，用Plugin一次引入，多地调用
export default {
  install (Vue) {
    Vue.prototype.confirm = ({ content, tip, type, center, callback }) => {
      MessageBox
        .confirm(content, tip, {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: type,
          center: center
        })
        .then(() => {
          // 如果存在就调用
          callback && callback()
        })
        .catch(() => {

        })
    }
  }
}