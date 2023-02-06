<template>
  <div>
    <div ref="container" class="monaco-editor"></div>
  </div>
</template>

<script>
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api.js'
export default {
  props: {
    // 编辑器中呈现的内容
    codes: {
      type: String,
      default: function () {
        return ''
      },
    },
    readonly: {
      type: Boolean,
      default: function () {
        return false
      },
    },
  },
  data() {
    return {
      monacoEditor: null,
      readOnly: true,
    }
  },
  watch: {
    codes(value) {
      this.setDataValue(value)
    },
  },
  methods: {
    initEditer() {
      let self = this
      self.$refs.container.innerHTML = ''
      self.monacoEditor = monaco.editor.create(self.$refs.container, {
        value: this.codes, // 见props
        language: 'json',
        theme: 'vs-dark', // 编辑器主题：vs, hc-black, or vs-dark，更多选择详见官网
        editorOptions: {
          selectOnLineNumbers: true,
          roundedSelection: false,
          readOnly: false,
          cursorStyle: 'line', // 光标样式
          automaticLayout: true, // 自动布局
          glyphMargin: true, // 字形边缘
        },
      })
      window.onresize = function () {
        self.monacoEditor.layout()
      }
    },
    setDataValue(data) {
      this.monacoEditor.setValue(data)
    },
  },
  mounted() {
    this.initEditer()
    this.readOnly = this.readonly
  },
}
</script>

<style scoped>
.monaco-editor {
  height: 200px;
  text-align: left;
}
</style>
