<template>
  <div class="mx-6 mt-3">
    <v-layout row wrap v-if="lists.length" >
       <v-flex xs12 v-for="(list, index) in lists" class="mb-4">
         <v-card color="blue lighten-2" class="white--text" :to="{ name: 'list_detail', params: { id: index } }">
           <v-card-title class="font-weight-bold">
             {{ list.name || $('list_no_name') }}
           </v-card-title>
           <v-card-text class="body-2 white--text">
             {{ $tc('list_num_items', list.items.length) }}
           </v-card-text>
         </v-card>
       </v-flex>
     </v-layout>

     <div v-else>
       <p class="text-xs-center mt-3">{{ $t('no_lists') }}</p>
     </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'list-index',
  created: function(){
    this.$store.commit({
      type: 'updateTitle',
      title: this.$t('list_index_title')
    });
  },
  computed: mapState({
    lists: state => state.lists
  }),
}
</script>
