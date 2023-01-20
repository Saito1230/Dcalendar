<template>
  <h1>認証中…</h1>
</template>

<script>
import axios from 'axios'

export default {
  data: () => ({
  }),
  methods: {
  },
  mounted () {
    window.onload = () => {
      const code = this.$route.query.code
      if (code === '' || code === undefined || code === null) this.$router.push('login')
      try {
        const params = new URLSearchParams()
        params.append('code', code)
        axios.post('https://dcalendar.net/token_oauth2', params).then(res => {
          if (res.data.message === 'ok') {
            this.$router.push('dcalendar')
          } else {
            this.$router.push({
              name: 'login',
              params: { message: 'no' }
            })
          }
        }).catch(e => {
          console.log(e)
          this.$router.push('login')
        })
      } catch (e) {
        console.log(e)
        this.$router.push('login')
      }
    }
  }
}
</script>

<style scoped>

</style>
