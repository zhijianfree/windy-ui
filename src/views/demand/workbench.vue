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
                    :len="200"
                    :showpop="false"
                    text="需求描述需求描述需求描述需求描述需求描述需求描述需求描述需求描述需求描述需求描述需求描述需求描述需求描述需求描述需求描述需求描述需求描述需求描述需求描述需求描述需求描述需求描述需求描述需求描述需求描述需求描述需求描述需求描述需求描述需求描述需求描述需求描述需求描述需求描述需求描述需求描述需求描述需求描述需求描述需求描述需求描述需求描述需求描述需求描述需求描述需求描述需求描述需求描述需求描述需求描述需求描述需求描述需求描述需求描述需求描述需求描述需求描述需求描述需求描述需求描述需求描述需求描述需求描述需求描述需求描述"
                  >
                  </textview>
                </div>
              </div>
              <div class="bug-bottom">
                <span class="bug-level">P3</span>
                <span><i class="el-icon-user-solid" /> 古月澜</span>
                <span
                  ><i class="el-icon-camera-solid bug-icon" /> [hakjsdhk3821321]
                  <i class="el-icon-document-copy"
                /></span>
              </div>
              <div class="time-div">提出时间: 07-08</div>
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
  </div>
</template>
<script>
import img from '../../../public/logo.svg'
import textview from '../../components/text-view.vue'
export default {
  components: {
    textview,
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
    }
  },
  methods: {
    handleClick(tab) {
      console.log(tab)
    },
    handleSizeChange(size) {
      console.log(size)
    },
    handleCurrentChange(page) {
      console.log(page)
    },
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
  cursor: pointer;
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
  background-color: #409eff;
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
  font-size: 14px;
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
