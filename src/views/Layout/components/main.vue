<template>
  <div id="main_wrap">
    <router-view></router-view>
  </div>
</template>

<script>
export default {}
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
