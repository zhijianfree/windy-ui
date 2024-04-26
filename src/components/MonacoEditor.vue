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
  watch: {
    codes: {
      immediate: true,
      handler(n) {
        this.content = n
      },
    },
    content: {
      handler(n) {
        this.$emit('change', n)
      },
    },
  },
  data() {
    return {
      monacoEditor: null,
      readOnly: true,
      content: '',
    }
  },
  methods: {
    getValue() {
      return this.monacoEditor.getValue()
    },
    initEditer() {
      this.$nextTick(() => {
        let self = this
        this.$refs.container.innerHTML = ''
        self.monacoEditor = monaco.editor.create(self.$refs.container, {
          value: this.content, // 见props
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
        self.monacoEditor.onDidChangeModelContent(() => {
          self.content = self.monacoEditor.getValue()
        })
        window.onresize = function () {
          self.monacoEditor.layout()
        }
      })
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
  min-height: 400px;
  text-align: left;
}
</style>
