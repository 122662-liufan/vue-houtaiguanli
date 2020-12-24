<template>
  <div>
    <el-dialog
      title="编辑"
      :visible.sync="my_info_dialog"
      append-to-body
      @close="close"
      @opened="opened"
      width="435px"
    >
      <!-- 表单 -->
      <el-form :model="form">
        <el-form-item label="类型:" :label-width="formLabelWidth">
          <el-select v-model="form.category" placeholder="请选择活动区域">
            <el-option
              v-for="cate in category"
              :key="cate.id"
              :label="cate.category_name"
              :value="cate.id"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="标题:" :label-width="formLabelWidth">
          <el-input v-model="form.title" placeholder="请输入内容"></el-input>
        </el-form-item>

        <el-form-item label="概况:" :label-width="formLabelWidth">
          <el-input
            type="textarea"
            :rows="6"
            placeholder="请输入内容"
            v-model="form.content"
          ></el-input>
        </el-form-item>
      </el-form>
      <!-- 操作按钮 -->
      <div slot="footer" class="dialog-footer">
        <el-button @click="close">取 消</el-button>
        <el-button type="danger" @click="submit">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { reactive, ref, watch } from '@vue/composition-api'
import { get_news, edit_news } from '@/api/info'
// vue3.0写法

export default {
  props: {
    info_dialog_edit: {
      type: Boolean,
      default: false,
    },
    category: {
      type: Array,
      default: [],
    },
    id: {
      type: String,
      default: '',
    },
  },
  setup(props, { root, emit }) {
    // ------------------------  data  ----------------------------------------------
    const my_info_dialog = ref(false)
    const formLabelWidth = ref('60px')
    const form = reactive({
      category: '',
      title: '',
      content: '',
    })
    // ------------------------   methods  ----------------------------------------------
    const opened = () => {
      getinfo()
    }
    const getinfo = () => {
      get_news({
        id: Number(props.id),
        pageNumber: 1, //当前页码
        pageSize: 2, //当前所在页的数据数量
      }).then((res) => {
        form.title = res.data.data.data[0].title
        form.content = res.data.data.data[0].content
        form.category = res.data.data.data[0].categoryId
      })
    }
    const submit = () => {
      edit_news({
        id: props.id,
        categoryId: form.category,
        title: form.title,
        content: form.content,
      }).then((res) => {
        root.$message({
          type: 'success',
          message: res.data.message,
          duration: 1000,
        })
        close()
        emit('reload')
      })
    }
    const close = () => {
      // 使用属性修饰符  是通过 .sunc 告知父组件更新某一个数据
      // 适合场景：只是告知父组件更新某一个值，没有其他业务逻辑
      emit('update:info_dialog_edit', false)
      form.title = ''
      form.content = ''
      form.category = ''
    }
    // ------------------------    watch  ----------------------------------------------
    // 监听父组件的属性变化
    watch(
      () => props.info_dialog_edit,
      (newValue, oldValue) => {
        my_info_dialog.value = newValue
      }
    )
    return {
      // ref
      my_info_dialog,
      formLabelWidth,
      // reactive
      form,
      //  methods
      close,
      opened,
      submit,
    }
  },
}
</script>
