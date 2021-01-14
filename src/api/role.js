import { reactive } from '@vue/composition-api';
import axios from "@/utils/request.js"
// 多个组件之间，只要是重新调用了，组件之间的相应是不存在的
export const getRoles = () => {
  //分类信息
  const button = reactive({

  })

  return {
    button,

  }
}
