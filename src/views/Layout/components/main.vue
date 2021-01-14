<template>
  <div id="main_wrap">
    <!-- 保持页面原来的样子，在别的页面返回还在原 -->
    <keep-alive>
      <router-view v-if="$route.meta.keep"></router-view>
    </keep-alive>
    <router-view v-if="!$route.meta.keep"></router-view>
  </div>
</template>

<script>
import { reactive, ref, watch } from '@vue/composition-api'

export default {
  setup(props, { root }) {
    watch(
      () => root.$route.path,
      (value1, value2) => {
        // console.log(value1, value2)
      }
    )
  },
}
</script>
<style lang="scss" scoped>
#main_wrap {
  position: fixed;
  top: $LayoutHeader;
  left: $NavWidth;
  right: 0;
  bottom: 0px;
  padding-left: 10px;
  padding-right: 10px;
  border: 20px solid #f7f7f7;
  border-bottom: none;
  @include webkit('transition', all 1s ease 0s);
}
.open {
  #main_wrap {
    left: $NavWidth;
  }
}

.close {
  #main_wrap {
    left: $NavMinWidth;
  }
}
</style>
