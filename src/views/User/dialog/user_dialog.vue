<template>
  <div>
    <el-dialog
      :title="data.title"
      :visible.sync="data.my_user_dialog"
      append-to-body
      width="600px"
      @close="close"
      @open="open"
      @opened="opened"
    >
      <el-form
        ref="user"
        :model="data.form"
        label-width="100px"
        :rules="data.rules"
      >
        <el-form-item label="用户名：" prop="username">
          <el-input
            v-model="data.form.username"
            placeholder="请输入邮箱"
          ></el-input>
        </el-form-item>
        <el-form-item label="密码：" prop="password">
          <el-input
            v-model="data.form.password"
            placeholder="请输入6-20位数字+字母"
          ></el-input>
        </el-form-item>
        <el-form-item label="姓名：" prop="truename">
          <el-input
            v-model="data.form.truename"
            placeholder="请输入真实姓名"
          ></el-input>
        </el-form-item>
        <el-form-item label="手机号：" prop="phone">
          <el-input
            v-model="data.form.phone"
            placeholder="请输入手机号"
          ></el-input>
        </el-form-item>

        <el-form-item label="地区：" prop="region">
          <citySelect :region.sync="data.form.region" ref="city" />
        </el-form-item>

        <el-form-item label="是否禁用：" prop="status">
          <el-radio v-model="data.form.status" label="1">禁用</el-radio>
          <el-radio v-model="data.form.status" label="2">启用</el-radio>
        </el-form-item>
        <!-- 角色 -->
        <el-form-item label="角色：" prop="role">
          <el-checkbox-group v-model="data.form.role">
            <template v-for="item in data.roles">
              <el-checkbox :label="item.name" :key="item.role"></el-checkbox>
            </template>
          </el-checkbox-group>
        </el-form-item>
        <!-- 角色按钮 -->
        <el-form-item label="权限按钮：" prop=" btnPerm">
          <template v-for="item in data.btnPerm">
            <div :key="item.name">
              <h4>{{ item.name }}</h4>
              <el-checkbox-group v-model="data.form.btnPerm">
                <el-checkbox
                  v-for="perm in item.perm"
                  :key="perm.name"
                  :label="perm.value"
                  >{{ perm.name }}</el-checkbox
                >
              </el-checkbox-group>
            </div>
          </template>
        </el-form-item>
        <el-row :gutter="30">
          <el-col :span="12">
            <el-button style="width:150px;float:right;" @click="close">
              取消</el-button
            >
          </el-col>
          <el-col :span="12">
            <el-button
              @click="submit"
              type="danger"
              style="width:150px;float:left;"
              >确定</el-button
            ></el-col
          >
        </el-row>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { reactive, watch, onMounted } from '@vue/composition-api'
import citySelect from '@/components/City/index'
import { get_role, get_permission, add_user, edit_user } from '@/api/user.js'
import validateUtils from '@/utils/validate.js'

export default {
  props: {
    showDialog: {
      type: Boolean,
      default: false,
    },
    dialogData: {
      type: Object,
      default: {},
    },
  },
  components: { citySelect },
  setup(props, { root, emit, refs }) {
    // 过滤非法字符
    let validatePassword = (rule, value, callback) => {
      data.form.password = value = validateUtils.validate_inputValue(
        value,
        'password'
      )
      // 验证的字段 rule  输入的值 value 验证后做的操作（回调函数）
      //   注意是数字字母组合

      if (value === '') {
        //   输入错误
        callback(new Error('请输入密码'))
      } else if (validateUtils.test_password(value)) {
        callback(new Error('密码格式需6~20位'))
      } else {
        //   输入正确
        callback()
      }
    }
    const data = reactive({
      my_user_dialog: false,
      title: '新增',
      form: {
        username: '', //用户名
        password: '', //密码
        truename: '', //真实姓名
        phone: '', //手机号
        region: {}, //地区
        status: '1', //禁用 1 启用 2
        btnPerm: [], //拥有权限
        role: [], //角色
      },
      roles: [],
      btnPerm: [],
      // 表单校验  角色前面加星号
      rules: {
        role: [
          {
            required: true,
            message: '角色必须勾选',
            trigger: 'change',
          },
        ],
        password: [{ validator: validatePassword, trigger: 'blur' }],
      },
      type: null,
    })

    watch(
      () => props.showDialog,
      (value) => (data.my_user_dialog = value)
    )

    const close = () => {
      data.form.username = ''
      ;(data.form.password = ''), //密码
        (data.form.truename = ''), //真实姓名
        (data.form.phone = ''), // 手机号
        (data.form.region = {}), //地区
        (data.form.status = '1'), // 禁用1  启用 2
        (data.form.btnPerm = []), //拥有权限
        (data.form.role = []), // 角色
        emit('update:showDialog', false)
      data.type = null
    }
    const getRoleAndPermission = () => {
      get_role({}).then((res) => {
        data.roles = res.data.data
      })
      get_permission({}).then((res) => {
        data.btnPerm = res.data.data
      })
    }
    // 打开之前设置表单的相关内容
    const open = () => {
      // data.type = Object.keys(props.dialogData).length
      // console.log(props.dialogData.region)
      // 请求角色和权限按钮
      getRoleAndPermission()
      if (props.dialogData.id) {
        data.title = '编辑'
        // 表单数据初始化
        // console.log(props.dialogData.region)
        for (let key in props.dialogData) {
          data.form[key] = props.dialogData[key]
        }
        data.form.role = props.dialogData.role.split(',')
        data.form.btnPerm = props.dialogData.btnPerm.split(',')
        data.form.region = JSON.parse(props.dialogData.region)
        data.type = '编辑'
      } else {
        // 新增
        data.title = '新增'
      }
    }
    const opened = () => {
      if (data.type == '编辑') {
        refs['city'].selectDefaultvalue()
      }
      refs['city'].getProvince()
    }
    const submit = () => {
      refs['city'].cache_city()
      refs['user'].validate((flag) => {
        if (flag) {
          const _data = {
            username: data.form.username, //用户名
            password: data.form.password, //密码
            truename: data.form.truename, //真实姓名
            phone: data.form.phone, //手机号
            status: data.form.status, //禁用 1 启用 2
            btnPerm: data.form.btnPerm.join(), //拥有权限
            role: data.form.role.join(), //角色
            region: JSON.stringify(data.form.region),
          }
          if (props.dialogData.id) {
            // 提交 编辑
            _data.id = props.dialogData.id
            // 如果没有更改城市信息 不添加 region 这个字段
            edit_user(_data).then((res) => {
              root.$message({
                type: 'success',
                message: '修改成功',
                duration: 2000,
              })
              close()
            })
          } else {
            // 提交 新增
            add_user(_data).then((res) => {
              root.$message({
                type: 'success',
                message: '新增成功',
                duration: 2000,
              })
              close()
            })
          }
        } else {
          root.$message({
            type: 'error',
            message: '表单数据验证不通过',
          })
        }
      })
    }
    return {
      data,
      close,
      open,
      submit,
      opened,
    }
  },
}
</script>
<style lang="scss" scoped></style>
