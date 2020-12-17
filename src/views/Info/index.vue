<template>
  <div id="index">
    <div class="space-24"></div>
    <el-row :gutter="14">
      <el-col :span="4">
        <div class="label-warp category">
          <label for="category">类型 :</label>
          <div class="warp-content">
            <el-select
              id="category"
              v-model="category_value"
              placeholder="请选择"
            >
              <el-option label="分类一" value="1"> </el-option>
              <el-option label="分类二" value="2"> </el-option>
            </el-select>
          </div>
        </div>
      </el-col>

      <el-col :span="7">
        <div class="label-warp date">
          <label for="date">日期 :</label>
          <div class="warp-content">
            <el-date-picker
              style="width:100%"
              v-model="date_value"
              type="datetimerange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              default-time="['12:00:00']"
            >
            </el-date-picker>
          </div>
        </div>
      </el-col>

      <el-col :span="4">
        <div class="label-warp key-ward">
          <label for="key-ward">关键字 :</label>
          <div class="warp-content">
            <el-select
              @change="search_keyword"
              id="key-ward"
              style="width:80%"
              v-model="search_key"
              placeholder="ID"
            >
              <el-option
                v-for="item in search_option"
                :label="item.label"
                :value="item.value"
                :key="item.value"
              >
              </el-option>
            </el-select>
          </div>
        </div>
      </el-col>

      <el-col :span="3">
        <el-input v-model="search_input" placeholder="请输入内容"></el-input>
      </el-col>

      <el-col :span="2">
        <el-button type="danger" style="width:100%">搜索</el-button>
      </el-col>

      <el-col :span="4">
        <el-button
          type="danger"
          style="width:45%"
          class="pull-right"
          @click="info_dialog = true"
          >新增</el-button
        >
      </el-col>
    </el-row>

    <div class="space-24"></div>
    <el-row>
      <el-table :data="table_Data" border style="width: 100%" algin="certer">
        <el-table-column type="selection"> </el-table-column>
        <el-table-column prop="title" label="标题" min-width="6">
        </el-table-column>
        <el-table-column prop="category" label="类别" min-width="1">
        </el-table-column>
        <el-table-column prop="date" label="日期" min-width="2">
        </el-table-column>
        <el-table-column prop="user" label="管理人" min-width="1">
        </el-table-column>
        <el-table-column label="操作" min-width="2">
          <template slot-scope="scope">
            <el-button size="mini" type="danger">删除</el-button>
            <el-button size="mini" type="success">编辑</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-row>
    <div class="space-24">
      <el-row>
        <el-col :span="12"><el-button>批量删除</el-button></el-col>
        <el-col :span="12">
          <el-pagination
            class="pull-right"
            background
            :current-page="1"
            :page-sizes="[10, 20, 30]"
            layout="sizes,total,prev, pager, next"
            :total="100"
            @current-change="current_change"
          ></el-pagination
        ></el-col>
      </el-row>

      <!-- 新增弹框 -->
      <el-dialog title="收货地址" :visible.sync="info_dialog" append-to-body>
        11111
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { reactive, ref } from '@vue/composition-api'
export default {
  setup() {
    // ---------------------------------  数据  -----------------------------------
    // 类型的默认数据
    const category_value = ref('')
    // 日期的默认数据
    const date_value = ref('')
    // 搜索框默认的数据
    const search_key = ref('')
    // 搜索框下拉列表
    const search_option = reactive([
      {
        value: 'ID',
        label: 'ID',
      },
      {
        value: 'title',
        label: '标题',
      },
    ])
    // 设置搜索内容框
    const search_input = ref('')
    // 表格数据
    const table_Data = reactive([
      {
        date: '2019-09-10 19:31:31',
        category: '国内信息',
        user: '管理员',
        title: '纽约市长白思豪宣布退出总统竞选 特朗普发布回应',
      },
      {
        date: '2019-09-10 19:31:31',
        category: '国内信息',
        user: '张三',
        title:
          '习近平在中央政协工作会议庆祝中国人民政协成立70周年大会上发表重要讲话',
      },
      {
        date: '2019-09-10 19:31:31',
        category: '国内信息',
        user: '李四',
        title: "斯里巴斯与台当局'断交'系蔡当局上台后断交第7国",
      },
      {
        date: '2019-09-10 19:31:31',
        category: '国内信息',
        user: '王五',
        title: '不选了，纽约市长白思豪宣布退出2020美国大选',
      },
    ])
    // 新增弹框
    const info_dialog = ref(false) //false代表隐藏  true展示
    // --------------------------------- methods ------------------------------------
    const search_keyword = (value) => {
      console.log(value)
    }
    const current_change = (currentPage) => {
      console.log(currentPage)
    }
    return {
      // ref
      date_value,
      category_value,
      search_key,
      search_input,
      // reactive
      search_option,
      table_Data,
      info_dialog,
      // methods
      search_keyword,
      current_change,
    }
  },
}
</script>
<style lang="scss" scoped>
.label-warp {
  &.category {
    // label {
    //   float: left;
    //   width: 60px;
    //   text-align: center;
    //   line-height: 40px;
    //   font-size: 14px;
    // }
    // .warp-content {
    //   margin-left: 60px;
    // }
    @include labelDom(center, 60, 40);
  }
  &.date {
    @include labelDom(center, 60, 40);
  }
  &.key-ward {
    @include labelDom(center, 60, 40);
  }
}
</style>
