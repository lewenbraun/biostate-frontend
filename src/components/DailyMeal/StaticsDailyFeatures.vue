<template>
  <div v-if="user" class="flex justify-center column items-center">
    <q-circular-progress
      show-value
      class="text-orange-8 q-ma-xs"
      :value="dailyCalories"
      size="120px"
      :max="user.maxNutrients.calories"
      track-color="grey-3"
      color="orange-8"
      rounded
      :angle="180"
    >
      <div class="column">
        <div class="text-h5 text-grey-8 q-ma-none">
          {{ dailyCalories }}
        </div>
        <div class="text-h6 text-grey-8">
          / {{ user.maxNutrients.calories ?? '?' }}
        </div>
      </div>
    </q-circular-progress>

    <div class="text-grey-8">Calories</div>
    <div class="row justify-center q-gutter-sm">
      <div class="flex justify-center column items-center">
        <q-circular-progress
          show-value
          class="text-orange-8 q-ma-xs"
          :value="dailyProteins"
          size="65px"
          :max="user.maxNutrients.proteins"
          color="orange-8"
          track-color="grey-3"
          rounded
          :angle="180"
        >
          <div class="column">
            <div class="text-grey-8 q-ma-none q-ml-sm" style="font-size: 12px">
              {{ dailyProteins }}
            </div>
            <div class="text-grey-8 q-ma-none" style="font-size: 12px">
              / {{ user.maxNutrients.proteins ?? '?' }}
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
          :max="user.maxNutrients.carbs"
          track-color="grey-3"
          color="orange-8"
          rounded
          :angle="180"
        >
          <div class="column">
            <div class="text-grey-8 q-ma-none q-ml-sm" style="font-size: 12px">
              {{ dailyCarbs }}
            </div>
            <div class="text-grey-8 q-ma-none" style="font-size: 12px">
              / {{ user.maxNutrients.carbs ?? '?' }}
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
          :max="user.maxNutrients.fats"
          track-color="grey-3"
          color="orange-8"
          rounded
          :angle="180"
        >
          <div class="column">
            <div class="text-grey-8 q-ma-none q-ml-sm" style="font-size: 12px">
              {{ dailyFats }}
            </div>
            <div class="text-grey-8 q-ma-none" style="font-size: 12px">
              / {{ user.maxNutrients.fats ?? '?' }}
            </div>
          </div>
        </q-circular-progress>
        <div class="text-grey-8" style="font-size: 12px">Fats</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useDailyMealStore } from '../../stores/dailyMealStore';
import { useUserStore } from '../../stores/userStore';
import { formatToLocal } from '../../utils/Formatters/dateFormatter.ts';

const props = defineProps<{
  date: Date;
}>();

const dailyMealStore = useDailyMealStore();
const userStore = useUserStore();
const user = ref();

const formatedDate = computed(() => formatToLocal(props.date));

const nutritionalSummary = computed(() =>
  dailyMealStore.getNutritionalSummary(formatedDate.value)
);

const dailyCalories = computed(() => nutritionalSummary.value.calories);
const dailyFats = computed(() => nutritionalSummary.value.fats);
const dailyCarbs = computed(() => nutritionalSummary.value.carbs);
const dailyProteins = computed(() => nutritionalSummary.value.proteins);

onMounted(async () => {
  await userStore.getMaxNutrients();
  user.value = userStore.user.data;
});
</script>

<style scoped></style>
