<template>
  <transition
    appear
    enter-active-class="animated fadeIn"
    leave-active-class="animated fadeOut"
  >
    <div class="col-12 col-sm-6 col-md-4 q-py-md q-px-sm">
      <q-card class="my-card" bordered flat>
        <q-card-section class="q-pa-none">
          <div class="row justify-between items-center">
            <div class="text-h8 text-bold q-mx-sm q-mt-sm">
              {{ product.name }}
            </div>
            <div class="row q-gutter-xs">
              <q-btn
                flat
                round
                class="q-mt-xs"
                size="8px"
                dense
                outline
                color="grey-7"
                icon="edit"
                :to="{ path: `/product/edit/${product.id}` }"
                v-close-popup
              />
              <q-btn
                flat
                round
                class="q-mr-xs"
                size="8px"
                dense
                outline
                color="grey-7"
                icon="delete"
                @click="emit('deleteProduct', product.id)"
                v-close-popup
              />
            </div>
          </div>
        </q-card-section>

        <q-card-section class="q-pt-none q-pa-sm">
          {{ product.description }}
        </q-card-section>
        <q-separator />

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
  </transition>
</template>

<script lang="ts" setup>
import { defineProps, PropType, defineEmits } from 'vue';
import { Product } from '../../types/product';

defineOptions({
  name: 'ProductCard',
});

defineProps({
  product: {
    type: Object as PropType<Product>,
    required: true,
  },
});

const emit = defineEmits<{
  (event: 'deleteProduct', productId: number): void;
}>();
</script>
<style scoped>
.nutrients-info {
  display: flex;
  justify-content: space-around;
}
</style>
