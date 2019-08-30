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
          absolute
          dark
          fab
          top
          right
          color="blue"
          style="font-size:22px;"
        >+</v-btn>
      </v-card-text>
    </v-card>
  </div>
</template>

<style>
#plus-create-list {
  position:fixed;
  bottom:10px;
  right:10px
}
</style>
