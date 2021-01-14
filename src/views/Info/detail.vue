<template>
  <div>
    <!-- 详情{{ id }} -->
    <el-form :model="form" status-icon ref="ruleForm" label-width="100px">
      <el-form-item label="分类:">
        <el-select v-model="form.categoryId" placeholder="请选择">
          <el-option
            :label="cate.category_name"
            :value="cate.id"
            v-for="cate in category.item"
            :key="cate.id"
          >
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="标题:">
        <el-input v-model="form.title" style="width: 14%"></el-input>
      </el-form-item>

      <el-form-item label="缩略图:">
        缩略图
      </el-form-item>

      <el-form-item label="日期:">
        <el-date-picker
          v-model="form.createDate"
          type="date"
          placeholder="选择日期"
          format="yyyy-MM-dd / HH:mm:ss"
          disabled
        >
        </el-date-picker>
      </el-form-item>

      <el-form-item label="详细内容:">
        <quill-editor
          v-model="form.content"
          style="height:200px;width:75%;"
          :options="editorOption"
        ></quill-editor>
      </el-form-item>
      <div class="space-24"></div>
      <el-form-item>
        <el-button type="danger" class="pull-right" @click="submit"
          >提交</el-button
        >
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import {
  onActivated,
  onDeactivated,
  ref,
  reactive,
  watch,
  onMounted,
} from '@vue/composition-api'
import { get_news, edit_news } from '@/api/info'
import { common } from '@/api/common.js'
import { formatDate } from '@/utils/functions'

// 富文本编辑器局部引入
import { quillEditor } from 'vue-quill-editor' //调用编辑器
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

export default {
  components: {
    quillEditor,
  },
  setup(props, { root }) {
    /* // const id = root.$route.query.id
    // const content = root.$route.query.content
    // console.log(id, content)

    // const content =
    //   root.$route.params.content || root.$store.getters['params/content']
    // console.log( content)

    // vue 2.0
    // 第一次进入
    // created activated
    //  第一次离开
    // deactivated
    // 第一次进入
    // activated
    // setup 对于 keeplive 缓存的时候只执行一次，后面在进入这个组件就跳过 setup
    // vue 3.0
    // 第一次进入
    // setup created onActivated
    //  第一次离开
    // onDeactivated
    // 第一次进入
    // onActivated8*/
    const toolbarOptions = [
      ['bold', 'italic', 'underline', 'strike'], // toggled buttons
      ['blockquote', 'code-block'],

      [{ header: 1 }, { header: 2 }], // custom button values
      [{ list: 'ordered' }, { list: 'bullet' }],
      [{ script: 'sub' }, { script: 'super' }], // superscript/subscript
      [{ indent: '-1' }, { indent: '+1' }], // outdent/indent
      [{ direction: 'rtl' }], // text direction

      [{ size: ['small', false, 'large', 'huge'] }], // custom dropdown
      [{ header: [1, 2, 3, 4, 5, 6, false] }],

      [{ color: [] }, { background: [] }], // dropdown with defaults from theme
      [{ font: [] }],
      [{ align: [] }],

      ['clean'], // remove formatting button
      ['link', 'image'],
    ]
    const editorOption = reactive({
      placeholder: '编辑文章内容',
      modules: {
        toolbar: toolbarOptions,
      },
    })
    const id = ref('')
    const form = reactive({
      categoryId: '',
      title: '',
      content: '',
      createDate: '',
      imgUrl: '',
    })
    const category = reactive({
      item: [],
    })
    const { category: cate, getCategoryAll } = common()
    const getInfo = () => {
      get_news({
        pageNumber: 1,
        pageSize: 1,
        id: id.value,
      }).then((res) => {
        // console.log(res.data.data)
        const responseData = res.data.data.data[0]
        form.categoryId = responseData.categoryId
        form.title = responseData.title
        form.content = responseData.content
        form.createDate = formatDate(responseData.createDate)
        form.imgUrl = responseData.imgUrl
      })
    }
    onMounted(() => {
      getCategoryAll()
    })
    watch(
      () => cate.item,
      (value) => {
        category.item = value
      }
    )
    onActivated(() => {
      id.value = root.$route.params.id || root.$store.getters['params/id']
      getInfo()
      // console.log(id)
      // console.log('onActivated,进入')
    })
    // onDeactivated(() => {
    //   // console.log(' onDeactivated,离开')
    // })
    // ----------------  methods  ----------------------------
    const submit = () => {
      const data = {
        id: id.value,
        categoryId: form.categoryId,
        title: form.title,
        content: form.content,
      }
      edit_news(data).then((res) => {
        root.$message({
          type: 'success',
          message: '修改成功',
          duration: 1000,
        })
      })
    }
    return {
      // ref
      id,
      //  reactive
      form,
      category,
      editorOption,
      //  methods
      submit,
    }
  },
}
</script>
<style lang="scss" scoped></style>
