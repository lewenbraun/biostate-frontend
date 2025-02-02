<template>
  <transition
    appear
    enter-active-class="animated fadeIn"
    leave-active-class="animated fadeOut"
  >
    <q-page class="flex items-center column" padding>
      <q-card
        class="flex full-width-card column fit"
        style="max-width: 600px"
        bordered
        flat
      >
        <!-- Profile Header with Edit Button -->
        <q-card-section class="col-12 flex items-center justify-between">
          <div class="text-h6">Profile</div>
          <q-btn
            flat
            dense
            icon="edit"
            @click="toggleEdit"
            label="Change Parameters"
            class="q-ml-sm"
          />
        </q-card-section>

        <q-separator inset />

        <!-- Main Info Section -->
        <q-card-section class="col-12">
          <div class="text-body1 text-bold">Main info:</div>
          <q-list style="max-width: 200px" class="q-ml-xs">
            <q-item dense class="q-px-none">
              <q-item-section>
                <q-item-label class="text-body1">Name:</q-item-label>
              </q-item-section>
              <q-item-section>
                <q-input
                  v-if="isEditing"
                  v-model="editableUser.profileData.name"
                  dense
                  hide-bottom-space
                />
                <div v-else-if="editableUser.profileData.name !== undefined">
                  {{ editableUser.profileData.name }}
                </div>
                <q-skeleton v-else type="text" />
              </q-item-section>
            </q-item>
            <q-item dense class="q-px-none">
              <q-item-section>
                <q-item-label class="text-body1">Weight:</q-item-label>
              </q-item-section>
              <q-item-section>
                <q-input
                  v-if="isEditing"
                  v-model="editableUser.profileData.weight"
                  dense
                  hide-bottom-space
                />
                <div v-else-if="editableUser.profileData.weight !== undefined">
                  {{ editableUser.profileData.weight }}
                </div>
                <q-skeleton v-else type="text" />
              </q-item-section>
            </q-item>
          </q-list>
        </q-card-section>

        <q-separator inset />

        <!-- Daily Maximum Section -->
        <div class="q-ml-md q-mt-md q-mb-md">
          <div class="text-body1 text-bold">Daily maximum:</div>
          <q-list style="max-width: 200px" class="q-ml-xs">
            <q-item dense class="q-px-none">
              <q-item-section>
                <q-item-label class="text-body1">Calories:</q-item-label>
              </q-item-section>
              <q-item-section>
                <q-input
                  v-if="isEditing"
                  v-model="editableUser.maxNutrients.calories"
                  dense
                  hide-bottom-space
                />
                <div
                  v-else-if="editableUser.maxNutrients.calories !== undefined"
                >
                  {{ editableUser.maxNutrients.calories }}
                </div>
                <q-skeleton v-else type="text" />
              </q-item-section>
            </q-item>
            <q-item dense class="q-px-none">
              <q-item-section>
                <q-item-label class="text-body1">Proteins:</q-item-label>
              </q-item-section>
              <q-item-section>
                <q-input
                  v-if="isEditing"
                  v-model="editableUser.maxNutrients.proteins"
                  dense
                  hide-bottom-space
                />
                <div
                  v-else-if="editableUser.maxNutrients.proteins !== undefined"
                >
                  {{ editableUser.maxNutrients.proteins }}
                </div>
                <q-skeleton v-else type="text" />
              </q-item-section>
            </q-item>
            <q-item dense class="q-px-none">
              <q-item-section>
                <q-item-label class="text-body1">Carbs:</q-item-label>
              </q-item-section>
              <q-item-section>
                <q-input
                  v-if="isEditing"
                  v-model="editableUser.maxNutrients.carbs"
                  dense
                  hide-bottom-space
                />
                <div v-else-if="editableUser.maxNutrients.carbs !== undefined">
                  {{ editableUser.maxNutrients.carbs }}
                </div>
                <q-skeleton v-else type="text" />
              </q-item-section>
            </q-item>
            <q-item dense class="q-px-none">
              <q-item-section>
                <q-item-label class="text-body1">Fats:</q-item-label>
              </q-item-section>
              <q-item-section>
                <q-input
                  v-if="isEditing"
                  v-model="editableUser.maxNutrients.fats"
                  dense
                  hide-bottom-space
                />
                <div v-else-if="editableUser.maxNutrients.fats !== undefined">
                  {{ editableUser.maxNutrients.fats }}
                </div>
                <q-skeleton v-else type="text" />
              </q-item-section>
            </q-item>
          </q-list>
        </div>
        <q-separator inset v-if="isEditing" />
        <q-card-section class="col-12 flex justify-end" v-if="isEditing">
          <q-btn label="Save" color="primary" flat @click="saveChanges" />
          <q-btn label="Cancel" flat @click="cancelChanges" />
        </q-card-section>
      </q-card>
    </q-page>
  </transition>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useUserStore } from '../../stores/userStore';

const userStore = useUserStore();

const user = computed(() => userStore.user.data);

const editableUser = ref({ ...user.value });

const isEditing = ref(false);

const toggleEdit = () => {
  if (isEditing.value) {
    userStore.updateUser(editableUser.value);
  } else {
    editableUser.value = { ...user.value };
  }
  isEditing.value = !isEditing.value;
};

const saveChanges = async () => {
  await userStore.updateUser(editableUser.value);
  isEditing.value = false;
};

const cancelChanges = () => {
  isEditing.value = false;
  editableUser.value = { ...user.value };
};

onMounted(async () => {
  await userStore.getProfileData();
  await userStore.getMaxNutrients();
  editableUser.value = { ...userStore.user.data };
});
</script>

<style scoped></style>
