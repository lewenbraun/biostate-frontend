<template>
  <div class="flex justify-center column items-center">
    <q-circular-progress
      show-value
      class="text-orange-8 q-ma-xs"
      :value="value"
      :max="max"
      size="65px"
      color="orange-8"
      track-color="grey-3"
      rounded
      :angle="180"
    >
      <div class="column">
        <div class="text-grey-8 q-ma-none q-ml-sm" style="font-size: 12px">
          {{ value }}
        </div>
        <div class="text-grey-8 q-ma-none" style="font-size: 12px">
          / {{ max ?? '?' }}
        </div>
      </div>
    </q-circular-progress>
    <div class="text-grey-8" style="font-size: 12px">{{ label }}</div>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue';

defineProps({
  value: {
    type: Number,
    required: true,
  },
  max: {
    type: Number,
    required: false,
  },
  label: {
    type: String,
    required: true,
  },
});
</script>
