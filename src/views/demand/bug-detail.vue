<template>
  <div>
    <el-form
      :model="bugForm"
      ref="bugForm"
      size="mini"
      label-width="120px"
      :rules="bugRule"
    >
      <el-form-item label="缺陷标题" prop="bugName">
        <el-input
          type="textarea"
          :autosize="{ minRows: 2, maxRows: 10 }"
          placeholder="请输入缺陷标题"
          v-model="bugForm.bugName"
        ></el-input>
      </el-form-item>
      <el-form-item label="负责人">
        <el-input
          v-model="bugForm.acceptor"
          placeholder="请输入负责人"
        ></el-input>
      </el-form-item>
      <el-form-item label="缺陷状态" v-if="edit">
        <el-select v-model="bugForm.status" placeholder="请选择缺陷状态">
          <el-option
            v-for="(item, index) in statusList"
            :key="index"
            :label="item.statusName"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="缺陷级别" prop="level">
        <el-select v-model="bugForm.level" placeholder="请选择缺陷优先级">
          <el-option label="P1" :value="1"></el-option>
          <el-option label="P2" :value="2"></el-option>
          <el-option label="P3" :value="3"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="缺陷环境" prop="environment">
        <el-input
          v-model="bugForm.environment"
          placeholder="请输入缺陷环境"
        ></el-input>
      </el-form-item>
      <el-form-item label="bug现象" prop="scene">
        <el-input
          type="textarea"
          :autosize="{ minRows: 12, maxRows: 30 }"
          placeholder="请输入详细描述缺陷信息"
          v-model="bugForm.scene"
        ></el-input>
      </el-form-item>
      <el-form-item label="关联需求" prop="demandId">
        <el-input
          placeholder="请输入关联的需求ID"
          v-model="bugForm.demandId"
        ></el-input>
      </el-form-item>
      <el-form-item label="复现步骤" prop="replayStep">
        <el-input
          type="textarea"
          :autosize="{ minRows: 2, maxRows: 10 }"
          placeholder="请输入缺陷的浮现步骤"
          v-model="bugForm.bugContent"
        >
        </el-input>
      </el-form-item>
      <el-form-item label="预期结果" prop="expectResult">
        <el-input
          type="textarea"
          :autosize="{ minRows: 1, maxRows: 4 }"
          placeholder="请输入预期结果"
          v-model="bugForm.expectResult"
        ></el-input>
      </el-form-item>
      <el-form-item label="实际结果" prop="realResult">
        <el-input
          type="textarea"
          :autosize="{ minRows: 1, maxRows: 4 }"
          placeholder="请输入实际结果"
          v-model="bugForm.realResult"
        ></el-input>
      </el-form-item>
      <el-form-item label="标签">
        <el-select
          v-model="bugForm.tags"
          filterable
          allow-create
          default-first-option
          placeholder="请选择标签"
        >
          <el-option
            v-for="(item, index) in tagList"
            :key="index"
            :label="item.text"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button size="mini" @click="closeBug">取 消</el-button>
        <el-button type="primary" @click="submitBug('bugForm')" size="mini"
          >确 定</el-button
        >
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import bugApi from '../../http/BugApi'
export default {
  props: {
    edit: Boolean,
    bug: String,
  },
  watch: {
    edit: {
      handler(val) {
        console.log('eeessss', val)
        this.isEdit = val
      },
      deep: true,
      immediate: true,
    },
    bug: {
      handler(val) {
        this.bugId = val
        this.bugForm = {}
        this.getBug()
      },
      deep: true,
      immediate: true,
    },
  },
  data() {
    return {
      bugForm: {},
      statusList: [],
      isEdit: false,
      bugId: '',
      tagList: [
        { text: '个人缺陷', value: '个人缺陷' },
        { text: '数据分析', value: '数据分析' },
        { text: '客户定制', value: '客户定制' },
      ],
      bugRule: {
        bugName: [
          { required: true, message: '请输入缺陷名称', trigger: 'blur' },
          { min: 10, message: '缺陷名称最少10个字符', trigger: 'blur' },
        ],
        level: [
          { required: true, message: '请选择缺陷优先级', trigger: 'change' },
        ],
      },
    }
  },
  methods: {
    getBug() {
      if (this.edit) {
        bugApi.getBugDetail(this.bug).then((res) => {
          this.bugForm = res.data
          if (this.$refs.bugForm) {
            this.$refs.bugForm.resetFields()
          }
        })
      }
    },
    getstatusList() {
      bugApi.getBugStatuses().then((res) => {
        this.statusList = res.data
      })
    },
    closeBug() {
      this.bugForm = {}
      this.$emit('cancel')
    },
    submitBug(formName) {
      this.$refs[formName].validate((valid) => {
        if (!valid) {
          return false
        }

        if (this.edit) {
          bugApi.updateBug(this.bugForm).then((res) => {
            if (res.data) {
              this.$message.success('修改缺陷成功')
              this.closeBug()
            } else {
              this.$message.error('修改缺陷失败')
            }
          })
          return
        }
        bugApi.createBug(this.bugForm).then((res) => {
          if (res.data) {
            this.$message.success('创建缺陷成功')
            this.closeBug()
          } else {
            this.$message.error('创建缺陷失败')
          }
        })
      })
    },
  },
  created() {
    this.isEdit = this.edit
    this.getstatusList()
  },
}
</script>
