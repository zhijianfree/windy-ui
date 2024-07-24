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
      <el-tabs type="border-card">
        <el-tab-pane label="缺陷" name="bug">
          <span slot="label"><i class="el-icon-question"></i> 缺陷</span>
          <div>
            <el-row>
              <el-col :span="1">
                <el-tag type="success">未解决</el-tag>
              </el-col>
              <el-col :span="23"
                >这是一个很长很长的bugggggggggggggggggggggggggggggggggg</el-col
              >
            </el-row>
            <el-row>
              <el-col :span="1">p3</el-col>
            </el-row>
          </div>
        </el-tab-pane>
        <el-tab-pane label="需求" name="demand">
          <span slot="label"><i class="el-icon-s-opportunity"></i> 需求</span>
        </el-tab-pane>
        <el-tab-pane label="工作项" name="work">
          <span slot="label"><i class="el-icon-s-claim"></i> 工作项</span>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>
<script>
import img from '../../../public/logo.svg'
export default {
  data() {
    return {
      imageUrl: img,
      searchText: '',
      activeName: '',
      bugData: [],
    }
  },
  methods: {
    handleClick(tab) {},
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
  width: 300px;
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
</style>
<style>
.custom-input {
  width: 300px;
  box-sizing: border-box; /* 确保 padding 不会影响元素的总尺寸 */
}
</style>
