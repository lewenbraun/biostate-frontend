<template>
  <transition
    appear
    enter-active-class="animated fadeIn"
    leave-active-class="animated fadeOut"
  >
    <q-page class="flex items-center column q-mx-md">
      <div
        class="q-mt-md"
        style="max-width: 800px; min-width: 350px; width: 100%"
      >
        <q-card class="q-mt-md full-width-card" bordered flat>
          <q-card-section>
            <div class="text-h6">Edit product</div>
          </q-card-section>
          <q-card-section>
            <q-input
              outlined
              dense
              v-model="productData.name"
              label="Name"
              class="q-mb-md"
            />
            <div class="row q-gutter-x-sm">
              <div class="col-3">
                <q-input
                  outlined
                  dense
                  v-model.number="productData.price"
                  label="Price"
                  class="q-mb-md"
                />
              </div>
              <div class="col-3">
                <q-input
                  outlined
                  dense
                  v-model="productData.weight_default"
                  label="Weight"
                  :rules="ruleNumber"
                  style="min-width: 50px"
                />
              </div>

              <div class="col-12">
                <q-editor
                  placeholder="Description"
                  v-model="productData.description"
                  min-height="5rem"
                />
              </div>
            </div>
          </q-card-section>
          <q-separator />
          <q-card-section>
            <q-list style="max-width: 250px">
              <q-item class="q-px-none">
                <q-item-section>
                  <q-item-label class="text-body1 text-bold"
                    >For weight:</q-item-label
                  >
                </q-item-section>

                <q-item-section>
                  <q-input
                    outlined
                    dense
                    v-model="productData.weight_for_features"
                    label="Weight"
                    style="max-width: 150px"
                  />
                </q-item-section>
              </q-item>
              <q-item class="q-px-none">
                <q-item-section>
                  <q-item-label class="text-body1">Calories:</q-item-label>
                </q-item-section>

                <q-item-section>
                  <q-input
                    outlined
                    dense
                    v-model="productData.calories"
                    label="Calories"
                    style="max-width: 150px"
                  />
                </q-item-section>
              </q-item>
              <q-item class="q-px-none">
                <q-item-section>
                  <q-item-label class="text-body1">Proteins:</q-item-label>
                </q-item-section>

                <q-item-section>
                  <q-input
                    outlined
                    dense
                    v-model="productData.proteins"
                    label="Proteins"
                    style="max-width: 150px"
                  />
                </q-item-section>
              </q-item>
              <q-item class="q-px-none">
                <q-item-section>
                  <q-item-label class="text-body1">Carbs:</q-item-label>
                </q-item-section>

                <q-item-section>
                  <q-input
                    outlined
                    dense
                    v-model="productData.carbs"
                    label="Carbohydrates"
                    style="max-width: 150px"
                  />
                </q-item-section>
              </q-item>
              <q-item class="q-px-none">
                <q-item-section>
                  <q-item-label class="text-body1">Fats:</q-item-label>
                </q-item-section>

                <q-item-section>
                  <q-input
                    outlined
                    dense
                    v-model="productData.fats"
                    label="Fats"
                    style="max-width: 150px"
                  />
                </q-item-section>
              </q-item>
            </q-list>
          </q-card-section>
          <q-separator />
          <q-card-section class="flex justify-end">
            <q-btn label="Update" color="positive" @click="submitProduct" />
          </q-card-section>
        </q-card>
      </div>
    </q-page>
  </transition>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { Notify } from 'quasar';
import { useProductStore } from '../../stores/productStore';
import type { UpdateProduct } from '../../stores/productStore';

defineOptions({
  name: 'ProductEditPage',
});

const router = useRouter();

const productData = ref<UpdateProduct>({
  id: 0,
  description: '',
});

const ruleNumber = [
  (val: string) => /^\d+(\.\d{1,2})?$/.test(val) || 'Only numbers allowed',
];

const productStore = useProductStore();

onMounted(async () => {
  const productId = router.currentRoute.value.params.id;
  if (productId) {
    const product = await productStore.getProduct(productId as string);
    if (product) {
      productData.value = product;
    } else {
      Notify.create({
        type: 'negative',
        message: 'Product not found.',
      });
      router.push({ name: 'products' });
    }
  }
});

const submitProduct = async () => {
  try {
    const createdProduct = await productStore.updateProduct(productData.value);

    if (createdProduct) {
      Notify.create({
        type: 'positive',
        message: 'Productt created successfully!',
      });
      router.push({ name: 'products' });
    }
  } catch (error) {
    Notify.create({
      type: 'negative',
      message: 'Failed to create product.',
    });
    console.error('Error creating product:', error);
  }
};
</script>

<style scoped>
.full-width-card {
  width: 100%;
}
</style>
