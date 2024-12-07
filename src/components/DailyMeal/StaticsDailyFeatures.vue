<template>
  <div class="flex justify-center column items-center">
    <q-circular-progress
      show-value
      class="text-orange-8 q-ma-xs"
      :value="dailyCalories"
      size="120px"
      :max="maxNutritonalQuantity.calories"
      color="orange-8"
      rounded
      :angle="180"
    >
      <div class="column">
        <div class="text-h5 text-grey-8 q-ma-none">
          {{ dailyCalories }}
        </div>
        <div class="text-h6 text-grey-8">/ {{ maxNutritonalQuantity.calories }}</div>
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
          :max="maxNutritonalQuantity.proteins"
          color="orange-8"
          rounded
          :angle="180"
        >
          <div class="column">
            <div class="text-grey-8 q-ma-none q-ml-sm" style="font-size: 12px">
              {{ dailyProteins }}
            </div>
            <div class="text-grey-8 q-ma-none" style="font-size: 12px">
              / {{ maxNutritonalQuantity.proteins }}
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
          :max="maxNutritonalQuantity.carbs"
          color="orange-8"
          rounded
          :angle="180"
        >
          <div class="column">
            <div class="text-grey-8 q-ma-none q-ml-sm" style="font-size: 12px">
              {{ dailyCarbs }}
            </div>
            <div class="text-grey-8 q-ma-none" style="font-size: 12px">
              / {{ maxNutritonalQuantity.carbs }}
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
          :max="maxNutritonalQuantity.fats"
          color="orange-8"
          rounded
          :angle="180"
        >
          <div class="column">
            <div class="text-grey-8 q-ma-none q-ml-sm" style="font-size: 12px">
              {{ dailyFats }}
            </div>
            <div class="text-grey-8 q-ma-none" style="font-size: 12px">
              / {{ maxNutritonalQuantity.fats }}
            </div>
          </div>
        </q-circular-progress>
        <div class="text-grey-8" style="font-size: 12px">Fats</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useDailyMealStore } from 'src/stores/dailyMealStore';

const props = defineProps<{
  date: Date;
}>();

const dailyMealStore = useDailyMealStore();

const maxNutritonalQuantity = dailyMealStore.getMaxNutritonalQuantity;

const formatedDate = props.date.toISOString().split('T')[0];

const nutritionalSummary = computed(() =>
  dailyMealStore.getNutritionalSummary(formatedDate)
);
const dailyCalories = computed(() => nutritionalSummary.value.calories);
const dailyFats = computed(() => nutritionalSummary.value.fats);
const dailyCarbs = computed(() => nutritionalSummary.value.carbs);
const dailyProteins = computed(() => nutritionalSummary.value.proteins);
</script>

<style scoped></style>
