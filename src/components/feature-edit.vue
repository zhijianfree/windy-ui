<template>
  <div>
    <!-- 数组类型数据展示开始 -->
    <div v-if="data.type == 'Array'">
      <div class="array-plus">
        <span @click="addParam" v-if="isEdit"
          ><i class="el-icon-circle-plus-outline" /> 新增</span
        >
      </div>
      <div v-if="data.initData.rangeType == 'Object'">
        <div
          class="array-show-box"
          v-for="(valueItem, order) in data.value"
          :key="order"
        >
          <el-row>
            <el-col :span="22">
              <el-row
                v-for="(obj, index) in valueItem.rangeList"
                :key="index"
                class="item-line"
              >
                <el-col :span="4">
                  <div class="param_name">{{ obj.paramKey }}:</div>
                </el-col>
                <el-col :span="20">
                  <FeatureEdit
                    :point="pointId"
                    :feature="obj"
                    :isEdit="isEdit"
                    @refreshData="refreshArrayValue($event, order)"
                  />
                </el-col>
              </el-row>
            </el-col>
            <el-col :span="2">
              <div class="array-delete" v-if="isEdit">
                <span @click="deleteArray(order)"
                  ><i class="el-icon-remove-outline" /> 删除</span
                >
              </div>
            </el-col>
          </el-row>
        </div>
      </div>
      <div v-else>
        <div
          class="array-show-box"
          v-for="(item, index) in paramList"
          :key="index"
        >
          <el-row>
            <el-col :span="20">
              <el-input
                size="small"
                :disabled="!isEdit"
                v-model="item.content"
                @input="refreshList(index)"
              ></el-input>
            </el-col>
            <el-col :span="4">
              <div class="array-delete" v-if="isEdit">
                <span @click="deleteList(index)"
                  ><i class="el-icon-remove-outline" /> 删除</span
                >
              </div>
            </el-col>
          </el-row>
        </div>
      </div>
    </div>
    <!-- 数组类型数据展示结束 -->

    <!-- Object数据类型展示开始 -->
    <div v-else-if="data.type == 'Object'">
      <el-row v-for="(obj, index) in paramList" :key="index" class="item-line">
        <el-col :span="4">
          <div class="param_name">{{ obj.paramKey }}:</div>
        </el-col>
        <el-col :span="15">
          <FeatureEdit
            :point="pointId"
            :feature="obj"
            :isEdit="isEdit"
            @refreshData="refreshObjectValue($event)"
          />
        </el-col>
      </el-row>
    </div>
    <!-- Object数据类型展示结束 -->

    <!-- Map数据类型展示开始 -->
    <div v-else-if="data.type == 'Map'">
      <el-row v-for="(item, num) in paramList" :key="num">
        <el-col :span="10">
          <el-input
            size="mini"
            :disabled="!isEdit"
            v-model="item.keyName"
            @input="notifyData"
            placeholder="请输入键"
          ></el-input>
        </el-col>
        <el-col :span="2">
          <div class="header-line">-</div>
        </el-col>
        <el-col :span="9">
          <el-input
            size="mini"
            :disabled="!isEdit"
            @input="notifyData"
            v-model="item.keyValue"
            placeholder="请输入值"
          >
          </el-input>
        </el-col>
        <el-col :span="3">
          <div v-if="isEdit" class="op-icon">
            <i
              class="el-icon-remove-outline"
              @click="deleteValueItem(data.value, num)"
            />
            <i class="el-icon-circle-plus-outline" @click="addValueItem" />
          </div>
        </el-col>
      </el-row>
    </div>
    <!-- Map数据类型展示结束 -->

    <!-- Integer数据类型展示开始 -->
    <div v-else-if="data.type == 'Integer' || data.type == 'Long'">
      <el-input-number
        size="small"
        :disabled="!isEdit"
        v-model="data.value"
        @input="notifyData"
        @pointerdown.stop.native
        controls-position="right"
        :placeholder="data.description"
      ></el-input-number>
    </div>
    <!-- Integer数据类型展示结束 -->

    <!-- Integer数据类型展示开始 -->
    <div v-else-if="data.type == 'Boolean'">
      <el-switch
        size="small"
        :disabled="!isEdit"
        v-model="data.value"
        @change="notifyData"
        active-color="#13ce66"
        inactive-color="#909399"
      >
      </el-switch>
    </div>
    <!-- Integer数据类型展示结束 -->

    <!-- Integer数据类型展示开始 -->
    <div v-else-if="data.type == 'Float'">
      <el-input-number
        size="small"
        :precision="2"
        :step="0.1"
        :disabled="!isEdit"
        v-model="data.value"
        @input="notifyData"
        @pointerdown.stop.native
        controls-position="right"
        :placeholder="data.description"
      ></el-input-number>
    </div>
    <!-- Integer数据类型展示结束 -->

    <!-- Integer数据类型展示开始 -->
    <div v-else-if="data.type == 'Double'">
      <el-input-number
        size="small"
        :precision="2"
        :step="0.1"
        :disabled="!isEdit"
        v-model="data.value"
        @input="notifyData"
        @pointerdown.stop.native
        controls-position="right"
        :placeholder="data.description"
      ></el-input-number>
    </div>
    <!-- Integer数据类型展示结束 -->

    <!-- 默认数据类型展示开始 -->
    <el-input
      v-else
      size="small"
      :disabled="!isEdit"
      v-model="data.value"
      @input="notifyData"
      @pointerdown.stop.native
      :placeholder="data.description"
    >
      <el-button
        slot="append"
        @click="diaplayString(data.value)"
        icon="el-icon-full-screen"
      ></el-button
    ></el-input>
    <!-- 默认数据类型展示结束 -->

    <el-dialog
      title="数据编辑"
      :visible.sync="showDetail"
      @close="closeEditor"
      width="60%"
    >
      <monaco ref="editer" :codes="jsonStr" :readonly="false"></monaco>
    </el-dialog>
  </div>
