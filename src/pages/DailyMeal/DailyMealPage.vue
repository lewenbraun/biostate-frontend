<template>
  <q-page class="flex items-center column">
    <q-card class="q-mt-md full-width-card" bordered flat>
      <div class="q-pa-md q-gutter-md row justify-around">
        <q-btn
          v-for="(date, index) in dates"
          :key="index"
          :label="formatDate(date)"
          outline
          :class="{ 'today-btn': isToday(date) }"
        />
      </div>
      <q-separator inset />
      <div class="flex justify-center q-my-md">
        <q-table
          title="Breakfast"
          flat
          dense
          hide-pagination
          :rows="rows"
          :columns="columns"
          row-key="name"
        >
          <template v-slot:body="props">
            <q-tr :props="props">
              <q-td key="name" :props="props">
                {{ props.row.name }}
                <q-popup-edit v-model="props.row.name" v-slot="scope">
                  <q-input
                    v-model="scope.value"
                    dense
                    autofocus
                    counter
                    @keyup.enter="scope.set"
                  />
                </q-popup-edit>
              </q-td>
              <q-td key="calories" class="cursor-pointer" :props="props">
                <div style="border-style: dotted">{{ props.row.calories }}</div>
                <q-popup-edit
                  v-model="props.row.calories"
                  title="Update calories"
                  buttons
                  v-slot="scope"
                >
                  <q-input
                    type="number"
                    v-model="scope.value"
                    dense
                    autofocus
                  />
                </q-popup-edit>
              </q-td>
              <q-td key="fat" :props="props">
                <div class="text-pre-wrap">{{ props.row.fat }}</div>
                <q-popup-edit v-model="props.row.fat" v-slot="scope">
                  <q-input
                    type="textarea"
                    v-model="scope.value"
                    dense
                    autofocus
                  />
                </q-popup-edit>
              </q-td>
              <q-td key="carbs" :props="props">
                {{ props.row.carbs }}
                <q-popup-edit
                  v-model="props.row.carbs"
                  title="Update carbs"
                  buttons
                  persistent
                  v-slot="scope"
                >
                  <q-input
                    type="number"
                    v-model="scope.value"
                    dense
                    autofocus
                    hint="Use buttons to close"
                  />
                </q-popup-edit>
              </q-td>
              <q-td key="protein" :props="props">{{ props.row.protein }}</q-td>
              <q-td key="sodium" :props="props">{{ props.row.sodium }}</q-td>
              <q-td key="calcium" :props="props">{{ props.row.calcium }}</q-td>
              <q-td key="weight" :props="props">{{ props.row.weight }}</q-td>
            </q-tr>
          </template>
        </q-table>
      </div>
      <q-separator inset />
      <div class="flex justify-center q-my-md">
        <q-table
          title="Lunch"
          flat
          dense
          hide-pagination
          :rows="rows"
          :columns="columns"
          row-key="name"
        />
      </div>
      <q-separator inset />
      <q-list>
        <q-item>
          <q-item-section>
            <q-item-label>Frozen Yogurt</q-item-label>
            <q-item-label>23</q-item-label>
            <q-item-label caption lines="1">23</q-item-label>
          </q-item-section>

          <q-item-section side top>
            <q-item-label caption>5 min ago</q-item-label>
            <q-icon name="star" color="yellow" />
          </q-item-section>
        </q-item>

        <q-separator spaced inset />

        <q-item>
          <q-item-section>
            <q-item-label>Single line item</q-item-label>
            <q-item-label caption
              >Secondary line text. Lorem ipsum dolor sit amet, consectetur
              adipiscit elit.</q-item-label
            >
          </q-item-section>

          <q-item-section side top>
            <q-item-label caption>Voted!</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
      <q-separator class="q-mt-md" />
    </q-card>
  </q-page>
</template>

<script setup lang="ts">
import { ref } from 'vue';

// Определяем количество дней до и после текущей даты
const DAYS_RANGE = 3;
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
function isToday(date: Date): boolean {
  const today = new Date();
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
}

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
  { name: 'protein', label: 'Protein (g)', align: 'center', field: 'protein' },
  { name: 'sodium', label: 'Sodium (g)', align: 'center', field: 'sodium' },
  { name: 'calcium', label: 'Calcium (g)', align: 'center', field: 'calcium' },
  { name: 'weight', label: 'Weight (g)', align: 'center', field: 'weight' },
];

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
