<template>
  <div class="content">
    <el-form
      :inline="true"
      :model="queryForm"
      size="small"
      class="demo-form-inline"
    >
      <el-form-item label="模版名称">
        <el-input
          clearable
          @input="inputChange"
          v-model="queryForm.name"
          placeholder="请输入模版名称"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="startQuery"
          >查询</el-button
        >
        <el-button
          type="primary"
          icon="el-icon-circle-plus-outline"
          @click="startCreate"
          >新增模版</el-button
        >
      </el-form-item>
    </el-form>
    <el-table :data="templateData" size="mini" style="width: 100%">
      <el-table-column prop="templateId" label="模版ID"> </el-table-column>
      <el-table-column prop="name" label="模版名称"> </el-table-column>
      <el-table-column prop="description" label="模版描述"> </el-table-column>
      <!-- <el-table-column prop="author" label="提交人"> </el-table-column> -->
      <el-table-column prop="updateTime" label="最近修改时间">
        <template slot-scope="scope">
          {{ scope.row.updateTime | dateFormat }}
        </template>
      </el-table-column>
      <el-table-column align="right">
        <template slot-scope="scope" v-if="scope.row.templateType == 1">
          <el-button
            type="primary"
            size="mini"
            @click="refreshTemplate(scope.row)"
            >刷新</el-button
          >
          <el-button size="mini" @click="handleEdit(scope.row)">编辑</el-button>
          <el-button size="mini" type="danger" @click="handleDelete(scope.row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <div>
      <el-pagination
        :page-size="10"
        :current-page="currentPage"
        @current-change="pageChange"
        layout="prev, pager, next"
        :total="totalSize"
      >
      </el-pagination>
    </div>

    <!-- 创建模版开始 -->
    <el-dialog :visible.sync="showDialog" @close="closeDialog" width="85%">
      <template slot="title">
        {{ dialogTitle }}
        <el-tooltip effect="dark" placement="right-start">
          <div slot="content">
            用例执行点是由模版拖拽而来，模版定义了执行点运行的基本参数。<br />执行点配置好参数值之后执行测试任务
          </div>
          <span
            ><i
              style="margin-left: 5px; cursor: pointer; font-size: 15px"
              class="el-icon-question"
          /></span>
        </el-tooltip>
      </template>
      <el-form
        :model="infoForm"
        ref="infoForm"
        :rules="infoRule"
        size="small"
        label-width="120px"
      >
        <el-form-item label="模版名称" prop="name">
          <el-input
            v-model="infoForm.name"
            placeholder="请输入模版名称"
          ></el-input>
        </el-form-item>
        <el-form-item label="模版类型" prop="invokeType">
          <el-radio-group v-model="infoForm.invokeType">
            <el-radio :label="1">默认模版</el-radio>
            <el-radio :label="2">Http</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item
          :label="infoForm.invokeType == 1 ? '类名' : 'Url'"
          prop="service"
        >
          <el-input v-model="infoForm.service" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="请求header" v-if="infoForm.invokeType == 2">
          <el-row v-for="(item, index) in infoForm.headers" :key="index">
            <el-col :span="10">
              <el-input
                size="mini"
                v-model="item.key"
                placeholder="请输入"
              ></el-input>
            </el-col>
            <el-col :span="2">
              <div class="header-line">-</div>
            </el-col>
            <el-col :span="10">
              <el-input
                size="mini"
                v-model="item.value"
                placeholder="请输入默认值"
              ></el-input>
            </el-col>
            <el-col :span="2">
              <i
                class="el-icon-remove-outline op-icon"
                @click="removeHeader(index)"
              />
              <i
                class="el-icon-circle-plus-outline op-icon"
                v-if="index == infoForm.headers.length - 1"
                @click="addHeader"
              />
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="方法" prop="method">
          <el-input
            v-if="infoForm.invokeType == 1"
            v-model="infoForm.method"
            placeholder="请输入"
          ></el-input>
          <el-select v-else v-model="infoForm.method" placeholder="请选择">
            <el-option
              v-for="item in httpMethods"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="参数列表">
          <el-row v-for="(item, num) in infoForm.params" :key="num">
            <el-col :span="3">
              <el-input
                size="mini"
                v-model="item.paramKey"
                placeholder="请输入参数名"
              ></el-input>
            </el-col>
            <el-col :span="1">
              <div class="header-line">-</div>
            </el-col>
            <el-col :span="3">
              <el-select v-model="item.type" placeholder="请选择参数类型">
                <el-option
                  v-for="item in paramTypeList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-col>
            <el-col :span="1">
              <div class="header-line">-</div>
            </el-col>
            <el-col :span="3">
              <el-input
                size="mini"
                v-model="item.description"
                placeholder="请输入参数描述"
              ></el-input>
            </el-col>
            <el-col :span="1">
              <div class="header-line">-</div>
            </el-col>
            <el-col :span="3">
              <el-input
                size="mini"
                v-model="item.defaultValue"
                placeholder="请输入默认值"
              ></el-input>
            </el-col>
            <el-col :span="1" v-if="item.type == 2">
              <div class="header-line">-</div>
            </el-col>
            <el-col :span="4" v-if="item.type == 2">
              <el-select
                v-model="item.range"
                multiple
                filterable
                allow-create
                placeholder="请添加枚举类型"
              >
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-col>
            <el-col :span="2">
              <div class="delete-icon">
                <i
                  class="el-icon-remove-outline op-icon"
                  @click="deleteItem(item, num)"
                />
                <i
                  class="el-icon-circle-plus-outline op-icon"
                  v-if="num == infoForm.params.length - 1"
                  @click="addItem"
                />
              </div>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input
            v-model="infoForm.description"
            placeholder="请输入模版功能描述"
            type="textarea"
            :autosize="{ minRows: 2, maxRows: 4 }"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submit('infoForm')">确认</el-button>

          <el-button type="info" @click="closeDialog">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!-- 创建模版结束 -->
  </div>
