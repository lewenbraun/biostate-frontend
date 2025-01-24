<template>
  <div>
    <Line :data="data" :options="options" />
  </div>
</template>

<script setup lang="ts">
import { computed, defineProps, PropType } from 'vue';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'vue-chartjs';
import annotationPlugin from 'chartjs-plugin-annotation';
import type { ChartOptions } from 'chart.js';
import { DataDay } from '../../stores/statisticsStore';

const props = defineProps({
  nutrientData: {
    type: Object as PropType<DataDay[]>,
    required: true,
  },
  nameNutrient: {
    type: String,
    required: true,
  },
  maxCountNutrients: {
    type: Object,
    required: true,
  },
});

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  annotationPlugin
);

const defaultValue = props.maxCountNutrients[props.nameNutrient] as number;

const options: ChartOptions<'line'> = {
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false,
    },
    annotation: {
      annotations: {
        defaultLine: {
          type: 'line',
          yMin: defaultValue,
          yMax: defaultValue,
          borderColor: 'DarkOrange',
          borderWidth: 1.2,
          borderDash: [6, 6],
          label: {
            content: 'Max',
            position: 'end',
          },
        },
      },
    },
  },
  scales: {
    y: {
      beginAtZero: true,
    },
  },
};

const data = computed(() => ({
  labels: props.nutrientData.map((data) => data.date),
  datasets: [
    {
      backgroundColor: '#f87979',
      data: props.nutrientData.map((data) => data.total),
    },
  ],
}));
</script>

<style scoped></style>
