<template>
  <div>
    <div class="main" @click="showCourse">
      <div class="title">
        <slot name="title"></slot>
      </div>
    </div>
    <transition>
      <div v-show="boxshow && isAuto" class="lesson">
        <div class=" animate__animated  animate__fadeIndown">
          <slot name="content"> </slot>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  props: {
    isAuto: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      boxshow: false,
    };
  },
  methods: {
    showCourse() {
      this.boxshow = !this.boxshow;
    },
  },
};
</script>

<style scoped>
.item {
  padding-bottom: 20px;
}
.main {
  position: relative;
}
.title {
  cursor: pointer;
}
</style>
