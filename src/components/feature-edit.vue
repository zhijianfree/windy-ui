<template>
  <div>
    <div v-if="data.type == 'Map'">
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
    <div v-else-if="data.type == 'Array'">
      <div class="array-plus">
        <span @click="addParam"
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
            <el-col :span="20">
              <el-row
                v-for="(obj, index) in data.initData.range"
                :key="index"
                class="item-line"
              >
                <el-col :span="4">
                  <div class="param_name">{{ obj.paramKey }}:</div>
                </el-col>
                <el-col :span="15">
                  <FeatureEdit
                    :point="pointId"
                    :feature="obj"
                    :isEdit="true"
                    @refreshData="refreshArrayValue($event, order)"
                  />
                </el-col>
              </el-row>
            </el-col>
            <el-col :span="4">
              <div class="array-delete">
                <span @click="deleteArray(order)"
                  ><i class="el-icon-remove-outline" /> 删除</span
                >
              </div>
            </el-col>
          </el-row>
        </div>
      </div>
      <div v-else>
        <div class="array-show-box">
          <el-input
            v-for="(valueItem, order) in data.value"
            :key="order"
            size="small"
            :disabled="!isEdit"
            v-model="valueItem.text"
            @input="notifyData"
          ></el-input>
        </div>
      </div>
    </div>
    <div v-else-if="data.type == 'Integer'">
      <el-input-number
        size="small"
        :disabled="!isEdit"
        v-model="data.value"
        @input="notifyData"
        controls-position="right"
        :placeholder="data.description"
      ></el-input-number>
    </div>
    <!-- <div v-else-if="data.type == 'Boolean'">
      <el-switch
        size="small"
        v-model="data.value"
        active-color="#13ce66"
        inactive-color="#909399"
      >
      </el-switch>
    </div> -->
    <div v-else-if="data.type == 'Float'">
      <el-input-number
        size="small"
        :precision="2"
        :step="0.1"
        :disabled="!isEdit"
        v-model="data.value"
        @input="notifyData"
        controls-position="right"
        :placeholder="data.description"
      ></el-input-number>
    </div>
    <div v-else-if="data.type == 'Double'">
      <el-input-number
        size="small"
        :precision="2"
        :step="0.1"
        :disabled="!isEdit"
        v-model="data.value"
        @input="notifyData"
        controls-position="right"
        :placeholder="data.description"
      ></el-input-number>
    </div>
    <el-input
      v-else
      size="small"
      :disabled="!isEdit"
      v-model="data.value"
      @input="notifyData"
      :placeholder="data.description"
    >
      <el-button
        slot="append"
        @click="diaplayString(data.value)"
        icon="el-icon-full-screen"
      ></el-button
    ></el-input>

    <el-dialog title="数据编辑" :visible.sync="showDetail" @close="closeEditor">
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
      if (this.data.type == 1) {
        this.paramList = this.matchMap(this.data.value)
      }
      if (!val.value && val.initData) {
        this.data.value = val.initData.data
      }
      if (!this.data.value && this.data.initData.rangeType == 'Object') {
        this.data.value = []
      }
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
    },
    addParam() {
      this.data.value.push({})
    },
    refreshArrayValue(event, index) {
      console.log('refreshArrayValue', event, index)
      this.data.value[index][event.item.paramKey] = event.item.value
      console.log(this.data.value)
    },
    diaplayString(str) {
      this.showDetail = true
      this.jsonStr = str
    },
    notifyData() {
      let data = this.data
      if (this.data.type == 1) {
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
  },
  created() {
    this.pointId = this.point
    this.data = this.feature
    if (!this.data.value && this.data.initData) {
      this.data.value = this.data.initData.data
    }

    if (!this.data.value && this.data.initData.rangeType == 'Object') {
      this.data.value = []
    }

    // if (!this.data.value && this.data.type == 'Boolean') {
    //   this.data.value = false
    // }

    if (this.data.type == 1) {
      this.paramList = this.matchMap(this.data.value)
    }
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
