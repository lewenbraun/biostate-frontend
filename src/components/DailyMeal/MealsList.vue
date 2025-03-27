<template>
  <template v-for="(addedProductGroup, groupIndex) in meals" :key="groupIndex">
    <div class="row justify-between items-center">
      <div class="row items-center">
        <div class="text-h6">{{ getMealTitle(groupIndex) }}</div>
        <q-btn
          color="red-5"
          flat
          size="10px"
          class="q-ml-sm"
          dense
          icon="delete"
          @click="emit('deleteMeal', addedProductGroup.id)"
        />
      </div>
      <q-btn
        round
        outline
        color="green"
        size="10px"
        dense
        icon="add"
        @click="emit('setCurrentMealOrder', addedProductGroup.meal_order)"
      />
    </div>

    <transition
      appear
      enter-active-class="animated fadeIn"
      leave-active-class="animated fadeOut"
    >
      <q-list v-if="addedProductGroup.products.length > 0">
        <AddedProduct
          v-for="(product, productIndex) in addedProductGroup.products"
          :key="`${groupIndex}-${productIndex}`"
          :product="product"
          :meal_id="addedProductGroup.id"
          @deleteProduct="
            emit(
              'deleteProduct',
              product.id,
              product.weight,
              addedProductGroup.id
            )
          "
          @increase="emit('increase', product.id, addedProductGroup.id)"
          @decrease="
            emit('decrease', product.id, product.count, addedProductGroup.id)
          "
        />
      </q-list>
      <q-item-label
        class="flex justify-center text-grey-6 q-my-sm"
        style="user-select: none"
        v-else
      >
        Empty
      </q-item-label>
    </transition>
  </template>

  <div class="q-ma-md">
    <q-btn
      outline
      color="green"
      class="full-width"
      size="10px"
      dense
      icon="add"
      style="opacity: 60%"
      @click="emit('createMeal')"
    />
  </div>
</template>

<script setup lang="ts">
import { PropType, defineEmits } from 'vue';
import { formatMealTitle } from '../../utils/Formatters/mealTitleFormatter';
import AddedProduct from './AddedProduct.vue';
import type { Meal } from '../../types/dailyMeal';

defineProps({
  meals: {
    type: Array as PropType<Meal[]>,
    required: true,
  },
});

const emit = defineEmits<{
  (e: 'deleteMeal', mealId: number): void;
  (e: 'setCurrentMealOrder', mealOrder: number): void;
  (e: 'createMeal'): void;
  (e: 'deleteProduct', productId: number, weight: number, mealId: number): void;
  (e: 'increase', productId: number, mealId: number): void;
  (e: 'decrease', productId: number, count: number, mealId: number): void;
}>();

function getMealTitle(index: number): string {
  return formatMealTitle(index);
}
</script>

<style scoped></style>
