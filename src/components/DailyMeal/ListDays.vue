<template>
  <div class="q-pa-md">
    <div class="row justify-between items-center">
      <!-- Wrapper for transition (overflow:hidden hides "overflowing" elements) -->
      <div class="transition-wrapper row">
        <!-- Button to navigate to previous dates -->
        <q-btn
          dense
          icon="chevron_left"
          class="q-mr-sm"
          @click="prevDates"
          flat
        />
        <transition :name="transitionName" mode="out-in">
          <!-- Date block, key changes when currentStartDate changes -->
          <div
            :key="currentKey"
            class="dates-container row justify-around q-gutter-md"
          >
            <!-- Transition with a dynamically computed animation name depending on direction -->
            <q-btn
              v-for="(date, index) in currentDates"
              :key="index"
              :label="formatDateLabel(date)"
              outline
              :class="{ 'today-btn': isSelected(date) }"
              @click="onSelectDate(date)"
            />
          </div>
        </transition>
        <!-- Button to navigate to next dates -->
        <q-btn
          icon="chevron_right"
          class="q-ml-sm"
          dense
          @click="nextDates"
          flat
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { PropType } from 'vue';

const props = defineProps({
  dates: {
    type: Array as PropType<Date[]>,
    required: true,
  },
  selectedDate: {
    type: Date as PropType<Date>,
    required: true,
  },
});

const emit = defineEmits<{
  (event: 'selectDate', date: Date): void;
}>();

// Number of displayed dates, e.g., 7 (depends on the input array)
const displayCount = props.dates.length;

// Start date for the date window (default is the first in the array)
const currentStartDate = ref(new Date(props.dates[0]));

// Transition direction flag: forward -> isForward=true, backward -> false
const isForward = ref(true);

// Animation key: changes when currentStartDate changes, forcing <transition> to redraw the block
const currentKey = computed(() => currentStartDate.value.toISOString());

// Compute the array of dates for the current window (starting from currentStartDate, for displayCount days)
const currentDates = computed(() => {
  const dates: Date[] = [];
  for (let i = 0; i < displayCount; i++) {
    const date = new Date(currentStartDate.value);
    date.setDate(date.getDate() + i);
    dates.push(date);
  }
  return dates;
});

// Date formatting function in "DD.MM" format
const formatDateLabel = (date: Date): string => {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  return `${day}.${month}`;
};

// Check if the date is selected
const isSelected = (date: Date): boolean => {
  return date.toDateString() === props.selectedDate.toDateString();
};

// Emit event when a date is selected
function onSelectDate(date: Date): void {
  emit('selectDate', date);
}

// Navigate to next dates: shift the window forward by displayCount days
function nextDates() {
  isForward.value = true;
  const newDate = new Date(currentStartDate.value);
  newDate.setDate(newDate.getDate() + displayCount);
  currentStartDate.value = newDate;
}

// Navigate to previous dates: shift the window backward by displayCount days
function prevDates() {
  isForward.value = false;
  const newDate = new Date(currentStartDate.value);
  newDate.setDate(newDate.getDate() - displayCount);
  currentStartDate.value = newDate;
}

// Compute transition name depending on direction
// Forward transition -> class slide-fade-right, backward -> slide-fade-left
const transitionName = computed(() =>
  isForward.value ? 'slide-fade-right' : 'slide-fade-left'
);
</script>

<style scoped>
.today-btn {
  background-color: #e0f7fa;
  color: #00796b;
}

/* Wrapper for animation with overflow:hidden to hide shifting content */
.transition-wrapper {
  position: relative;
  width: 100%;
  overflow: hidden;
}

/* Date container takes up 100% width */
.dates-container {
  flex-grow: 1;
  min-width: 0;
}

/* "Slide-fade" effect for transitioning to next dates (right) */
.slide-fade-right-enter-active,
.slide-fade-right-leave-active {
  transition: all 0.2s ease;
}
.slide-fade-right-enter-from {
  opacity: 0;
  transform: translateX(10%);
}
.slide-fade-right-enter-to {
  opacity: 1;
  transform: translateX(0);
}
.slide-fade-right-leave-from {
  opacity: 1;
  transform: translateX(0);
}
.slide-fade-right-leave-to {
  opacity: 0;
  transform: translateX(-10%);
}

/* "Slide-fade" effect for transitioning to previous dates (left) */
.slide-fade-left-enter-active,
.slide-fade-left-leave-active {
  transition: all 0.2s ease;
}
.slide-fade-left-enter-from {
  opacity: 0;
  transform: translateX(-10%);
}
.slide-fade-left-enter-to {
  opacity: 1;
  transform: translateX(0);
}
.slide-fade-left-leave-from {
  opacity: 1;
  transform: translateX(0);
}
.slide-fade-left-leave-to {
  opacity: 0;
  transform: translateX(10%);
}
</style>
