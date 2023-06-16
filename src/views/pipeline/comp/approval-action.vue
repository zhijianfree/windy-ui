<template>
  <div>
    <el-divider content-position="left">动作触发配置</el-divider>
    <el-form-item label="参数列表">
      <el-row
        v-for="(item, index) in paramList"
        :key="index"
        class="config-line"
      >
        <el-col :span="5">
          <el-input
            placeholder="输入参数名"
            v-model="item.name"
            disabled
            @input="notifyParam"
          />
        </el-col>
        <el-col :span="1" class="separate-line">-</el-col>
        <el-col :span="6">
          <el-input
            placeholder="输入参数描述"
            v-model="item.description"
            disabled
            @input="notifyParam"
          />
        </el-col>
        <el-col :span="1" class="separate-line">-</el-col>
        <el-col :span="5">
          <el-input
            placeholder="输入默认值"
            v-model="item.value"
            @input="notifyParam"
          >
            <span slot="suffix">秒</span>
          </el-input>
        </el-col>
      </el-row>
    </el-form-item>
  </div>
</template>
<script>
export default {
  props: {
    form: Object,
  },
  watch: {
    form: {
      handler(val) {
        console.log('监听到新值', val)
        this.actionForm = val
        if (val.paramList && val.paramList.length > 0) {
          this.paramList = val.paramList
        }
      },
      deep: true,
      immediate: true,
    },
  },
  data() {
    return {
      actionForm: {},
      paramList: [
        { name: 'maxWait', description: '审批最大等待时长(秒)', value: 604800 },
      ],
      operators: [
        { label: 'equals', value: 'equal' },
        { label: '等于', value: '=' },
        { label: '大于', value: '>' },
        { label: '大于等于', value: '>=' },
        { label: '小于', value: '<' },
        { label: '小于等于', value: '<=' },
      ],
      typeList: [
        { label: '数字类型', value: 'Integer' },
        { label: '字符串类型', value: 'String' },
      ],
    }
  },
  methods: {
    notifyParam() {
      this.$emit('notifyParam', {
        paramList: this.paramList,
        compareList: [],
      })
    },
  },
  created() {
    this.dataForm = this.form
    this.notifyParam()
  },
}
</script>
<style scoped>
.separate-line {
  text-align: center;
}
.config-line {
  margin: 10px 0px;
}
</style>
