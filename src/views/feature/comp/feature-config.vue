<template>
  <div>
    <div class="feature-content gridBackground">
      <div>
        <el-row :gutter="20">
          <el-col :span="18">
            <div class="edit-content" @contextmenu.prevent="onContextmenu">
              <div class="menu-type">
                <el-radio-group
                  v-model="menuType"
                  size="small"
                  @change="selectTestStep"
                >
                  <el-radio-button label="1">预置</el-radio-button>
                  <el-radio-button label="2">执行</el-radio-button>
                  <el-radio-button label="3">清理</el-radio-button>
                </el-radio-group>
              </div>
              <!--- 开始-->
              <div>
                <el-empty
                  v-if="isShowEmpty"
                  description="请在右侧拖拽组件到此处"
                ></el-empty>
                <div v-else>
                  <draggable
                    style="min-height: 100px"
                    v-model="displayList"
                    :disabled="!isEdit"
                    @add="addItem"
                    :group="{ name: 'api', pull: 'clone' }"
                    animation="100"
                  >
                    <div
                      v-for="(executePoint, index) in displayList"
                      :key="index"
                      :name="executePoint.randomId"
                      class="content-item"
                    >
                      <div class="content-item-title" :key="uuid">
                        <el-row :gutter="10">
                          <el-col :span="executePoint.editDesc ? 6 : 13">
                            {{ executePoint.description }}
                            <i
                              class="el-icon-document-copy"
                              @click="copyExecutePoint(executePoint)"
                            />
                          </el-col>
                          <el-col :span="4">
                            <i
                              v-if="isEdit"
                              @click="
                                deleteExecutePoint(index, executePoint.pointId)
                              "
                              class="el-icon-delete delete-point"
                            />
                            <i
                              v-if="isEdit && !executePoint.editDesc"
                              @click="exchangeEditStatus(executePoint)"
                              class="el-icon-edit-outline delete-point"
                            />
                          </el-col>

                          <el-col
                            :span="8"
                            v-if="executePoint.editDesc && isEdit"
                          >
                            <div>
                              <el-input
                                placeholder="输入功能描述"
                                v-model="executePoint.desc"
                                size="mini"
                              />
                            </div>
                          </el-col>
                          <el-col v-if="executePoint.editDesc" :span="5">
                            <el-button
                              size="mini"
                              @click="exchangeEditStatus(executePoint, true)"
                              >保存</el-button
                            >
                            <el-button
                              size="mini"
                              @click="exchangeEditStatus(executePoint)"
                              >取消</el-button
                            >
                          </el-col>
                        </el-row>
                        <i
                          :class="{
                            'el-icon-arrow-down': executePoint.isActive,
                            'right-icon': true,
                            'el-icon-arrow-right': !executePoint.isActive,
                          }"
                          @click="closeDiv(executePoint)"
                        />
                      </div>
                      <collapse>
                        <div
                          v-show="executePoint.isActive"
                          class="content-item-detail"
                        >
                          <FeatureTemplate
                            v-if="executePoint.executeType == 1"
                            :data="executePoint"
                            :isEdit="isEdit"
                            :type="executePoint.writeType"
                            @refreshData="refreshValue"
                          />
                          <FeatureTool
                            v-else
                            :data="executePoint"
                            :isEdit="isEdit"
                            @refreshData="refreshValue"
                          />
                        </div>
                      </collapse>
                    </div>
                  </draggable>
                </div>
              </div>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="feature-config-list">
              <div class="operate">
                <el-link
                  v-if="!isEdit"
                  icon="el-icon-edit"
                  :underline="false"
                  type="primary"
                  @click="clickEdit"
                  size="middle"
                  >编辑</el-link
                >
                <el-link
                  v-if="isEdit"
                  icon="el-icon-upload"
                  type="success"
                  :underline="false"
                  @click="saveConfig"
                  size="middle"
                  >保存</el-link
                >
                <el-link
                  v-if="isEdit"
                  icon="el-icon-circle-close"
                  type="info"
                  :underline="false"
                  @click="cancelEdit"
                  size="middle"
                  >取消</el-link
                >
                <el-link
                  icon="el-icon-video-play"
                  v-if="!isEdit"
                  type="danger"
                  :underline="false"
                  @click="startDebug"
                  size="middle"
                  >调试</el-link
                >
              </div>
              <el-collapse v-model="toolType" accordion>
                <el-collapse-item title="基础工具" name="1">
                  <draggable
                    @start="startDrag"
                    :list="featureItemList"
                    :group="{ name: 'api', pull: 'clone' }"
                    animation="100"
                  >
                    <div
                      v-for="(element, index) in featureItemList"
                      :key="index"
                    >
                      <div
                        class="feature-item"
                        v-if="element.templateType != 1"
                      >
                        <div class="template-name">
                          {{ element.name }}
                        </div>
                        <div class="template-desc">
                          {{ element.description }}
                        </div>
                      </div>
                    </div>
                  </draggable>
                </el-collapse-item>
                <el-collapse-item title="业务模版" name="2">
                  <draggable
                    @start="startDrag"
                    style="height: 500px"
                    :list="featureItemList"
                    :group="{ name: 'api', pull: 'clone' }"
                    animation="100"
                  >
                    <div
                      v-for="(element, index) in featureItemList"
                      :key="index"
                    >
                      <div
                        class="feature-item"
                        v-if="element.templateType == 1"
                      >
                        <div class="template-name">
                          {{ element.name }}
                        </div>
                        <div class="template-desc">
                          {{ element.description }}
                        </div>
                      </div>
                    </div>
                  </draggable>
                </el-collapse-item>
              </el-collapse>
            </div>
          </el-col>
        </el-row>
      </div>
    </div>
  </div>
