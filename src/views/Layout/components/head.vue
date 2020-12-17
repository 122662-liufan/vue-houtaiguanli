<template>
  <div id="header_wrap">
    <div class="pull-left header-icon" @click="toggleMenu">
      <svg-icon iconName="menu" />
    </div>

    <div class="pull-right">
      <div class="pull-left userinfo">
        <img src="../../../assets/toux.jpg" alt="" />
      </div>

      <div class="pull-right header-icon aa" @click="exit">
        <svg-icon iconName="exit" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Header',
  setup(props, { root }) {
    const toggleMenu = () => {
      root.$store.commit('app/SET_COLLAPSE')
    }
    const exit = () => {
      root.$store.dispatch('app/exit').then((res) => {
        root.$router.push({
          name: 'Login',
        })
      })
    }
    return {
      toggleMenu,
      exit,
    }
  },
}
</script>
<style lang="scss" scoped>
#header_wrap {
  position: fixed;
  top: 0;
  left: $NavWidth;
  right: 0;
  height: $LayoutHeader;
  background-color: #fff;
  @include webkit('transition', all 1s ease 0s);
  .header-icon {
    padding: 10px 20px;
    svg {
      font-size: 20px;
    }
  }

  .userinfo {
    height: $LayoutHeader;
    padding: 0 32px;
    border-right: 1px solid #ccc;
    img {
      width: 30px;
      height: 30px;
      margin-top: 11px;
      display: inline-block;
      border-radius: 50%;
    }
  }
  .aa {
    margin-right: -17px;
  }
}
.open {
  #header_wrap {
    left: $NavWidth;
  }
}

.close {
  #header_wrap {
    left: $NavMinWidth;
  }
}
</style>
