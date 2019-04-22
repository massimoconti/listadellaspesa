<template>
  <div>
    <ul v-if="lists.length">
      <li v-for="(list, index) in lists">
        <router-link :to="{ name: 'list_detail', params: { id: index } }">
          {{ list.name || '[senza nome]' }}
        </router-link>
        <br><small>{{ list.items.length }} {{ list.items.length==1 ? 'articolo' : 'articoli' }}</small>
      </li>
    </ul>
    <div v-else>
      <p class="emptylist-msg">
        Nessuna lista presente
      </p>
      <p>Crea ora una nuova lista</p>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'list-index',
  created: function(){
    if (1 === this.lists.length){
      var first_id = Object.keys(this.lists)[0];
      this.$router.push({ name: 'list_detail', params: { id: first_id } });
    }
    this.$store.commit({
      type: 'updateTitle',
      title: 'Le tue liste'
    });
  },
  computed: mapState({
    lists: state => state.lists
  }),
}
</script>

<style scoped>
li {
  display:block;
  background: #fff;
  border-radius: 0.3rem;
  margin-bottom: 1rem;
  padding:0.5rem;
  box-shadow:0 0 0 0.2rem rgba(0,123,255,.25);
}

li a {
  font-weight: 500;
  text-decoration: none;
  color:#333;
  font-size:1.1rem;
}

li small {
  color:#666;
  font-size:.9rem;
}

.emptylist-msg {
  display: block;
  width: 100%;
  font-size: 1.3rem;
  font-weight: 500;
  text-align: center;
  color: rgb(236, 242, 245);
  /* text-shadow: 1px 1px 1px #4E342E; */
}
</style>
