<template>
  <div>
    <el-divider content-position="left">动作触发配置</el-divider>
    <el-form-item
      v-for="(item, index) in paramList"
      :key="index"
      :label="item.description"
    >
      <el-radio-group v-model="item.value" @change="notifyParam">
        <el-radio label="1">是</el-radio>
        <el-radio label="false">否</el-radio>
      </el-radio-group>
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
      paramList: [
        {
          name: 'deleteBranch',
          description: '是否删除分支',
          value: 2,
        },
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
        compareList: [],
      })
    },
  },
  created() {
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
