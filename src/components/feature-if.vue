<template>
  <div>
    <div class="for-title">
      <div class="for-start">
        if(
        <el-input
          :disabled="!isEdit"
          v-model="condition"
          @input="notifyData"
          size="mini"
          class="condition-input"
          inline
        />
        )
      </div>
      {
      <div>
        <draggable
          class="for-content"
          v-model="points"
          @add="addPoint"
          group="api"
          animation="100"
        >
          <el-collapse accordion :key="uuid">
            <el-collapse-item
              v-for="(executePoint, index) in points"
              :key="index"
              :name="executePoint.randomId"
            >
              <template slot="title">
                <span>
                  {{ executePoint.name }}
                </span>
                <i
                  v-if="isEdit"
                  @click="deleteExecutePoint(index, executePoint.pointId)"
                  class="el-icon-delete delete-point"
                />
              </template>
              <div class="content-item">
                <FeatureTemplate
                  :data="executePoint"
                  :isEdit="isEdit"
                  :type="executePoint.writeType"
                  @refreshData="refreshValue"
                />
              </div>
            </el-collapse-item>
          </el-collapse>
        </draggable>
      </div>
      }
    </div>
  </div>
</template>
<script>
import draggable from 'vuedraggable'
import FeatureTemplate from './feature-template'
import featureApi from '../http/Feature'
export default {
  props: {
    data: Object,
    isEdit: Boolean,
  },
  components: {
    draggable,
    FeatureTemplate,
  },
  data() {
    return {
      executeData: {},
      size: '',
      points: [],
      uuid: '',
      condition: '',
    }
  },
  methods: {
    addPoint(e) {
      this.points[e.newIndex - 1].randomId = this.$utils.randomString(20)
      this.points[e.newIndex - 1].writeType = '1'
      this.points[e.newIndex - 1].sortOrder = e.newIndex
      this.isEdit = true
      this.uuid = new Date().valueOf()
    },
    notifyData() {
      this.refreshValue()
    },
    refreshValue(update) {
      let array = []
      this.points.forEach((e) => {
        if (update && e.randomId == update.data.randomId) {
          e = update.data
        }

        let point = {
          compareDefine: e.compareDefine,
          variableDefine: e.variableDefine,
          executorUnit: {
            method: e.method,
            name: e.name,
            description: e.description,
            service: e.service,
            params: e.params,
          },
          featureId: this.executeData.pointId,
        }
        array.push(point)
      })

      let data = JSON.parse(JSON.stringify(this.executeData))
      data.method = this.condition
      data.executePoints = JSON.parse(JSON.stringify(array))
      this.$emit('refreshData', {
        data: data,
      })
    },
    deleteExecutePoint(index, pointId) {
      this.$confirm('确认删除用例执行点?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        featureApi.deleteExecutePoint(pointId).then((res) => {
          if (res.data == 1) {
            this.uuid = new Date().valueOf()
            this.forFeatures.splice(index, 1)
            this.updateFeatureList()
            this.$message.success('删除执行点成功')
            return
          }
          this.$message.warning('删除执行点失败')
        })
      })
    },
  },
  created() {
    this.executeData = this.data
    if (this.data.method) {
      this.condition = this.data.method
    }

    this.points = []
    if (this.data.executePoints) {
      this.data.executePoints.forEach((point) => {
        point.executorUnit.randomId = new Date().valueOf()
        let item = point.executorUnit
        item.writeType = '1'
        item.compareDefine = point.compareDefine
        item.variableDefine = point.variableDefine
        this.points.push(item)
      })
    }
  },
}
</script>
<style scoped>
.condition-input {
  width: 80%;
}
.for-title {
  margin: 5px;
  border: 2px dashed #dcdfe6;
  padding: 10px;
  width: 500px;
  border-radius: 4px;
}
.for-content {
  min-height: 100px;
}
.for-start {
  margin: 1px;
  border: 1px dashed #dcdfe6;
  padding: 5px;
}
</style>
