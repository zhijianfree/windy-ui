<template>
  <div>
    <div>
      <div class="git">
        <a href="">{{ gitUrl }}</a>
        <i class="el-icon-document-copy copy-icon" />
      </div>
    </div>

    <div>
      <div>
        <el-select
          v-model="selectedBranch"
          filterable
          remote
          size="small"
          reserve-keyword
          placeholder="请输入绑定的分支"
          :remote-method="remoteMethod"
          :loading="loading"
        >
          <el-option
            v-for="item in features"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
        <el-button
          type="primary"
          size="small"
          @click="bindFeature"
          class="search-btn"
          icon="el-icon-paperclip"
          >绑定分支</el-button
        >
      </div>
      <div>
        <div class="bind-title">
          已绑定分支：
        </div>
        <el-table :data="tableData" stripe style="width: 100%">
          <el-table-column prop="gitBranch" label="分支名" width="180">
          </el-table-column>
          <el-table-column prop="createTime" label="绑定时间" width="180">
          </el-table-column>
          <el-table-column prop="bindType" label="绑定类型"> </el-table-column>
          <el-table-column fixed="right" label="操作" width="100">
            <template slot-scope="scope">
              <el-button
                @click="unbind(scope.row)"
                icon="el-icon-connection"
                type="text"
                size="small"
                >解绑</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>
<script>
import gitBindApi from "../../http/GitBind";
export default {
  props: {
    pipeline: String,
  },
  data() {
    return {
      selectedBranch: "",
      features: [{ label: "feature_2021202020", value: "feature_2021202020" }],
      loading: false,
      tableData: [],
      pipelineId: "",
      gitUrl: "https://www.baidu.com",
    };
  },
  methods: {
    remoteMethod(query) {
      console.log("远端请求", query);
    },
    unbind(item) {
      this.$confirm("确认删除？").then(() => {
        gitBindApi.deleteCodeChange(this.pipelineId, item.bindId).then(() => {
          this.$message({ message: "解绑成功", type: "success" });
          this.getBindFeatures();
        });
      });
    },
    bindFeature() {
      if (!this.selectedBranch || this.selectedBranch == "") {
        this.$message({ message: "请先选择分支", type: "warning" });
        return;
      }

      let data = {
        gitBranch: this.selectedBranch,
        gitUrl: this.gitUrl,
        bindType: 0,
        pipelineId: this.pipelineId,
      };
      gitBindApi.createGitbind(data).then(() => {
        this.$message({ message: "绑定成功", type: "success" });
        this.getBindFeatures();
      });
    },
    getBindFeatures() {
      gitBindApi.gitbindList(this.pipelineId).then((res) => {
        console.log("get list", res);
        this.tableData = res.data;
      });
    },
  },
  created() {
    this.pipelineId = this.pipeline;
    this.getBindFeatures();
  },
};
</script>
<style scoped>
.git {
  max-width: 800px;
  width: 800px;
  height: 20px;
  line-height: 20px;
  vertical-align: middle;
  border: 1px solid #dcdfe6;
  border-radius: 5px;
  background-color: #f2f6fc;
  margin: 20px 10px;
  padding: 5px;
  position: relative;
  display: inline-block;
  font-size: 13px;
}
.copy-icon {
  position: absolute;
  top: 5px;
  right: 20px;
}
.git a {
  text-decoration: none;
}
.search-btn {
  margin-left: 20px;
}
.bind-title {
  margin: 20px 0;
  font-weight: 900;
}
</style>
