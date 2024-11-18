<template>
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
              <div class="text-h6">{{ getMealTitle(groupIndex) }}</div>
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
            <q-list v-if="addedProductGroup.products.length > 0">
              <!-- Пройдемся по каждому продукту внутри текущего addedProducts -->
              <AddedProduct
                v-for="(product, productIndex) in addedProductGroup.products"
                :key="`${groupIndex}-${productIndex}`"
                :product="product"
                :mealOrder="addedProductGroup.meal_order"
                @deleteProduct="
                  deleteProductFromDailyMeal(product.id, addedProductGroup.id)
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
        <ProductList :addProduct="addProductToDailyMeal" />
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { Product } from 'src/stores/productStore';
import { useDailyMealStore, Meal } from 'src/stores/dailyMealStore';
import AddedProduct from 'src/components/DailyMeal/AddedProduct.vue';
import ProductList from 'src/components/Product/ProductList.vue';

const dailyMealStore = useDailyMealStore();

const card = ref(false);
const selectedDate = ref<Date>(new Date());
// const selectedDate = ref<string>('');

const meals = ref<Array<Meal>>([]);
const countMeal = ref<number>(0);

const currentMealOrder = ref<number>(0);

// const newMeal = ref<Meal>({
//   products: [],
//   meal_order: 0,
// });

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

function setCurrentMealOrder(meal_order: number) {
  // const selectedDate = new Date();

  card.value = true;

  currentMealOrder.value = meal_order;

  // dailyMealStore.createMeal(selectedDate, countMeal.value);
}

function increaseCountProduct(product_id: number, meal_id: number | null) {
  dailyMealStore.meals.forEach((meal) => {
    if (meal.id === meal_id) {
      meal.products.forEach((product) => {
        if (product.id === product_id) {
          product.count++;
        }
      });
    }
  });
  dailyMealStore.increaseCountProduct(product_id, meal_id);
}

function decreaseCountProduct(product_id: number, meal_id: number | null) {
  dailyMealStore.meals.forEach((meal) => {
    if (meal.id === meal_id) {
      meal.products.forEach((product) => {
        if (product.id === product_id) {
          product.count--;
        }
      });
    }
  });
  dailyMealStore.decreaseCountProduct(product_id, meal_id);
}

async function createMeal() {
  // Ожидание результата асинхронного запроса
  let lastMealOrder = await getLastMealOrder();

  // Ожидание результата создания нового приема пищи
  let meal_id = await dailyMealStore.createMeal(
    selectedDate.value,
    lastMealOrder
  );
  const formatedDate = selectedDate.value.toISOString().split('T')[0];

  meals.value.push({
    id: meal_id,
    products: [],
    meal_order: lastMealOrder,
    date: formatedDate,
  });
}

function getLastMealOrder() {
  const lastMeal = meals.value[meals.value.length - 1];

  return lastMeal ? lastMeal.meal_order + 1 : 1;
}

function addProductToDailyMeal(product: Product) {
  // Обновляем store
  dailyMealStore.addProductToMeal(
    product.id,
    selectedDate.value,
    currentMealOrder.value
  );

  const existingGroup = meals.value.find(
    (group) => group.meal_order === currentMealOrder.value
  );

  product.count = 1;
  if (existingGroup) {
    let existingProduct = existingGroup.products.find(
      (productInGroup) => productInGroup.id === product.id
    );
    if (existingProduct) {
      meals.value.forEach((meal) => {
        if (meal.id === existingGroup.id) {
          meal.products.forEach((productInGroup) => {
            if (productInGroup.id === product.id) {
              productInGroup.count++;
            }
          });
        }
      });
    } else {
      existingGroup.products.push(product);
    }
  } else {
    const formatedDate = selectedDate.value.toISOString().split('T')[0];

    meals.value.push({
      id: null,
      products: [product],
      meal_order: currentMealOrder.value,
      date: formatedDate,
    });
  }
}

function deleteProductFromDailyMeal(
  product_id: number,
  meal_id: number | null
) {
  dailyMealStore.deleteProductFromMeal(product_id, meal_id);

  // Удаляем продукт из meals
  meals.value.forEach((meal) => {
    
    if (meal.id === meal_id && meal_id !== null) {
      const index = meal.products.findIndex(
        (product) => product.id === product_id
      );
      if (index !== -1) {
        meal.products.splice(index, 1);
      }
    }
  });
}

onMounted(async () => {
  const today = new Date();

  selectedDate.value = today;

  await dailyMealStore.fetchDailyMeal(today);

  dailyMealStore.meals.forEach((meal) => {
    meals.value.push({
      id: meal.id,
      products: meal.products,
      meal_order: meal.meal_order,
      date: meal.date,
    });

    countMeal.value += 1;
  });
});

// Определяем количество дней до и после текущей даты
const DAYS_RANGE = 4;
const dates = ref<Date[]>(generateDates(DAYS_RANGE));

// Генерация массива дат на основе диапазона
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

// Форматирование даты в "dd.MM"
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

async function selectDate(date: Date) {
  selectedDate.value = date;
  const formatedDate = date.toISOString().split('T')[0];

  const mealsForDate = await dailyMealStore.getOrFetchMealsByDate(date);

  switch (dailyMealStore.mealsStatus[formatedDate]) {
    case 'empty':
      console.warn(`Для даты ${formatedDate} данных нет.`);
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
      console.error(`Произошла ошибка при загрузке данных для ${formatedDate}`);
      meals.value = [];
      break;

    default:
      console.log(`Данные для ${formatedDate} ещё загружаются.`);
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
