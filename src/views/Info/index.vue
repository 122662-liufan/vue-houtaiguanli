<template>
  <div id="index">
    <div class="space-24"></div>
    <el-row :gutter="14">
      <el-col :span="4">
        <div class="label-warp category">
          <label for="category">类型 :</label>
          <div class="warp-content">
            <el-select
              id="category"
              v-model="category_value"
              placeholder="请选择"
            >
              <el-option
                v-for="cate in category.item"
                :key="cate.id"
                :label="cate.category_name"
                :value="cate.id"
              >
              </el-option>
            </el-select>
          </div>
        </div>
      </el-col>

      <el-col :span="7">
        <div class="label-warp date">
          <label for="date">日期 :</label>
          <div class="warp-content">
            <el-date-picker
              style="width:100%"
              v-model="date_value"
              type="datetimerange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              :default-time="['12:00:00']"
            >
            </el-date-picker>
          </div>
        </div>
      </el-col>

      <el-col :span="4">
        <div class="label-warp key-ward">
          <label for="key-ward">关键字 :</label>
          <div class="warp-content">
            <el-select
              @change="search_keyword"
              id="key-ward"
              style="width:80%"
              v-model="search_key"
              placeholder="ID"
            >
              <el-option
                v-for="item in search_option"
                :label="item.label"
                :value="item.value"
                :key="item.value"
              >
              </el-option>
            </el-select>
          </div>
        </div>
      </el-col>

      <el-col :span="3">
        <el-input v-model="search_input" placeholder="请输入内容"></el-input>
      </el-col>

      <el-col :span="2">
        <el-button type="danger" style="width:100%" @click="getNews"
          >搜索</el-button
        >
      </el-col>

      <el-col :span="4">
        <el-button
          type="danger"
          style="width:45%"
          class="pull-right"
          @click="info_dialog = true"
          >新增</el-button
        >
      </el-col>
    </el-row>

    <div class="space-24"></div>
    <el-row>
      <el-table
        :data="table_Data.item"
        border
        style="width: 100%"
        ref="table"
        @selection-change="selected"
      >
        <el-table-column type="selection"> </el-table-column>
        <el-table-column prop="title" label="标题" min-width="6">
        </el-table-column>
        <el-table-column
          prop="categoryId"
          label="类别"
          :formatter="_cate"
          min-width="1"
        >
        </el-table-column>
        <el-table-column
          prop="createDate"
          label="日期"
          :formatter="_date"
          min-width="2"
        >
        </el-table-column>
        <el-table-column prop="id" label="管理人" min-width="1">
        </el-table-column>
        <el-table-column label="操作" min-width="2">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="danger"
              @click="deleteItem(scope.row.id)"
              >删除</el-button
            >
            <el-button
              size="mini"
              type="success"
              @click="editItem(scope.row.id)"
              >编辑</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-row>
    <div class="space-24">
      <el-row>
        <el-col :span="12"
          ><el-button @click="deleteAll">批量删除</el-button></el-col
        >
        <el-col :span="12">
          <el-pagination
            class="pull-right"
            background
            :current-page="current_page"
            :page-sizes="[2, 4, 5]"
            layout="sizes,total,prev, pager, next"
            :total="total"
            @current-change="current_change"
            @size-change="size_change"
          ></el-pagination
        ></el-col>
      </el-row>

      <!-- 新增弹框 -->
      <!-- 第一种办法 -->
      <!-- <InfoDialog v-if="info_dialog" @close="info_dialog = false" /> -->
      <!-- 第二种办法 -->
      <!-- <InfoDialog :info_dialog="info_dialog" @close="closeDialog" /> -->
      <!-- 第三种办法 -->
      <InfoDialog
        :info_dialog.sync="info_dialog"
        :category="category.item"
        @loadNews="getNews"
      />
      <!-- 编辑弹框 -->
      <EditDialog
        :info_dialog_edit.sync="info_dialog_edit"
        :category="category.item"
        :id="editId"
        @reload="getNews"
      />
    </div>
  </div>
</template>

