<template>
  <svg :class="svgClass" aria-hidden="true">
    <use :xlink:href="name"></use>
  </svg>
</template>
<script>
import { onMounted, reactive, ref, computed } from '@vue/composition-api'
export default {
  // 接收 简化写法
  // props: ['iconName'],

  // 接收 复杂写法
  props: {
    iconName: {
      type: String,
      default: '',
      required: false,
    },
    // 可以进行单独样式设置
    iconClass: {
      type: String,
      default: '',
    },
  },
  setup(props, { root, refs }) {
    // console.log('-->', props.iconName)
    // console.log('-->', props.iconClass)
    const svgClass = computed(() => {
      // 传的话就传两个
      if (props.iconClass) {
        return `svg-icon ${props.iconName}`
      } else {
        // 也可以不传
        return `svg-icon`
      }
    })
    // 计算属性
    const name = computed(() => `#icon-${props.iconName}`)
    return {
      svgClass,
      name,
    }
  },
}
</script>
<style lang="scss" scoped>
.svg-icon {
  width: 1.5em;
  height: 1.5em;
  font-size: 1.5em;
  margin-right: 20px;
  fill: currentColor;
  color: #fff;
}
// 可以单独设置css
// .info {
//   color: red;
// }
</style>