</template>
<script>
import FeatureTemplate from '@/components/feature-template'
import FeatureTool from '@/components/feature-tool'
import draggable from 'vuedraggable'
import featureApi from '../../../http/Feature'
import collapse from '../../../lib/collapse'
export default {
  props: {
    feature: String,
  },
  components: {
    draggable,
    FeatureTemplate,
    FeatureTool,
    collapse,
  },
  watch: {
    feature: {
      handler(val) {
        this.featureId = val
        this.getExecutePoint()
      },
      deep: true,
      immediate: true,
    },
  },
  computed: {
    isShowEmpty() {
      let flag = false
      if (
        this.displayList.length == 0 ||
        this.displayList.length == undefined
      ) {
        flag = true
      }
      if (this.isDrag) {
        flag = false
      }
      return flag
    },
  },
  data() {
    return {
      displayList: [{}],
      allPoints: [],
      menuType: '',
      toolType: '2',
      isDrag: false,
      featureItemList: [],
      isEdit: false,
      uuid: '',
      isActive: false,
      featureId: '',
    }
  },
  methods: {
    onContextmenu(event) {
      this.$contextmenu({
        items: [
          {
            label: '粘贴执行点',
            disabled: !this.isEdit,
            onClick: () => {
              this.pasteExecutePoint()
            },
          },
        ],
        event,
        zIndex: 3,
        minWidth: 230,
      })
      return true
    },
    pasteExecutePoint() {
      let copyString = localStorage.getItem('copyItem')
      let pasteItem = JSON.parse(copyString)
      if (pasteItem && pasteItem.randomId) {
        let lastItem = this.displayList[this.displayList.length - 1]
        console.log('last', lastItem)

        pasteItem.randomId = this.$utils.randomString(20)
        pasteItem.writeType = '1'
        pasteItem.testStage = parseInt(this.menuType)
        pasteItem.pointId = null
        this.allPoints.push(pasteItem)
        this.displayExepoints()

        localStorage.removeItem('copyItem')
      }
    },
    copyExecutePoint(copyItem) {
      console.log(copyItem)
      localStorage.setItem('copyItem', JSON.stringify(copyItem))
      this.$notify({
        title: '成功',
        dangerouslyUseHTMLString: true,
        message: `执行点<strong>[${copyItem.description}]</strong>已复制`,
        type: 'success',
      })
    },
    closeDiv(executePoint) {
      executePoint.isActive = !executePoint.isActive
      this.uuid = this.$utils.randomString(20)
    },
    deleteExecutePoint(index, pointId) {
      this.$confirm('确认删除用例执行点?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        if (!pointId) {
          console.log('fake', this.displayList[index])
          this.removeItem(this.displayList[index])
          this.displayExepoints()
          return
        }
        featureApi.deleteExecutePoint(pointId).then((res) => {
          if (res.data == 1) {
            this.removeItem(this.displayList[index])
            this.displayExepoints()
            this.$message.success('删除执行点成功')
            return
          }
          this.$message.warning('删除执行点失败')
        })
      })
    },
    removeItem(item) {
      let index = -1
      for (let i in this.allPoints) {
        if (this.allPoints[i]['randomId'] === item.randomId) {
          index = i
          break
        }
      }
      if (index == -1) return
      this.allPoints.splice(index, 1)
    },
    startDebug() {
      featureApi.startFeature(this.featureId).then((res) => {
        if (res.data) {
          this.$message.success('开始执行，请查看运行日志')
        } else {
          this.$message.error('执行失败')
        }
      })
    },
    resetOrder() {
      this.bindStepPoints()
      this.allPoints.sort((m, n) => {
        let before = m.testStage
        let current = n.testStage
        if (before > current) {
          return 1
        }
        if (before < current) {
          return -1
        }
        return 0
      })
    },
    saveConfig() {
      this.displayList.forEach((e) => {
        e.editDesc = false
      })
      let index = 0
      let array = []
      this.resetOrder()
      this.allPoints.forEach((e) => {
        console.log('invokeType', e.invokeType)
        let item = {
          method: e.method,
          name: e.name,
          invokeType: e.invokeType,
          description: e.description,
          service: e.service,
        }

        if (e.executeType != 1) {
          item.executePoints = e.executePoints
        } else {
          item.params = e.params
        }

        array.push({
          pointId: e.pointId,
          featureId: this.featureId,
          templateId: e.templateId,
          testStage: e.testStage,
          sortOrder: index,
          executorUnit: item,
          compareDefine: e.compareDefine,
          variableDefine: e.variableDefine,
          executeType: e.executeType,
          description: e.description,
        })
        index++
      })
      let data = {
        featureId: this.featureId,
        testFeatures: array,
      }

      featureApi.updateFeature(data).then(() => {
        this.$message.success('保存成功')
        this.isEdit = false
      })
    },
    exchangeEditStatus(item, isUpdateText) {
      if (isUpdateText) {
        item.description = item.desc
      }
      item.editDesc = !item.editDesc
      this.uuid = this.$utils.randomString(20)
    },
    cancelEdit() {
      this.getExecutePoint()
      this.isEdit = false
    },
    clickEdit() {
      this.isEdit = !this.isEdit
    },
    addItem(e) {
      this.displayList = JSON.parse(JSON.stringify(this.displayList))
      let item = this.displayList[e.newIndex]
      item.isActive = true
      item.randomId = this.$utils.randomString(20)
      item.writeType = '1'
      item.sortOrder = e.newIndex
      item.testStage = parseInt(this.menuType)
      item.pointId = null
      this.allPoints.push(item)
      this.isEdit = true
      this.displayExepoints()
      this.uuid++
    },
    refreshValue(update) {
      this.allPoints.forEach((e) => {
        if (e.randomId == update.data.randomId) {
          e = update.data
        }
      })
      this.displayExepoints()
    },
    startDrag() {
      this.isDrag = true
    },
    selectTestStep() {
      this.bindStepPoints()
      this.displayExepoints()
      this.$forceUpdate()
    },
    bindStepPoints() {
      if (this.displayList.length == 0) {
        return
      }
      let currentStage = this.displayList[0].testStage
      let array = this.allPoints.filter((e) => {
        return e.testStage != currentStage
      })
      this.allPoints = array.concat(this.displayList)
    },
    refreshArray(data) {
      this.displayList = []
      let index = 0
      data.forEach((e) => {
        this.$set(this.displayList, index, e)
        index++
      })
    },
    getExecutePoint() {
      featureApi.getExecutePoints(this.featureId).then((res) => {
        this.allPoints = []
        res.data.data.forEach((e) => {
          let executePoint = e.executorUnit
          let data = executePoint.params
          let item = {
            id: e.id,
            pointId: e.pointId,
            name: executePoint.name,
            method: executePoint.method,
            service: executePoint.service,
            description: e.description,
            invokeType: executePoint.invokeType,
            params: data,
            executePoints: executePoint.executePoints,
            compareDefine: e.compareDefine,
            variableDefine: e.variableDefine,
            writeType: '1',
            executeType: e.executeType,
            randomId: this.$utils.randomString(20),
            testStage: e.testStage,
            isActive: false,
          }
          this.allPoints.push(item)
        })
        this.menuType = '1'
        this.displayExepoints()
      })

      featureApi.getFeatureTemplates().then((res) => {
        let array = res.data
        array.forEach((e) => {
          e.executeType = e.templateType
        })
        this.featureItemList = array
      })
    },
    displayExepoints() {
      let array = []
      let stage = parseInt(this.menuType)
      this.allPoints.forEach((e) => {
        if (e.testStage == stage) {
          array.push(e)
        }
      })
      this.displayList = array
    },
  },
  created() {
    this.getExecutePoint()
  },
}
</script>
<style scoped>
.operate {
  margin: 10px;
  padding-left: 20%;
}
.operate a {
  margin-right: 10px;
}
.right-icon {
  position: absolute;
  top: 10px;
  right: 10px;
}
.content-item {
  background: #ffffff;
  margin: 10px 20px;
  border-radius: 5px;
  width: 90%;
  padding: 5px 10px;
}
.content-item-title {
  height: 40px;
  line-height: 40px;
  font-size: 14px;
  cursor: pointer;
  position: relative;
}
.content-item-detail {
  font-size: 13px;
  padding: 10px 10px;
}
.feature-item {
  height: 40px;
  padding: 2px 4px;
  border-radius: 5px;
  text-align: left;
  border: 2px solid #f2f6fc;
  cursor: pointer;
  background-color: #f2f6fc;
  box-shadow: 1px 1px 2px #f2f6fc;
  margin: 10px;
  font-size: 14px;
  color: #606266;
  border: 1px dashed #d4d6d8;
}
.template-desc {
  font-size: 12px;
  color: #909399;
}
.template-name {
  height: 20px;
}

.feature-config-list {
  background-color: #ffffff;
  height: 80vh;
  padding: 10px 20px;
}

.delete-point {
  font-size: 16px;
  margin-left: 20px;
}

.menu-type {
  width: 200px;
  margin-left: 50%;
  margin-top: 10px;
  transform: translateX(-50%);
  margin-bottom: 10px;
}

.edit-content {
  position: relative;
}

.feature-content {
  height: 75vh;
  min-height: 300px;
  padding: 0 10px;
  background-color: #fff;
}

.gridBackground {
  background: #dcdfe6;
  background-image: linear-gradient(white 0px, transparent 0),
    linear-gradient(90deg, white 0px, transparent 0),
    linear-gradient(hsla(0, 0%, 100%, 0.3) 1px, transparent 0),
    linear-gradient(90deg, hsla(0, 0%, 100%, 0.3) 1px, transparent 0);
  background-size: 75px 75px, 75px 75px, 15px 15px, 15px 15px;
}
</style>
