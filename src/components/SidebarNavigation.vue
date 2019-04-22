<template>
  <div>
    <Backdrop v-bind:visible="isOpen" @clicked="close" />
    <nav @touchstart="touchStart" @touchend="touchEnd" @touchmove="touchMove" :style="navStyleObject">
      <slot></slot>
    </nav>
  </div>
</template>

<script>
import Backdrop from './Backdrop.vue'

export default {
  name: 'sidebar-navigation',
  data: function(){
    return {
      touch_left: null,
      nav_width: null,
      touch_start_x: null
    };
  },
  computed: {
    navStyleObject: function(){
      var left;
      var transition;

      if (this.touch_start_x)
        transition = "none";
      else
        transition = ".3s ease-in-out";

      if (this.touch_left)
        left = this.touch_left+'px';
      else if (this.isOpen)
        left = 0;
      else
        left = '-100%';

      return {
        left: left,
        transition: transition
      }
    },
    isOpen: function(){
      return this.$store.state.nav_open;
    }
  },
  methods: {
    close: function(){
      this.touch_start_x = null;

      this.$store.dispatch('closeNav');
    },
    touchStart: function(event){
      if (null === this.nav_width)
        this.nav_width = event.target.offsetWidth;

      this.touch_start_x = event.touches[0].clientX;
    },
    touchMove: function(event){
      this.touch_left = 0 - (this.touch_start_x - event.touches[0].clientX);
      if (this.touch_left > 0)
        this.touch_left = 0;
    },
    touchEnd: function(){
      var do_open = Math.abs(this.touch_left) < this.nav_width/2;
      this.touch_left = null;
      this.touch_start_x = null;

      if (!do_open)
        this.close();
    }
  },
  components: {
    Backdrop
  }
};
</script>

<style>
nav {
  background: #efefef;
  position: fixed;
  top:0;
  left:-100%;
  width: 85%;
  height:100%;
  z-index: 101;
  box-shadow: 2px 0px 15px 1px rgba(0,0,0,0.75);
  overflow: auto;
}
</style>
