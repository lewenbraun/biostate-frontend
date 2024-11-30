<template>
  <transition
    appear
    enter-active-class="animated fadeIn"
    leave-active-class="animated fadeOut"
  >
    <q-page class="flex column q-mx-md">
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
          <div
            class="q-mb-md q-q-px-md row q-col-gutter-sm items-end justify-end"
          >
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
          />
        </div>
      </div>
      <q-page-sticky position="bottom-right" :offset="[70, 50]">
        <q-btn
          :to="{ name: 'productCreate' }"
          fab
          icon="add"
          color="deep-orange"
        />
      </q-page-sticky>
    </q-page>
  </transition>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import ProductCard from '../../components/Product/ProductCard.vue';
import { useProductStore, Product } from '../../stores/productStore';

const productStore = useProductStore();
const products = ref<Product[]>([]);

onMounted(async () => {
  await productStore.fetchProducts();
  products.value = productStore.products;
});

products.value = productStore.products;

const searchQuery = ref('');

const filterFn = () => {};

const onSearch = () => {};
</script>

<style scoped>
.search-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
}

.product-list {
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
}
</style>
