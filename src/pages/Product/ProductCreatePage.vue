<template>
  <transition
    appear
    enter-active-class="animated fadeIn"
    leave-active-class="animated fadeOut"
  >
    <q-page class="flex items-center column q-mx-md">
      <div
        class="q-mt-md"
        style="max-width: 600px; min-width: 350px; width: 100%"
      >
        <q-card class="q-mt-md full-width-card" bordered flat>
          <q-card-section>
            <div class="text-h6">Add product</div>
          </q-card-section>
          <q-card-section>
            <q-input
              outlined
              ref="nameRef"
              dense
              v-model="productData.name"
              label="Name"
              :rules="ruleRequired"
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
                  ref="weight"
                  dense
                  v-model="productData.weight"
                  :rules="ruleNumber"
                  label="Weight"
                  style="min-width: 50px"
                  lazy-rules
                />
              </div>
            </div>
            <div class="col-12">
              <q-editor
                placeholder="Description"
                v-model="productData.description"
                min-height="5rem"
              />
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
            <q-toggle
              v-model="productData.is_public"
              color="deep-orange-9"
              label="Public product"
              class="q-mr-sm"
              left-label
            />
            <q-btn label="Create" color="positive" @click="submitProduct" />
          </q-card-section>
        </q-card>
      </div>
    </q-page>
  </transition>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { Notify, QForm } from 'quasar';
import { useProductStore } from '../../stores/productStore';
import { ruleNumber, ruleRequired } from '../../utils/validations.ts';
import { handleApiError } from '../../utils/errorHandler.ts';
import type { CreateProduct } from '../../types/product';

defineOptions({
  name: 'ProductCreatePage',
});

const router = useRouter();

const productData = ref<CreateProduct>({
  description: '',
  is_public: false,
});

const productStore = useProductStore();

const weightRef = ref<QForm | null>(null);
const nameRef = ref<QForm | null>(null);

const submitProduct = async () => {
  weightRef.value?.validate();
  nameRef.value?.validate();

  productData.value;
  try {
    const createdProduct = await productStore.createProduct(productData.value);
    if (createdProduct) {
      Notify.create({
        type: 'positive',
        message: 'Productt created successfully!',
      });
      router.push({ name: 'products' });
    }
  } catch (error) {
    handleApiError(error);
  }
};
</script>

<style scoped>
.full-width-card {
  width: 100%;
}
</style>
