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
            <div class="row self-center flex q-gutter-x-sm">
              <div class="col-3">
                <q-input
                  outlined
                  dense
                  v-model.number="productData.price"
                  label="Price"
                  :rules="ruleNumber"
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
                />
              </div>
              <div class="col">
                <q-toggle
                  v-model="productData.is_alcohol"
                  color="deep-orange-9"
                  label="Is alcohol"
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
          <div class="row g-gutter-md">
            <q-card-section>
              <q-list style="max-width: 220px">
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
            <q-card-section v-if="productData.is_alcohol">
              <q-list style="max-width: 220px">
                <q-item class="q-px-none">
                  <q-item-section>
                    <q-item-label class="text-body1">Percent:</q-item-label>
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
                    <q-item-label class="text-body1"
                      >Type alcohol:</q-item-label
                    >
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
              </q-list>
            </q-card-section>
          </div>
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
import type { CreateProduct } from '../../stores/productStore';
import { handleApiError } from '../../utils/errorHandler.ts';

defineOptions({
  name: 'ProductCreatePage',
});

const router = useRouter();

const productData = ref<CreateProduct>({
  description: '',
  is_public: false,
  is_alcohol: false,
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
