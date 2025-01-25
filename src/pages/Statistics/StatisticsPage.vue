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
        <q-card-section class="col-12" v-if="!isLoading">
          <div class="text-body1 text-bold">Statistics for day:</div>
          <div class="row justify-center q-gutter-sm">
            <NutrientCircularProgress
              :value="dailyCalories"
              :max="user.maxNutrients.calories"
              label="Calories"
            />
            <NutrientCircularProgress
              :value="dailyProteins"
              :max="user.maxNutrients.proteins"
              label="Proteins"
            />
            <NutrientCircularProgress
              :value="dailyCarbs"
              :max="user.maxNutrients.carbs"
              label="Carbs"
            />
            <NutrientCircularProgress
              :value="dailyFats"
              :max="user.maxNutrients.fats"
              label="Fats"
            />
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
        <!-- Statistics for week -->
        <q-card-section class="col-12" v-if="!isLoading">
          <div class="text-body1 text-bold q-mb-sm">Statistics for week:</div>

          <div
            class="text-body2 text-bold q-mb-md"
            v-for="(nutrientPerWeek, nameNutrient) in nutrientsPerWeek"
            :key="nameNutrient"
          >
            {{ capitalize(nameNutrient) }}:
            <ChartLineForPeriodDate
              :nameNutrient="nameNutrient"
              :nutrientData="nutrientPerWeek"
              :maxCountNutrients="userMaxCountNutrients"
            />
          </div>
        </q-card-section>
      </q-card>
    </q-page>
  </transition>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useDailyMealStore } from '../../stores/dailyMealStore';
import { useUserStore } from '../../stores/userStore';
import { useStatisticsStore } from '../../stores/statisticsStore';
import { formatToLocal } from '../../utils/Formatters/dateFormatter.ts';
import ChartLineForPeriodDate from 'src/components/Statistics/ChartLineForPeriodDate.vue';
import NutrientCircularProgress from 'src/components/Statistics/NutrientCircularProgress.vue';

const dailyMealStore = useDailyMealStore();
const statisticsStore = useStatisticsStore();
const userStore = useUserStore();
const user = ref();

const today = new Date();

const formatedDate = computed(() => formatToLocal(today));

onMounted(async () => {
  try {
    await dailyMealStore.getOrFetchMealsByDate(today);
    await statisticsStore.fetchSumNutrientsPerWeek([
      'calories',
      'proteins',
      'carbs',
      'fats',
    ]);
    await userStore.getProfileData();
    await userStore.getMaxNutrients();

    user.value = userStore.user.data;
  } finally {
    isLoading.value = false;
  }
});

const nutritionalSummary = computed(() =>
  dailyMealStore.getNutritionalSummary(formatedDate.value)
);

const dailyCalories = computed(() => nutritionalSummary.value.calories);
const dailyFats = computed(() => nutritionalSummary.value.fats);
const dailyCarbs = computed(() => nutritionalSummary.value.carbs);
const dailyProteins = computed(() => nutritionalSummary.value.proteins);
const nutrientsPerWeek = computed(() => statisticsStore.sumNutrientsPerWeek);
const userMaxCountNutrients = computed(() => userStore.maxCountNutrients);

const isLoading = ref(true);

function capitalize(str: string): string {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}
</script>

<style scoped></style>
