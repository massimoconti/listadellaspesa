<template>
  <transition name="notifications">
    <div class="notifications body-1" v-if="msg">
      {{ msg }}
    </div>
  </transition>
</template>

<script>
export default {
  name: 'notification-bar',
  data: function(){
    return {
      interval: null
    }
  },
  computed: {
    msg: function(){
      if (this.$store.state.notification){

        if (this.interval)
          clearInterval(this.interval);

        this.interval = setTimeout(function(){
          this.$store.commit({
            type: 'notify',
            notification: ''
          });
        }.bind(this), 2500);
      }

      return this.$store.state.notification;
    }
  }
}
</script>

<style>
.notifications {
  display: block;
  position: fixed;
  background: #323232;
  border-radius: 0.1rem;
  padding: 0.4rem;
  color: #fff;
  box-sizing: border-box;
  left: 10px;
  right: 10px;
  bottom:10px;
  box-shadow: 1px 1px 1px 0px rgba(0,0,0,0.75);
}

.notifications-enter-active {
  animation: animate-notifications .4s;
}
.notifications-leave-active {
  animation: animate-notifications .4s reverse;
}

@keyframes animate-notifications {
  from { bottom:-50px; opacity:0 }
  to { bottom: 10px; opacity:1 }
}
</style>
