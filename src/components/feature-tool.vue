<template>
  <div>
    <div v-if="executePoint.executeType == 2">
      <FeatureFor
        :data="executePoint"
        :isEdit="isEdit"
        @refreshData="refreshValue"
      >
      </FeatureFor>
    </div>
    <div v-if="executePoint.executeType == 3">
      <FeatureIF
        :data="executePoint"
        :isEdit="isEdit"
        @refreshData="refreshValue"
      >
      </FeatureIF>
    </div>
    <div v-if="executePoint.executeType == 6">
      <monaco
        :codes="executePoint.service"
        @change="dataChange"
        language="javascript"
        :readonly="!isEdit"
      ></monaco>
    </div>
  </div>
</template>
<script>
import FeatureFor from '@/components/feature-for'
import FeatureIF from '@/components/feature-if'
import monaco from '@/components/MonacoEditor.vue'
export default {
  props: {
    data: Object,
    isEdit: Boolean,
  },
  components: {
    FeatureFor,
    FeatureIF,
    monaco,
  },
  watch: {
    data(val) {
      this.executePoint = val
    },
  },
  data() {
    return {
      executePoint: {},
      writeType: '',
    }
  },
  methods: {
    dataChange(info) {
      this.executePoint.service = info
      this.$emit('refreshData', {
        data: this.executePoint,
      })
    },
    refreshValue(update) {
      this.$emit('refreshData', update)
    },
  },
  created() {
    this.executePoint = this.data
    console.log(this.executePoint)
  },
}
</script>
<style scoped>
.item-line {
  margin: 10px 0px;
}

.title {
  position: relative;
  min-height: 40px;
  width: 100%;
}
.select-button {
  width: 200px;
  position: absolute;
  left: 50%;
  top: 0%;
  transform: translateX(-50%);
}
.param_name {
  height: 30px;
  line-height: 30px;
  float: right;
  margin-right: 10px;
  color: #606266;
}
</style>
