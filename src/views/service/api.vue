<template>
  <div>
    <div>
      <el-row :gutter="10">
        <el-col :span="5">
          <div class="api-list">
            <el-row>
              <el-col :span="8">服务列表</el-col>
              <el-col :span="16">
                <el-select
                  v-model="serviceId"
                  size="mini"
                  @change="selectService"
                  placeholder="选择服务"
                >
                  <el-option
                    v-for="(item, index) in serviceList"
                    :key="index"
                    :label="item.serviceName"
                    :value="item.serviceId"
                  ></el-option>
                </el-select>
              </el-col>
            </el-row>

            <div class="filter-text">
              <el-input
                v-model="filterText"
                size="mini"
                clearable
                placeholder="输入api名称过滤"
              ></el-input>
            </div>
            <el-tree
              :data="treeData"
              default-expand-all
              :filter-node-method="filterNode"
              ref="tree"
            >
            </el-tree>
          </div>
        </el-col>
        <el-col :span="19">
          <div class="api-detail">
            <el-tabs v-model="activeName" @tab-click="selectTab">
              <el-tab-pane label="接口预览" name="preview">
                <el-descriptions title="接口属性">
                  <el-descriptions-item label="接口名称">{{
                    apiForm.apiName
                  }}</el-descriptions-item>
                  <el-descriptions-item label="接口类型">{{
                    apiForm.type
                  }}</el-descriptions-item>
                  <el-descriptions-item label="修改时间">{{
                    apiForm.updateTime
                  }}</el-descriptions-item>
                  <el-descriptions-item label="接口定义"
                    ><el-tag type="success" size="small">{{
                      apiForm.method
                    }}</el-tag>
                    {{ apiForm.api }}</el-descriptions-item
                  >
                  <el-descriptions-item label="接口说明">
                    {{ apiForm.description }}
                  </el-descriptions-item>
                </el-descriptions>
                <h4>请求参数</h4>
                <div class="display-param" v-if="pathData.length > 0">
                  <h5>Path路径参数</h5>
                  <el-table :data="pathData" border size="mini">
                    <el-table-column
                      prop="paramKey"
                      label="参数名称"
                      width="150px"
                    >
                    </el-table-column>
                    <el-table-column prop="type" label="参数类型" width="150px">
                    </el-table-column>
                    <el-table-column
                      prop="position"
                      label="参数位置"
                      width="150px"
                    >
                    </el-table-column>
                    <el-table-column prop="description" label="参数描述">
                    </el-table-column>
                  </el-table>
                </div>

                <div class="display-param" v-if="headerData.length > 0">
                  <h5>Header</h5>
                  <el-table :data="headerData" border size="mini"
                    ><el-table-column
                      prop="paramKey"
                      label="参数名称"
                      width="150px"
                    >
                    </el-table-column>
                    <el-table-column prop="type" label="参数类型" width="150px">
                    </el-table-column>
                    <el-table-column prop="description" label="参数描述">
                    </el-table-column
                  ></el-table>
                </div>

                <div class="display-param" v-if="bodyData.length > 0">
                  <h5>请求body</h5>
                  <el-table
                    :data="bodyData"
                    size="mini"
                    border
                    row-key="id"
                    :tree-props="{
                      children: 'children',
                      hasChildren: 'hasChildren',
                    }"
                    ><el-table-column
                      prop="paramKey"
                      label="参数名称"
                      width="150px"
                    >
                    </el-table-column>
                    <el-table-column prop="type" label="参数类型" width="150px">
                    </el-table-column>
                    <el-table-column prop="description" label="参数描述">
                    </el-table-column
                  ></el-table>
                </div>

                <h4>响应参数</h4>
                <div class="display-param">
                  <el-table
                    :data="previewRes"
                    border
                    size="mini"
                    row-key="id"
                    :tree-props="{
                      children: 'children',
                      hasChildren: 'hasChildren',
                    }"
                    ><el-table-column prop="paramKey" label="参数名称">
                    </el-table-column>
                    <el-table-column prop="type" label="参数类型">
                    </el-table-column>
                    <el-table-column prop="type" label="参数描述">
                    </el-table-column
                  ></el-table>
                </div>
              </el-tab-pane>
              <el-tab-pane label="接口配置" name="edit">
                <el-form v-model="apiForm" size="small" label-width="80px">
                  <h4>接口属性</h4>
                  <el-form-item label="接口名称">
                    <el-input
                      v-model="apiForm.apiName"
                      placeholder="请输入接口名称"
                    ></el-input>
                  </el-form-item>
                  <el-form-item label="接口类型">
                    <el-select v-model="apiForm.type" placeholder="请选择">
                      <el-option label="Rest Http" value="http"> </el-option>
                      <el-option label="Dubbo" value="dubbo"> </el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="接口定义">
                    <el-input
                      placeholder="请输入内容"
                      v-model="apiForm.api"
                      class="input-with-select"
                    >
                      <el-select
                        v-model="apiForm.method"
                        slot="prepend"
                        placeholder="请选择请求方法"
                      >
                        <el-option label="GET" value="GET"></el-option>
                        <el-option label="POST" value="POST"></el-option>
                        <el-option label="PUT" value="PUT"></el-option>
                        <el-option label="DELETE" value="DELETE"></el-option>
                      </el-select>
                    </el-input>
                  </el-form-item>
                  <el-form-item label="接口说明">
                    <el-input
                      v-model="apiForm.description"
                      type="textarea"
                      placeholder="请输入接口描述"
                    ></el-input>
                  </el-form-item>
                  <h4>参数设置</h4>
                  <el-button type="primary" size="mini" @click="addParam"
                    >新增请求参数</el-button
                  >
                  <el-tree
                    class="tree-item"
                    :data="paramData"
                    :props="defaultProps"
                    node-key="id"
                    default-expand-all
                    :expand-on-click-node="false"
                  >
                    <div class="custom-node" slot-scope="{ node, data }">
                      <el-row :gutter="10">
                        <el-col :span="5">
                          <el-input
                            size="mini"
                            v-model="data.paramKey"
                            placeholder="请输入参数名称"
                          ></el-input>
                        </el-col>
                        <el-col :span="5">
                          <el-select
                            class="select-type"
                            v-model="data.type"
                            placeholder="请选择参数类型"
                            size="mini"
                          >
                            <el-option
                              label="String"
                              value="String"
                            ></el-option>
                            <el-option label="Long" value="Long"> </el-option>
                            <el-option label="Array" value="Array"> </el-option>
                            <el-option label="Object" value="Object">
                            </el-option>
                            <el-option label="Boolean" value="Boolean">
                            </el-option>
                            <el-option label="Integer" value="Integer">
                            </el-option>
                          </el-select>
                        </el-col>
                        <el-col :span="5">
                          <el-select
                            v-model="data.position"
                            style="with: 100%"
                            size="mini"
                            placeholder="请选择参数位置"
                          >
                            <el-option label="Path" value="Path"> </el-option>
                            <el-option label="Query" value="Query"> </el-option>
                            <el-option label="Header" value="Header">
                            </el-option>
                            <el-option label="Body" value="Body"> </el-option>
                          </el-select>
                        </el-col>
                        <el-col :span="5">
                          <el-input
                            size="mini"
                            v-model="data.description"
                            placeholder="请输入参数描述"
                          ></el-input>
                        </el-col>
                        <el-col :span="4">
                          <div class="op-icon">
                            <i
                              class="el-icon-remove-outline"
                              @click="removeParam(node, data)"
                            />
                            <i
                              class="el-icon-circle-plus-outline"
                              @click="addSubParam(data)"
                              v-if="data.type == 'Object'"
                            />
                          </div>
                        </el-col>
                      </el-row>
                    </div>
                  </el-tree>
                  <h4>响应设置</h4>
                  <el-button type="primary" size="mini" @click="addResParam"
                    >新增响应参数</el-button
                  >
                  <el-tree
                    class="tree-item"
                    :data="responseData"
                    :props="defaultProps"
                    node-key="id"
                    default-expand-all
                    :expand-on-click-node="false"
                  >
                    <div class="custom-node" slot-scope="{ node, data }">
                      <el-row :gutter="10">
                        <el-col :span="5">
                          <el-input
                            size="mini"
                            v-model="data.paramKey"
                            placeholder="请输入参数名称"
                          ></el-input>
                        </el-col>
                        <el-col :span="5">
                          <el-select
                            class="select-type"
                            v-model="data.type"
                            placeholder="请选择参数类型"
                            size="mini"
                          >
                            <el-option
                              label="String"
                              value="String"
                            ></el-option>
                            <el-option label="Long" value="Long"> </el-option>
                            <el-option label="Array" value="Array"> </el-option>
                            <el-option label="Object" value="Object">
                            </el-option>
                            <el-option label="Boolean" value="Boolean">
                            </el-option>
                            <el-option label="Integer" value="Integer">
                            </el-option>
                          </el-select>
                        </el-col>
                        <el-col :span="5">
                          <el-input
                            size="mini"
                            v-model="data.desciption"
                            placeholder="请输入参数描述"
                          ></el-input>
                        </el-col>
                        <el-col :span="4">
                          <div class="op-icon">
                            <i
                              class="el-icon-remove-outline"
                              @click="removeParam(node, data)"
                            />
                            <i
                              class="el-icon-circle-plus-outline"
                              @click="addSubParam(data)"
                              v-if="data.type == 'Object'"
                            />
                          </div>
                        </el-col>
                      </el-row>
                    </div>
                  </el-tree>
                </el-form>
              </el-tab-pane>
            </el-tabs>
          </div>
        </el-col>
      </el-row>
    </div>
    <div class="save-btn" v-if="activeName == 'edit'">
      <el-button
        type="primary"
        icon="el-icon-upload"
        size="small"
        @click="saveApi"
        >保存配置</el-button
      >
    </div>
  </div>
