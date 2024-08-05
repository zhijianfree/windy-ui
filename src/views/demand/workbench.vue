<template>
  <div>
    <div class="header-container">
      <img class="image-logo" :src="imageUrl" alt="windy" />
      <el-input
        v-model="searchText"
        size="mini"
        placeholder="输入缺陷、需求、工作像名称搜索"
        class="custom-input"
      />
      <div class="ui-container">
        <div class="ui-item">
          <div class="ui-value">10%</div>
          <div class="ui-label">阻塞率</div>
        </div>
        <div class="ui-item">
          <div class="ui-value">1</div>
          <div class="ui-label">缺陷数</div>
        </div>
        <div class="ui-item">
          <div class="ui-value ui-success">1</div>
          <div class="ui-label">需求数</div>
        </div>
        <div class="ui-item">
          <div class="ui-value ui-error">1</div>
          <div class="ui-label">工作项</div>
        </div>
      </div>
      <div></div>
    </div>
    <div class="content">
      <el-tabs type="border-card" v-model="activeName">
        <el-tab-pane label="缺陷" name="bug">
          <span slot="label"><i class="el-icon-question"></i> 缺陷</span>
          <div class="content-detail">
            <div class="bug-div" v-for="(item, index) in bugList" :key="index">
              <el-row class="bug-row">
                <el-col :span="1">
                  <el-tag type="success" size="small">未解决</el-tag>
                </el-col>
                <el-col :span="23" class="bug-description">
                  <textview
                    text="这是一个很长很长的bugggggggggggggggggggggggggggggggggg这是一个很长很长的bugggggggggggggggggggggggggggggggggg这是一个很长很长的bugggggggggggggggggggggggggggggggggg这是一个很长很长的bugggggggggggggggggggggggggggggggggg"
                    :len="100"
                  >
                  </textview>
                </el-col>
              </el-row>
              <div class="bug-bottom">
                <span class="bug-level">P3</span>
                <span
                  ><i class="el-icon-s-shop" /> 关联需求谢谢谢谢谢谢谢谢</span
                >
                <span
                  ><i class="el-icon-camera-solid bug-icon" /> [hakjsdhk3821321]
                  <i class="el-icon-document-copy"
                /></span>
              </div>
              <div class="time-div">创建时间: 07-08</div>
            </div>
          </div>
          <div class="pagination">
            <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page.sync="currentPage"
              :page-sizes="[10, 20, 50]"
              :page-size="10"
              layout="sizes, prev, pager, next"
              :total="total"
            >
            </el-pagination>
          </div>
        </el-tab-pane>
        <el-tab-pane label="需求" name="demand">
          <span slot="label"><i class="el-icon-s-opportunity"></i> 需求</span>
          <div class="content-detail">
            <div
              class="bug-div"
              v-for="(item, index) in demandData"
              :key="index"
            >
              <div>
                <div class="demand-title" @click="showDemand(item)">
                  <textview :text="item.demandName" :len="100"> </textview>
                </div>
                <div class="demand-desc">
                  <textview
                    :len="200"
                    :showpop="false"
                    :text="item.demandContent"
                  >
                  </textview>
                </div>
              </div>
              <div class="bug-bottom">
                <span class="bug-level p1" v-if="item.level == 1"
                  >P{{ item.level }}</span
                >
                <span class="bug-level p2" v-else-if="(item.level = 2)"
                  >P{{ item.level }}</span
                >
                <span class="bug-level p3" v-else>P{{ item.level }}</span>
                <span><i class="el-icon-user-solid" /> 古月澜</span>
                <span
                  ><span>需求ID:</span> [{{ item.demandId }}]
                  <i
                    :data-clipboard-text="item.demandId"
                    class="el-icon-document-copy copy-icon"
                /></span>
              </div>
              <div class="time-div">
                截止时间: {{ item.expectTime | dayFormat }}
              </div>
            </div>
          </div>
          <div class="pagination">
            <el-pagination
              @size-change="handleSizeChange($event, 'demand')"
              @current-change="handleCurrentChange($event, 'demand')"
              :current-page.sync="demandPage"
              :page-sizes="[10, 20, 50]"
              :page-size="demandSize"
              layout="sizes, prev, pager, next"
              :total="demandTotal"
            >
            </el-pagination>
          </div>
        </el-tab-pane>
        <el-tab-pane label="工作项" name="work">
          <span slot="label"><i class="el-icon-s-claim"></i> 工作项</span>
          <div class="content-detail">
            <div class="bug-div" v-for="(item, index) in bugList" :key="index">
              <div>
                <div class="demand-title">
                  <textview
                    text="需求title需求title需求title需求title需求title需求title需求title需求title需求title需求title需求title需求title需求title需求title需求title"
                    :len="100"
                  >
                  </textview>
                </div>
                <div class="demand-desc">
                  <textview
                    :showpop="false"
                    :len="200"
                    text="需求描述需求描述需求描述需求描述需求描述需求描述需求描述需求描述需求描述需求描述需求描述需求描述需求描述需求描述需求描述需求描述需求描述需求描述需求描述需求描述需求描述需求描述需求描述需求描述需求描述需求描述需求描述需求描述需求描述需求描述需求描述需求描述需求描述需求描述需求描述需求描述需求描述需求描述需求描述需求描述需求描述需求描述需求描述需求描述需求描述需求描述需求描述需求描述需求描述需求描述需求描述需求描述需求描述需求描述需求描述需求描述需求描述需求描述需求描述需求描述需求描述需求描述需求描述需求描述需求描述"
                  >
                  </textview>
                </div>
              </div>
              <div class="bug-bottom">
                <span
                  ><i class="el-icon-camera-solid bug-icon" /> [hakjsdhk3821321]
                  <i class="el-icon-document-copy"
                /></span>
                <span><i class="el-icon-user-solid" /> 工时: 1 天</span>
                <span><i class="el-icon-time" /> 结束点: 2024-10-01</span>
              </div>
              <div class="time-div">开始时间: 07-08</div>
            </div>
          </div>
          <div class="pagination">
            <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page.sync="currentPage"
              :page-sizes="[10, 20, 50]"
              :page-size="10"
              layout="sizes, prev, pager, next"
              :total="total"
            >
            </el-pagination>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
    <el-dialog title="需求详情" :visible.sync="showDemandDetail" width="90%">
      <detail :demand="demandId"></detail>
    </el-dialog>
  </div>
