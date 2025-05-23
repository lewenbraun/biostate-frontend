<template>
  <transition
    appear
    enter-active-class="animated fadeIn"
    leave-active-class="animated fadeOut"
  >
    <q-page class="flex items-center column">
      <q-card class="q-mt-md full-width-card" bordered flat>
        <ListDays
          :dates="dates"
          :selected-date="selectedDate"
          @select-date="selectDate"
        />
        <q-separator inset />

        <!-- Desktop version -->
        <q-card-section horizontal class="gt-sm">
          <q-card-section class="col-7">
            <MealsList
              :meals="meals"
              @deleteMeal="deleteMeal"
              @setCurrentMealOrder="setCurrentMealOrder"
              @createMeal="createMeal"
              @deleteProduct="deleteProductFromDailyMeal"
              @increase="increaseCountProduct"
              @decrease="decreaseCountProduct"
            />
          </q-card-section>

          <q-separator inset vertical />

          <q-card-section class="col-5">
            <StaticsDailyFeatures
              v-if="meals.length > 0"
              :date="selectedDate"
            />
          </q-card-section>
        </q-card-section>

        <!-- Mobile version -->
        <div class="lt-md">
          <q-tabs
            v-model="activeTab"
            dense
            class="text-grey"
            active-color="primary"
            indicator-color="primary"
            align="justify"
            narrow-indicator
          >
            <q-tab name="meals" label="Meals" />
            <q-tab name="stats" label="Statistics" />
          </q-tabs>

          <q-tab-panels v-model="activeTab" animated>
            <q-tab-panel name="meals">
              <MealsList
                :meals="meals"
                @deleteMeal="deleteMeal"
                @setCurrentMealOrder="setCurrentMealOrder"
                @createMeal="createMeal"
                @deleteProduct="deleteProductFromDailyMeal"
                @increase="increaseCountProduct"
                @decrease="decreaseCountProduct"
              />
            </q-tab-panel>

            <q-tab-panel
              name="stats"
              class="q-mb-md"
              style="width: 100vw; max-width: 100vw; padding: 0"
            >
              <transition
                appear
                enter-active-class="animated fadeIn"
                leave-active-class="animated fadeOut"
              >
                <StaticsDailyFeatures
                  v-if="meals.length > 0"
                  :date="selectedDate"
                />
              </transition>
            </q-tab-panel>
          </q-tab-panels>
        </div>
      </q-card>

      <q-dialog v-model="card">
        <q-card class="q-px-md">
          <SelectProductList @add-product="addProductToDailyMeal" />
        </q-card>
      </q-dialog>
    </q-page>
  </transition>
</template>

<script setup lang="ts">
import { onMounted, ref, computed } from 'vue';
import { useDailyMealStore } from '../../stores/dailyMealStore';
import { handleApiError } from '../../utils/errorHandler';
import { formatToLocal } from '../../utils/Formatters/dateFormatter';
import { useQuasar } from 'quasar';
import SelectProductList from '../../components/Product/Meal/SelectProductList.vue';
import StaticsDailyFeatures from '../../components/DailyMeal/StaticsDailyFeatures.vue';
import MealsList from '../../components/DailyMeal/MealsList.vue';
import ListDays from '../../components/DailyMeal/ListDays.vue';
import type { Product } from '../../types/product';
import type { Meal } from '../../types/dailyMeal';

const dailyMealStore = useDailyMealStore();
const card = ref(false);
const selectedDate = ref<Date>(new Date());
const meals = ref<Array<Meal>>([]);
const currentMealOrder = ref<number>(0);

const $q = useQuasar();
const isMobile = computed(() => $q.platform.is.mobile);

const activeTab = ref('meals');

onMounted(async () => {
  selectedDate.value = new Date();

  const mealsForDate = await dailyMealStore.getOrFetchMealsByDate(
    selectedDate.value
  );

  meals.value = mealsForDate.map((meal: Meal) => ({
    id: meal.id,
    products: meal.products,
    meal_order: meal.meal_order,
    date: formatToLocal(selectedDate.value),
  }));
});

function setCurrentMealOrder(meal_order: number): void {
  card.value = true;
  currentMealOrder.value = meal_order;
}

function increaseCountProduct(
  product_id: number,
  meal_id: number | null
): void {
  dailyMealStore.increaseCountProduct(product_id, meal_id);
}

function decreaseCountProduct(
  product_id: number,
  product_count: number,
  meal_id: number | null
): void {
  if (product_count === 0) {
    meals.value.forEach((meal) => {
      if (meal.id === meal_id) {
        meal.products = meal.products.filter(
          (product) => product.id !== product_id
        );
      }
    });
  }
  dailyMealStore.decreaseCountProduct(product_id, meal_id);
}

function getLastMealOrder() {
  const lastMeal = meals.value[meals.value.length - 1];

  return lastMeal ? lastMeal.meal_order + 1 : 1;
}

async function createMeal(): Promise<void> {
  try {
    let lastMealOrder = await getLastMealOrder();

    let updated_meals = await dailyMealStore.createMeal(
      selectedDate.value,
      lastMealOrder
    );

    meals.value = updated_meals;
  } catch (error) {
    handleApiError(error);
  }
}

function addProductToDailyMeal(product: Product): void {
  dailyMealStore.addProductToMeal(
    product,
    selectedDate.value,
    currentMealOrder.value
  );
}

async function deleteMeal(meal_id: number): Promise<void> {
  try {
    let updated_meals = await dailyMealStore.deleteMeal(
      selectedDate.value,
      meal_id
    );

    meals.value = updated_meals;
  } catch (error) {
    handleApiError(error);
  }
}

async function deleteProductFromDailyMeal(
  product_id: number,
  weight_product: number,
  meal_id: number | null
): Promise<void> {
  try {
    let updated_meals = await dailyMealStore.deleteProductFromMeal(
      product_id,
      weight_product,
      meal_id,
      selectedDate.value
    );

    meals.value = updated_meals;
  } catch (error) {
    handleApiError(error);
  }
}

const DAYS_RANGE = isMobile.value ? 1 : 4;
const dates = ref<Date[]>(generateDates(DAYS_RANGE));

function generateDates(range: number): Date[] {
  const result: Date[] = [];
  const today = new Date();

  for (let i = -range; i <= range; i++) {
    const newDate = new Date(today);
    newDate.setDate(today.getDate() + i);
    result.push(newDate);
  }

  return result;
}

async function selectDate(date: Date): Promise<void> {
  selectedDate.value = date;

  const formatedDate = formatToLocal(date);

  const mealsForDate = await dailyMealStore.getOrFetchMealsByDate(date);

  switch (dailyMealStore.mealsStatus[formatedDate]) {
    case 'empty':
      meals.value = [];
      break;

    case 'loaded':
      meals.value = mealsForDate.map((meal: Meal) => ({
        id: meal.id,
        products: meal.products,
        meal_order: meal.meal_order,
        date: formatedDate,
      }));
      break;

    case 'error':
      meals.value = [];
      break;

    default:
      meals.value = [];
  }
}
</script>

<style scoped>
.button-container {
  display: grid;
}

.table-container {
  max-width: 800px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.today-btn {
  background-color: #e0f7fa;
  color: #00796b;
}
</style>
