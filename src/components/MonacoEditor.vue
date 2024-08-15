<template>
  <div>
    <!-- <div
      ref="container"
      style="height: 300px; width: 100%"
      class="monaco-editor"
    ></div> -->
    <codemirror v-model="content" :options="options"></codemirror>
  </div>
</template>

<script>
import { codemirror } from 'vue-codemirror'
import '../lib/cm-setting'
export default {
  components: {
    codemirror,
  },
  props: {
    // 编辑器中呈现的内容
    codes: {
      type: String,
    },
    language: {
      type: String,
      default: 'application/json',
    },
    readonly: {
      type: Boolean,
      default: function () {
        return false
      },
    },
  },
  watch: {
    codes: {
      immediate: true,
      handler(val) {
        if (val) {
          this.content = val
        }
      },
    },
    content: {
      handler(n) {
        this.$emit('change', n)
      },
    },
    readonly: {
      handler(val) {
        this.options.readOnly = val
      },
    },
  },
  data() {
    return {
      monacoEditor: null,
      readOnly: true,
      content: '',
      hoverProvider: null,
      options: {
        line: true,
        theme: 'lesser-dark', // 主题
        tabSize: 4, // 制表符的宽度
        indentUnit: 2, // 一个块应该缩进多少个空格（无论这在编辑语言中意味着什么）。默认值为 2。
        firstLineNumber: 1, // 从哪个数字开始计算行数。默认值为 1。
        readOnly: this.readonly, // 只读
        autorefresh: true,
        smartIndent: true, // 上下文缩进
        lineNumbers: true, // 是否显示行号
        styleActiveLine: true, // 高亮选中行
        viewportMargin: Infinity, //处理高度自适应时搭配使用
        showCursorWhenSelecting: true, // 当选择处于活动状态时是否应绘制游标
        mode: this.language,
      },
    }
  },
  methods: {},
  mounted() {},
}
</script>

<style scoped>
.monaco-editor {
  min-height: 400px;
  text-align: left;
}
</style>