</template>
<script>
import Clipboard from 'clipboard'
import img from '../../../public/logo.svg'
import textview from '../../components/text-view.vue'
import demandApi from '../../http/DemandApi'
import detail from './detail.vue'
export default {
  components: {
    textview,
    detail,
  },
  data() {
    return {
      imageUrl: img,
      searchText: '',
      activeName: 'bug',
      bugData: [],
      bugList: [
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {},
      ],
      total: 30,
      currentPage: 1,
      demandTotal: 0,
      demandPage: 1,
      demandSize: 10,
      demandData: [],
      showDemandDetail: false,
      demandId: '',
    }
  },
  methods: {
    showDemand(row) {
      this.demandId = row.demandId
      this.showDemandDetail = true
    },
    handleClick(tab) {
      console.log(tab)
    },
    handleSizeChange(size, type) {
      if (type == 'demand') {
        this.demandSize = size
        this.getDemands()
      }
    },
    handleCurrentChange(page, type) {
      if (type == 'demand') {
        this.demandPage = page
        this.getDemands()
      }
    },
    getDemands() {
      demandApi.getUserDemands(this.demandPage, this.demandSize).then((res) => {
        this.demandTotal = res.data.total
        this.demandData = res.data.data
      })
    },
    initCopy() {
      let _this = this
      let clipboard = new Clipboard('.copy-icon')

      clipboard.on('success', function () {
        _this.$message.success('复制成功')
      })
      clipboard.on('error', function () {
        _this.$message.error('复制失败')
      })
    },
  },
  created() {
    this.getDemands()
  },
  mounted() {
    this.initCopy()
  },
}
</script>
<style scoped>
.image-logo {
  width: 60px;
  height: 60px;
  border-radius: 60px;
  margin-right: 10px; /* 根据需要调整间距 */
}

.header-container {
  display: flex;
  align-items: center;
  margin: 20px;
  position: relative;
}
.input-div {
  display: flex;
  align-items: center;
}
.content {
  margin: 20px;
  margin-top: 40px;
}

.ui-container {
  width: 450px;
  position: absolute;
  top: 10px;
  right: 60px;
  display: flex;
  justify-content: space-between;
}

.ui-item {
  text-align: center;
}
.p1 {
  background-color: #f56c6c;
}
.p2 {
  background-color: #409eff;
}
.p3 {
  background-color: #67c23a;
}

.ui-value {
  font-size: 35px;
  font-weight: bold;
}
.ui-success {
  color: #67c23a;
}

.ui-error {
  color: #f56c6c;
}
.ui-result {
  color: #409eff;
}

.ui-label {
  font-size: 14px;
  color: #909399;
}

.content-detail {
  height: 500px;
  overflow-y: scroll;
}
.time-div {
  position: absolute;
  right: 20px;
  top: 20px;
  font-size: 13px;
  color: #909399;
}
.bug-div {
  position: relative;
  color: #303133;
  font-size: 13px !important;
  border-bottom: 1px solid #e4e7ed;
  padding: 15px;
}
.bug-div:hover {
  background-color: #f2f6fc;
}

.bug-row {
  display: flex;
  align-items: center;
}

.bug-description {
  flex: 1;
  display: flex;
  align-items: center;
  word-break: break-all;
}
.bug-level {
  width: 30px;
  height: 20px;
  font-size: 12px;
  border-radius: 5px;
  margin-right: 10px;
  display: flex;
  color: #fff;
  justify-content: center;
  align-items: center;
}
.bug-bottom {
  margin-top: 10px;
  display: flex;
  color: #909399;
}
.bug-bottom span {
  margin-right: 10px;
}
.bug-icon {
  color: #f56c6c;
}
.pagination {
  margin-top: 10px;
}
.demand-title {
  font-size: 15px;
  font-weight: 800;
  color: #606266;
  cursor: pointer;
}
.demand-title:hover {
  color: #409eff;
}
.demand-desc {
  font-size: 12px;
  margin-top: 5px;
  color: #909399;
}
</style>
<style>
.custom-input {
  width: 300px;
  box-sizing: border-box; /* 确保 padding 不会影响元素的总尺寸 */
}
</style>
