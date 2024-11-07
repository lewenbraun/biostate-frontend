<template>
  <div class="col-12 col-sm-6 col-md-4 q-py-md q-px-sm">
    <q-card class="my-card" bordered flat>
      <q-card-section class="q-pa-none">
        <div class="row justify-between items-center">
          <div class="text-h8 q-mx-sm q-mt-sm">
            {{ product.name }}
          </div>
          <q-btn
            round
            class="q-mt-xs q-mr-sm"
            size="8px"
            dense
            outline
            color="green"
            icon="add"
            @click="handleAddProduct(product)"
            v-close-popup
          />
        </div>
      </q-card-section>

      <q-card-section class="q-pt-none q-pa-sm">
        {{ product.description }}
      </q-card-section>
      <q-separator />

      <!-- КБЖУ информация -->
      <q-card-section class="q-pa-sm">
        <div class="nutrients-info row">
          <div class="col text-caption"><b>C:</b> {{ product.calories }}</div>
          <div class="col text-caption"><b>P:</b> {{ product.proteins }}</div>
          <div class="col text-caption"><b>F:</b> {{ product.fats }}</div>
          <div class="col text-caption"><b>C:</b> {{ product.carbs }}</div>
        </div>
      </q-card-section>
    </q-card>
  </div>
</template>

<script lang="ts" setup>
import { Product } from 'src/stores/productStore';
import { defineProps, defineEmits, PropType } from 'vue';

defineOptions({
  name: 'ProductCard',
});

// Определяем эмиттер для отправки события добавления продукта
const emit = defineEmits<{
  (e: 'addProduct', product: Product): void;
}>();

function handleAddProduct(product: Product) {
  emit('addProduct', product);
}

defineProps({
  product: {
    type: Object as PropType<Product>,
    required: true,
  },
});
</script>

<style scoped>
.nutrients-info {
  display: flex;
  justify-content: space-around;
}
</style>
