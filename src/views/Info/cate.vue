<template>
  <div id="category">
    <el-button
      type="danger"
      class="el-button--danger__aa"
      @click="addFirstCategory"
    >
      添加一级分类</el-button
    >

    <hr />
    <div class="space-24"></div>
    <div>
      <el-row :gutter="30">
        <el-col :span="10">
          <div class="category-wrap">
            <div class="category" v-for="cate in category.item" :key="cate.id">
              <!--一级分类-->
              <h4>
                <svg-icon iconName="plus1"></svg-icon>
                {{ cate.category_name }}
                <div class="button-group">
                  <el-button
                    size="mini"
                    type="danger"
                    round
                    @click="editCategory(cate, 'first_category')"
                    >编辑</el-button
                  >
                  <el-button
                    size="mini"
                    type="success"
                    round
                    @click="addSecondCategory(cate, 'first_cate')"
                    >添加子级</el-button
                  >
                  <el-button size="mini" round @click="deleteCategory(cate)"
                    >删除</el-button
                  >
                </div>
              </h4>
              <!--子级分类-->
              <!-- v-if="cate.children && cate.children.length > 0" -->
              <ul>
                <li v-for="_cate in cate.children" :key="_cate.id">
                  {{ _cate.category_name }}
                  <div class="button-group">
                    <el-button
                      size="mini"
                      type="danger"
                      round
                      @click="
                        editCategory(
                          _cate,
                          'seccond_category',
                          cate.category_name
                        )
                      "
                      >编辑</el-button
                    >
                    <el-button
                      size="mini"
                      round
                      @click="deleteCategory(_cate, 'seccond_cate')"
                      >删除</el-button
                    >
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </el-col>
        <el-col :span="14">
          <h4 class="menu-title">分类编辑</h4>
          <div class="space-24"></div>
          <el-form label-width="142px" class="from-wrap" ref="categoryFrom">
            <el-form-item
              label="一级分类名称："
              prop="categoryName"
              v-if="category_first_input"
            >
              <el-input
                v-model="form.categoryName"
                :disabled="is_disabled"
              ></el-input>
            </el-form-item>
            <div class="space-24"></div>
            <el-form-item
              label="二级分类名称："
              prop="secCategoryName"
              v-if="category_second_input"
            >
              <el-input v-model="form.secCategoryName"></el-input>
            </el-form-item>
            <div class="space-24"></div>
            <el-form-item>
              <el-button type="danger" style="width:100px" @click="submit"
                >确定</el-button
              >
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import { reactive, ref, onMounted, watch } from '@vue/composition-api'
import {
  add_first_category,
  get_all_category,
  add_seccond_category,
  delete_first_Category,
  edit_Category,
} from '@/api/info'
import { global } from '@/utils/global_3.0.js'
import { common } from '@/api/common.js'
export default {
  name: 'category',
  setup(props, { root, refs }) {
    //--------------- global  ----------------------------
    const { confirm } = global()
    //--------------- ref  ----------------------------
    const category_first_input = ref(true)
    const category_second_input = ref(true)
    const is_disabled = ref(false) //一级分类的启用和禁用
    const submit_type = ref('')
    //--------------- reactive  ----------------------------
    // 分类表单绑定的数据
    const form = reactive({
      categoryName: '',
      secCategoryName: '',
    })
    // 存储分类信息
    const category = reactive({
      item: [
        // 无用了
        // {
        //   id: 1,
        //   category_name: '服装',
        //   children: [
        //     {
        //       id: 1,
        //       category_name: '男装',
        //     },
        //     {
        //       id: 2,
        //       category_name: '女装',
        //     },
        //   ],
        // },
      ], //所有的分类
      current: [], //当前操作的是哪个分类
    })
    // --------------- methods  ----------------------------
    // 点击隐藏二级分类名称，添加一级分类按钮
    const addFirstCategory = () => {
      category_second_input.value = false
      category_first_input.value = true
      submit_type.value = 'add_first_category'
      is_disabled.value = false
      form.categoryName = ''
    }
    // 点击添加二级分类按钮
    const addSecondCategory = (cate) => {
      form.categoryName = cate.category_name
      is_disabled.value = true
      category_second_input.value = true
      category_first_input.value = true
      submit_type.value = 'add_seccond_category'
      category.current = cate
      form.secCategoryName = ''
    }
    //  点击编辑一级和二级分类
    const editCategory = (cate, type, first_cate_name = '') => {
      //  点击编辑一级分类
      if (type === 'first_category') {
        is_disabled.value = false
        form.categoryName = cate.category_name
        category_second_input.value = false
        submit_type.value = 'edit_first_category'
        category.current = cate
        //  点击编辑二级分类
      } else {
        is_disabled.value = true
        form.secCategoryName = cate.category_name
        // 所对应的一级菜单的值
        form.categoryName = first_cate_name
        category_second_input.value = true
        category_first_input.value = true
        submit_type.value = 'edit_seccond_category'
        category.current = cate
      }
    }
    // 点击删除一级和二级分类
    const deleteCategory = (cate, type) => {
      // 确认删除后再执行删除
      confirm({
        content: '确认删除吗？',
        tip: '删除',
        type: 'error',
        center: true,
        callback: () => {
          delete_first_Category({ categoryId: cate.id }).then((res) => {
            if (type === 'first_cate') {
              category.item.map((_cate, index) => {
                if (_cate.id == cate.id) {
                  category.item.splice(index, 1)
                }
              })
            } else {
              getCategoryAll()
            }
          })
        },
      })
    }
    // 执行一级分类添加逻辑
    const doAddFirstCategory = () => {
      // 当前分类不能为空
      if (!form.categoryName) {
        root.$message({
          type: 'error',
          message: '一级分类不能为空',
          duration: 1500,
        })
        return false
      }
      // 添加一级分类
      add_first_category({
        categoryName: form.categoryName,
      })
        .then((res) => {
          root.$message({
            type: 'success',
            message: res.data.message,
            duraction: 1500,
          })
          // category.item.unshift(res.data.data)
          getCategoryAll()
          // 清空表单
          form.categoryName = ''
        })
        .catch((err) => {
          console.log(err)
        })
    }
    //执行二级分类添加逻辑
    const doAddSecondCategory = () => {
      // console.log(category.current)
      add_seccond_category({
        categoryName: form.secCategoryName,
        parentId: category.current.id,
      }).then((res) => {
        root.$message({
          type: 'success',
          message: res.data.message,
          duraction: 1500,
        })
        // console.log(res.data)

        // 1. 重新请求 http 数据
        // get_all_category().then((res) => {
        //   category.item = res.data.data
        // })
        // 相当于上面的方法，封装了
        getCategoryAll()

        // 2. 手动找到 children 数组中 push  此方法有问题
        // category.item.map((cate) => {
        //   // 找到要 push 的一级分类
        //   if (cate.id === category.current.id) {
        //     cate.children.unshift(res.data.data)
        //   }
        // })
        // 清空表单
        form.categoryName = ''
        form.secCategoryName = ''
      })
    }
    // 编辑一级和二级分类  api
    const doEditCategory = (categoryName) => {
      edit_Category({
        id: category.current.id,
        categoryName: categoryName,
      }).then((res) => {
        // 因为引用，可以改变
        category.current.category_name = res.data.data.data.categoryName
        // 清空表单
        form.categoryName = ''
        form.secCategoryName = ''
      })
    }

    // 点击表单提交
    const submit = () => {
      // 判断业务逻辑
      if (submit_type.value === 'add_first_category') {
        // 添加一级分类
        doAddFirstCategory()
      }
      if (submit_type.value === 'add_seccond_category') {
        // 点击添加二级分类
        doAddSecondCategory()
      }
      if (submit_type.value === 'edit_first_category') {
        //  点击编辑一级分类
        doEditCategory(form.categoryName)
      }
      if (submit_type.value === 'edit_seccond_category') {
        //  点击编辑二级分类
        doEditCategory(form.secCategoryName)
      }
    }
    const { category: _category, getCategoryAll } = common()
    // 监听变化 两边同步
    watch(
      () => _category.item,
      (value) => {
        category.item = value
      }
    )
    // --------------- 生命周期  ----------------------------
    onMounted(() => {
      getCategoryAll()
    })
    return {
      // -------  ref     --------------
      category_first_input,
      category_second_input,
      is_disabled,
      submit_type,
      // -------  reactive --------------
      form,
      category,
      // --------------- methods  ----------------------------
      addFirstCategory,
      submit,
      addSecondCategory,
      deleteCategory,
      editCategory,
      doEditCategory,
    }
  },
}
</script>
<style lang="scss" scoped>
#category {
  padding-top: 22px;
  padding-left: 22px;
  .el-button--danger__aa {
    width: 120px;
    height: 30px;
    padding: 0 !important;
    line-height: 30px;
  }
  hr {
    margin-top: 20px;
    margin-left: -33px;
    margin-right: -10px;
    border: none;
    border-bottom: 1px solid #c4c4c4;
  }
  .category-wrap {
    div:first-child {
      &:before {
        top: 20px;
      }
    }
    div:last-child {
      &:before {
        bottom: 21px;
      }
    }
  }
  .menu-title {
    line-height: 44px;
    padding-left: 22px;
    &:hover {
      background-color: #f3f3f3;
    }
  }
  .category {
    position: relative;
    line-height: 44px;
    cursor: pointer;
    &:before {
      content: '';
      position: absolute;
      left: 22px;
      top: 0;
      bottom: 0;
      width: 32px;
      border-left: 1px dotted #000;
    }
    h4 {
      position: relative;
      padding-left: 40px;
    }
    svg {
      width: 15px;
      height: 15px;
      position: absolute;
      left: 15px;
      top: 15px;
      background-color: #fff;
      font-size: 17px;
    }
    li {
      position: relative;
      padding-left: 36px;
      margin-left: 24px;
      &:before {
        content: '';
        position: absolute;
        left: 0;
        top: 22px;
        width: 32px;
        border-bottom: 1px dotted #000;
      }
    }
    li,
    h4 {
      @include webkit(transition, all 0.5s ease 0s);
      &:hover {
        background-color: #f3f3f3;
        .button-group {
          display: block;
        }
      }
    }
  }
  .button-group {
    display: none;
    position: absolute;
    z-index: 2;
    right: 11px;
    top: -1px;
    button {
      font-size: 12px;
    }
  }
  .from-wrap {
    width: 410px;
    padding-top: 26px;
  }
  .hr-e9e9e9 {
    width: calc(100% + 60px);
    margin-left: -30px;
    border: none;
    margin-top: 30px;
    margin-bottom: 30px;
    border-bottom: 1px solid #e9e9e9;
  }
}
</style>
