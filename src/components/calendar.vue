<template>
  <v-row class="fill-height">
    <v-col>
      <v-sheet height="64">
        <v-toolbar
          flat
        >
          <v-btn
            fab
            outlined
            class="mr-1"
            color="grey darken-2"
            @click="setToday"
          >
            <v-icon dense>mdi-calendar-today</v-icon>
          </v-btn>
          <v-btn
            fab
            text
            small
            color="grey darken-2"
            @click="prev"
          >
            <v-icon small>
              mdi-chevron-left
            </v-icon>
          </v-btn>
          <v-btn
            fab
            text
            small
            color="grey darken-2"
            @click="next"
          >
            <v-icon small>
              mdi-chevron-right
            </v-icon>
          </v-btn>
          <v-toolbar-title v-if="$refs.calendar">
            {{ $refs.calendar.title }}
          </v-toolbar-title>
          <v-spacer></v-spacer>
          <v-menu
            bottom
            right
          >
            <v-list>
              <v-list-item @click="type = 'day'">
                <v-list-item-title>日</v-list-item-title>
              </v-list-item>
              <v-list-item @click="type = 'week'">
                <v-list-item-title>週</v-list-item-title>
              </v-list-item>
              <v-list-item @click="type = 'month'">
                <v-list-item-title>月</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </v-toolbar>
      </v-sheet>
      <v-sheet height="600">
        <v-calendar
          ref="calendar"
          v-model="focus"
          color="primary"
          :events="events"
          :event-color="getEventColor"
          :type="type"
          @click:event="showEvent"
          @click:day="showEditMenu"
          @change="updateRange"
        ></v-calendar>

        <!-- 追加時ウィンドウ -->
        <v-menu
          v-model="edit_selectedOpen"
          :close-on-content-click="false"
          :activator="edit_selectedElement"
          offset-x
        >
          <v-card>
            <v-toolbar
              :color="'dark'"
              dark
            >
              <v-toolbar-title v-html="'<p>予定を追加</p>'" class="mt-5 mr-5"></v-toolbar-title>
              <v-spacer></v-spacer>
            </v-toolbar>
            <v-card-text>
              <v-form>
                <v-container>

                  <v-text-field
                    label="予定を入力"
                    filled
                    dense
                    v-model="eventTitle"
                  >
                  </v-text-field>
                  <v-color-picker
                    dot-size="25"
                    swatches-max-height="200"
                    v-model="color"
                  ></v-color-picker>
                </v-container>
              </v-form>
            </v-card-text>
            <v-card-actions>
              <v-btn
                text
                color="white"
                @click="edit_selectedOpen = false"
              >
                取り消す
              </v-btn>
              <v-spacer></v-spacer>
              <v-btn
                text
                color="white"
                @click="addEvent"
              >
                追加
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-menu>

        <!-- イベントクリック時のウィンドウ -->
        <v-menu
          v-model="selectedOpen"
          :close-on-content-click="false"
          :activator="selectedElement"
          offset-x
        >
          <v-card
            color="grey lighten-4"
            min-width="350px"
            flat
          >
            <v-toolbar
              :color="selectedEvent.color"
              dark
            >
              <v-toolbar-title v-html="selectedEvent.name"></v-toolbar-title>
              <v-spacer></v-spacer>
            </v-toolbar>
            <v-card-text>
              <span v-html="selectedEvent.details"></span>
            </v-card-text>
            <v-card-actions>
              <v-btn
                text
                color="secondary"
                @click="removeSchedule"
              >
                取り消す
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-menu>
      </v-sheet>
    </v-col>
  </v-row>
</template>
<script>
import axios from 'axios'

export default {
  data: () => ({
    color: '',
    focus: '',
    type: 'month',
    typeToLabel: {
      month: '月',
      week: '週',
      day: '日'
    },
    eventTitle: '',
    selectedEvent: {},
    selectedElement: null,
    selectedOpen: false,
    edit_selectedOpen: false,
    edit_selectedElement: null,
    editing_date: null,
    events: [],
    colors: ['blue', 'indigo', 'deep-purple', 'cyan', 'green', 'orange', 'grey darken-1'],
    names: ['Meeting', 'Holiday', 'PTO', 'Travel', 'Event', 'Birthday', 'Conference', 'Party'],
    schedule_data: []
  }),
  mounted () {
    try {
      axios.post('https://dcalendar.net/login_auth').then(res => {
        if (res.data.message !== 'no') {
          // カレンダーを更新
          if (res.data.schedule.length > 0) {
            this.schedule_data = res.data.schedule
          }

          this.updateRange()
        }
      }).catch(e => {
        console.log(e)
        return null
      })
    } catch (e) {
      return null
    }
  },
  methods: {
    removeSchedule () {
      this.selectedOpen = false
      const id = this.selectedEvent.id
      for (let i = 0; i < this.events.length; i++) {
        if (this.events[i].id === id && id !== undefined) {
          this.events.splice(i, 1)

          this.$emit('addSchedule', this.schedule_data)
          this.updateRange()
          this.eventTitle = ''
          this.edit_selectedOpen = false
        }
      }
    },
    addEvent () {
      if (this.eventTitle === '') {
        alert('タイトルを入力してください')
        return
      }
      const date = this.focus.split('-')
      const year = Number(date[0])
      let month = Number(date[1])
      month = ('0' + month).slice(-2)
      let day = Number(date[2])
      day = ('0' + day).slice(-2)
      // const StartDateTime = new Date(year, month, day)
      const StartDateTime = `${year}-${month}-${day}`

      const ScheduleJson = {
        name: this.eventTitle,
        start: StartDateTime,
        end: StartDateTime,
        color: this.color,
        id: new Date().toISOString()
      }
      this.schedule_data.push(ScheduleJson)

      this.$emit('addSchedule', this.schedule_data)

      this.updateRange()
      this.eventTitle = ''
      this.edit_selectedOpen = false
    },
    showEditMenu ({ nativeEvent, date }) {
      const open = () => {
        this.focus = date
        this.edit_selectedElement = nativeEvent.target
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            this.eidt_selectedOpen = true
            // this.editing_date = new Date(nativeEvent.getDate().to, nativeEvent.getMonth(), nativeEvent.getDate())
          })
        })
      }
      if (this.edit_selectedOpen) {
        this.edit_selectedOpen = false
        requestAnimationFrame(() => requestAnimationFrame(() => open()))
      } else {
        open()
      }
      nativeEvent.stopPropagation()
    },
    viewDay ({ date }) {
      this.focus = date
      this.type = 'day'
    },
    getEventColor (event) {
      return event.color
    },
    setToday () {
      this.focus = ''
    },
    prev () {
      this.$refs.calendar.prev()
    },
    next () {
      this.$refs.calendar.next()
    },
    showEvent ({ nativeEvent, event }) {
      // console.log(event)
      const open = () => {
        this.selectedEvent = event
        this.selectedElement = nativeEvent.target
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            this.selectedOpen = true
          })
        })
      }

      if (this.selectedOpen) {
        this.selectedOpen = false
        requestAnimationFrame(() => requestAnimationFrame(() => open()))
      } else {
        open()
      }

      nativeEvent.stopPropagation()
    },
    updateRange () {
      this.events = this.schedule_data
    },
    rnd (a, b) {
      return Math.floor((b - a + 1) * Math.random()) + a
    }
  }
}
</script>

<style scoped>

</style>
