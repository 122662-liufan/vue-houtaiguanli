import { reactive } from '@vue/composition-api';
import axios from "@/utils/request.js"
// 多个组件之间，只要是重新调用了，组件之间的相应是不存在的
export const page = () => {
  //分类信息
  const pageData = reactive({
    total: 0,
    page_sizes: [2, 3, 4, 5, 8, 10],
    page_size: 5,
    current_page: 1,
  })
  const setTotal = (total) => {
    pageData.total = total
  }
  const current_change = pageNumber => {
    pageData.current_page = pageNumber
  }
  const size_change = pageSize => {
    pageData.page_size = pageSize
  }
  return {
    pageData,
    setTotal,
    current_change,
    size_change
  }
}
