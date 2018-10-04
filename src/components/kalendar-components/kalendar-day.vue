<template>
  <ul style="position: relative;" @mouseleave="clearCreatingLeftovers" :class="{'is-weekend': isWeekend, 'is-today': isToday, 'creating': calendarOptions.currently_working_on_date === day.date}" class="kalendar-day">
    <portal-target 
      name="calendar-card-details" 
      :slot-props="{appointments: calendarOptions.appointments, day: day, section: section}" 
      v-if="calendarOptions.appointments.length > 0">
		</portal-target>
    <!-- <v-chip 
      v-for="(appointment, index) in calendarOptions.appointments"
      :key="index"
      :class="{'appointment-card--last': index == calendarOptions.appointments.length - 1, 'appointment-card': index < calendarOptions.appointments.length - 1}"
      v-if="appointment.date == day.date && appointment.section == section.name"> 
      <b> {{ appointment.text }} </b> &nbsp; {{ appointment.time }}
    </v-chip> -->
    <!-- <v-card color="#F5F5F5" class="appointment-card" v-for="appointment in calendarOptions.appointments" v-if="appointment.date == day.date && appointment.section == section.name">
      <v-card-title>
        <b> {{ appointment.time }}</b>
      </v-card-title>
      <v-divider></v-divider>
      <v-card-text>
        {{ appointment.text }}
      </v-card-text>
    </v-card> -->
  </ul>
</template>
<script>
import isWeekend from 'date-fns/is_weekend';
import isToday from 'date-fns/is_today';
import format from 'date-fns/format';

export default {
  props: ['day', 'passedTime', 'section'],
  components: {
    kalendarCell: () =>
      import ('./kalendar-cell.vue'),
  },
  inject: ['calendarOptions'],
  mounted() {
    // if (this.scrollToNow && this.isToday) this.scrollView();
  },
  computed: {
    isWeekend() {
      return isWeekend(this.day.date);
    },
    isToday() {
      return isToday(this.day.date);
    },
    currentDay() {
      return this.calendarOptions.current_day;
    },
    scrollToNow() {
      return this.calendarOptions.scrollToNow;
    },
  },
  data: () => ({
    creator: {
      creating: false,
      starting_cell_index: null,
      current_cell_index: null,
      appointment_id: null,
      status: null,
    },

  }),
  methods: {
    resetEvents() {
      if (!this.creator.creating && this.creator.status === null) return;
      this.creator = {
        creating: false,
        starting_cell_index: null,
        current_cell_index: null,
        appointment_id: null,
        status: null,
      };
      this.calendarOptions.currently_working_on_date = null;
    },
    clearCreatingLeftovers() {
      let { existing_appointments } = this.calendarOptions;
      for (let key in existing_appointments) {
        if (existing_appointments[key]['status'] === 'creating') {
          this.resetEvents();
          this.$delete(existing_appointments, key);
        }
      }
    },
    updateCreator({ payload, index, event_type }) {
      this.creator = payload;
      this.selectCell(index);
    },
    selectCell(index, status = 'creating') {
      if (!this.creator.creating) return;
      let { creating, appointment_id, ending_cell_index, current_cell_index, starting_cell_index } = this.creator;
      let _ending_index = ending_cell_index == null ? current_cell_index : ending_cell_index;
      let payload = {
        id: appointment_id,
        data: {
          start: starting_cell_index,
          end: _ending_index,
          status: status,
        },
      };
      this.$emit('updateAppointments', payload);
      if (creating) {
        this.day.date_hours.forEach((hour, index) => {
          let is_in_range = hour.index >= starting_cell_index && hour.index <= _ending_index;
          if (is_in_range) {
            this.day.date_hours[index] = { ...hour, ['appointment_id']: appointment_id };
          } else if (hour['appointment_id'] === appointment_id && !is_in_range) {
            this.day.date_hours[index] = { ...hour, ['appointment_id']: null };
          }
        });
      }
    },
    initiatePopup() {
      let { creating, appointment_id, ending_cell_index, current_cell_index, starting_cell_index } = this.creator;
      let _ending_index = ending_cell_index == null ? current_cell_index : ending_cell_index;
      let payload = {
        id: appointment_id,
        data: {
          start: starting_cell_index,
          end: _ending_index,
          status: 'popup-initiated',
        }
      };
      this.$emit('updateAppointments', payload);
      this.creator = { ...this.creator, ['creating']: false };
    },
    scrollView() {
      let topoffset = this.$refs.nowIndicator.offsetTop;
      console.log('Scrolling to now.', topoffset);
      setTimeout(() => {
        window.scroll({ top: topoffset, left: 0, behavior: 'smooth' });
      }, 500);
    },
  },
  watch: {
    scrollToNow(val) {
      if (val && this.isToday) this.scrollView();
    },
  },
}
</script>
<style lang="scss">
ul.kalendar-day {
  position: relative;
  background-color: white;
  position: relative;
  border-right: solid 1px var(--table-cell-border-color);
  margin-bottom: 0;
  flex: 1;
  min-height: 50px;
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  padding: 15px !important;
  &.is-today {
    background-color: #FEF4F4;
  }
  .appointment-card{
    margin-bottom: 15px;
  }
  .clear {
    position: absolute;
    z-index: 1;
    top: -20px;
    right: 0;
    font-size: 10px;
  }
  .creating {
    z-index: 3;
  }
}
</style>