<template>
  <div>
    <el-autocomplete
      v-model="selectedUser"
      :fetch-suggestions="querySearchAsync"
      placeholder="请输入用户名称搜索"
      @select="handleSelect"
    ></el-autocomplete>
  </div>
</template>
<script>
import userApi from '../http/User'
export default {
  props: {
    user: String,
  },
  watch: {
    user: {
      immediate: true,
      handler(val) {
        console.log('接受到数据', val)
        this.selectedUser = val
      },
    },
  },
  data() {
    return {
      selectedUser: null,
    }
  },
  methods: {
    querySearchAsync(queryString, cb) {
      userApi.queryUserByName(queryString).then((res) => {
        let array = []
        res.data.forEach((e) => {
          e.value = e.userName
          array.push(e)
        })
        cb(array)
      })
    },
    handleSelect(item) {
      console.log(this.selectedUser)
      this.$emit('chooseUser', item)
    },
  },
  created() {
    this.selectedUser = this.user
  },
}
</script>
