<template>
  <div class="line">
    <el-row v-for="(item, num) in compareData" :key="num">
      <el-col :span="6">
        <div class="item">
          <el-input
            size="mini"
            :disabled="!isEdit"
            v-model="item.compareKey"
            @input="notifyData"
            placeholder="请输入响应参数"
          ></el-input>
        </div>
      </el-col>
      <el-col :span="5">
        <div class="item">
          <el-select
            :disabled="!isEdit"
            v-model="item.operator"
            placeholder="选择运算符"
            size="mini"
          >
            <el-option
              v-for="(item, index) in operatorList"
              :key="index"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </div>
      </el-col>
      <el-col :span="12">
        <div class="item">
          <el-input
            size="mini"
            :disabled="!isEdit"
            @input="notifyData"
            v-model="item.expectValue"
            placeholder="请输入期望值"
          >
            <template slot="append">
              <i class="el-icon-full-screen" />
            </template>
          </el-input>
        </div>
      </el-col>
      <el-col :span="1">
        <div class="delete-div">
          <i
            class="el-icon-remove-outline delete-icon"
            v-bind:class="{ 'disable-icon': !isEdit }"
            @click="deleteValueItem(compareData, num)"
          />
        </div>
      </el-col>
    </el-row>
    <div
      class="add-line"
      @click="addItem"
      v-bind:class="{ 'disable-select': !isEdit }"
    >
      <div class="add-button"><i class="el-icon-plus" /> 新增</div>
    </div>
  </div>
</template>
<script>
import featureApi from '../http/Feature'
export default {
  props: {
    data: Array,
    point: String,
    isEdit: Boolean,
  },
  data() {
    return {
      operator: '',
      operatorList: [],
      compareData: [],
      disableSelect: 'disable-select',
      pointId: '',
    }
  },
  methods: {
    deleteValueItem(array, index) {
      array.splice(index, 1)
      if (array.length == 0) {
        array.push({
          keyName: '',
          keyValue: '',
        })
      }
      this.notifyData()
    },
    notifyData() {
      this.$emit('refreshCompare', {
        data: this.compareData,
        pointId: this.pointId,
      })
    },
    addItem() {
      this.compareData.push({})
    },
    getOperators() {
      this.operatorList = []
      featureApi.getExecuteOperators().then((res) => {
        res.data.forEach((e) => {
          this.operatorList.push({
            label: e,
            value: e,
          })
        })
      })
    },
    isEmptyArray(array) {
      if (array == null || array == undefined || array.length == 0) {
        return true
      }

      return false
    },
  },
  created() {
    this.pointId = this.point
    this.compareData = this.data
    if (this.isEmptyArray(this.compareData)) {
      this.compareData = [{}]
    }
    this.getOperators()
  },
}
</script>
<style scoped>
.add-button {
  border: 1px dashed #dcdfe6;
  border-radius: 3px;
  width: 200px;
  height: 30px;
  line-height: 30px;
  text-align: center;
  vertical-align: middle;
  position: absolute;
  top: 0px;
  left: 50%;
  transform: translateX(-50%);
  cursor: pointer;
}
.add-line {
  position: relative;
  margin: 10px 20px;
}
.line {
  padding: 5px 20px;
  min-height: 100px;
}
.item {
  margin: 2px 5px;
}
.delete-icon {
  cursor: pointer;
  font-size: 16px;
  color: #f56c6c;
}
.delete-div {
  height: 30px;
  line-height: 30px;
  vertical-align: middle;
}
.disable-select {
  color: #c0c4cc;
  border-color: #f2f6fc;
  pointer-events: none;
}
.disable-icon {
  display: none;
}
</style>
