import { reactive } from '@vue/composition-api';
import { loadTableData } from '@/api/common.js'
// 多个组件之间，只要是重新调用了，组件之间的相应是不存在的
export const loadData = () => {
  //分类信息
  const tableData = reactive({
    item: [],
    total: 0
  })
  const tableLoadData = (requestData) => {
    // 发送请求
    loadTableData(requestData).then(res => {
      tableData.item = res.data.data.data
      tableData.total = res.data.data.total
    })
  }
  return {
    tableData,
    tableLoadData
  }
}
