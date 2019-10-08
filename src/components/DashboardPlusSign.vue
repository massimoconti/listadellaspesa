<template>
  <div>
    <v-card
    :flat="true"
    class="transparent"
    id="plus-create-list"
      >
      <v-card-text>
        <v-btn
          :to="{ name: 'list_new'}"
          dark
          fab
          top
          right
          color="blue"
        >+</v-btn>
      </v-card-text>
    </v-card>
  </div>
</template>

<style>
#plus-create-list {
  position:fixed;
  bottom:10px;
  right:20px;
}

#plus-create-list .v-btn__content {
  font-size:25px;
}
</style>
