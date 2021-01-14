<template>
  <div>
    <el-table
      :data="data.tableData"
      border
      style="width: 100%;"
      ref="table"
      @select="select"
      @select-all="select"
    >
      <!-- 多选框 -->
      <el-table-column type="selection" v-if="data.tableConfig.showSelect">
      </el-table-column>
      <!-- 表头 文本渲染-->
      <template v-for="item in data.tableConfig.tHead">
        <el-table-column
          :key="item.label"
          :prop="item.prop"
          :label="item.label"
          :min-width="item.width"
          v-if="item.type != 'slot'"
        >
        </el-table-column>
        <!-- 表头 插槽渲染-->
        <el-table-column
          :key="item.label"
          :label="item.label"
          :min-width="item.width"
          v-else
        >
          <template v-slot="scope">
            <slot :name="item.slotName" :data="scope.row"> </slot>
          </template>
        </el-table-column>
      </template>
    </el-table>
    <div class="space-24"></div>
    <el-row>
      <el-col :span="4">
        <slot name="footer"></slot>
      </el-col>
      <el-col :span="20">
        <el-pagination
          class="pull-right"
          background
          :layout="data.tableConfig.pageLayout"
          :page-size="pageData.page_size"
          :total="pageData.total"
          :page-sizes="pageData.page_sizes"
          :current-page="pageData.current_page"
          @current-change="current_change"
          @size-change="size_change"
        >
        </el-pagination>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import { reactive, onMounted, watch } from '@vue/composition-api'
// import { loadTableData } from '@/api/common'
import { loadData } from './tableload'
import { page } from './page'
export default {
  props: {
    tableConfig: {
      type: Object,
      default: {},
    },
    tableSelect: {
      type: Array,
      default: [],
    },
  },
  setup(props, { root, emit }) {
    const data = reactive({
      tableConfig: {
        tHead: [],
        showSelect: true,
        requestData: {},
        pageLayout: '',
      },
      tableData: [],
    })

    // 初始化表格的样式
    const initTable = () => {
      const tableConfigKeys = Object.keys(data.tableConfig)
      //   传递什么配置，替换什么配置
      for (let key in props.tableConfig) {
        // 判断传递的属性是否属于配置属性  --->  key
        if (tableConfigKeys.includes(key)) {
          data.tableConfig[key] = props.tableConfig[key]
        } else {
          root.$message({
            type: 'error',
            message: `${key}属性未定义`,
          })
        }
      }
    }
    // 表格业务
    const { tableData, tableLoadData } = loadData()
    // 监听表格数据 监听多个属性
    watch(
      [() => tableData.item, () => tableData.total],
      ([newData, newTotal]) => {
        data.tableData = newData
        setTotal(newTotal)
      }
    )
    // 分页业务
    const { pageData, setTotal, current_change, size_change } = page()
    watch(
      [() => pageData.current_page, () => pageData.page_size],
      ([currentPage, pageSize]) => {
        const params = data.tableConfig.requestData
        params.data.pageNumber = currentPage
        params.data.pageSize = pageSize
        tableLoadData(params)
      }
    )
    // methods
    // 获取按钮的id
    const select = (value) => {
      const ids = []
      value.map((item) => ids.push(item.id))
      emit('update:tableSelect', ids)
    }
    // 刷新表格数据
    const refresh = () => {
      tableLoadData(data.tableConfig.requestData)
    }
    // 带参数请求数据
    const refreshWithParams = (params) => {
      const requestData = Object.assign(params, {
        pageNumber: 1,
        pageSize: 5,
      })
      data.tableConfig.requestData.data = requestData
      tableLoadData(data.tableConfig.requestData)
    }
    onMounted(() => {
      initTable()
      // loadData()
      tableLoadData(data.tableConfig.requestData)
    })
    return {
      //    reactive
      data,
      current_change,
      size_change,
      pageData,
      // methods
      select,
      refresh,
      refreshWithParams,
    }
  },
}
</script>
<style lang="scss" scoped></style>
