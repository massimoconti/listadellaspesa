<template>
  <v-card color="white">
    <v-card-text>
      <v-form v-model="valid" @submit.prevent="createList">
        <v-text-field
          v-model="name"
          :counter="50"
          :rules="nameRules"
          :label="this.$t('list_new_name')"
          required
          autofocus
        ></v-text-field>
      </v-form>
    </v-card-text>
  </v-card>
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

      gtag('event', 'createList', {
        'event_category': 'ManageListe',
        'event_label': this.name
      });

      this.$router.push({ name: 'list_detail', params: { id: last_id } });
    }
  }
}
</script>
