<template>
  <div class="mx-6 mt-3">
    <v-form v-model="valid" @submit.prevent="createList">
      <v-text-field
        v-model="name"
        :counter="50"
        :rules="nameRules"
        :label="$t('list_insert_name')"
        required
        class="mb-3"
      ></v-text-field>

      <v-card v-if="list.length" class="mx-auto mb-5" tile>
        <v-list-item v-for="item in list">
          <v-list-item-content>
            <v-list-item-title>{{ item }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-card>

      <v-btn color="primary" type="submit">
        {{ $t("save") }}
      </v-btn>
    </v-form>
  </div>
</template>

<script>
import splitItems from '@/plugins/splitItems'

export default {
  name: "share-target",
  data() {
    const parsedUrl = new URL(window.location);

    return {
      valid: false,
      name: parsedUrl.searchParams.get("title"),
      list: splitItems(this.$t('list_vocal_separator'), parsedUrl.searchParams.get("text")),
      nameRules: [(v) => !!v || this.$t("list_insert_name")],
    };
  },
  created: function () {
    this.$store.commit({
      type: "updateTitle",
      title: this.$t("list_share_target_title"),
    });
  },
  methods: {
    createList() {
      if (false == this.valid) {
        return;
      }

      this.$store.commit({
        type: 'createList',
        name: this.name
      });

      var last_id = Math.max(...[...this.$store.state.lists.keys()]);

      gtag('event', 'createList', {
        'event_category': 'ShareTarget',
        'event_label': this.name
      });

      this.list.forEach((item) => {
        this.$store.commit({
          type: 'pushToList',
          id: last_id,
          item: item
        });
      });
      
      this.$router.push({ name: 'list_detail', params: { id: last_id } });
    },
  },
};
</script>
