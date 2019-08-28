<template>
  <div>
    <v-layout row wrap v-if="lists.length" >
       <v-flex xs12 v-for="(list, index) in lists">
         <v-card color="blue lighten-2" class="white--text" :to="{ name: 'list_detail', params: { id: index } }">
           <v-card-title primary-title>
             <div>
               <div class="headline font-weight-bold">{{ list.name || $('list_no_name') }}</div>
               <span>{{ $tc('list_num_items', list.items.length) }}</span>
             </div>
           </v-card-title>
         </v-card>
       </v-flex>
     </v-layout>

     <div v-else>
       <p class="text-xs-center mt-3">{{ $t('no_lists') }}</p>
     </div>

     <v-card
      :flat="true"
      class="blue-grey lighten-5"
      >
      <v-card-text style="height: 300px;"></v-card-text>
      <v-card-text style="height: 100px; position: relative">
        <v-btn
          :to="{ name: 'list_new'}"
          absolute
          dark
          fab
          top
          right
          color="blue"
        >+</v-btn>
      </v-card-text>
    </v-card>
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
