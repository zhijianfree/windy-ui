<template>
  <div>
    <el-divider content-position="left">动作触发配置</el-divider>
    <el-form-item
      v-for="(item, index) in paramList"
      :key="index"
      :label="item.description"
    >
      <el-input
        placeholder="输入默认值"
        v-model="item.value"
        @input="notifyParam"
      >
        <span slot="suffix">秒</span>
      </el-input>
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
        this.actionForm = val
        if (val.paramList && val.paramList.length > 0) {
          this.presetValue(val.paramList, this.paramList, 'name')
        }
        this.notifyParam()
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
    presetValue(source, target, key) {
      let map = {}
      source.forEach((e) => {
        map[e[key]] = e.value
      })

      target.forEach((e) => {
        let presetValue = map[e[key]]
        if (presetValue) {
          e.value = presetValue
        }
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
