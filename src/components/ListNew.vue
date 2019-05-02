<template>
  <v-form v-model="valid" class="mt-3" @submit.prevent="createList">
    <v-text-field
      v-model="name"
      :counter="50"
      :rules="nameRules"
      :label="this.$t('list_new_name')"
      required
      autofocus
    ></v-text-field>
  </v-form>
</template>

<script>

export default {
  name: 'list-new',
  created: function(){
    this.$store.commit({
      type: 'updateTitle',
      title: this.$t('list_new')
    });
  },
  data: function(){
    return {
      valid: false,
      name: '',
      nameRules: [
        v => !!v || this.$t('list_insert_name')
      ],
    }
  },
  methods: {
    createList: function(){
      if (!this.valid)
        return;

      this.$store.commit({
        type: 'createList',
        name: this.name
      });

      var last_id = Math.max(...[...this.$store.state.lists.keys()]);

      this.$router.push({ name: 'list_detail', params: { id: last_id } });
    }
  }
}
</script>
