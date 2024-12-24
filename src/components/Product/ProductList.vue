<template>
  <div class="product-list">
    <div class="column q-mb-md q-q-px-md row q-col-gutter-sm">
      <q-input
        outlined
        dense
        rounded
        placeholder="Название продукта"
        v-model="searchQuery"
        size="74"
        class="q-mt-lg"
      >
        <template v-slot:append>
          <q-icon class="cursor-pointer" name="search" @click="onSearch" />
        </template>
      </q-input>
    </div>

    <div class="col items-end">
      <div class="q-mb-md q-q-px-md row q-col-gutter-sm items-end justify-end">
        <div class="col-auto items-end">
          <q-select
            outlined
            v-model="searchQuery"
            dense
            options-dense
            rounded
            use-input
            hide-selected
            class="col custom-height-input"
            fill-input
            input-debounce="0"
            :options="products"
            :input-style="{ fontSize: '15px' }"
            placeholder="Категория"
            @filter="filterFn"
          >
            <template v-slot:no-option>
              <q-item>
                <q-item-section class="text-grey">
                  Нет результатов
                </q-item-section>
              </q-item>
            </template>
          </q-select>
        </div>
        <div class="col-auto">
          <q-select
            outlined
            v-model="searchQuery"
            dense
            rounded
            options-dense
            use-input
            hide-selected
            class="col custom-height-input"
            fill-input
            input-debounce="0"
            :options="products"
            :input-style="{ fontSize: '15px' }"
            placeholder="Сортировка"
            @filter="filterFn"
          >
            <template v-slot:no-option>
              <q-item>
                <q-item-section class="text-grey">
                  Нет результатов
                </q-item-section>
              </q-item>
            </template>
          </q-select>
        </div>
      </div>
    </div>

    <q-separator />
    <div class="row q-col-gutter-xs wrap">
      <ProductCard
        v-for="product in products"
        :key="product.id"
        :product="product"
        @addProduct="props.addProduct"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, defineProps } from 'vue';
import ProductCard from '../../components/Product/ProductCard.vue';
import { useProductStore, Product } from '../../stores/productStore';

const props = defineProps<{
  addProduct: (product: Product) => void;
}>();

const productStore = useProductStore();
const products = ref<Product[]>([]);

onMounted(async () => {
  await productStore.fetchProducts();
  products.value = productStore.products;
});

products.value = productStore.products;

// defineProps({
//   products: {
//     type: Object as PropType<Product[]>,
//     required: true,
//   },
// });

const searchQuery = ref('');

const filterFn = () => {};

const onSearch = () => {};
</script>

<style scoped></style>
