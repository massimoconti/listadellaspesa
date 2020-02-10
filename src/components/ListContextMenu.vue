<template>
<div>
    <v-bottom-sheet inset>
      <template v-slot:activator="{ on }">
          <v-btn
            icon
            class="white--text"
            dark
            v-on="on"
            v-if="isWhatsappInstalled"
          >
            <v-icon>share</v-icon>
          </v-btn>
      </template>
      <v-sheet class="text-center" height="60px" style="padding:15px">
            {{ $t('share_with') }}
            <v-btn
              class="white--text"
              style="background:#28b351"
              @click="shareWhatapp"
            >
                Whatsapp
            </v-btn>
      </v-sheet>
    </v-bottom-sheet>

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
</div>
</template>

<script>
export default {
  name: 'list-context-menu',
  data: function(){

  function goto(url, fallback) {
      var script = document.createElement('script');

      script.onload = function() {
          document.location = url;
      }
      script.onerror = function() {
          document.location = fallback;
      }
      script.setAttribute('src', url);

      document.getElementsByTagName('head')[0].appendChild(script);
  }

    return {
        whatsappSupported: false
    }
  },
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
    },
    shareWhatapp: function(){
        var text = this.list.items.map(function(el){
          return el.name.trim();
      }).join("\n");



      location.href="whatsapp://send?text=" + text
    }
  }
}
</script>
