<template>
  <div class="q-pa-none">
    <q-stepper
      class="custom-stepper"
      style="padding: 0px"
      flat
      v-model="step"
      ref="stepper"
      color="primary"
      animated
    >
      <q-step
        :name="1"
        title="Select product"
        icon="settings"
        :done="step > 1"
        style="padding: 0px"
      >
        <q-input dense rounded placeholder="Name product" v-model="searchQuery">
          <template v-slot:append>
            <q-icon class="cursor-pointer" name="search" @click="onSearch" />
          </template>
        </q-input>
        <q-table
          hide-bottom
          flat
          :rows="products"
          :columns="columns"
          dense
          row-key="name"
          :rows-per-page-options="[10]"
        >
          <template v-slot:header="props">
            <q-tr :props="props">
              <q-th v-for="col in props.cols" :key="col.name" :props="props">
                {{ col.label }}
              </q-th>
              <q-th auto-width />
            </q-tr>
          </template>

          <template v-slot:body="props">
            <transition
              appear
              enter-active-class="animated fadeIn"
              leave-active-class="animated fadeOut"
            >
              <q-tr :props="props">
                <q-td v-for="col in props.cols" :key="col.name" :props="props">
                  {{ col.value }}
                </q-td>
                <q-td auto-width>
                  <q-btn
                    round
                    class="q-mt-xs q-mr-sm"
                    size="8px"
                    dense
                    outline
                    color="green"
                    icon="add"
                    @click="selectProduct(props.row)"
                  />
                </q-td>
              </q-tr>
            </transition>
          </template>
        </q-table>
      </q-step>
      <q-step
        :name="2"
        title="Enter weight"
        icon="create_new_folder"
        :done="step > 2"
      >
        <p class="text-h6 q-mb-none">{{ selectedProduct!.name }}</p>
        <q-input
          dense
          class="q-mb-md"
          v-model.number="selectedProduct!.weight"
          label="Change weight"
        />
        <div class="flex justify-end q-mb-sm">
          <q-btn
            label="Add"
            v-close-popup
            @click="handleAddProduct(selectedProduct!)"
            outlined
            color="green"
          />
        </div>
      </q-step>
    </q-stepper>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useProductStore } from '../../../stores/productStore';
import type { Product } from '../../../types/product';

const productStore = useProductStore();
const products = ref<Product[]>([]);
const searchQuery = ref('');
const selectedProduct = ref<Product>();

const step = ref(1);

async function onSearch() {
  products.value = await productStore.searchProducts(searchQuery.value);
}

onMounted(async () => {
  await productStore.fetchProducts();
  products.value = productStore.products;
});

const emit = defineEmits<{
  (e: 'addProduct', product: Product): void;
}>();

function handleAddProduct(product: Product) {
  emit('addProduct', product);
}

function selectProduct(product: Product) {
  step.value = 2;
  selectedProduct.value = product;
}

const columns = [
  {
    name: 'name',
    field: 'name',
    align: 'left' as const,
    label: 'Name',
    sortable: true,
  },
  {
    name: 'calories',
    label: 'Calories',
    align: 'center' as const,
    field: 'calories',
    sortable: true,
  },
  {
    name: 'fats',

    align: 'center' as const,
    label: 'Fats (g)',
    field: 'fats',
    sortable: true,
  },
  {
    name: 'carbs',

    align: 'center' as const,
    label: 'Carbs (g)',
    field: 'carbs',
  },
  {
    name: 'proteins',
    align: 'center' as const,
    label: 'Proteins (g)',
    field: 'proteins',
  },
];

products.value = productStore.products;
</script>

<style scoped>
::v-deep(.q-stepper--horizontal .q-stepper__step-inner) {
  padding: 0;
}
</style>
