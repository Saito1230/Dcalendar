<template>
<div id="content">
  <div id="login">
    <div id="text">
      <h2>Welcome DCalendar</h2>
    </div>
    <div id="btn">
      <v-btn
        color="#7e9be0"
        depressed
        elevation="11"
        @click="toLogin"
      >Login Discord Accaunt</v-btn>
    </div>
  </div>
</div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'welcome',
  created () {
    try {
      axios.post('https://dcalendar.net/login_auth').then(res => {
        if (res.data.message === 'ok') this.$router.push('dcalendar')
      }).catch(e => {
        console.log(e)
      })
    } catch (e) {
      console.log(e)
    }
  },
  methods: {
    toLogin () {
      window.open('https://discord.com/api/oauth2/authorize?client_id=1063280642835628164&redirect_uri=https%3A%2F%2Fdcalendar.net%2Foauth2&response_type=code&scope=identify')
    }
  }
}
</script>

<style scoped>

#content{
  display: grid;
  grid-template-rows: 200px auto 200px;
  grid-template-columns: 1fr 2fr 1fr;
  justify-items: center;
  align-items: center;
}

#login{
  grid-column: 2/3;
  grid-row: 2/3;
}
#btn {
  margin-top: 50px;
}

</style>
