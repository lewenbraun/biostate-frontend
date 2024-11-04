<template>
  <q-item>
    <q-item-section>
      <q-item-label class="row q-gutter-md items-center">
        <span class="text-subtitle1">{{ product.name }}</span>
        <span class="cursor-pointer text-weight-regular text-grey-8"
          >{{ product.weight }} gr (1 un)</span
        >
      </q-item-label>
      <q-item-label caption class="row q-gutter-md" lines="2">
        <span caption>Proteins: {{ product.proteins }}</span>
        <span caption>Carbs: {{ product.carbs }}</span>
        <span caption>Fats: {{ product.fats }}</span>
      </q-item-label>
    </q-item-section>

    <q-item-section side>
      <q-item-label class="text-subtitle2 text-dark">
        Calories: {{ product.calories }}
      </q-item-label>
    </q-item-section>
    <q-item-section side>
      <div class="text-grey-8 q-gutter-xs">
        <q-btn
          size="12px"
          flat
          dense
          round
          icon="delete"
          @click="handleDeleteProduct()"
        />
      </div>
    </q-item-section>
  </q-item>

  <q-separator spaced inset />
</template>

<script setup lang="ts">
import { Product } from 'src/stores/productStore';
import { PropType } from 'vue';

defineProps({
  product: {
    type: Object as PropType<Product>,
    required: true,
  },
});

// Определяем эмиттер для отправки события добавления продукта
const emit = defineEmits<{
  (e: 'deleteProduct'): void;
}>();

function handleDeleteProduct() {
  emit('deleteProduct');
}
</script>

<style scoped></style>
