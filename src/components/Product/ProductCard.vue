<template>
  <div class="col-12 col-sm-6 col-md-4 q-py-md q-px-sm">
    <q-card class="my-card" bordered flat>
      <img src="https://cdn.quasar.dev/img/mountains.jpg" />

      <q-card-section class="q-pa-none">
        <div class="text-h8 q-mx-sm q-mt-sm">
          {{ product.name }}
        </div>
      </q-card-section>

      <q-card-section class="q-pt-none q-pa-sm">
        {{ product.description }}
      </q-card-section>
      <q-separator />

      <!-- КБЖУ информация -->
      <q-card-section class="q-pa-sm">
        <div class="nutrients-info row">
          <div class="col text-caption"><b>К:</b> {{ product.calories }} г</div>
          <div class="col text-caption"><b>Б:</b> {{ product.proteins }} г</div>
          <div class="col text-caption"><b>Ж:</b> {{ product.fats }} г</div>
          <div class="col text-caption"><b>У:</b> {{ product.carbs }} г</div>
        </div>
      </q-card-section>
    </q-card>
  </div>
</template>

<script lang="ts" setup>
import { defineProps } from 'vue';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const props = defineProps({
  product: {
    type: Object,
    required: true,
  },
});
</script>

<style scoped>
.nutrients-info {
  display: flex;
  justify-content: space-between;
}
</style>
