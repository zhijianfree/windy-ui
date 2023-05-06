<template>
  <div>
    <div v-if="data.type == 1">
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
        <el-col :span="10">
          <el-input
            size="mini"
            :disabled="!isEdit"
            @input="notifyData"
            v-model="item.keyValue"
            placeholder="请输入值"
          ></el-input>
        </el-col>
        <el-col :span="2">
          <div
            v-if="isEdit"
            @click="deleteValueItem(data.value, num)"
            class="delete-icon"
          >
            <i class="el-icon-remove-outline" />
          </div>
        </el-col>
      </el-row>
    </div>
    <div v-else-if="data.type == 2">
      <el-select
        v-model="data.value"
        @change="notifyData"
        :disabled="!isEdit"
        size="small"
        :placeholder="'请选择' + data.description"
      >
        <el-option
          v-for="item in data.defaultValue.range"
          :key="item"
          :label="item"
          :value="item"
        >
        </el-option>
      </el-select>
    </div>
    <el-input
      v-else
      size="small"
      :disabled="!isEdit"
      v-model="data.value"
      @input="notifyData"
      :placeholder="data.description"
    ></el-input>
  </div>
</template>
<script>
export default {
  props: {
    feature: Object,
    isEdit: Boolean,
    point: String,
  },
  watch: {
    feature(val) {
      console.log('1111111')
      this.data = JSON.parse(JSON.stringify(val))
      if (this.data.type == 1) {
        this.paramList = this.matchMap(this.data.value)
      }
      if (!val.value) {
        this.data.value = val.defaultValue.defaultValue
      }
    },
  },
  data() {
    return {
      pointId: '',
      data: {},
      paramList: [],
      uniqId: '',
    }
  },
  methods: {
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
      array.splice(index, 1)
      if (array.length == 0) {
        array.push({
          keyName: '',
          keyValue: '',
        })
      }
      this.notifyData()
    },
  },
  created() {
    this.pointId = this.point
    this.data = this.feature
    if (!this.data.value) {
      this.data.value = this.data.defaultValue.defaultValue
    }

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
</style>
