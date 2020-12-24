import axios from "@/utils/request.js"
// 添加一级分类
export const add_first_category = (data) => {
  return axios.request({
    method: "post",
    url: "/news/addFirstCategory/",
    data: data
  })
}
// 获取所有分类信息
export const get_all_category = (data) => {
  return axios.request({
    method: "post",
    // 有子分类
    url: "/news/getCategoryAll/",
    data: data
  })
}

// 添加二级分类
export const add_seccond_category = (data) => {
  return axios.request({
    method: "post",
    // 有子分类
    url: "/news/addChildrenCategory/",
    data: data
  })
}

// 删除一级分类
export const delete_first_Category = (data) => {
  return axios.request({
    method: "post",
    url: "/news/deleteCategory/",
    data: data
  })
}
// 编辑一级和二级分类
export const edit_Category = (data) => {
  return axios.request({
    method: "post",
    url: "/news/editCategory/",
    data: data
  })
}

// 添加信息

export const add_new = (data) => {
  return axios.request({
    method: "post",
    url: "/news/add/",
    data: data
  })
}

// 获取信息

export const get_news = (data) => {
  return axios.request({
    method: "post",
    url: "/news/getList/",
    data: data
  })
}

// 删除

export const delete_news = (data) => {
  return axios.request({
    method: "post",
    url: "/news/deleteInfo/",
    data: data
  })
}

// 编辑修改信息
export const edit_news = (data) => {
  return axios.request({
    method: "post",
    url: "/news/editInfo/",
    data: data
  })
}