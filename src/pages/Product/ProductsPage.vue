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
            placeholder="Name product"
            v-model="searchQuery"
            size="74"
            class="q-mt-lg"
          >
            <template v-slot:append>
              <q-icon class="cursor-pointer" name="search" @click="onSearch" />
            </template>
          </q-input>
        </div>

        <div class="row q-col-gutter-xs wrap">
          <ProductCard
            v-for="product in products"
            :key="product.id"
            :product="product"
            @deleteProduct="handleDeleteProduct"
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

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { Notify } from 'quasar';
import ProductCard from '../../components/Product/ProductCard.vue';
import { useProductStore } from '../../stores/productStore';
import { Product } from '../../types/product';

const productStore = useProductStore();
const products = ref<Product[]>([]);
const searchQuery = ref('');

onMounted(async () => {
  await productStore.fetchProducts();
  products.value = [...productStore.products];
});

async function handleDeleteProduct(productId: number) {
  try {
    await productStore.deleteProduct(productId);
    products.value = products.value.filter(
      (product) => product.id !== productId
    );
    Notify.create({
      type: 'positive',
      message: 'Product successfully deleted.',
      actions: [
        {
          icon: 'close',
          color: 'white',
          round: true,
          handler: () => {},
        },
      ],
    });
  } catch (error) {
    Notify.create({
      type: 'negative',
      message: 'Failed to delete the product.',
      actions: [
        {
          icon: 'close',
          color: 'white',
          round: true,
          handler: () => {},
        },
      ],
    });
  }
}

async function onSearch() {
  products.value = await productStore.searchProducts(searchQuery.value);
}
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