</template>
<script>
import serviceApi from '../../http/Service'
export default {
  data() {
    return {
      activeName: 'preview',
      filterText: '',
      apiForm: {},
      paramData: [],
      responseData: [],
      treeData: [],
      defaultProps: {
        children: 'children',
        label: 'paramKey',
      },
      pathData: [],
      headerData: [],
      bodyData: [],
      previewRes: [],
      uuid: 1,
      serviceList: [],
      serviceId: '',
      currentApi: '',
    }
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val)
    },
  },
  methods: {
    saveApi() {
      if (this.currentApi != '') {
        return
      }
      let data = this.apiForm
      data.serviceId = this.serviceId
      data.requestParams = this.paramData
      data.responseParams = this.responseData
      serviceApi.createApi(data).then((res) => {
        if (res.data) {
          this.$message.success('添加接口成功')
        } else {
          this.$message.error('添加接口失败')
        }
      })
    },
    selectTab() {
      if (this.activeName == 'preview') {
        this.pathData = []
        this.headerData = []
        this.bodyData = []
        this.paramData.forEach((e) => {
          console.log('xxxx', e)
          if (e.position == 'Path' || e.position == 'Query') {
            this.pathData.push(e)
          }
          if (e.position == 'Header') {
            this.headerData.push(e)
          }
          if (e.position == 'Body') {
            this.bodyData.push(e)
          }
        })
        console.log('dssad', this.pathData, this.headerData, this.bodyData)
      }
    },
    filterNode(value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
    removeParam(node, data) {
      const parent = node.parent
      const children = parent.data.children || parent.data
      const index = children.findIndex((d) => d.id === data.id)
      children.splice(index, 1)
    },
    addParam() {
      this.paramData.push({ id: this.uuid, paramKey: '', children: [] })
      this.uuid++
    },
    addSubParam(data) {
      if (data.children) {
        data.children.push({ id: this.uuid, paramKey: '', children: [] })
        this.uuid++
        return
      }
      data.children = [{ id: this.uuid, paramKey: '', children: [] }]
      this.uuid++
    },
    addResParam() {
      this.responseData.push({ id: this.uuid, paramKey: '', children: [] })
      this.uuid++
    },
    selectService() {
      serviceApi.getApiList(this.serviceId).then((res) => {
        this.treeData = res.data
      })
    },
    getServices() {
      this.serviceList = []
      serviceApi.getServices().then((res) => {
        this.serviceList = res.data
        this.serviceId = this.serviceList[0].serviceId
        this.selectService()
      })
    },
  },
  created() {
    this.getServices()
  },
}
</script>
<style scoped>
.save-btn {
  position: absolute;
  bottom: 50px;
  right: 100px;
  z-index: 1000;
}
.display-param {
  margin-left: 50px;
}
.filter-text {
  margin-top: 20px;
}
.api-list {
  min-height: 90vh;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  transition: 0.3s;
  border-radius: 4px;
  padding: 10px;
}
.api-detail {
  min-height: 90vh;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  transition: 0.3s;
  border-radius: 4px;
  padding: 10px;
}
.custom-node {
  width: 80%;
}
.op-icon i {
  font-size: 20px;
  margin-left: 10px;
}
.op-icon .el-icon-remove-outline {
  color: #f56c6c;
}
</style>
<style>
.el-select .el-input {
  width: 140px;
}
.input-with-select .el-input-group__prepend {
  background-color: #fff;
}
.tree-item .el-tree-node__content {
  padding: 5px 10px;
}

.input-with-select .el-input-group__prepend {
  background-color: #fff;
}
.el-tree-node:focus > .el-tree-node__content {
  background-color: #fff !important;
}
.el-tree-node__content:hover {
  background-color: #fff;
}
.el-tree--highlight-current .el-tree-node.is-current > .el-tree-node__content {
  background-color: #fff;
}
</style>
