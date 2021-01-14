<template>
  <div>
    <div class="space-24"></div>
    <el-row>
      <el-col :span="20">
        <div class="label-warp keyward">
          <label for="keyward">关键字 :{{ data.selectValue.value }}</label>
          <div class="warp-content">
            <el-row :gutter="25">
              <el-col :span="3">
                <selectVue
                  :option="data.option"
                  :selectValue.sync="data.selectValue"
                />
              </el-col>
              <!-- @input="input" 防抖 -->
              <el-col :span="4"
                ><el-input
                  v-model="data.keyword"
                  class="pull-right"
                  style="width:140px"
                ></el-input>
              </el-col>
              <el-col :span="15"
                ><el-button type="danger" @click="search">搜索</el-button>
              </el-col>
            </el-row>
          </div>
        </div>
      </el-col>
      <el-col :span="4">
        <el-button
          type="danger"
          v-if="data.add_flag"
          style="width:75px"
          class="pull-right"
          @click="add"
          >新增</el-button
        >
      </el-col>
    </el-row>
    <div class="space-24"></div>
    <el-row>
      <tableVue
        ref="table"
        :tableConfig="data.tableConfig"
        :tableSelect.sync="data.tableSelect"
      >
        <!-- vue 3.0 具名插槽的改变  简化 #del 全写v-slot:updates -->
        <template v-slot:status="scopeData">
          <el-switch
            @change="statusChange(scopeData.data)"
            v-model="scopeData.data.ststus"
            active-value="2"
            inactive-value="1"
            active-color="#13ce66"
            inactive-color="#ff4949"
          >
          </el-switch>
        </template>
        <template v-slot:update="scopeData">
          <el-button
            size="mini"
            v-if="data.delete_flag"
            type="danger"
            @click="del_one(scopeData.data)"
            >删除</el-button
          >
          <el-button
            size="mini"
            v-if="data.edit_flag"
            type="success"
            @click="edit(scopeData.data)"
            >编辑</el-button
          >
        </template>
        <template v-slot:footer>
          <el-button type="info" @click="del_more"
            >批量删除</el-button
          ></template
        >
      </tableVue>
    </el-row>
    <userDialog
      :showDialog.sync="data.showDialog"
      :dialogData="data.dialogData"
    />
  </div>
</template>

<script>
import { reactive, ref, watch, onMounted } from '@vue/composition-api'
import selectVue from '@c/Select/index'
import tableVue from '@c/Table/index'
import { global } from '@/utils/global_3.0.js'
import { del_user, change_status_user } from '@/api/user.js'
import userDialog from './dialog/user_dialog'
import lodash from 'lodash'
import store from '@/store/index.js'
export default {
  components: {
    selectVue,
    tableVue,
    userDialog,
  },
  setup(props, { root, refs }) {
    // 用户页面 检测 add edit delete 是否有权限
    onMounted(() => {
      const button_ = store.getters['role/premButton']
      button_.map((item) => {
        let role_arr = item.split('.')
        if (role_arr[0] == 'user') {
          if (role_arr[1] == 'delete') {
            data.delete_flag = true
          } else if (role_arr[1] == 'edit') {
            data.edit_flag = true
          } else if (role_arr[1] == 'add') {
            data.add_flag = true
          }
        }
      })
    })
    // 防抖 debounce
    // const input = lodash.debounce(() => {
    //   console.log('xxx')
    // }, 2000)
    // 更改用户启用和禁用  节流 lodash.throttle 点击事件
    const statusChange = lodash.throttle((row) => {
      if (data.flag) {
        return false
      }
      data.flag = !data.flag
      change_status_user({
        id: row.id,
        status: row.status,
      })
        .then((res) => {
          data.flag = !data.flag
        })
        .catch((err) => {
          data.flag = !data.flag
        })
    }, 2000)
    const data = reactive({
      delete_flag: false,
      edit_flag: false,
      add_flag: false,
      // 初始化下拉框
      // init: ['name', 'phone']
      option: { init: ['name', 'id'] },
      keyword: '',
      //   选中的select
      selectValue: {},
      // 表格配置
      tableConfig: {
        tHead: [
          { prop: 'username', label: '邮箱/用户名', width: '6' },
          { prop: 'truename', label: '真实姓名', width: '2' },
          { prop: 'phone', label: '手机号', width: '4' },
          { prop: 'region', label: '地区', width: '3', type: 'function' },
          { prop: 'role', label: '角色', width: '3' },
          {
            prop: '',
            label: '禁启用状态',
            width: '2',
            type: 'slot',
            slotName: 'status',
          },
          {
            prop: '',
            label: '操作',
            width: '3',
            type: 'slot',
            slotName: 'update',
          },
        ],

        // 是否显示多选框
        showSelect: true,
        // 表格接口请求参数
        requestData: {
          url: '/user/getList/',
          method: 'post',
          data: {
            pageNumber: 1,
            pageSize: 5,
          },
        },
        // 分页样式
        pageLayout: 'total,sizes,prev, pager, next',
      },
      // 表格选中数据
      tableSelect: [],
      flag: false, //阈值
      showDialog: false,
      dialogData: {},
    })
    const { confirm } = global()
    // 删除单个
    const del_one = ({ id }) => {
      data.tableSelect = [id]
      checkdel()
    }
    // 批量删除
    const del_more = () => {
      // 获取id
      checkdel()
    }
    const checkdel = () => {
      if (data.tableSelect.length == 0) {
        root.$message({
          message: '请勾选数据',
          type: 'error',
          duration: 2000,
        })
        return false
      }
      confirm({
        content: '确认删除吗',
        tip: '删除用户',
        type: 'danger',
        center: 'center',
        callback: do_del,
      })
    }
    // 执行删除
    const do_del = () => {
      del_user({
        id: data.tableSelect,
      }).then((res) => {
        // 让表格重新加载数据
        refs['table'].refresh()
      })
    }
    // 搜索业务
    //搜索业务
    const search = () => {
      refs['table'].refreshWithParams({
        [data.selectValue.value]: data.keyword,
      })
    }

    const add = () => {
      data.showDialog = !data.showDialog
      data.dialogData = {}
    }
    const edit = (params) => {
      data.showDialog = !data.showDialog
      data.dialogData = params
    }
    return {
      data,
      del_one,
      del_more,
      search,
      statusChange,
      add,
      edit,
      // input,
    }
  },
}
</script>
<style lang="scss" scoped>
.label-warp {
  &.keyward {
    @include labelDom(center, 60, 40);
  }
}
</style>
