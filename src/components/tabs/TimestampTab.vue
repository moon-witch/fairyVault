<script setup lang="ts">
import {computed, ref, watch} from "vue";

const inputDate = ref<string>('')
const inputTime = ref<string>('')
const inputTimeZone = ref<string>('0')
const plusActive = ref<boolean>(true)
const minusActive = ref<boolean>(false)

const dateTime = computed(() => {
  if (inputTimeZone.value != '0') {
    const pre = plusActive.value ? '+' : minusActive.value ? '-' : ''
    const hours = inputTimeZone.value.length === 1 ? `0${inputTimeZone.value}` : inputTimeZone.value
    return new Date(`${inputDate.value}T${inputTime.value}:00.000${pre}${hours}:00`).getTime() / 1000
  }
  return new Date(`${inputDate.value}T${inputTime.value}:00.000Z`).getTime() / 1000
})

function clickMinus() {
  plusActive.value = false;
  minusActive.value = true;
}

function clickPlus() {
  plusActive.value = true;
  minusActive.value = false;
}
</script>

<template>
<div class="timestamp-container">
  <div class="inputs">
    <div class="input">
      <label for="date">date</label>
      <input
          id="date"
          type="date"
          v-model="inputDate"
          style="width: 9.5rem;"
          class="custom_input text-amber-400 rounded-lg p-2 mb-2"
          required
      />
    </div>
    <div class="input">
      <label for="time">time</label>
      <input
          id="time"
          type="time"
          v-model="inputTime"
          style="width: 8rem;"
          class="custom_input text-amber-400 rounded-lg p-2 mb-2"
          required
      />
    </div>
    <div class="input">
      <label for="timezone">timezone</label>
      <div class="UTC-plus-minus">
        UTC
        <div class="plus-minus">
          <div class="plus" :class="{active: plusActive}" @click="clickPlus">+</div>
          <div class="minus" :class="{active: minusActive}" @click="clickMinus">-</div>
        </div>
        <input
            id="timezone"
            type="text"
            v-model="inputTimeZone"
            style="width: 3rem; text-align: center;"
            class="custom_input text-amber-400 rounded-lg p-2 mb-2"
            required
        />
      </div>
    </div>
  </div>
  <div class="output">
    {{ inputDate && inputTime ? dateTime : 'choose a date' }}
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
  flex-direction: column;
  gap: 0.2rem;

  .input {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;

    .UTC-plus-minus {
      display: flex;
      justify-content: center;
      align-items: center;

      .plus-minus {
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        width: 2rem;
        margin: 0.5rem 1rem;

        .plus {
          width: 2rem;
          border-radius: 5px;
          font-weight: bold;
        }

        .minus {
          width: 2rem;
          border-radius: 5px;
          font-weight: bold;
        }
      }

      .active {
        background: $bg-dark;
      }
    }
  }
}

.output {
  border: 1px solid $bg-dark;
  padding: 0.5rem 1rem;
  border-radius: 50px;
  font-weight: bold;
  color: $bg-bright;
  font-size: 25px;
}
</style>