<template>
  <div v-if="visible" class="backdrop" @click="clicked"></div>
</template>

<script>
export default {
  name: 'backdrop',
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    clicked: function(){
      this.$emit('clicked');
    }
  }
}
</script>

<style>
.backdrop {
  position: fixed;
  top:0;
  left:0;
  width: 100%;
  height:100%;
  z-index: 100;
}
</style>
