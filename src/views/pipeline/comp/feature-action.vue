<template>
  <div>
    <el-divider content-position="left">动作触发配置</el-divider>
    <el-form-item
      v-for="(item, index) in paramList"
      :key="index"
      :label="item.description"
    >
      <el-input
        placeholder="编辑流水线时选择"
        v-model="item.value"
        disabled
        @input="notifyParam"
      >
      </el-input>
    </el-form-item>

    <el-divider content-position="left">状态查询配置</el-divider>
    <el-form-item
      v-for="(item, index) in compareList"
      :key="index"
      :label="item.description"
    >
      <el-input-number
        v-model="item.value"
        @change="notifyParam"
        :min="50"
        :max="100"
        label="请输入默认值"
      ></el-input-number>
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
        if (val.compareResults && val.compareResults.length > 0) {
          this.presetValue(val.compareResults, this.compareList, 'compareKey')
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
        {
          name: 'taskId',
          description: '选择任务',
          value: '',
          type: 'select',
        },
      ],
      compareList: [
        {
          compareKey: 'percent',
          description: '执行成功率',
          operator: '>=',
          valueType: 'Integer',
          value: '90',
          showCompare: true,
        },
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
        compareList: this.compareList,
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
