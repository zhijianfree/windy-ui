<template>
  <div>
    <el-divider content-position="left">动作触发配置</el-divider>
    <el-form-item label="动作触发地址">
      <el-input
        placeholder="请输入执行点名称"
        v-model="dataForm.actionUrl"
        @input="notifyParam"
      />
    </el-form-item>

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
            @input="notifyParam"
          />
        </el-col>
        <el-col :span="1" class="separate-line">-</el-col>
        <el-col :span="6">
          <el-input
            placeholder="输入参数描述"
            v-model="item.description"
            @input="notifyParam"
          />
        </el-col>
        <el-col :span="1" class="separate-line">-</el-col>
        <el-col :span="5">
          <el-input
            placeholder="输入默认值"
            v-model="item.value"
            @input="notifyParam"
          />
        </el-col>
      </el-row>
      <div class="add-btn" @click="addNewItem">新增参数</div>
    </el-form-item>

    <el-divider content-position="left">状态查询配置</el-divider>
    <el-form-item label="状态查询地址">
      <el-input
        placeholder="请输入状态查询地址"
        v-model="dataForm.queryUrl"
        @input="notifyParam"
      />
    </el-form-item>
    <el-form-item label="结果条件列表">
      <el-row
        v-for="(item, index) in compareList"
        :key="index"
        class="config-line"
      >
        <el-col :span="4">
          <el-input
            placeholder="比较Key"
            v-model="item.compareKey"
            @input="notifyParam"
          />
        </el-col>
        <el-col :span="1" class="separate-line">-</el-col>
        <el-col :span="4">
          <el-input
            placeholder="描述"
            v-model="item.description"
            @input="notifyParam"
          />
        </el-col>
        <el-col :span="1" class="separate-line">-</el-col>
        <el-col :span="4">
          <el-select
            v-model="item.valueType"
            placeholder="选择数据类型"
            @change="notifyParam"
          >
            <el-option
              v-for="item in typeList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="1" class="separate-line">-</el-col>
        <el-col :span="4">
          <el-select
            v-model="item.operator"
            placeholder="选择运算服符"
            @change="notifyParam"
          >
            <el-option
              v-for="item in operators"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="1" class="separate-line">-</el-col>
        <el-col :span="4">
          <el-input
            placeholder="设置期望值"
            v-model="item.value"
            @input="notifyParam"
          />
        </el-col>
      </el-row>
      <div class="add-btn" @click="addNewCondition">新增条件</div>
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
          this.paramList = val.paramList
        }
        if (val.compareResults && val.compareResults.length > 0) {
          this.compareList = val.compareResults
        }
      },
      deep: true,
      immediate: true,
    },
  },
  data() {
    return {
      dataForm: {},
      paramList: [{}],
      compareList: [{ showCompare: true }],
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
        actionUrl: this.dataForm.actionUrl,
        queryUrl: this.dataForm.queryUrl,
      })
    },
    addNewItem() {
      this.paramList.push({})
    },
    addNewCondition() {
      this.compareList.push({ showCompare: true })
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
.add-btn {
  height: 30px;
  line-height: 30px;
  text-align: center;
  vertical-align: middle;
  border: 1px dashed #ccc;
  margin: 10px 20%;
  cursor: pointer;
}
.config-line {
  margin: 10px 0px;
}
</style>
