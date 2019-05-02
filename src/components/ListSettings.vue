<template>
  <div>
    <v-form v-model="valid" class="mt-3" @submit.prevent="updateList">
      <v-text-field
        v-model="name"
        :counter="50"
        :rules="nameRules"
        :label="$t('list_rename')"
        required
      ></v-text-field>
    </v-form>

    <p class="subheading mt-5">{{ $t('list_delete') }}</p>
    <v-btn color="error" :ripple="true" @click="deleteList">
      <v-icon>delete</v-icon>
      {{ $t('delete') }}
    </v-btn>
  </div>
</template>

<script>

export default {
  name: 'list-settings',
  created: function(){
    this.name = this.list_name;

    this.$store.commit({
      type: 'updateTitle',
      title: this.$t('list_settings')
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
  computed: {
    id: function(){
      return this.$route.params.id;
    },
    list: function(){
      return this.$store.state.lists[this.id];
    },
    list_name: function(){
      return this.list.name;
    }
  },
  methods: {
    updateList: function(){
      if (!this.valid)
        return;

      this.$store.commit({
        type: 'updateListName',
        id: this.id,
        name: this.name
      });

      this.$router.push({ name: 'list_detail', params: { id: this.id } });
    },
    deleteList: function(){
      var name = this.list_name;

      this.$store.commit({
        type: 'deleteList',
        id: this.id
      });

      this.$store.commit({
        type: 'notify',
        notification: this.$t('list_delete_notify', [name])
      });

      this.$router.push({ name: 'list_index' });
    }
  }
}
</script>
