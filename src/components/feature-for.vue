<template>
  <div>
    <div class="for-title">
      <div class="for-start">
        for(int i =0; i {{ str }}
        <el-input
          :disabled="!isEdit"
          v-model="condition"
          @input="notifyData"
          size="mini"
          class="size-input"
          inline
        />
        ; i ++)
      </div>
      {
      <div>
        <draggable
          class="for-content"
          v-model="forFeatures"
          @add="addFeature"
          group="api"
          animation="100"
        >
          <el-collapse accordion :key="uuid">
            <el-collapse-item
              v-for="(executePoint, index) in forFeatures"
              :key="index"
              :name="executePoint.randomId"
            >
              <template slot="title">
                <span>
                  {{ executePoint.name }}
                </span>
                <i
                  v-if="isEdit"
                  @click="deleteExecutePoint(index)"
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
      forData: {},
      size: '',
      str: '<',
      forFeatures: [],
      uuid: '',
      condition: '',
    }
  },
  methods: {
    addFeature(e) {
      this.forFeatures[e.newIndex - 1].randomId = new Date().valueOf()
      this.forFeatures[e.newIndex - 1].writeType = '1'
      this.forFeatures[e.newIndex - 1].sortOrder = e.newIndex
      this.isEdit = true
      this.uuid = new Date().valueOf()
    },
    notifyData() {
      this.refreshValue()
    },
    refreshValue(update) {
      let points = []
      this.forFeatures.forEach((e) => {
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
          featureId: this.forData.pointId,
        }
        points.push(point)
      })

      let data = JSON.parse(JSON.stringify(this.forData))
      data.method = this.condition
      data.executePoints = JSON.parse(JSON.stringify(points))
      this.$emit('refreshData', {
        data: data,
      })
    },
    deleteExecutePoint(index) {
      this.forFeatures.splice(index, 1)
    },
  },
  created() {
    this.forData = this.data
    if (this.data.method) {
      this.condition = this.data.method
    }

    this.forFeatures = []
    if (this.data.executePoints) {
      this.data.executePoints.forEach((point) => {
        point.executorUnit.randomId = new Date().valueOf()
        let item = point.executorUnit
        item.writeType = '1'
        item.compareDefine = point.compareDefine
        item.variableDefine = point.variableDefine
        this.forFeatures.push(item)
      })
    }
  },
}
</script>
<style scoped>
.size-input {
  width: 100px;
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
