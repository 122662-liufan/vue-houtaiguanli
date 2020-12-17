<template>
  <div id="login">
    <div class="login_wrap">
      <ul class="menu_tab">
        <li
          :class="{ current: item.current }"
          v-for="(item, index) in menuTab"
          :key="index"
          @click="toggleMenu(item)"
        >
          {{ item.txt }}
        </li>
      </ul>

      <el-form
        :model="ruleForm"
        status-icon
        :rules="rules"
        ref="ruleForm"
        class="login-form"
        size="medium"
      >
        <el-form-item prop="username" class="form_item">
          <label for="username">邮箱</label>
          <el-input
            id="username"
            type="text"
            v-model="ruleForm.username"
            autocomplete="off"
          ></el-input>
        </el-form-item>

        <el-form-item prop="password" class="form_item">
          <label for="password">密码</label>
          <el-input
            id="password"
            type="text"
            v-model="ruleForm.password"
            autocomplete="off"
          ></el-input>
        </el-form-item>

        <el-form-item
          v-show="mode == 'register'"
          prop="password1"
          class="form_item"
        >
          <label for="password1">请确认密码</label>
          <el-input
            id="password1"
            type="text"
            v-model="ruleForm.password1"
            autocomplete="off"
          ></el-input>
        </el-form-item>

        <el-form-item prop="code" class="form_item">
          <label for="code">验证码</label>
          <el-row :gutter="10">
            <!-- 强制限制输入的位数 -->
            <!-- maxlength="6"
                minlength="6" -->
            <el-col :span="15"
              ><el-input id="code" v-model="ruleForm.code"></el-input
            ></el-col>
            <el-col :span="9">
              <el-button
                type="success"
                style="display:block; width: 100%;"
                v-bind:disabled="codeButtonStatus"
                class="block"
                @click="getCode"
                >{{ codeButtonText }}</el-button
              >
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item class="form_item">
          <el-button
            :disabled="buttonStatus"
            type="danger"
            style="display:block; width: 100%;margin-top: 30px;"
            @click="submitForm('ruleForm')"
            >{{ this.mode == 'login' ? '登录' : '注册' }}</el-button
          >
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
// 导入过滤特殊字符的函数
import validateUtils from '@/utils/validate.js'
import { onMounted, reactive, ref } from '@vue/composition-api'
import { get_code, do_register, do_login } from '@/api/login.js'
export default {
  setup(prop, { refs, root }) {
    //  -----------------------     生命周期     ---------------------------------------------
    // onMounted(() => {
    //   get_code().then((res) => {
    //     console.log(res)
    //   })
    // })
    //  -----------------------     data      ---------------------------------------------
    const status_username = ref(false)
    const status_password = ref(false)
    const status_password1 = ref(false)
    // 邮箱验证
    let validateUsername = (rule, value, callback) => {
      ruleForm.username = value = validateUtils.validate_inputValue(
        value,
        'email'
      )
      //   let reg = /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/
      //   严谨模式的邮箱
      if (value === '') {
        status_username.value = false
        callback(new Error('请输入邮箱'))
      } else if (validateUtils.test_email(value)) {
        status_username.value = false
        callback(new Error('邮箱格式错误'))
      } else {
        status_username.value = true
        callback()
      }
    }
    // 密码验证
    let validatePassword = (rule, value, callback) => {
      ruleForm.password = value = validateUtils.validate_inputValue(
        value,
        'password'
      )
      // 验证的字段 rule  输入的值 value 验证后做的操作（回调函数）
      //   注意是数字字母组合

      if (value === '') {
        status_password.value = false
        //   输入错误
        callback(new Error('请输入密码'))
      } else if (validateUtils.test_password(value)) {
        status_password.value = false
        callback(new Error('密码格式需6~20位'))
      } else {
        status_password.value = true
        //   输入正确
        callback()
      }
    }
    // 重复密码验证
    let validatePassword1 = (rule, value, callback) => {
      // 登录时不在重复捕捉输入密码
      if (mode.value == 'login') {
        callback()
        return
      }
      //   console.log('重复密码')
      ruleForm.password1 = value = validateUtils.validate_inputValue(
        value,
        'password1'
      )
      // 验证的字段 rule  输入的值 value 验证后做的操作（回调函数）
      //   注意是数字字母组合

      if (value !== ruleForm.password) {
        status_password1.value = false
        //   输入错误
        callback(new Error('两次密码输入不一致'))
      } else {
        status_password1.value = true
        //   输入正确
        callback()
      }
    }
    //   验证码验证
    let validateCode = (rule, value, callback) => {
      //过滤特殊字符
      ruleForm.code = value = validateUtils.validate_inputValue(value, 'code')

      if (!value) {
        return callback(new Error('验证码不能为空'))
      } else if (validateUtils.test_code(value)) {
        callback(new Error('验证码格式错误'))
      } else {
        callback()
      }
    }
    // 定义tab切换模式
    const mode = ref('login')
    const menuTab = reactive([
      { txt: '登录', current: true, type: 'login' },
      { txt: '注册', current: false, type: 'register' },
    ])
    //   input双向数据绑定
    const ruleForm = reactive({
      username: '',
      password: '',
      password1: '',
      code: '',
    })
    //   校验方式
    const rules = reactive({
      username: [{ validator: validateUsername, trigger: 'blur' }],
      password: [{ validator: validatePassword, trigger: 'blur' }],
      password1: [{ validator: validatePassword1, trigger: 'blur' }],
      code: [{ validator: validateCode, trigger: 'blur' }],
    })
    // 定义登录注册按钮的启用和禁用
    const buttonStatus = ref(true)
    // 定义验证码按钮的启用和禁用
    const codeButtonStatus = ref(false)
    // 定义验证码里面的文字
    const codeButtonText = ref('获取验证码')

    // 定义验证码延迟一次性定时器
    const timer_delay = ref(null)
    // 定义码倒计时定时器
    const timer_count_down = ref(null)
    //  -----------------------     methods      ---------------------------------------------
    // 对表单的每一个字段再次进行验证
    const submitForm = (formName) => {
      refs[formName].validate((result) => {
        if (result) {
          //   alert('submit!')
          // 执行登录和注册
          mode.value === 'login' ? doLogin() : doRegister()
        } else {
          //   console.log('error submit!!')
          //   console.log(result)
          return false
        }
      })
    }
    const toggleMenu = (item) => {
      menuTab.map((item) => (item.current = false))
      item.current = true
      mode.value = item.type
      //   点击切换的时候清除数据
      refs['ruleForm'].resetFields()
      //   还原验证码的 登录注册状态
      resetCodeButton()
      //    还原登录注册状态
      buttonStatus.value = true
    }
    // 获取验证码请求
    const getCode = () => {
      const { result, filed } = validateFileds()
      let offset = 0
      if (!result) {
        //true是验证通过， false是验证失败
        filed.map((item) => {
          offset += 40
          root.$message({
            type: 'error',
            message: `错误字段:${item.message}`,
            offset: offset,
            duration: 2000,
          })
        })

        return false
      }

      //让获取验证码的按钮禁用，按钮内容改为 "发送中"
      setCodeButton({
        status: true,
        text: '发送中',
      })

      //为了模拟网络延迟 设置一个一次性定时器
      timer_delay.value = setTimeout(() => {
        const data = {
          username: ruleForm.username,
          module: mode.value,
        }
        get_code(data)
          .then((res) => {
            //显示倒计时
            countDown(10)
            //获取到对应的验证码
            root.$message.success(res.data.message)
            //登录注册按钮启用
            buttonStatus.value = false
          })
          .catch((err) => {
            console.log(2)
          })
      }, 1000)
    }

    // -----------------------     辅助方法      ---------------------------------------------
    // 验证码倒计时定时器 ,周期性的
    const countDown = (timer) => {
      // 如果存在定时器
      if (timer_count_down.value) {
        clearInterval(timer_count_down.value)
      }
      timer_count_down.value = setInterval(() => {
        timer--
        if (timer === 0) {
          clearInterval(timer_count_down.value)
          // 倒计时结束，显示重新发送
          //   codeButtonText.value = '重新发送'
          //   buttonStatus.value = false
          setCodeButton({
            text: '重新发送',
            status: false,
          })
        } else {
          codeButtonText.value = `倒计时${timer}秒`
        }
      }, 1000)
    }
    //   还原验证码的 登录注册状态
    const resetCodeButton = () => {
      // 默认启用 发送中
      setCodeButton({
        status: false,
        text: '获取验证码',
      })
      //  清空所有定时器
      clearTimeout(timer_delay.value)
      clearInterval(timer_count_down.value)
    }
    // 设置获取验证码的相关状态
    const setCodeButton = ({ status, text }) => {
      codeButtonStatus.value = status
      codeButtonText.value = text
    }
    // 执行登录
    const doLogin = () => {
      const data = {
        username: ruleForm.username,
        password: ruleForm.password,
        code: ruleForm.code,
      }
      root.$store
        .dispatch('app/login', data)
        .then((res) => {
          console.log('-->', res)
          root.$message.success(res.data.message)
          root.$router.push({ name: 'Home' })
        })
        .catch((err) => {})

      //   执行登录  涉及网络请求，改写到 vue-actions-->mutations-->state
      //   do_login(data)
      //     .then((res) => {
      //       // 提示登录成功
      //       root.$message.success(res.data.message)
      //       //  登录后跳转到首页
      //       root.$router.push({ name: 'Home' })
      //     })
      //     .catch((err) => {})
    }
    // 执行注册

    const doRegister = () => {
      const data = {
        username: ruleForm.username,
        password: ruleForm.password,
        code: ruleForm.code,
      }
      //   执行注册
      do_register(data)
        .then((res) => {
          // 提示注册成功
          root.$message.success(res.data.message)
          //   console.log(res)注册成功后切换到tab
          toggleMenu(menuTab[0])
        })
        .catch((err) => {})
    }

    //  发送验证码时验证相关字段

    const validateFileds = () => {
      const result = status_username.value && status_password.value
      const _filed_arr = [
        {
          filed: 'username',
          flag: status_username.value,
          message: '邮箱格式错误',
        },
        { filed: 'password', flag: status_password.value, message: '密码错误' },
      ]
      if (mode.value === 'register') {
        _filed_arr.push({
          filed: 'password1',
          flag: status_password1.value,
          message: '重复密码错误',
        })
        result: status_username.value &&
          status_password.value &&
          status_password1.value
      }

      return {
        result: result,
        filed: _filed_arr.filter((item) => !item.flag),
      }
    }

    return {
      mode,
      menuTab,
      ruleForm,
      rules,
      toggleMenu,
      submitForm,
      getCode,
      buttonStatus,
      codeButtonStatus,
      codeButtonText,
    }
    //  -----------------------     data      ---------------------------------------------
  },
}
</script>
<style lang="scss" scoped>
#login {
  height: 100vh; //基于浏览器的可视区域
  background-color: #344a5f;
  .login_wrap {
    width: 329px;
    height: 652px;
    margin: 0px auto 0 auto;
    box-sizing: content-box;

    .menu_tab {
      text-align: center;
      padding-top: 180px;
      margin-bottom: 39px;
      li {
        width: 88px;
        height: 36px;
        line-height: 36px;
        text-align: center;
        color: #fff;
        font-size: 14px;
        border-radius: 2px;
        display: inline-block;
      }
      .current {
        background-color: #304256;
      }
    }
  }
}
.login-form {
  label {
    display: block;
    color: #fff;
    font-size: 14px;
    margin-bottom: 3px;
  }
  .form_item {
    margin-bottom: 13px;
  }
}
</style>
