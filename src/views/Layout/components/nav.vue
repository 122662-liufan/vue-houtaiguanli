<template>
  <div id="nav_wrap">
    <!-- logo -->
    <h1 class="logo"><img src="../../../assets/logo.png" alt="" /></h1>
    <!-- 菜单列表开始 -->
    <el-menu
      default-active="1-4-1"
      class="el-menu-vertical-demo"
      :collapse="isCollapse"
      background-color="  transparent"
      text-color="#fff"
      active-text-color="#fff"
      router
    >
      <!-- 一级路由 -->
      <template v-for="(item, index) in routes">
        <el-submenu :index="index + ''" :key="index" v-if="!item.hidden">
          <template slot="title">
            <!-- 添加svg图标 -->
            <svg-icon :iconName="item.mate.icon" :iconClass="item.mate.icon" />
            <!-- 循环加载名字 -->
            <span slot="title">{{ item.mate.name }}</span>
          </template>
          <!-- 二级路由 -->
          <el-menu-item-group>
            <el-menu-item
              :index="itemChild.path"
              v-for="(itemChild, index) in item.children"
              :key="index"
              >{{ itemChild.mate.name }}</el-menu-item
            >
          </el-menu-item-group>
        </el-submenu>
      </template>
    </el-menu>
    <!-- 菜单列表结束 -->
    <svg-icon />
  </div>
</template>

<script>
import { computed, reactive, ref } from '@vue/composition-api'
import SvgIcon from '../../../icons/components/SvgIcon.vue'
export default {
  components: { SvgIcon },
  name: 'Main',
  setup(props, { root, refs }) {
    // 读取vuex中的state
    const isCollapse = computed(() => {
      // console.log(root.$store.getters['app/isCollapse'])
      // 返回 false 和 true
      return root.$store.getters['app/isCollapse']
    })
    // 获取路由信息
    const routes = reactive(root.$router.options.routes)

    return {
      isCollapse,
      routes,
    }
  },
}
</script>
<style lang="scss" scoped>
#nav_wrap {
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  width: $NavWidth;
  background-color: #344a5f;
  // 封装动画
  @include webkit('transition', all 1s ease 0s);
  .logo {
    text-align: center;
    img {
      width: 70px;
      margin: 28px auto 28px;
    }
  }
}
.open {
  #nav_wrap {
    width: $NavWidth;
  }
}
.close {
  #nav_wrap {
    width: $NavMinWidth;
    .logo img {
      width: 50%;
    }
  }
}
</style>
