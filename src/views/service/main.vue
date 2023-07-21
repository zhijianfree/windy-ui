<template>
  <div>
    <div class="logo-line">
      <div class="logo-box">
        <img
          src="../../assets/windy.png"
          class="logo-img"
          width="60"
          height="60"
        />
        <div class="tips">
          <div class="tips-title">Windy的初衷</div>
          <div class="tips-content">
            使用Windy提供整个研发流程每个环节的工具，帮助开发者高效且有质量的完成代码迭代。
            使用Windy可以完成研发流程与代码的质量管理，并且可以在整个团队的视角提高研发的效能。
          </div>
          <div class="email">
            -- From 古月澜的一封信 <i class="el-icon-s-promotion" />
          </div>
        </div>
      </div>
    </div>
    <div class="num-line">
      <el-row :gutter="40">
        <el-col :span="8">
          <el-card shadow="always">
            <div class="content-num">
              <div class="content-box">
                <div class="num-name">服务数</div>
                <div class="num">0</div>
              </div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="8">
          <el-card shadow="always">
            <div class="content-num">
              <div class="content-box">
                <div class="num-name">流水线数</div>
                <div class="num">0</div>
              </div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="8">
          <el-card shadow="always">
            <div class="content-num">
              <div class="content-box">
                <div class="num-name">用例数</div>
                <div class="num">0</div>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>

    <div class="list-box">
      <el-row :gutter="40">
        <el-col :span="8">
          <el-card shadow="always">
            <el-row :gutter="20">
              <el-col :span="12">
                <div class="percent-box">
                  <el-progress
                    type="dashboard"
                    :percentage="20"
                    :color="colors"
                  ></el-progress>
                </div>
                <div class="title-name">Master节点资源</div>
              </el-col>
              <el-col :span="12">
                <div class="percent-box">
                  <el-progress
                    type="dashboard"
                    :percentage="20"
                    :color="colors"
                  ></el-progress>
                </div>
                <div class="title-name">Client节点资源</div>
              </el-col>
            </el-row>
          </el-card>
        </el-col>
        <el-col :span="16">
          <div>
            <div
              style="
                font-weight: 700;
                font-size: 16px;
                line-height: 18px;
                color: #606266;
                margin-bottom: 40px;
              "
            >
              使用Windy需要执行完如下三步
            </div>
            <el-steps class="steps" :active="1" finish-status="success">
              <el-step
                title="系统配置"
                description="完成全局Git相关配置,该步骤是必须完成的。"
              ></el-step>
              <el-step title="部署master节点" description="部署master节点">
              </el-step>
              <el-step
                title="部署Client节点"
                description="Client节点是任务执行的核心，Windy所有的任务都由client节点执行"
              ></el-step>
            </el-steps>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      tableData: [
        { ip: '123.123.123.123' },
        { ip: '123.123.123.123' },
        { ip: '123.123.123.123' },
        { ip: '123.123.123.123' },
      ],
      colors: [
        { color: '#f56c6c', percentage: 20 },
        { color: '#e6a23c', percentage: 40 },
        { color: '#5cb87a', percentage: 60 },
        { color: '#1989fa', percentage: 80 },
        { color: '#6f7ad3', percentage: 100 },
      ],
    }
  },
}
</script>
<style scoped>
.content-num {
  margin: 0 auto;
  text-align: center;
  min-height: 150px;
  width: 80%;
  position: relative;
}
.content-box {
  position: absolute;
  transform: translate(-50%, -50%);
  top: 50%;
  left: 50%;
}
.num {
  font-size: 50px;
  font-weight: 900;
}
.num-name {
  font-size: 13px;
  color: #909399;
}
.num-line {
  margin: 20px 40px;
}
.list-box {
  margin: 0 40px;
  margin-top: 40px;
}

.node-name {
  font-size: 12px;
  color: #67c23a;
  float: right;
  margin: 2px 0;
}
.title-name {
  color: #909399;
  text-align: center;
  margin-top: 2px;
}
.percent-box {
  text-align: center;
}
.node-list {
  height: 100px;
  overflow: scroll;
  cursor: pointer;
}
.list-name {
  font-size: 13px;
  color: #909399;
  text-align: right;
}
.steps {
  height: 200px;
}
.logo-img {
  border-radius: 60px;
  position: absolute;
  left: 10px;
  top: 50%;
  transform: translateY(-50%);
}
.tips {
  position: absolute;
  left: 80px;
  top: 50%;
  right: 40px;
  transform: translateY(-50%);
}
.logo-line {
  margin: 20px 40px;
}
.logo-box {
  position: relative;
  height: 100px;
  background-color: #f4f4f5;
  border-radius: 5px;
}
.tips-title {
  font-weight: 700;
  font-size: 13px;
  line-height: 18px;
  color: #909399;
}
.tips-content {
  font-size: 12px;
  color: #909399;
  margin: 5px 0 0;
}
.email {
  font-size: 13px;
  color: #909399;
  margin: 5px 0 0;
  font-weight: 700;
  float: right;
}
</style>
