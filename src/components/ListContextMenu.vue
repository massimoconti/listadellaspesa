<template>
  <v-menu offset-y transition="scroll-y-transition">
    <template v-slot:activator="{ on }">
      <v-btn
        icon
        class="white--text"
        dark
        v-on="on"
      >
        <v-icon>more_vert</v-icon>
      </v-btn>
    </template>
    <v-list>
      <v-list-item :to="{ name: 'list_settings', params: { id: id } }">
        <v-list-item-title>{{ $t('list_settings') }}</v-list-item-title>
      </v-list-item>

      <v-list-item @click="setListAction('elimina')" :disabled="!listHasItems">
        <v-list-item-title>{{ $t('list_deletion') }}</v-list-item-title>
      </v-list-item>

      <v-list-item @click="setListAction('edit')" :disabled="!listHasItems">
        <v-list-item-title>{{ $t('list_edit_items') }}</v-list-item-title>
      </v-list-item>

      <v-list-item @click="setListAction('riordina')" :disabled="!listHasItems">
        <v-list-item-title>{{ $t('list_rearrenge') }}</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<script>
export default {
  name: 'list-context-menu',
  computed: {
    id: function(){
      return this.$route.params.id;
    },
    list: function(){
      if (this.$store.state.lists[this.id])
        return this.$store.state.lists[this.id];
    },
    listHasItems: function(){
      return !!this.list.items && !!this.list.items.length
    }
  },
  methods: {
    setListAction: function(action){
      this.$store.commit({
        type: 'updateListAction',
        action: action
      })
    }
  }
}
</script>
