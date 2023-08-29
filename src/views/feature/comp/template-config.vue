<template>
  <div>
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
          @input="dataChange"
        ></el-input>
      </el-form-item>
      <el-form-item label="模版类型" prop="invokeType">
        <el-radio-group v-model="infoForm.invokeType" @change="dataChange">
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
        <el-row v-for="(item, index) in headerList" :key="index">
          <el-col :span="10">
            <el-input
              size="mini"
              v-model="item.key"
              @input="dataChange"
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
              @input="dataChange"
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
              v-if="index == headerList.length - 1"
              @click="addHeader"
            />
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item label="方法" prop="method">
        <el-input
          v-if="infoForm.invokeType == 1"
          v-model="infoForm.method"
          @input="dataChange"
          placeholder="请输入"
        ></el-input>
        <el-select
          v-else
          v-model="infoForm.method"
          @change="dataChange"
          placeholder="请选择"
        >
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
              @input="dataChange"
              v-model="item.paramKey"
              placeholder="请输入参数名"
            ></el-input>
          </el-col>
          <el-col :span="1">
            <div class="header-line">-</div>
          </el-col>
          <el-col :span="3">
            <el-select
              v-model="item.type"
              placeholder="请选择参数类型"
              @change="dataChange"
            >
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
              @input="dataChange"
            ></el-input>
          </el-col>
          <el-col :span="1">
            <div class="header-line">-</div>
          </el-col>
          <el-col :span="3">
            <el-input
              size="mini"
              @input="dataChange"
              v-model="item.initValue"
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
              @change="dataChange"
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
                @click="deleteItem(num)"
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
          @input="dataChange"
          :autosize="{ minRows: 2, maxRows: 4 }"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button size="mini" type="primary" @click="submit('infoForm')"
          >确定</el-button
        >
        <el-button size="mini" type="info" @click="closeDialog">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import templateApi from '../../../http/Template'
export default {
  props: {
    config: Object,
    isEdit: Boolean,
  },
  watch: {
    config: {
      handler(val) {
        let rowData = JSON.parse(JSON.stringify(val))
        if (rowData.headers) {
          let array = []
          Object.keys(rowData.headers).forEach((key) => {
            array.push({ key: key, value: rowData.headers[key] })
          })
          this.headerList = array
        } else {
          this.headerList = [{ key: '', value: '' }]
        }

        if (!rowData.params) {
          this.infoForm = rowData
          return
        }

        rowData.params.forEach((e) => {
          if (this.isEmpty(e.defaultValue)) {
            return
          }
          if (e.type == 2) {
            e.range = e.defaultValue.range
          }
          e.initValue = e.defaultValue.defaultValue
        })
        this.infoForm = rowData
      },
      deep: true,
      immediate: true,
    },
  },
  data() {
    return {
      infoForm: {},
      headerList: [],
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
    }
  },
  methods: {
    isEmpty(value) {
      return !value || value == '' || value == null
    },
    removeHeader(index) {
      this.headerList.splice(index, 1)
    },
    addHeader() {
      this.headerList.push({})
    },
    deleteItem(index) {
      this.infoForm.params.splice(index, 1)
    },
    addItem() {
      this.infoForm.params.push({})
    },
    dataChange() {
      let data = JSON.parse(JSON.stringify(this.infoForm))
      data.params.forEach((e) => {
        e.defaultValue = {
          defaultValue: e.initValue,
          range: e.range,
        }
      })

      let header = {}
      this.headerList.forEach((e) => {
        header[e.key] = e.value
      })
      data.headers = header
      this.$emit('dataChange', data)
    },
    submit(infoForm) {
      this.$refs[infoForm].validate((valid) => {
        if (!valid) {
          return false
        }

        let requestParam = JSON.parse(JSON.stringify(this.infoForm))
        requestParam.params.forEach((e) => {
          e.defaultValue = {
            defaultValue: e.initValue ? e.initValue : '',
          }
          if (e.type == 2) {
            e.defaultValue.range = e.range
          }

          if (e.type == 1 && this.isEmpty(e.value)) {
            e.defaultValue.defaultValue = '{}'
          }
        })

        let headers = {}
        if (this.headerList.length > 0) {
          this.headerList.forEach((e) => {
            if (this.isEmpty(e.key) || this.isEmpty(e.value)) {
              return
            }
            headers[e.key] = e.value
          })
        }
        requestParam.headers = headers

        if (this.isEdit) {
          templateApi.updateTemplate(requestParam).then(() => {
            this.$message.success(`修改成功`)
            this.$emit('complete')
          })
          return
        }

        templateApi.createTemplate(requestParam).then(() => {
          this.$message.success(`添加成功`)
          this.$emit('complete')
        })
      })
    },
    closeDialog() {
      this.infoForm = { params: [{}] }
      this.$emit('complete')
    },
  },
}
</script>
<style scoped>
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
