<template>
  <div class="mx-6 mt-3">
    <v-layout row wrap v-if="lists.length">
      <v-flex xs12 :key="index" v-for="(list, index) in lists" class="mb-4">
        <v-card
          color="blue lighten-3"
          class="white--text"
          :to="{ name: 'list_detail', params: { id: index } }"
        >
          <div>
            <v-card-title class="font-weight-bold">
              {{ list.name || $("list_no_name") }}
            </v-card-title>
            <v-card-text class="body-2 white--text">
              {{ $tc("list_num_items", list.items.length) }}
            </v-card-text>
          </div>
          <v-avatar class="ma-3" size="125" tile>
            <v-img :src="item.src"></v-img>
          </v-avatar>
        </v-card>
      </v-flex>
    </v-layout>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "share-target",
  created: function () {
    this.$store.commit({
      type: "updateTitle",
      title: this.$t("list_share_target_title"),
    });
  },
  computed: mapState({
    lists: (state) => state.lists,
  }),
};
</script>
