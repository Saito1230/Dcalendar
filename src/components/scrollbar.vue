<template>
  <div>
    <v-responsive
      max-width="400"
      class="mx-auto mb-4"
    >
      <v-text-field
        v-model="benched"
        type="number"
        label="Total Benched"
        min="0"
        max="10"
      ></v-text-field>
    </v-responsive>

    <v-card
      elevation="16"
      max-width="400"
      class="mx-auto"
    >
      <v-virtual-scroll
        :bench="benched"
        :items="items"
        height="300"
        item-height="64"
      >
        <template v-slot:default="{ item }">
          <v-list-item :key="item">
            <v-list-item-action>
              <v-btn
                fab
                small
                depressed
                color="#000"
              >
                {{ item }}
              </v-btn>
            </v-list-item-action>
          </v-list-item>

          <v-divider></v-divider>
        </template>
      </v-virtual-scroll>
    </v-card>
  </div>
</template>
<script>
export default {
  name: 'scrollbar',
  data: () => ({
    benched: 0
  }),
  computed: {
    items () {
      return Array.from({ length: this.length }, (k, v) => v + 1)
    },
    length () {
      return 10
    }
  }
}
</script>

<style scoped>

</style>
