<template>
  <div id="settings">
    <label>Rinomina questa lista</label><br>
    <input type="text" name="name" v-model="input_list_name" @keyup.enter="updateList" autofocus>
    <button @click="updateList">Salva</button>

    <br><br><br>
    <p>Elimina questa lista:</p>
    <button class="delete" @click="deleteList">Elimina</button>
  </div>
</template>

<script>

export default {
  name: 'list-settings',
  created: function(){
    this.input_list_name = this.list_name;

    this.$store.commit({
      type: 'updateTitle',
      title: 'Modifica ' + this.list.name
    });
  },
  data: function(){
    return {
      input_list_name: null
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
      this.$store.commit({
        type: 'updateListName',
        id: this.id,
        name: this.input_list_name
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
        notification: 'Lista \''+ name +'\' eliminata'
      });

      this.$router.push({ name: 'list_index' });
    }
  }
}
</script>

<style scoped>
#settings {
  background: #fff;
  border-radius: 5px;
  padding: 0.4rem;
}
p, label {
  margin-bottom: .3rem;
  font-size: .7rem;
  font-weight: 400;
  color:#333;
  text-transform: uppercase;
}
input {
  display: block;
  margin-bottom: 1.4rem;
  border-bottom:1px solid #ccc;
  padding:0.4rem;
  width:95%;
  font: 300 1.2rem Roboto, sans-serif;
  vertical-align: middle;
  resize: none;
  outline: 0;
  transition: border-color .15s ease-in-out,box-shadow .15s ease-in-out;
}
input:focus {
  border-bottom-color: blue;
}
button {
  width:19%;
  padding:0.42rem;
  background: #479047;
  border-bottom: 1px solid #ced4da;
  border-radius: .25rem;
  font: 500 1rem Roboto, sans-serif;
  color:#fff
}
button.delete {
  background:red
}
</style>
