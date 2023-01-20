<template>
  <div id="content">
    <sidemenue id="sidemenue"></sidemenue>
    <calendar @addSchedule="addSchedule" id="calendar"></calendar>
  </div>

</template>

<script>
import calendar from '@/components/calendar'
import sidemenue from '@/components/sidemenue'
import axios from 'axios'

export default {
  name: 'main',
  data: () => ({
    name: '',
    schedule_data: []
  }),
  created () {
    try {
      axios.post('https://dcalendar.net/login_auth').then(res => {
        if (res.data.message === 'no') this.$router.push('login')
        this.name = res.data.name
        this.schedule_data = res.data.schedule
      }).catch(e => {
        console.log(e)
        this.$router.push('login')
      })
    } catch (e) {
      console.log(e)
      this.$router.push('login')
    }
  },
  components: {
    calendar,
    sidemenue
  },
  methods: {
    addSchedule: function (SchedulData) {
      if (this.name === '') {
        console.error('名前が取得できませんでした。')
        return
      }

      const params = new URLSearchParams()
      params.append('schedule', JSON.stringify(SchedulData))
      params.append('name', this.name)

      axios.post('https://dcalendar.net/addSchedule', params).then(res => {
        if (res.data.message !== 'ok') {
          console.error('正常にイベント追加できませんでした。')
        }
      })
    }
  }
}
</script>

<style scoped>
#content{
  display: grid;
  margin: 0px 10px 0px 0px;
  grid-template-columns:  50px 1fr;
  grid-template-rows: 100vh;
}
#sidemenue{
  grid-column: 1 / 1;
}

#calendar{
  grid-column: 2 / 2;
}
</style>
