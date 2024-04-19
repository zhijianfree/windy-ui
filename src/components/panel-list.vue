<template>
  <div>
    <div v-for="(item, index) in resultList" :key="index">
      <Panel>
        <template slot="title">
          <div class="list-title" @click="showItem(item)">
            <div
              class="execute-name"
              :style="{ color: item.status ? '#67C23A' : '#F56C6C' }"
            >
              <i class="el-icon-circle-plus icon-tag" v-if="!item.show" />
              <i class="el-icon-remove icon-tag" v-else />
              {{ item.name }}
            </div>

            <div class="tag-list">
              <el-tag :type="item.status ? 'success' : 'danger'" size="mini">
                {{ item.status ? '成功' : '失败' }}
              </el-tag>
            </div>
          </div>
        </template>
        <template slot="content">
          <!-- if for执行结果展示开始 -->
          <div
            v-if="item.executeType == 2 || item.executeType == 3"
            class="cycle-div"
          >
            <div v-for="(result, index) in item.resultList" :key="index">
              <Panel>
                <template slot="title">
                  <div class="list-title" @click="showItem(result)">
                    <div
                      class="execute-name"
                      :style="{ color: result.status ? '#67C23A' : '#F56C6C' }"
                    >
                      <i
                        class="el-icon-circle-plus icon-tag"
                        v-if="!result.show"
                      />
                      <i class="el-icon-remove icon-tag" v-else />
                      {{ result.name }}
                    </div>

                    <div class="tag-list">
                      <el-tag
                        :type="item.status ? 'success' : 'danger'"
                        size="mini"
                      >
                        {{ result.status ? '成功' : '失败' }}
                      </el-tag>
                    </div>
                  </div>
                </template>
                <template slot="content">
                  <div>
                    <Panel>
                      <template slot="title">
                        <div class="desc-div">
                          <i class="el-icon-s-promotion" /> Request
                        </div>
                      </template>
                      <template slot="content">
                        <div
                          class="request-list"
                          v-for="(line, index) in result.executeDetailVo
                            .requestDetailVo.request"
                          :key="index"
                        >
                          {{ line }}
                        </div>
                        <div>
                          {{
                            result.executeDetailVo.requestDetailVo.requestBody
                          }}
                        </div>
                      </template>
                    </Panel>
                    <Panel>
                      <template slot="title">
                        <div class="desc-div">
                          <i class="el-icon-camera-solid" /> Response
                        </div>
                      </template>
                      <template slot="content">
                        <div>
                          <div class="request-list">
                            responseBody:
                            <json-viewer
                              v-if="
                                result.executeDetailVo.responseDetailVo
                                  .responseBody
                              "
                              :value="
                                result.executeDetailVo.responseDetailVo
                                  .responseBody
                              "
                              :expand-depth="5"
                              copyable
                            ></json-viewer>
                          </div>
                        </div>
                      </template>
                    </Panel>
                    <div
                      v-if="
                        result.executeDetailVo.responseDetailVo.errorMessage
                      "
                    >
                      <div class="desc-div error-icon">
                        <i class="el-icon-warning" /> Error
                      </div>
                      <div class="request-list">
                        {{
                          result.executeDetailVo.responseDetailVo.errorMessage
                        }}
                      </div>
                    </div>
                  </div>
                </template>
              </Panel>
            </div>
          </div>
          <!-- for执行结果展示结束 -->

          <div v-else>
            <div v-for="(result, index) in item.resultList" :key="index">
              <Panel>
                <template slot="title">
                  <div class="desc-div">
                    <i class="el-icon-s-promotion" /> Request
                  </div>
                </template>
                <template slot="content">
                  <div class="request-list">
                    <json-viewer
                      v-if="result.executeDetailVo.requestTips"
                      :value="result.executeDetailVo.requestTips"
                      :expand-depth="5"
                      copyable
                    ></json-viewer>
                  </div>
                </template>
              </Panel>
              <Panel>
                <template slot="title">
                  <div class="desc-div">
                    <i class="el-icon-camera-solid" /> Response
                  </div>
                </template>
                <template slot="content">
                  <div
                    class="request-list"
                    v-if="
                      result.compareResult &&
                      !result.compareResult.compareStatus &&
                      result.compareResult.description
                    "
                  >
                    比较错误：
                    <span
                      style="color: #f56c6c; font-size: 16px; font-weight: 900"
                      >{{ result.compareResult.description }}</span
                    >
                  </div>
                  <div>
                    <div class="request-list">
                      响应结果:
                      <json-viewer
                        v-if="
                          result.executeDetailVo.responseDetailVo.responseBody
                        "
                        :value="
                          result.executeDetailVo.responseDetailVo.responseBody
                        "
                        :expand-depth="5"
                        copyable
                      ></json-viewer>
                    </div>
                  </div>
                </template>
              </Panel>
              <div v-if="result.executeDetailVo.responseDetailVo.errorMessage">
                <div class="desc-div error-icon">
                  <i class="el-icon-warning" /> Error
                </div>
                <div class="request-list">
                  {{ result.executeDetailVo.responseDetailVo.errorMessage }}
                </div>
              </div>
            </div>
          </div>
        </template>
      </Panel>
    </div>
  </div>
</template>
<script>
import Panel from './panel.vue'
import JsonViewer from 'vue-json-viewer'
export default {
  name: 'PanelList',
  components: { Panel, JsonViewer },
  props: {
    list: Array,
  },
  data() {
    return {
      resultList: [],
    }
  },
  watch: {
    list(value) {
      this.exchangeData(value)
    },
  },
  methods: {
    showItem(item) {
      item.show = !item.show
    },
    exchangeData(array) {
      this.resultList = []
      array.forEach((e) => {
        e.executeResult.forEach((ele) => {
          ele.status = ele.success
        })
        let executeSuccess = e.status == 1
        if (e.compareResult) {
          executeSuccess = e.compareResult.compareStatus
        }
        let item = {
          name: e.executePointName,
          executeType: e.executeType,
          testStage: e.testStage,
          resultList: e.executeResult,
          compareResult: e.compareResult,
          show: false,
          status: executeSuccess,
        }
        this.resultList.push(item)
      })
    },
  },
  created() {},
}
</script>
<style scoped>
.list-title {
  position: relative;
  font-size: 12px;
  font-weight: 800;
  cursor: pointer;
}
.tag-list {
  position: absolute;
  right: 20px;
  top: 0px;
}
.desc-div {
  font-size: 14px;
  font-weight: 800;
  margin: 10px 20px;
}
.request-list {
  font-size: 12px;
  margin: 5px 60px;
}
.error-icon {
  color: #f56c6c;
}
.execute-name {
  font-size: 15px;
}
.cycle-div {
  margin-left: 20px;
}
</style>
