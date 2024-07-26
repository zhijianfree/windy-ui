<template>
  <span>
    <span v-if="showText.length == len">{{ showText }}</span>
    <span v-else>
      <el-popover
        v-if="showpop"
        :open-delay="200"
        :close-delay="300"
        placement="top-start"
        trigger="hover"
        :content="fullText"
      >
        <span slot="reference">{{ showText }}</span>
      </el-popover>
      <span v-else>{{ showText }}</span>
    </span>
  </span>
</template>
<script>
export default {
  props: {
    text: {
      type: String,
    },
    len: {
      type: Number,
      default: 20,
    },
    showpop: {
      type: Boolean,
      default: true,
    },
  },
  watch: {
    text: {
      handler(val) {
        if (!val) {
          return
        }
        this.fullText = val
        if (val.length > this.len) {
          this.showText = val.substring(0, this.len) + '...'
        } else {
          this.showText = val
        }
      },
      deep: true,
      immediate: true,
    },
  },
  data() {
    return {
      showText: '',
      fullText: '',
    }
  },
}
</script>
