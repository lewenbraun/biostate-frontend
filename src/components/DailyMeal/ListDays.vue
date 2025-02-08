<template>
  <div class="q-pa-md q-gutter-md row justify-around">
    <q-btn
      v-for="(date, index) in dates"
      :key="index"
      :label="formatDateLabel(date)"
      outline
      :class="{ 'today-btn': isSelected(date) }"
      @click="onSelectDate(date)"
    />
  </div>
</template>

<script setup lang="ts">
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

const formatDateLabel = (date: Date): string => {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  return `${day}.${month}`;
};

const isSelected = (date: Date): boolean => {
  return date.toDateString() === props.selectedDate.toDateString();
};

function onSelectDate(date: Date): void {
  emit('selectDate', date);
}
</script>

<style scoped>
.today-btn {
  background-color: #e0f7fa;
  color: #00796b;
}
</style>
