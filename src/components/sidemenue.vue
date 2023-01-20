<template>
<div id="sidemenu_content">
  <v-btn
    fab
    width="50"
    height="50"
    @click="newGroup"
  >
    <v-icon small color="white" x-large>
      mdi-plus
    </v-icon>
  </v-btn>
  <img class="icon" src="./img/icon.png" alt="">
</div>
<GCDialog></GCDialog>
</template>

<script>
import GCDialog from '@/components/dialog'

export default {
  data: () => ({
    dialog_visible: false
  }),
  components: {
    GCDialog
  },
  methods: {
    newGroup () {
      GCDialog.data().dialog = this.dialog_visible
    }
  }
}
</script>

<style scoped>
.icon{
  border-radius: 50px;
  width: 50px;
  display: block;
  margin-top: 5px;
}
</style>