</template>
<script>
import FeatureEdit from '@/components/feature-edit'
import monaco from '@/components/MonacoEditor.vue'
export default {
  name: 'FeatureEdit',
  props: {
    feature: Object,
    isEdit: Boolean,
    point: String,
  },
  components: {
    FeatureEdit,
    monaco,
  },
  watch: {
    feature(val) {
      this.data = JSON.parse(JSON.stringify(val))
      this.exchangeDataValue()
    },
  },
  data() {
    return {
      pointId: '',
      data: {
        value: [],
      },
      paramList: [],
      uniqId: '',
      jsonStr: '',
      showDetail: false,
    }
  },
  methods: {
    closeEditor() {
      this.data.value = this.$refs.editer.getValue()
    },
    deleteArray(index) {
      this.data.value.splice(index, 1)
      this.notifyData()
    },
    addParam() {
      if (this.data.initData.rangeType == 'Object') {
        let rangeList = []
        this.data.initData.range.forEach((e) => {
          let item = JSON.parse(JSON.stringify(e))
          item.value = null
          rangeList.push(item)
        })
        this.data.value.push({
          rangeList: rangeList,
        })
      } else {
        this.paramList.push({
          content: '',
        })
      }

      this.$forceUpdate()
    },
    deleteList(index) {
      this.paramList.splice(index, 1)
      this.refreshList()
    },
    refreshObjectValue(event) {
      this.data.value[event.item.paramKey] = event.item.value
      this.notifyData()
    },
    refreshList() {
      let array = []
      this.paramList.forEach((e) => {
        array.push(e.content)
      })
      this.data.value = array
      this.notifyData()
    },
    refreshArrayValue(event, index) {
      this.data.value[index][event.item.paramKey] = event.item.value
      this.notifyData()
    },
    diaplayString(str) {
      this.showDetail = true
      this.jsonStr = str
    },
    notifyData() {
      let data = this.data
      console.log(data)
      if (this.data.type == 'Map') {
        let item = {}
        this.paramList.forEach((e) => {
          item[e.keyName] = e.keyValue
        })
        data.value = item
        data.paramKey = this.data.paramKey
      }

      this.$emit('refreshData', {
        item: data,
        pointId: this.pointId,
      })
      this.$forceUpdate()
    },
    matchMap(map) {
      let array = []
      if (map == null || map == undefined) {
        array.push({
          keyName: '',
          keyValue: '',
        })
        return array
      }

      for (var name in map) {
        array.push({
          keyName: name,
          keyValue: map[name],
        })
      }

      if (array.length == 0) {
        array.push({
          keyName: '',
          keyValue: '',
        })
      }
      return array
    },
    deleteValueItem(array, index) {
      this.paramList.splice(index, 1)
      if (this.paramList.length == 0) {
        this.paramList.push({
          keyName: '',
          keyValue: '',
        })
      }
      this.notifyData()
    },
    addValueItem() {
      this.paramList.push({
        keyName: '',
        keyValue: '',
      })
    },
    exchangeDataValue() {
      if (!this.data.value && this.data.type == 'Boolean') {
        this.data.value = false
      }

      if (this.data.type == 'Map') {
        this.paramList = this.matchMap(this.data.value)
      }
      //====数组数据处理开始=====
      if (
        this.data.value &&
        this.data.type == 'Array' &&
        this.data.initData.rangeType != 'Object'
      ) {
        this.paramList = []
        this.data.value.forEach((e) => {
          this.paramList.push({ content: e })
        })
      }

      if (
        this.data.value &&
        this.data.initData &&
        this.data.initData.rangeType == 'Object'
      ) {
        let rangList = this.data.initData.range
        this.data.value.forEach((e) => {
          rangList.forEach((ele) => {
            ele.value = e[ele.paramKey]
          })
          e.rangeList = JSON.parse(JSON.stringify(rangList))
        })
      }
      if (!this.data.value && this.data.type == 'Array') {
        this.data.value = []
      }
      //====数组数据处理结束=====

      //====Object数据处理开始====
      if (this.data.type == 'Object') {
        this.data.value = this.data.value ? this.data.value : null
        let objData = JSON.parse(JSON.stringify(this.data))
        this.paramList = []
        objData.initData.range.forEach((e) => {
          if (this.data.value) {
            e.value = this.data.value[e.paramKey]
          }
          this.paramList.push(e)
        })
      }
      //====Object数据处理结束====

      if (!this.data.value && this.data.initData && this.data.initData.data) {
        this.data.value = this.data.initData.data
      }
    },
  },
  created() {
    this.pointId = this.point
    this.data = this.feature
    this.exchangeDataValue()
  },
}
</script>
<style scoped>
.header-line {
  text-align: center;
}

.op-icon i {
  margin-left: 10px;
  font-size: 16px;
  cursor: pointer;
}
.item-line {
  margin: 10px 0px;
}

.array-show-box {
  padding: 4px 8px;
  background-color: #ecf8ff;
  border-radius: 4px;
  border-left: 10px solid #50bfff;
  margin: 0px 10px 10px 10px;
}
.array-plus {
  margin: 10px;
}
.array-plus span {
  cursor: pointer;
}
.array-delete {
  cursor: pointer;
  display: flex;
  color: #f56c6c;
  justify-content: center; /* 水平居中 */
  align-items: center; /* 垂直居中 */
}
.param_name {
  height: 30px;
  line-height: 30px;
  float: right;
  margin-right: 10px;
  color: #606266;
  vertical-align: middle;
  text-align: center;
}
</style>
