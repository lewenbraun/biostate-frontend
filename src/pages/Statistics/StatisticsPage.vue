<template>
  <transition
    appear
    enter-active-class="animated fadeIn"
    leave-active-class="animated fadeOut"
  >
    <q-page class="flex items-center column" padding>
      <q-card
        class="flex full-width-card column fit"
        style="max-width: 600px"
        bordered
        flat
      >
        <!-- Statistics title -->
        <q-card-section class="col-12 flex items-center justify-between">
          <div class="text-h6">Statistics</div>
        </q-card-section>

        <q-separator inset />
        <!-- Statistics for day -->
        <q-card-section
          class="col-12"
          v-if="nutritionalSummary && userStore.user.data.name !== ''"
        >
          <div class="text-body1 text-bold">Statistics for day:</div>
          <div class="row justify-center q-gutter-sm">
            <div class="flex justify-center column items-center">
              <q-circular-progress
                show-value
                class="text-orange-8 q-ma-xs"
                :value="dailyCalories"
                size="65px"
                :max="userStore.user.data.calories"
                color="orange-8"
                track-color="grey-3"
                rounded
                :angle="180"
              >
                <div class="column">
                  <div
                    class="text-grey-8 q-ma-none q-ml-sm"
                    style="font-size: 12px"
                  >
                    {{ dailyCalories }}
                  </div>
                  <div class="text-grey-8 q-ma-none" style="font-size: 12px">
                    / {{ userStore.user.data.calories }}
                  </div>
                </div>
              </q-circular-progress>
              <div class="text-grey-8" style="font-size: 12px">Calories</div>
            </div>
            <div class="flex justify-center column items-center">
              <q-circular-progress
                show-value
                class="text-orange-8 q-ma-xs"
                :value="dailyProteins"
                size="65px"
                :max="userStore.user.data.proteins"
                color="orange-8"
                track-color="grey-3"
                rounded
                :angle="180"
              >
                <div class="column">
                  <div
                    class="text-grey-8 q-ma-none q-ml-sm"
                    style="font-size: 12px"
                  >
                    {{ dailyProteins }}
                  </div>
                  <div class="text-grey-8 q-ma-none" style="font-size: 12px">
                    / {{ userStore.user.data.proteins }}
                  </div>
                </div>
              </q-circular-progress>
              <div class="text-grey-8" style="font-size: 12px">Proteins</div>
            </div>
            <div class="flex justify-center column items-center">
              <q-circular-progress
                show-value
                class="text-orange-8 q-ma-xs"
                :value="dailyCarbs"
                size="65px"
                :max="userStore.user.data.carbs"
                color="orange-8"
                track-color="grey-3"
                rounded
                :angle="180"
              >
                <div class="column">
                  <div
                    class="text-grey-8 q-ma-none q-ml-sm"
                    style="font-size: 12px"
                  >
                    {{ dailyCarbs }}
                  </div>
                  <div class="text-grey-8 q-ma-none" style="font-size: 12px">
                    / {{ userStore.user.data.carbs }}
                  </div>
                </div>
              </q-circular-progress>
              <div class="text-grey-8" style="font-size: 12px">Carbs</div>
            </div>
            <div class="flex justify-center column items-center">
              <q-circular-progress
                show-value
                class="text-orange-8 q-ma-xs"
                :value="dailyFats"
                size="65px"
                :max="userStore.user.data.fats"
                color="orange-8"
                track-color="grey-3"
                rounded
                :angle="180"
              >
                <div class="column">
                  <div
                    class="text-grey-8 q-ma-none q-ml-sm"
                    style="font-size: 12px"
                  >
                    {{ dailyFats }}
                  </div>
                  <div class="text-grey-8 q-ma-none" style="font-size: 12px">
                    / {{ userStore.user.data.fats }}
                  </div>
                </div>
              </q-circular-progress>
              <div class="text-grey-8" style="font-size: 12px">Fats</div>
            </div>
          </div>
        </q-card-section>
        <q-card-section class="self-center" v-else>
          <q-circular-progress
            indeterminate
            rounded
            size="50px"
            color="orange-8"
          />
        </q-card-section>
        <q-separator inset />
        <q-card-section
          class="col-12"
          v-if="nutritionalSummary && userStore.user.data.name !== ''"
        >
          <div class="text-body1 text-bold q-mb-sm">Statistics for week:</div>
          <div class="text-body2 text-bold">Calories:</div>

          <div class="q-mx-md">
            <Line :data="data" :options="options" />
          </div>
        </q-card-section>
        {{ data }}
      </q-card>
    </q-page>
  </transition>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { useDailyMealStore } from '../../stores/dailyMealStore';
import { useUserStore } from '../../stores/userStore';
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

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const data = {
  labels: [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday',
  ],
  datasets: [
    {
      backgroundColor: '#f87979',
      data: [40, 39, 10, 40, 39, 80, 40],
    },
  ],
};

const options = {
  maintainAspectRatio: false,
};

const dailyMealStore = useDailyMealStore();
const userStore = useUserStore();

const today = new Date();

const formatedDate = computed(() => today.toISOString().split('T')[0]);

const nutritionalSummary = computed(() =>
  dailyMealStore.getNutritionalSummary(formatedDate.value)
);

const dailyCalories = computed(() => nutritionalSummary.value.calories);
const dailyFats = computed(() => nutritionalSummary.value.fats);
const dailyCarbs = computed(() => nutritionalSummary.value.carbs);
const dailyProteins = computed(() => nutritionalSummary.value.proteins);

onMounted(async () => {
  await dailyMealStore.getOrFetchMealsByDate(today);
  await userStore.getUser();
});
</script>

<style scoped></style>
