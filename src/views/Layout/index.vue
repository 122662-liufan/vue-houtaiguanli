<template>
  <div :class="[isCollapse ? 'close' : 'open']">
    <LayoutHeader />
    <LayoutNav />
    <LayoutMain />
  </div>
</template>

<script>
import { computed } from '@vue/composition-api'
import LayoutHeader from './components/head'
import LayoutMain from './components/main'
import LayoutNav from './components/nav'
export default {
  name: 'Home',
  setup(props, { refs, root }) {
    const isCollapse = computed(() => root.$store.getters['app/isCollapse'])
    return {
      isCollapse,
    }
  },
  components: {
    LayoutHeader,
    LayoutMain,
    LayoutNav,
  },
}
</script>
