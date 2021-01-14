import axios from "@/utils/request.js"
// 获取用户
export const get_users = (data) => {
  return axios.request({
    method: "post",
    url: "/user/getList/",
    data: data
  })
}

// 添加用户
export const add_user = (data) => {
  return axios.request({
    method: "post",
    url: "/user/add/",
    data: data
  })
}
// 删除用户
export const del_user = (data) => {
  return axios.request({
    method: "post",
    url: "/user/delete/",
    data: data
  })
}
// 修改用户
export const edit_user = (data) => {
  return axios.request({
    method: "post",
    url: "/user/edit/",
    data: data
  })
}
// 更改用户启用和禁用状态
export const change_status_user = (data) => {
  return axios.request({
    method: "post",
    url: "/user/actives/",
    data: data
  })
}
// 角色
export const get_role = (data) => {
  return axios.request({
    method: "post",
    url: "/role/",
    data: data
  })
}
// 权限
export const get_permission = (data) => {
  return axios.request({
    method: "post",
    url: "/permButton/",
    data: data
  })
}