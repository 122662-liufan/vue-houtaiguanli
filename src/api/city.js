import axios from "@/utils/request.js"
// 获取省信息
export const get_city = (data) => {
  return axios.request({
    method: "post",
    url: "/cityPicker/",
    data: data
  })
}