<script>
import { reactive, ref, watch, onMounted } from '@vue/composition-api'
import InfoDialog from './dialog/info'
import EditDialog from './dialog/edit'
// 换一种方法操作
// import { comfrim } from '@/utils/helper'
import { global } from '@/utils/global_3.0.js'
import { common } from '@/api/common.js'
import { get_news, delete_news } from '@/api/info'
import { formatDate } from '@/utils/functions'
export default {
  components: { InfoDialog, EditDialog },
  setup(props, { root, refs, emit }) {
    // --------------------------------- global -----------------------------------
    const category = reactive({
      item: [],
    })
    const { str, confirm } = global()
    const { category: _category, getCategoryAll } = common()
    // 监听变化
    watch(
      () => _category.item,
      (value) => {
        category.item = value
      }
    )
    // ---------------------------------  生命周期  -----------------------------------
    onMounted(() => {
      // 1. vuex 获取
      // 2. 3.0公共业务的抽离
      getCategoryAll()
      // 获取列表数据
      getNews()
    })
    // ---------------------------------  data  -----------------------------------
    // 类型的默认数据
    const category_value = ref('')
    // 日期的默认数据
    const date_value = ref('')
    // 搜索框默认的数据
    const search_key = ref('id')
    // 搜索框下拉列表
    const search_option = reactive([
      {
        value: 'id',
        label: 'ID',
      },
      {
        value: 'title',
        label: '标题',
      },
    ])
    // 设置搜索内容框
    const search_input = ref('')
    // 表格数据
    const table_Data = reactive({
      item: [],
    })
    // 新增弹框
    const info_dialog = ref(false) //false代表隐藏  true展示
    const info_dialog_edit = ref(false)
    const total = ref(0)
    let selected_data = reactive([])
    const editId = ref('')
    // --------------------------------- methods ------------------------------------
    const editItem = (id) => {
      info_dialog_edit.value = true
      editId.value = id
    }
    // 格式化日期
    const _date = (row) => {
      return formatDate(row.createDate)
    }
    // 格式化分类
    const _cate = (row) => {
      let cate_name = ''
      let tmp = category.item.map((cate) => {
        if (cate.id == row.categoryId) {
          cate_name = cate.category_name
        }
      })
      return cate_name
    }
    const current_page = ref(1)
    const page = reactive({
      pageNumber: 1, //当前页码
      pageSize: 2, //当前所在页的数据数量
    })
    // 点击页码
    const current_change = (currentPage) => {
      page.pageNumber = currentPage
      getNews()
    }
    // 点击页大小
    const size_change = (pageSize) => {
      page.pageSize = pageSize
      getNews()
    }
    const search_keyword = (value) => {
      search_key.value = value
      // console.log(search_key.value)
    }
    // 点击选择搜索的类型
    const search = () => {
      let data = {
        pageNumber: page.pageNumber, //当前页码
        pageSize: page.pageSize, //当前所在页的数据数量
      }
      // 处理类别搜索
      if (category_value.value) {
        data.categoryId = category_value.value
      }
      // 日期
      if (Array.isArray(date_value.value) && date_value.value.length > 0) {
        data.startTime = date_value.value[0]
        data.endTime = date_value.value[1]
        date_value.value = ''
      }
      // console.log(date_value.value)
      // 关键字
      if (search_input.value) {
        data[search_key.value] = search_input.value
        search_input.value = ''
      }
      return data
      // console.log(data)
    }
    // 获取列表数据
    const getNews = () => {
      let data = search()
      get_news(data).then((res) => {
        table_Data.item = res.data.data.data
        total.value = res.data.data.total
        // 如果当前页面没有数据，就刷新请求上一页数据
        if (res.data.data.data.length == 0 && page.pageNumber != 1) {
          window.location.reload()
        }
      })
    }
    // 添加vue的全局方法 通过vue实例调用
    // 第二种 解构传参  global.js和global_3.0.js也用此方法
    const delete_Item = (ids) => {
      // console.log(ids)
      // console.log('删除')
      delete_news({ id: ids }).then((res) => {
        ;(page.pageNumber = 1), //当前页码
          (page.pageSize = 2), //当前所在页的数据数量
          current_page
        getNews()
      })
    }
    // 点击出现删除模态框
    const deleteItem = (id) => {
      selected_data = reactive([Number(id)])
      // 第五种 vue3.0 写法
      confirm({
        content: '确定删除此信息？',
        tip: '提示',
        type: 'warning',
        center: true,
        callback: delete_Item,
        id: selected_data,
      })
      // str是ref的值
      // watch(
      //   () => str.value,
      //   (value) => {
      //     console.log(value) //nace
      //   }
      // )
      // 推荐此用法
      // watch(str, (value) => {
      //   console.log(value) //nace
      // })

      // 传参第一种
      // confirm(root)
      //  第二种 解构传参
      // confirm({
      //   content: '确定删除此信息？',
      //   tip: '提示',
      //   type: 'info',
      //   center: true,
      //   callback: delete_Item,
      // })
      // 第三种 promise
      // confirm({
      //   content: '确定删除此信息？',
      //   tip: '提示',
      //   type: 'info',
      //   center: true,
      // })
      //   .then((res) => {
      //     console.log(res)
      //   })
      //   .catch((err) => {
      //     console.log(err)
      //   })

      // 第四种 使用vue2.0全局引用组件写入
      // root.confirm({
      //   content: '确定删除此信息？',
      //   tip: '提示',
      //   type: 'info',
      //   center: true,
      //   callback: delete_Item,
      // })
    }
    const selected = (rows) => {
      selected_data = reactive([])
      rows.map((item) => {
        selected_data.push(item.id)
      })
    }
    const deleteAll = () => {
      // console.log(selected_data)
      const { confirm } = global()
      // 选中的数据在执行删除
      if (selected_data.length == 0) {
        root.$message({
          type: 'error',
          message: '请先选择数据',
          duration: 1000,
        })
        return false
      } else {
        console.log('2222')
      }
      confirm({
        content: '确定删除此信息？',
        tip: '提示',
        type: 'warning',
        center: true,
        callback: delete_Item,
        id: selected_data,
      })
    }

    // 第二种办法
    // const closeDialog = (value) => {
    //   info_dialog.value = value
    // }

    return {
      // ref
      date_value,
      category_value,
      search_key,
      search_input,
      info_dialog_edit,
      total,
      current_page,
      editId,
      // reactive
      search_option,
      table_Data,
      info_dialog,
      category,
      // methods
      search_keyword,
      current_change,
      deleteItem,
      deleteAll,
      selected,
      _date,
      _cate,
      getNews,
      size_change,
      editItem,
      // closeDialog,
    }
  },
}
</script>
<style lang="scss" scoped>
.label-warp {
  &.category {
    // label {
    //   float: left;
    //   width: 60px;
    //   text-align: center;
    //   line-height: 40px;
    //   font-size: 14px;
    // }
    // .warp-content {
    //   margin-left: 60px;
    // }
    @include labelDom(center, 60, 40);
  }
  &.date {
    @include labelDom(center, 60, 40);
  }
  &.key-ward {
    @include labelDom(center, 60, 40);
  }
}
</style>
