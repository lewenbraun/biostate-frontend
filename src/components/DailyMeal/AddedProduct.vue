<template>
  <q-item>
    <q-item-section>
      <q-item-label class="row q-gutter-md items-center">
        <div>
          <span class="text-subtitle1 q-mr-sm">{{ product.name }}</span>
          <span class="cursor-pointer text-weight-regular text-grey-8"
            >{{ product.weight }} gr</span
          >
        </div>
        <div>
          <span class="text-subtitle2 text-dark item-end"
            >Calories: {{ product.calories }}</span
          >
        </div>
      </q-item-label>
      <q-item-label caption class="row q-gutter-md" lines="2">
        <span caption>Proteins: {{ product.proteins }}</span>
        <span caption>Carbs: {{ product.carbs }}</span>
        <span caption>Fats: {{ product.fats }}</span>
      </q-item-label>
    </q-item-section>
    <q-item-section side>
      <div class="row q-gutter-sm items-center">
        <div>
          <q-field dense stack-label borderless>
            <template v-slot:control>
              <div class="self-center full-width no-outline" tabindex="0">
                {{ product.count }}
              </div>
            </template>

            <template v-slot:before>
              <q-btn
                icon="remove"
                flat
                dense
                size="sm"
                @click="$emit('decrease')"
              />
            </template>
            <template v-slot:after>
              <q-btn
                icon="add"
                flat
                dense
                size="sm"
                @click="$emit('increase')"
              />
            </template>
          </q-field>
        </div>
        <div class="text-grey-8">
          <q-btn
            size="12px"
            flat
            dense
            round
            icon="delete"
            @click="$emit('deleteProduct')"
          />
        </div>
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
</script>

<style scoped></style>
