<template>
  <div>
    <div class="title">
      <!-- 表单查询开始 -->
      <div>
        <el-form :inline="true" size="mini">
          <el-form-item label="环境名称">
            <el-input
              clearable
              v-model="queryName"
              placeholder="请输入环境名称"
            ></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" @click="startQuery"
              >查询</el-button
            >
            <el-button
              type="primary"
              icon="el-icon-circle-plus-outline"
              @click="createEnv"
              >新增环境</el-button
            >
          </el-form-item>
        </el-form>
      </div>
      <!-- 表单查询结束 -->
    </div>
    <div>
      <el-table :data="envData">
        <el-table-column label="环境名称" prop="envName"></el-table-column>
        <el-table-column label="环境状态" prop="envStatus">
          <template slot-scope="scope">
            <el-tag :type="scope.row.envStatus | statusFormat" size="medium">{{
              scope.row.envStatus | deployFormat
            }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="环境类型" prop="envType">
          <template slot-scope="scope">
            {{ scope.row.envType | deployType }}
          </template>
        </el-table-column>
        <el-table-column label="环境参数" prop="envParams">
          <template slot-scope="scope">
            <el-popover placement="right" width="600" trigger="click">
              <el-table :data="scope.row.paramsList" max-height="250">
                <el-table-column
                  width="150"
                  property="name"
                  label="参数名"
                ></el-table-column>
                <el-table-column
                  width="150"
                  property="value"
                  label="参数值"
                ></el-table-column>
                <el-table-column
                  width="300"
                  property="desc"
                  label="参数描述"
                ></el-table-column>
              </el-table>
              <el-button size="mini" type="primary" slot="reference"
                >查看参数</el-button
              >
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column label="修改时间" prop="updateTime">
          <template slot-scope="scope">
            {{ scope.row.updateTime | dateFormat }}
          </template>
        </el-table-column>
        <el-table-column align="right" label="操作">
          <template slot-scope="scope">
            <el-button size="mini" @click="handleEdit(scope.row)" type="primary"
              >编辑</el-button
            >
            <el-button
              size="mini"
              type="danger"
              @click="handleDelete(scope.row)"
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
    </div>

    <el-dialog :title="titleName" :visible.sync="showEnvDialog" width="60%">
      <el-form :model="envForm" label-width="80px" size="mini">
        <el-form-item label="环境名称" prop="envName">
          <el-input
            v-model="envForm.envName"
            placeholder="请输入环境名称"
          ></el-input>
        </el-form-item>
        <el-form-item label="部署类型" prop="envType">
          <el-radio-group v-model="envForm.envType" @change="selectType">
            <el-radio :label="1">SSH部署</el-radio>
            <el-radio :label="2">K8S部署</el-radio>
            <el-radio :label="3">Docker部署</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item>
          <el-form label-width="80px" size="mini">
            <el-form-item
              v-for="(item, index) in paramsList"
              :key="index"
              :label="item.name"
            >
              <el-input
                v-model="item.value"
                :placeholder="item.desc"
              ></el-input>
            </el-form-item>
          </el-form>
        </el-form-item>
        <el-form-item label="环境状态" prop="envStatus">
          <el-row>
            <el-col :span="3">
              <el-switch :disabled="limited" v-model="checked"></el-switch>
            </el-col>
            <el-col :span="6">
              <el-button
                type="primary"
                icon="el-icon-refresh"
                class="check"
                size="mini"
                @click="checkStatus"
                >检测</el-button
              >
            </el-col>
          </el-row>
        </el-form-item>
        <el-alert
          title="检测提示"
          description="只有通过检测之后环境才可使用，点击检测按钮即可"
          type="info"
          :closable="false"
          show-icon
        >
        </el-alert>
      </el-form>
      <div slot="footer">
        <el-button size="mini" @click="cancellDialog"> 取消</el-button>
        <el-button type="primary" size="mini" @click="submit"> 确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import envApi from "../../http/Environment";
export default {
  data() {
    return {
      currentPage: 1,
      totalSize: 0,
      envData: [],
      queryName: "",
      showEnvDialog: false,
      envForm: {},
      titleName: "创建环境",
      limited: true,
      isEdit: false,
      checked: false,
      sshParams: [
        { key: "host", value: "", name: "访问IP", desc: "请输入访问ssh的IP" },
        {
          key: "port",
          value: "",
          name: "访问端口",
          desc: "请输入访问ssh的端口",
        },
        {
          key: "user",
          value: "",
          name: "ssh用户",
          desc: "请输入访问ssh所使用的用户",
        },
        {
          key: "password",
          value: "",
          name: "ssh密码",
          desc: "请输入访问ssh所使用的密码",
        },
      ],
      paramsList: [],
    };
  },
  methods: {
    pageChange(page) {},
    handleDelete(row) {
      envApi.deleteEnv(row.envId).then((res) => {
        if (res.data) {
          this.$message.success("删除环境成功");
          this.getEnvs();
        } else {
          this.$message.error("删除环境失败");
        }
      });
    },
    handleEdit(row) {
      this.showEnvDialog = true;
      this.isEdit = true;
      this.titleName = "修改环境";
      this.paramsList = JSON.parse(row.envParams);
      this.limited = row.envStatus == 2;
      this.envForm = JSON.parse(JSON.stringify(row));
      this.checked = row.envStatus == 1;
    },
    submit() {
      let data = this.envForm;
      data.envParams = JSON.stringify(this.paramsList);
      data.envStatus = 2;
      if (this.checked) {
        data.envStatus = 1;
      }
      if (this.isEdit) {
        envApi.updateEnv(data).then((res) => {
          if (res.data) {
            this.$message.success("修改环境成功");
            this.cancellDialog();
            this.getEnvs();
          } else {
            this.$message.error("修改环境失败");
          }
        });
        return;
      }

      envApi.createEnv(data).then((res) => {
        console.log("create result", res);
        if (res.data) {
          this.$message.success("添加环境成功");
          this.cancellDialog();
          this.getEnvs();
        } else {
          this.$message.error("添加环境失败");
        }
      });
    },
    cancellDialog() {
      this.showEnvDialog = false;
      this.envForm = {};
    },
    selectType(type) {
      console.log("1111", type);
      this.paramsList = [];
      if (type == 1) {
        this.paramsList = JSON.parse(JSON.stringify(this.sshParams));
      }
    },
    getEnvs() {
      this.envData = [];
      envApi.getEnvs(this.currentPage, 10).then((res) => {
        console.log("环境列表", res);
        res.data.data.forEach((element) => {
          element.paramsList = JSON.parse(element.envParams);
          this.envData.push(element);
        });
        this.totalSize = res.data.total;
      });
    },
    checkStatus() {
      this.$message.success("校验成功");
      this.limited = false;
      this.checked = false;
    },
    startQuery() {},
    createEnv() {
      this.showEnvDialog = true;
      this.envForm = { envType: 1 };
      this.selectType(1);
      this.limited = true;
      this.isEdit = false;
      this.titleName = "创建环境";
    },
  },
  created() {
    this.getEnvs();
  },
};
</script>

<style scoped>
.title {
  margin: 10px;
}
.check {
  margin-left: 20px;
}
</style>
