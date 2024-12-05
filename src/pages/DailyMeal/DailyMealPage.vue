<template>
  <transition
    appear
    enter-active-class="animated fadeIn"
    leave-active-class="animated fadeOut"
  >
    <q-page class="flex items-center column">
      <q-card class="q-mt-md full-width-card" bordered flat>
        <div class="q-pa-md q-gutter-md row justify-around">
          <q-btn
            v-for="(date, index) in dates"
            :key="index"
            :label="formatDate(date)"
            outline
            :class="{ 'today-btn': isSelectedDate(date) }"
            @click="selectDate(date)"
          />
        </div>
        <q-separator inset />

        <q-card-section horizontal>
          <q-card-section class="col-7">
            <template
              v-for="(addedProductGroup, groupIndex) in meals"
              :key="groupIndex"
            >
              <div class="row justify-between items-center">
                <div class="row items-center">
                  <div class="text-h6">{{ getMealTitle(groupIndex) }}</div>
                  <q-btn
                    color="red-5"
                    flat
                    size="10px"
                    class="q-ml-sm"
                    dense
                    icon="delete"
                    @click="deleteMeal(addedProductGroup.id)"
                  />
                </div>
                <q-btn
                  round
                  outline
                  color="green"
                  size="10px"
                  dense
                  icon="add"
                  @click="setCurrentMealOrder(addedProductGroup.meal_order)"
                />
              </div>
              <transition
                appear
                enter-active-class="animated fadeIn"
                leave-active-class="animated fadeOut"
              >
                <q-list v-if="addedProductGroup.products.length > 0">
                  <AddedProduct
                    v-for="(
                      product, productIndex
                    ) in addedProductGroup.products"
                    :key="`${groupIndex}-${productIndex}`"
                    :product="product"
                    :meal_id="addedProductGroup.id"
                    @deleteProduct="
                      deleteProductFromDailyMeal(
                        product.id,
                        addedProductGroup.id
                      )
                    "
                    @increase="
                      increaseCountProduct(product.id, addedProductGroup.id)
                    "
                    @decrease="
                      decreaseCountProduct(product.id, addedProductGroup.id)
                    "
                  />
                </q-list>
                <q-item-label
                  class="flex justify-center text-grey-6 q-my-sm"
                  style="user-select: none"
                  v-else
                >
                  Empty
                </q-item-label>
              </transition>
            </template>
            <div class="q-ma-md">
              <q-btn
                outline
                color="green"
                class="full-width"
                size="10px"
                dense
                icon="add"
                style="opacity: 60%"
                @click="createMeal"
              />
            </div>
          </q-card-section>

          <q-separator inset vertical />
          <q-card-section class="col-5">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit.
          </q-card-section>
        </q-card-section>
      </q-card>

      <q-dialog v-model="card">
        <q-card class="q-px-md">
          <!-- <ProductList :addProduct="addProductToDailyMeal" /> -->
          <SelectProductList @add-product="addProductToDailyMeal" />
        </q-card>
      </q-dialog>
    </q-page>
  </transition>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { Product } from 'src/stores/productStore';
import { useDailyMealStore, Meal } from 'src/stores/dailyMealStore';
import AddedProduct from 'src/components/DailyMeal/AddedProduct.vue';
import SelectProductList from 'src/components/Product/Meal/SelectProductList.vue';

const dailyMealStore = useDailyMealStore();

const card = ref(false);
const selectedDate = ref<Date>(new Date());

const meals = ref<Array<Meal>>([]);

const currentMealOrder = ref<number>(0);

function getMealTitle(index: number): string {
  const mealTitles = [
    'First',
    'Second',
    'Third',
    'Fourth',
    'Fifth',
    'Sixth',
    'Seventh',
    'Eighth',
    'Ninth',
    'Tenth',
    'Eleventh',
    'Twelfth',
    'Thirteenth',
    'Fourteenth',
    'Fifteenth',
    'Sixteenth',
    'Seventeenth',
    'Eighteenth',
    'Nineteenth',
    'Twentieth',
  ];
  return `${mealTitles[index]} meal`;
}

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
  meal_id: number | null
): void {
  dailyMealStore.decreaseCountProduct(product_id, meal_id);
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
    console.error('Error creating meal:', error);
  }
}

async function deleteMeal(meal_id: number): Promise<void> {
  try {
    let updated_meals = await dailyMealStore.deleteMeal(
      selectedDate.value,
      meal_id
    );

    meals.value = updated_meals;
  } catch (error) {
    console.error('Error creating meal:', error);
  }
}

function getLastMealOrder() {
  const lastMeal = meals.value[meals.value.length - 1];

  return lastMeal ? lastMeal.meal_order + 1 : 1;
}

function addProductToDailyMeal(product: Product): void {
  dailyMealStore.addProductToMeal(
    product,
    selectedDate.value,
    currentMealOrder.value,
  );
}

function deleteProductFromDailyMeal(
  product_id: number,
  meal_id: number | null
): void {
  meals.value.forEach((meal) => {
    if (meal.id === meal_id) {
      meal.products = meal.products.filter(
        (product) => product.id !== product_id
      );
    }
  });
  dailyMealStore.deleteProductFromMeal(product_id, meal_id);
}

onMounted(async () => {
  const today = new Date();

  selectedDate.value = today;

  await dailyMealStore.getOrFetchMealsByDate(today);

  dailyMealStore.meals.forEach((meal) => {
    meals.value.push({
      id: meal.id,
      products: meal.products,
      meal_order: meal.meal_order,
      date: meal.date,
    });
  });
});

const DAYS_RANGE = 4;
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

function formatDate(date: Date): string {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  return `${day}.${month}`;
}

function isSelectedDate(date: Date): boolean {
  return (
    date.getDate() === selectedDate.value.getDate() &&
    date.getMonth() === selectedDate.value.getMonth() &&
    date.getFullYear() === selectedDate.value.getFullYear()
  );
}

async function selectDate(date: Date): Promise<void> {
  selectedDate.value = date;

  const formatedDate = date.toISOString().split('T')[0];

  const mealsForDate = await dailyMealStore.getOrFetchMealsByDate(date);

  switch (dailyMealStore.mealsStatus[formatedDate]) {
    case 'empty':
      console.warn(`For date ${formatedDate} data is empty.`);
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
      console.error(`Error loading ${formatedDate}`);
      meals.value = [];
      break;

    default:
      console.log(`Data for ${formatedDate} still loading.`);
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
