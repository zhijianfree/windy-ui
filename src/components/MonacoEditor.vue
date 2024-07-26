<template>
  <div>
    <div
      ref="container"
      style="height: 300px; width: 100%"
      class="monaco-editor"
    ></div>
  </div>
</template>

<script>
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api.js'
export default {
  props: {
    // 编辑器中呈现的内容
    codes: {
      type: String,
    },
    language: {
      type: String,
      default: 'json',
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
          this.setDataValue(val)
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
        this.monacoEditor.updateOptions({ readOnly: val })
      },
    },
  },
  data() {
    return {
      monacoEditor: null,
      readOnly: true,
      content: '',
      hoverProvider: null,
    }
  },
  methods: {
    getValue() {
      return this.monacoEditor.getValue()
    },
    initEditer() {
      this.monacoEditor = monaco.editor.create(this.$refs.container, {
        value: this.content,
        language: this.type,
        theme: 'vs-dark',
        readOnly: this.readOnly,
        automaticLayout: true, // 自动布局
        lineNumbers: 'on', // 显示行号
        fontFamily: "Consolas, 'Courier New', monospace", // 字体设置
        fontSize: 14, // 字体大小
        tabSize: 2, // 制表符大小
        wordWrap: 'on', // 自动换行
        find: true,
        scrollBeyondLastLine: false, // 是否允许滚动超过最后一行
        minimap: {
          enabled: true, // 是否显示缩略图
        },
      })
      this.monacoEditor.onDidChangeModelContent(() => {
        this.content = this.monacoEditor.getValue()
      })
      window.addEventListener('resize', () => {
        this.monacoEditor.layout()
      })
      // 使用 nextTick 确保编辑器完全初始化后设置值
      this.$nextTick(() => {
        this.setDataValue(this.content)
      })
    },
    setDataValue(data) {
      if (!data || data == '') {
        return
      }
      if (this.monacoEditor) {
        const currentPosition = this.monacoEditor.getPosition()
        const selection = this.monacoEditor.getSelection()

        this.monacoEditor.setValue(data || '')

        // 恢复光标位置
        if (currentPosition) {
          this.monacoEditor.setPosition(currentPosition)
        }
        if (selection) {
          this.monacoEditor.setSelection(selection)
        }
        this.monacoEditor.focus()
      }
    },
  },
  mounted() {
    this.readOnly = this.readonly
    this.type = this.language
    this.initEditer()
  },
}
</script>

<style scoped>
.monaco-editor {
  min-height: 400px;
  text-align: left;
}
</style>
