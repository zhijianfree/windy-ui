<template>
  <div>
    <el-divider content-position="left">动作触发配置</el-divider>
    <el-form-item
      v-for="(item, index) in paramList"
      :key="index"
      :label="item.description"
    >
      <el-input
        placeholder="在流水线选择部署的环境"
        v-model="item.value"
        disabled
        @input="notifyParam"
      >
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
        this.dataForm = val
        if (val.paramList && val.paramList.length > 0) {
          this.presetValue(val.paramList, this.paramList, 'name')
        }
        if (val.compareResults && val.compareResults.length > 0) {
          this.presetValue(val.compareResults, this.compareList, 'compareKey')
        }
        this.notifyParam()
      },
      deep: true,
      immediate: true,
    },
  },
  data() {
    return {
      dataForm: {},
      paramList: [
        { name: 'envId', description: '环境Id', value: '', type: 'select' },
      ],
      compareList: [
        {
          compareKey: 'status',
          description: '部署状态',
          value: '',
          valueType: 'Integer',
          operator: '=',
          showCompare: false,
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
      deployModes: [
        { label: 'Jar部署', value: 'JAR' },
        { label: '镜像部署', value: 'MIRROR' },
      ],
    }
  },
  methods: {
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
    notifyParam() {
      this.$emit('notifyParam', {
        paramList: this.paramList,
        compareList: this.compareList,
        actionUrl: this.dataForm.actionUrl,
        queryUrl: this.dataForm.queryUrl,
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
