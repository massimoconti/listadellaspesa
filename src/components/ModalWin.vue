<template>
  <div class="modal-overlay" :class="{active: open}" @click="closeModal">
    <div class="modal">
      <div class="modal-content">
        <span class="close" @click="closeModal">&times;</span>
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'modal-win',
  props: {
    open: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    closeModal: function(){
      this.$emit('update:open', false);
      this.$emit('modal_closed');
    }
  }
}
</script>

<style>
.modal-overlay {
  display:none;
  position: fixed;
  z-index: 100;
  padding-top: 100px;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: rgba(0,0,0,0.7);
}

.modal-overlay.active {
  display:block;
}

/* Modal Content */
.modal {
  position: relative;
  background-color: #fefefe;
  margin: auto;
  padding: 2rem 1rem;
  border: 1px solid #888;
  border-radius: 0.4rem;
  width: 85%;
  max-width: 600px;
  animation: animatemodal 0.4s;
}

@keyframes animatemodal {
  from {top:200px; opacity:0}
  to {top:0; opacity:1}
}

.modal-content {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  color: #333;
  font-size: 16px;
}

.modal-title {
  font-weight:bold;
  padding:1rem 0;
}

.modal-description {
  font-size:0.9rem;
}

/* The Close Button */
.close {
  display:inline-block;
  position: absolute;
  top:1rem;
  right:1rem;
  margin-top: -0.5rem;
  color: #aaa;
  font-size: 1.5rem;
  font-weight: bold;
  cursor: pointer;
}

.close:hover,
.close:focus {
  color: #000;
  text-decoration: none;
}
</style>
