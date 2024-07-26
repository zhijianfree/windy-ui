<template>
  <div>
    <div class="title-line">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/demand/list' }"
          >需求列表</el-breadcrumb-item
        >
        <el-breadcrumb-item>需求详情</el-breadcrumb-item>
      </el-breadcrumb>
      <div class="btn-list">
        <el-button
          size="mini"
          v-if="!isEdit"
          @click="isEdit = !isEdit"
          type="primary"
          icon="el-icon-edit"
          >编辑</el-button
        >
        <el-button
          size="mini"
          v-if="isEdit"
          @click="isEdit = !isEdit"
          type="danger"
          icon="el-icon-circle-close"
          >取消</el-button
        >
        <el-button
          size="mini"
          icon="el-icon-s-promotion"
          v-if="isEdit"
          type="primary"
          @click="submitInfo"
          >提交</el-button
        >
      </div>
      <el-divider></el-divider>
    </div>
    <el-row>
      <el-col :span="14">
        <el-form :model="demandForm" size="mini" label-width="80px">
          <el-form-item label="需求标识">
            <span
              >{{ demandForm.demandId }}
              <el-tooltip effect="dark" content="复制" placement="right-start">
                <i
                  class="copy-icon el-icon-document-copy"
                  :data-clipboard-text="demandForm.demandId"
                  @click="copyValue"
                />
              </el-tooltip>
            </span>
          </el-form-item>
          <el-form-item label="需求标题">
            <span>{{ demandForm.demandName }}</span>
          </el-form-item>
          <el-form-item label="客户价值">
            <span>{{ demandForm.customerValue }}</span>
          </el-form-item>
          <el-form-item label="需求描述">
            <el-input
              type="textarea"
              :disabled="!isEdit"
              :autosize="{ minRows: 8, maxRows: 20 }"
              placeholder="请输入需求的详细描述"
              v-model="demandForm.demandContent"
            >
            </el-input>
          </el-form-item>
          <el-form-item label="附件">
            xxxx.doc
          </el-form-item>
        </el-form>
        <div class="comments-div">
          <div>
            <el-input
              type="textarea"
              :autosize="{ minRows: 4, maxRows: 20 }"
              placeholder="请输入您对需求的讨论"
              v-model="commentMsg"
            >
            </el-input>
          </div>
          <div class="commit-btn">
            <el-button size="mini" type="primary" @click="addComment"
              >添加评论</el-button
            >
          </div>
        </div>
        <div class="comment-list">
          <div class="history" v-for="(item, index) in comments" :key="index">
            <div class="user-div">
              <span><i class="el-icon-s-custom"/></span> {{ item.userName }}
              {{ item.createTime }}
            </div>
            <div class="history-content">
              {{ item.comment }}
            </div>
          </div>
        </div>
      </el-col>
      <el-col :span="8">
        <el-form :model="demandForm" label-width="120px" size="mini">
          <el-form-item label="提出人">
            <span>{{ demandForm.proposer }}</span>
          </el-form-item>
          <el-form-item label="接受方">
            <el-input
              :disabled="!isEdit"
              v-model="demandForm.acceptTeam"
              placeholder="接受方"
            ></el-input>
          </el-form-item>
          <el-form-item label="接受人">
            <el-input
              :disabled="!isEdit"
              v-model="demandForm.acceptor"
              placeholder="接受人"
            ></el-input>
          </el-form-item>
          <el-form-item label="截止时间" disabled>
            <el-date-picker
              disabled
              v-model="completeDate"
              align="right"
              type="date"
              placeholder="选择日期"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item label="工作量" disabled>
            <el-input
              disabled
              v-model="demandForm.workload"
              placeholder="请输入工作量(人/日)"
            ></el-input>
          </el-form-item>
          <el-form-item label="标签">
            <el-select
              v-model="demandForm.tag"
              filterable
              :disabled="!isEdit"
              allow-create
              default-first-option
              placeholder="请选择标签"
            >
              <el-option
                v-for="(item, index) in tagList"
                :key="index"
                :label="item"
                :value="item"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="需求状态">
            <el-select
              v-model="demandForm.status"
              @change="statusChange"
              placeholder="请选择状态"
            >
              <el-option
                v-for="(item, index) in statusOptions"
                :key="index"
                :label="item.name"
                :value="item.status"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="搁置天数">
            3
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import Clipboard from 'clipboard'
import DemandApi from '../../http/Demand'
import CommentApi from '../../http/Comment'
export default {
  data() {
    return {
      demandForm: {},
      demandId: '',
      tagList: ['个人需求', '数据分析', '客户定制'],
      abilityList: ['用户体验', '功能增强', '性能', '可靠性', '安全', '运维'],
      commentMsg: '',
      refuseReason: '',
      isRefuse: false,
      completeDate: null,
      isEdit: false,
      statusOptions: [],
      comments: [],
    }
  },
  watch: {},
  methods: {
    submitInfo() {
      DemandApi.updateDemand(this.demandForm).then((res) => {
        if (res.data) {
          this.$message.success('更新成功')
          this.isEdit = false
        } else {
          this.$message.error('更新失败')
        }
      })
    },
    copyValue() {
      let _this = this
      let clipboard = new Clipboard('.copy-icon')

      clipboard.on('success', function() {
        _this.$message.success('复制成功')
      })
      clipboard.on('error', function() {
        _this.$message.success('复制失败')
      })
    },
    getDemandDetail() {
      DemandApi.getDemandDetail(this.demandId).then((res) => {
        console.log(res)
        this.demandForm = res.data
        this.completeDate = new Date(this.demandForm.expectTime)
      })
    },
    getstatusList() {
      DemandApi.getStatusList(1).then((res) => {
        this.statusOptions = res.data
      })
    },
    statusChange() {
      console.log(this.demandForm.status, this.demandId)
      DemandApi.updateDemandStatus({
        status: this.demandForm.status,
        demandId: this.demandId,
      }).then((res) => {
        console.log('返回结果', res)
        this.$message.success('修改状态成功')
      })
    },
    getCommentsList() {
      CommentApi.getComments(this.demandId).then((res) => {
        console.log('list comment ', res)
        this.comments = res.data
      })
    },
    addComment() {
      let data = {
        comment: this.commentMsg,
        relativeId: this.demandId,
        userId: 'admin',
        userName: 'admin',
      }
      CommentApi.createComment(data).then((res) => {
        if (res.data) {
          this.$message.success('添加评论成功')
          this.getCommentsList()
          this.commentMsg = ''
        } else {
          this.$message.error('添加评论失败')
        }
      })
    },
  },
  created() {
    this.demandId = this.$route.query.demandId
    this.isEdit = this.$route.query.edit
    this.getDemandDetail()
    this.getstatusList()
    this.getCommentsList()
  },
}
</script>
<style scoped>
.comments-div {
  margin: 20px 0 20px 20px;
}
.commit-btn {
  margin-top: 10px;
  text-align: right;
}
.history {
  margin: 20px;
}
.user-div {
  font-size: 13px;
}
.history-content {
  padding: 10px 20px;
}
.op-line {
  margin-bottom: 20px;
  margin-right: 20px;
  text-align: right;
}
.reason {
  margin: 10px 0 10px 20px;
}
.copy-icon {
  margin-left: 20px;
  cursor: pointer;
}
.title-line {
  margin: 10px;
}
.btn-list {
  float: right;
  margin-top: -10px;
}
.comment-list {
  max-height: 300px;
  overflow: scroll;
}
</style>
