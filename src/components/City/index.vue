<template>
  <div>
    <el-row :gutter="10">
      <el-col :span="5" style="width:25%">
        <el-select
          v-model="data.provinceValue"
          placeholder="请选择"
          @change="selectProvince"
        >
          <el-option
            v-for="item in data.provinceData"
            :label="item.PROVINCE_NAME"
            :value="item.PROVINCE_CODE"
            :key="item.PROVINCE_ID"
          ></el-option>
        </el-select>
      </el-col>
      <el-col :span="5" style="width:24%">
        <el-select
          v-model="data.cityValue"
          placeholder="请选择"
          @change="selectCity"
        >
          <el-option
            v-for="item in data.cityData"
            :label="item.CITY_NAME"
            :value="item.CITY_CODE"
            :key="item.CITY_ID"
          ></el-option>
        </el-select>
      </el-col>
      <el-col :span="5" style="width:24%">
        <el-select
          v-model="data.areaValue"
          placeholder="请选择"
          @change="selectArea"
        >
          <el-option
            v-for="item in data.areaData"
            :label="item.AREA_NAME"
            :value="item.AREA_CODE"
            :key="item.AREA_ID"
          ></el-option>
        </el-select>
      </el-col>
      <el-col :span="5" style="width:25%">
        <el-select
          v-model="data.streetValue"
          placeholder="请选择"
          @change="selectStreet"
        >
          <el-option
            v-for="item in data.streetData"
            :label="item.STREET_NAME"
            :value="item.STREET_CODE"
            :key="item.STREET_ID"
          ></el-option>
        </el-select>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import { onMounted, reactive, watch } from '@vue/composition-api'
import { get_city } from '@/api/city.js'
import { getCity, setCity } from '@/utils/city_cache.js'
export default {
  props: {
    region: {
      type: Object,
      default: {},
    },
    type: {
      type: Number,
      default: 0,
    },
  },
  setup(props, { emit, root, refs }) {
    const data = reactive({
      flag: true,
      provinceLabel: '',
      provinceValue: '',
      provinceData: [],

      cityLabel: '',
      cityValue: '',
      cityData: [],

      areaLabel: '',
      areaValue: '',
      areaData: [],

      streetLabel: '',
      streetValue: '',
      streetData: [],
    })
    const rest = (type) => {
      let clearType = {
        // all: [' provine', 'city', 'area', 'street'],
        all: ['province', 'city', 'area', 'street'],
        provine: ['city', 'area', 'street'],
        city: ['area', 'street'],
        area: ['street'],
      }
      clearType[type].map((type) => {
        data[`${type}Value`] = ''
        data[`${type}Data`] = []
      })
    }
    // methods
    const findLabel = (id, level) => {
      data[`${level}Data`].map((item) => {
        if (id == item[`${level.toUpperCase()}_COOE`]) {
          data[`${level}Label`] = item[`${level.toUpperCase()}_NAME`]
          return
        }
      })
    }
    const selectProvince = (value) => {
      // 标记省选择
      data.flag = true
      // 每次选择清空后面的选项内容
      rest('provine')
      get_city({
        type: 'city',
        province_code: value,
      }).then((res) => {
        data.cityData = res.data.data.data
      })
      findLabel(value, 'province')
    }
    const selectCity = (value) => {
      // 标记市选择
      data.flag = true
      rest('city')
      get_city({
        type: 'area',
        city_code: value,
      }).then((res) => {
        data.areaData = res.data.data.data
      })
      findLabel(value, 'city')
    }
    const selectArea = (value) => {
      // 标记省选择
      data.flag = true
      rest('area')
      get_city({
        type: 'street',
        area_code: value,
      }).then((res) => {
        data.streetData = res.data.data.data
      })
      findLabel(value, 'area')
    }
    const selectStreet = (value) => {
      data.flag = true
      findLabel(value, 'street')
    }
    const getProvince = () => {
      get_city({
        type: 'province',
      }).then((res) => {
        data.provinceData = res.data.data.data
      })
    }
    // 编辑的时候选中默认
    const selectDefaultvalue = () => {
      const p = props.region.province
      const c = props.region.city
      const a = props.region.area
      const s = props.region.street
      // 将对应的 id 转化为 城市信息

      // 获取对应的缓存
      const cityName = getCity([p, c, a, s].join('/')).split('/')
      ;(data.provinceValue = cityName[0]),
        (data.cityValue = cityName[1]),
        (data.areaValue = cityName[2]),
        (data.streetValue = cityName[3])
      data.flag = false
    }
    const cache_city = () => {
      let provine = data.provinceValue
      let city = data.cityValue
      let area = data.areaValue
      let street = data.streetValue
      if (provine && city && area && street) {
        let key = [provine, city, area, street].join('/')
        let city_value = [
          data.provinceLabel,
          data.cityLabel,
          data.areaLabel,
          data.streetLabel,
        ].join('/')
        setCity(key, city_value)
      }
    }
    // 监听父组件传递的region属性 如果region为空 让当前的选中清空
    watch(
      () => props.region,
      (value) => {
        // 什么时候是重置
        if (Object.keys(value).length === 0) {
          //父组件重置了
          rest('all')
        }
      }
    )
    // 通知父组件选择的是什么地址信息
    watch(
      [
        () => data.provinceValue,
        () => data.cityValue,
        () => data.areaValue,
        () => data.streetValue,
      ],
      ([provinceValue, cityValue, areaValue, streetValue]) => {
        const cityObject = {
          province: provinceValue,
          city: cityValue,
          area: areaValue,
          street: streetValue,
        }
        if (data.flag) {
          emit('update:region', cityObject)
          // console.log(cityObject)
        }
      }
    )
    onMounted(() => {
      getProvince()
    })
    return {
      data,
      selectProvince,
      selectCity,
      selectArea,
      selectDefaultvalue,
      selectStreet,
      getProvince,
      cache_city,
    }
  },
}
</script>
<style lang="scss" scoped></style>
