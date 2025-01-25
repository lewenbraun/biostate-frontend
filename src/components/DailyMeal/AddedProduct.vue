<template>
  <q-item>
    <q-item-section>
      <q-item-label class="row">
        <div class="fit row justify-between">
          <div class="flex">
            <span
              class="text-subtitle1 q-mr-sm wrap-name"
              style="max-width: 100px"
              >{{ product.name }}
            </span>
            <q-popup-edit v-model="changeWeight" v-slot="scope">
              <q-input
                v-model="changeWeight"
                dense
                autofocus
                @keyup.enter="scope.set"
                class="q-mb-sm"
              />
              <div class="flex justify-end">
                <q-btn
                  label="Save"
                  flat
                  color="success"
                  @click="changeWeightInMeal"
                  no-caps
                />
              </div>
            </q-popup-edit>
            <span
              class="cursor-pointer text-weight-regular text-grey-8 self-center"
              >{{ product.weight }} gr</span
            >
          </div>
          <div class="flex">
            <span class="text-subtitle2 text-dark item-end self-center"
              >Calories: {{ parseFloat(product.calories.toFixed(1)) }}</span
            >
          </div>
        </div>
      </q-item-label>
      <q-item-label caption class="row q-gutter-sm" lines="2">
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
                :disable="product.count === 1"
                size="sm"
                @click="handleDecrease"
              />
            </template>
            <template v-slot:after>
              <q-btn icon="add" flat dense size="sm" @click="handleIncrease" />
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
            @click="handleDelete"
          />
        </div>
      </div>
    </q-item-section>
  </q-item>

  <q-separator spaced inset />
</template>

<script setup lang="ts">
import { ref, PropType } from 'vue';
import { useDailyMealStore } from '../../stores/dailyMealStore';
import { Product } from '../../stores/productStore';

const dailyMealStore = useDailyMealStore();

const props = defineProps({
  product: {
    type: Object as PropType<Product>,
    required: true,
  },
  meal_id: {
    type: Number,
    required: true,
  },
});

const emit = defineEmits(['deleteProduct', 'increase', 'decrease']);

const handleDelete = () => {
  emit('deleteProduct', props.product.id, props.meal_id);
};

const handleIncrease = () => {
  emit('increase', props.product.id, props.meal_id);
};

const handleDecrease = () => {
  emit('decrease', props.product.id, props.meal_id);
};

const changeWeight = ref(props.product.weight);

async function changeWeightInMeal() {
  await dailyMealStore.updateProductWeight(
    props.product,
    props.meal_id,
    changeWeight.value
  );
}
</script>

<style scoped>
.wrap-name {
  line-height: 1.2rem;
}
</style>
