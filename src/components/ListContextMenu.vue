<template>
  <div class="context-menu-wrapper">
    <Backdrop v-bind:visible="open" @clicked="toggle" />

    <a class="context-nav" href="#" @click="toggle">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="1"></circle><circle cx="12" cy="5" r="1"></circle><circle cx="12" cy="19" r="1"></circle></svg>
    </a>

    <div class="context-menu" v-if="isOpen">
      <ul>
        <li><router-link :to="{ name: 'list_settings', params: { id: id } }">Impostazioni lista</router-link></li>
        <li v-bind:class="{ disabled: !list.items.length }"><a href="#" @click="setListAction('elimina')">Elimina articoli</a></li>
        <li v-bind:class="{ disabled: list.items.length <= 1 }"><a href="#" @click="setListAction('riordina')">Riordina articoli</a></li>
      </ul>
    </div>
  </div>
</template>

<script>
import Backdrop from './Backdrop.vue'

export default {
  name: 'list-context-menu',
  data: function(){
    return {
      open: false
    }
  },
  computed: {
    id: function(){
      return this.$route.params.id;
    },
    list: function(){
      return this.$store.state.lists[this.id];
    },
    isOpen: function(){
      return !!this.open;
    },
  },
  methods: {
    toggle: function(){
      this.open = !this.open;
    },
    setListAction: function(action){
      this.toggle();
      this.$store.commit({
        type: 'updateListAction',
        action: action
      })
    }
  },
  components: {
    Backdrop
  }
}
</script>

<style>
.context-menu-wrapper {
  float:right;
  position: relative;
}
.context-menu {
  display:block;
  position: absolute;
  top:0;
  right: -2px;
  width: 200px;
  height: 150px;
  z-index: 101;
  background: #fff;
  border-radius: .2rem;
  border:1px solid #ddd;
  box-shadow: .1rem .1rem .2rem .2rem rgba(0,0,0,.25);
  padding: .9rem;
  overflow: hidden;
}
.context-menu li {
  margin-bottom: .9rem;
}
.context-menu a {
  color:#333
}
.context-menu .disabled a {
  color:#aaa
}
</style>
