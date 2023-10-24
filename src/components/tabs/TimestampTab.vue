<script setup lang="ts">
import {ref} from "vue";

const inputDate = ref('')
const inputTime = ref('')
const inputTimeZone = ref('')
const dateTime = ref(inputDate.value+'T'+inputTime.value+':00Z')
const test = 'YYYY-MM-DDTHH:mm:ss.sssZ'
</script>

<template>
<div class="timestamp-container">
  <div class="inputs">
    <div>
      <label for="date">date</label>
      <input
          id="date"
          type="date"
          v-model="inputDate"
          class="custom_input text-amber-400 rounded-lg p-2 mb-2"
          required
      />
    </div>
    <div>
      <label for="time">time</label>
      <input
          id="time"
          type="time"
          v-model="inputTime"
          class="custom_input text-amber-400 rounded-lg p-2 mb-2"
          required
      />
    </div>
    <div>
      <label for="timezone">timezone</label>
      <input
          id="timezone"
          type="number"
          v-model="inputTimeZone"
          style="width: 3rem;"
          class="custom_input text-amber-400 rounded-lg p-2 mb-2"
          required
      />
    </div>
  </div>
  {{ inputDate }}
  {{ inputTime }}
  {{ dateTime }}!
  {{ typeof dateTime }}
  <div class="output">
    {{ inputDate && inputTime ? Date.parse(dateTime) : 'choose a date' }}
  </div>
</div>
</template>

<style scoped lang="scss">
.timestamp-container {
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
}

.inputs {
  display: flex;
  justify-content :center;
  align-items: center;
  text-align: center;
  gap: 0.2rem;
}

.output {
  border: 1px solid $bg-dark;
  padding: 0.5rem 1rem;
  border-radius: 50px;
}
</style>