</template>
<script>
import templateApi from '../../http/Template'
export default {
  data() {
    return {
      templateData: [],
      queryForm: {},
      showDialog: false,
      infoForm: { params: [{}] },
      dialogTitle: '添加执行点模版',
      options: [],
      paramTypeList: [
        { label: 'String', value: 0 },
        { label: 'Map', value: 1 },
        { label: 'List', value: 2 },
        { label: 'Integer', value: 3 },
        { label: 'Float', value: 4 },
        { label: 'Double', value: 5 },
      ],
      httpMethods: [
        { label: 'Post', value: 'Post' },
        { label: 'Get', value: 'Get' },
        { label: 'Put', value: 'Put' },
        { label: 'Delete', value: 'Delete' },
      ],
      isEdit: false,
      currentPage: 1,
      totalSize: 0,
      infoRule: {
        name: [{ required: true, message: '请输入模版名称', trigger: 'blur' }],
        invokeType: [
          { required: true, message: '请选择执行类型', trigger: 'blur' },
        ],
        service: [{ required: true, message: '此项不能为空', trigger: 'blur' }],
        method: [{ required: true, message: '此项不能为空', trigger: 'blur' }],
        description: [
          { required: true, message: '模版描述不能为空', trigger: 'blur' },
        ],
      },
    }
  },
  methods: {
    removeHeader(index) {
      this.infoForm.headers.splice(index, 1)
    },
    addHeader() {
      this.infoForm.headers.push({})
    },
    inputChange() {
      this.getTemplatePage(1)
    },
    pageChange(page) {
      this.getTemplatePage(page)
    },
    getTemplatePage(page) {
      let name = this.queryForm.name
      if (!name) {
        name = ''
      }

      templateApi.getTemplatePage(page, 10, name).then((res) => {
        this.templateData = res.data.data
        this.totalSize = res.data.total
      })
    },
    startQuery() {
      this.getTemplatePage(1)
    },
    startCreate() {
      this.isEdit = false
      this.showDialog = !this.showDialog
      this.dialogTitle = '创建模版'
      this.infoForm = { params: [{}], headers: [{}], invokeType: 1, method: '' }
    },
    refreshTemplate(row) {
      templateApi.refresh(row.templateId).then((res) => {
        if (res.data) {
          this.$message.success('刷新成功')
        } else {
          this.$message.error('刷新失败')
        }
      })
    },
    handleEdit(row) {
      this.isEdit = true
      this.showDialog = true
      this.dialogTitle = '编辑模版'

      let rowData = JSON.parse(JSON.stringify(row))
      if (rowData.headers && rowData.headers.length > 0) {
        let array = []
        Object.keys(rowData.headers).forEach((key) => {
          array.push({ key: key, value: rowData.headers[key] })
        })
        rowData.headers = array
      } else {
        rowData.headers = [{ key: '', value: '' }]
      }

      if (!rowData.params) {
        this.infoForm = rowData
        return
      }

      rowData.params.forEach((e) => {
        if (e.defaultValue === null) {
          return
        }
        if (e.type == 2) {
          e.range = e.defaultValue.range
        }

        e.defaultValue = e.defaultValue.defaultValue
      })
      this.infoForm = rowData
      console.log('rrrr', this.infoForm)
    },
    handleDelete(row) {
      templateApi.deleteTemplate(row.templateId).then(() => {
        this.$message.success('删除模版成功')
        this.getTemplatePage(1)
      })
    },
    deleteItem(item, index) {
      this.infoForm.params.splice(index, 1)
    },
    addItem() {
      this.infoForm.params.push({})
    },
    closeDialog() {
      this.showDialog = false
      this.infoForm = { params: [{}] }
    },
    submit(infoForm) {
      this.$refs[infoForm].validate((valid) => {
        if (!valid) {
          return false
        }

        let requestParam = JSON.parse(JSON.stringify(this.infoForm))
        requestParam.params.forEach((e) => {
          e.defaultValue = {
            defaultValue: e.defaultValue ? e.defaultValue : '',
          }
          if (e.type == 2) {
            e.defaultValue.range = e.range
          }
        })

        let headers = {}
        requestParam.headers.forEach((e) => {
          headers[e.key] = e.value
        })
        requestParam.headers = headers

        if (this.isEdit) {
          templateApi.updateTemplate(requestParam).then(() => {
            this.$message.success(`${this.dialogTitle}成功`)
            this.showDialog = false
            this.getTemplatePage(1)
          })
          return
        }

        templateApi.createTemplate(requestParam).then(() => {
          this.$message.success(`${this.dialogTitle}成功`)
          this.showDialog = false
          this.getTemplatePage(1)
        })
      })
    },
  },
  created() {
    this.getTemplatePage(1)
  },
}
</script>
<style scoped>
.content {
  margin: 5px;
}
.header-line {
  text-align: center;
}
.delete-icon {
  font-size: 20px;
  cursor: pointer;
}
.op-icon {
  margin-left: 10px;
  font-size: 16px;
  cursor: pointer;
}
</style>
