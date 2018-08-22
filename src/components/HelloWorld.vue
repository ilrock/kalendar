<template>
  <div>
    <div class="plain-controls">
      <div>
        <label>Style Selection
          <select v-model="style">
            <option value="material_design">Material Design</option>
            <option value="flat_design">Flat Design</option>
          </select>
        </label>
        <label>View Type
          <select v-model="view_type">
            <option value="Day">Day</option>
            <option value="Month">Month</option>
          </select>
        </label>
        <label>Split Each
          <select v-model.number="split_value">
            <option value="5">5 minutes</option>
            <option value="10">10 minutes</option>
            <option value="15">15 minutes</option>
            <option value="20">20 minutes</option>
            <option value="30">30 minutes</option>
          </select>
        </label>
      </div>
    </div>
    <kalendar :configuration="config" :appointments="appointments" ref="calendar-component">
      <div slot="creating-card" slot-scope="{appointment_props}">
        <h4 class="appointment-title">New Appointment</h4>
        <span class="time">{{getHours(appointment_props.start_value.value, appointment_props.end_value.value)}}
        </span>
      </div>
      <div id="k-popup" slot="popup-form" slot-scope="{popup_scope}" style="display: flex; flex-direction: column;">
        <h4 style="margin-bottom: 10px">Appointment Form</h4>
        <input v-model="new_appointment['title']" type="text" name="title" placeholder="Title">
        <textarea v-model="new_appointment['description']" type="text" name="description" placeholder="Description" rows="2"></textarea>
        <div class="buttons">
          <button class="cancel" @click="popup_scope.close_popup = true">Cancel</button>
          <button @click="completeAppointment(popup_scope)">Save</button>
        </div>
      </div>
      <div slot="details-card" slot-scope="{appointments_props}">
        <v-chip
          v-for="(appointment, index) in appointments_props.appointments"
          v-if="appointment.date == appointments_props.day.date && appointment.section == appointments_props.section.name"
          :key="index"
          @click="onAppointmentClicked(appointment)"
          :class="{'appointment-card--last': index == appointments_props.appointments.length - 1, 'appointment-card': index < appointments_props.appointments.length - 1}">
          <b> {{ appointment.text }} </b> &nbsp; {{ appointment.time }}
        </v-chip>
        <!-- <h4 class="appointment-title">{{appointment_props.data.title}}</h4>
        <small class="description" v-show="(appointment_props.end - appointment_props.start) > 2">{{appointment_props.data.description}}</small>
        <span class="time">{{appointment_props.start_value.value | normalizeDate('hh:mm A')}} - {{appointment_props.end_value.value | normalizeDate('hh:mm A')}}</span> -->
      </div>
    </kalendar>
  </div>
</template>
<script>
const existing_appointments = [{
  id: "1",
  time: "11:00 - 19:00",
  text: "Andrea",
  from: 'Mon Aug 20 2018 11:00:00 GMT+0200 (Central European Summer Time)',
  to: 'Mon Aug 20 2018 19:00:00 GMT+0200 (Central European Summer Time)',
  date: '2018-08-20',
  section: "Kitchen",
  data: {
    title: 'Grocery Shoppin',
    description: 'Lorem ipsum dolor sit amet.',
  },
}, {
  id: "2",
  time: "11:00 - 19:00",
  text: "Andrea",
  from: 'Wed Jul 15 2018 01:00:00 GMT+0200 (Central European Summer Time)',
  to: 'Wed Jul 15 2018 02:40:00 GMT+0200 (Central European Summer Time)',
  date: '2018-07-15',
  data: {
    title: 'Grocery Shoppin',
    description: 'Lorem ipsum dolor sit amet.',
  },
}];

import format from 'date-fns/format';
import getTime from 'date-fns/get_time';
import kalendar from './kalendar-components/kalendar-container.vue';

export default {
  data: () => ({
    appointments: existing_appointments,
    style: 'material_design',
    view_type: 'Month',
    split_value: 20,
    new_appointment: {
      description: null,
      title: null,
    },
  }),
  components: {
    kalendar,
  },
  computed: {
    config() {
      return {
        split_value: this.split_value,
        style: this.style,
        sections: [
          {
            name: "Kitchen",
            color: "red"
          },
          {
            name: "Service",
            color: "green"
          }
        ],
        appointments: this.appointments,
        view_type: this.view_type,
        scrollToNow: true,
      }
    },
  },
  methods: {
    onAppointmentClicked(appointment){
      // console.log(appointment);
      this.appointments.forEach((app) => {
        if (app.id == appointment.id){
          console.log(app);
          app.text = "Ciccio";
          // app.text == "Ciccio"
        }
      });
    },
    getHours(start, end) {
      return `${format(start, 'hh:mm A')} - ${format(end, 'hh:mm A')}`;
    },
    completeAppointment(popup_data) {
      let payload = {
        data: {
          title: this.new_appointment.title,
          description: this.new_appointment.description,
        },
        from: popup_data.appointment_props.start_value.value,
        to: popup_data.appointment_props.end_value.value,
        date: format(popup_data.appointment_props.start_value.value, 'YYYY-MM-DD'),
      };
      this.appointments.push(payload);
      popup_data.close_popup = true;
    },
  },
};

</script>
<style scoped lang="scss">
$green: #00F0B5;
$red: #F61067;
.plain-controls {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 15px;
  background-color: whitesmoke;
  >div {
    display: flex;
    align-items: center;
    border-radius: 4px;
    overflow: hidden;
  }
  label {
    font-size: 16px;
    padding: 10px 20px;
    border-color: solid 1px white;
    background-color: white;
    display: flex;
    flex-direction: column;
    border-right: solid 1px whitesmoke;
    select {
      font-size: 15px;
      backgorund-color: white;
      margin-top: 5px;
    }
  }
}

.event-popup {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.event-popup .buttons {
  margin-top: 5px;
  display: flex;
  justify-content: space-between;
}

.event-popup .buttons button {
  border: none;
  color: #29771c;
  background-color: rgba($green, .04);
  padding: 5px 10px;
  &.cancel {
    background-color: rgba($red, .04);
    color: $red;
  }
}

.appointment-title, .description {
  text-align: left;
  display: block;
}

</style>
