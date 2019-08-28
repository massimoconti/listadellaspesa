<template>
  <div>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'index',
  created: function(){
    if (1 === this.lists.length){
      var first_id = Object.keys(this.lists)[0];
      this.$router.replace({ name: 'list_detail', params: { id: first_id } });
      return;
    }

  this.$router.replace({ name: 'list_index' });
  },
  computed: mapState({
    lists: state => state.lists
  }),
}
</script>
