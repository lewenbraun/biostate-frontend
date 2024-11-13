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

  meals.value.push({
    id: meal_id,
    products: [],
    meal_order: lastMealOrder,
    date: selectedDate.value,
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
    meals.value.push({
      id: null,
      products: [product],
      meal_order: currentMealOrder.value,
      date: selectedDate.value,
    });
  }
}

function deleteProductFromDailyMeal(
  product_id: number,
  meal_id: number | null
) {
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

// Проверка, является ли дата сегодняшним днём
// function isToday(date: Date): boolean {
//   const today = new Date();
//   return (
//     date.getDate() === today.getDate() &&
//     date.getMonth() === today.getMonth() &&
//     date.getFullYear() === today.getFullYear()
//   );
// }

function isSelectedDate(date: Date): boolean {
  return (
    date.getDate() === selectedDate.value.getDate() &&
    date.getMonth() === selectedDate.value.getMonth() &&
    date.getFullYear() === selectedDate.value.getFullYear()
  );
}

async function selectDate(date: Date) {
  selectedDate.value = date;

  // Запрос данных для конкретной даты
  await dailyMealStore.fetchDailyMeal(date);

  // Если данные с бэка пустые, очищаем meals
  if (dailyMealStore.meals.length === 0) {
    meals.value = [];
  } else {
    // Обновляем meals, добавляя только уникальные элементы
    dailyMealStore.meals.forEach((meal) => {
      const exists = meals.value.some(
        (existingMeal) => existingMeal.id === meal.id
      );

      if (!exists) {
        meals.value.push({
          id: meal.id,
          products: meal.products,
          meal_order: meal.meal_order,
          date: date,
        });
      }
    });
  }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const columns: Array<{
  name: string;
  required?: boolean;
  label: string;
  align?: 'left' | 'center' | 'right';
  field: string | ((row: Record<string, unknown>) => unknown);
  format?: (val: unknown) => string;
  sortable?: boolean;
  sort?: (a: unknown, b: unknown) => number;
}> = [
  {
    name: 'name',
    required: true,
    label: 'Name',
    align: 'left', // 'left', 'center' или 'right'
    field: (row: Record<string, unknown>) => row.name,
    format: (val: unknown) => `${val}`,
    sortable: true,
  },
  {
    name: 'calories',
    align: 'center',
    label: 'Calories',
    field: 'calories',
    sortable: true,
  },
  {
    name: 'fat',
    label: 'Fat (g)',
    align: 'center',
    field: 'fat',
    sortable: true,
  },
  { name: 'carbs', label: 'Carbs (g)', align: 'center', field: 'carbs' },
  {
    name: 'proteins',
    label: 'Proteins (g)',
    align: 'center',
    field: 'proteins',
  },
  { name: 'sodium', label: 'Sodium (g)', align: 'center', field: 'sodium' },
  { name: 'calcium', label: 'Calcium (g)', align: 'center', field: 'calcium' },
  { name: 'weight', label: 'Weight (g)', align: 'center', field: 'weight' },
];

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const rows = [
  {
    name: 'Frozen Yogurt',
    calories: 159,
    fat: 6.0,
    carbs: 24,
    protein: 4.0,
    sodium: 87,
    calcium: '14%',
    weight: '1%',
  },
  {
    name: 'Ice cream sandwich',
    calories: 237,
    fat: 9.0,
    carbs: 37,
    protein: 4.3,
    sodium: 129,
    calcium: '8%',
    weight: '1%',
  },
  {
    name: 'Eclair',
    calories: 262,
    fat: 16.0,
    carbs: 23,
    protein: 6.0,
    sodium: 337,
    calcium: '6%',
    weight: '7%',
  },
  {
    name: 'Cupcake',
    calories: 305,
    fat: 3.7,
    carbs: 67,
    protein: 4.3,
    sodium: 413,
    calcium: '3%',
    weight: '8%',
  },
  {
    name: 'Gingerbread',
    calories: 356,
    fat: 16.0,
    carbs: 49,
    protein: 3.9,
    sodium: 327,
    calcium: '7%',
    weight: '16%',
  },
  {
    name: 'Jelly bean',
    calories: 375,
    fat: 0.0,
    carbs: 94,
    protein: 0.0,
    sodium: 50,
    calcium: '0%',
    weight: '0%',
  },
  {
    name: 'Lollipop',
    calories: 392,
    fat: 0.2,
    carbs: 98,
    protein: 0,
    sodium: 38,
    calcium: '0%',
    weight: '2%',
  },
  {
    name: 'Honeycomb',
    calories: 408,
    fat: 3.2,
    carbs: 87,
    protein: 6.5,
    sodium: 562,
    calcium: '0%',
    weight: '45%',
  },
  {
    name: 'Donut',
    calories: 452,
    fat: 25.0,
    carbs: 51,
    protein: 4.9,
    sodium: 326,
    calcium: '2%',
    weight: '22%',
  },
  {
    name: 'KitKat',
    calories: 518,
    fat: 26.0,
    carbs: 65,
    protein: 7,
    sodium: 54,
    calcium: '12%',
    weight: '6%',
  },
];
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
