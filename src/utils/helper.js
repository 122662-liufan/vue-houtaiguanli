// MessageBox.confirm 全局调用参数与全局方法相同。
import { MessageBox } from 'element-ui';
// 第二种 自定义方法 解构传参
export const confirm = ({ content, tip, type, center, callback }) => {
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

// 第三种  用promise来解决
// export const confirm = ({ content, tip, type, center }) => {
//   return new Promise((resolve, reject) => {
//     MessageBox
//       .confirm(content, tip, {
//         confirmButtonText: '确定',
//         cancelButtonText: '取消',
//         type: type,
//         center: center
//       })
//       .then(() => {
//         // 如果存在就调用
//         resolve('确定')
//       })
//       .catch(() => {
//         reject('取消')
//       })
//   })
// }




// 第一种 传参解决 root 
// export const confirm = (root) => {
//   root
//     .$confirm('确定删除此信息？', '提示', {
//       confirmButtonText: '确定',
//       cancelButtonText: '取消',
//       type: 'warning',
//       center: true,
//     })
//     .then(() => {
//       root.$message({
//         type: 'success',
//         message: '删除成功!',
//       })
//     })
//     .catch(() => {
//       root.$message({
//         type: 'info',
//         message: '已取消删除',
//       })
//     })
// }