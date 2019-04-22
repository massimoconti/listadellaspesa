<template>
  <div>
    <label>Crea una nuova lista</label><br>
    <input type="text" name="name" v-model="name" @keyup.enter="createList" autofocus>
    <button @click="createList">Salva</button>
</div>
</template>

<script>

export default {
  name: 'list-new',
  created: function(){
    this.$store.commit({
      type: 'updateTitle',
      title: 'Nuova lista'
    });
  },
  data: function(){
    return {
      name: ''
    }
  },
  methods: {
    createList: function(){
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

<style scoped>
label {
  font-size: 1.1rem;
  color:#fff;
}
input {
  margin-right: 1%;
  padding:0.5rem;
  border-radius: .25rem;
  background: #fff;
  transition: border-color .15s ease-in-out,box-shadow .15s ease-in-out;
  width:75%;
  display: inline-block;
  font: 300 1rem Roboto, sans-serif;
  vertical-align: middle;
  resize: none;
  outline: 0;
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
</style>
