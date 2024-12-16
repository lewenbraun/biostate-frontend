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
        <!-- Statistics for day -->
        <q-card-section class="col-12 flex items-center justify-between">
          <div class="text-h6">Statistics per day</div>
          <!-- Main Info Section -->
          <q-card-section class="col-12">
            <div class="text-body1 text-bold">Main info:</div>
            <q-list style="max-width: 200px" class="q-ml-xs">
              <q-item dense class="q-px-none">
                <q-item-section>
                  <q-item-label class="text-body1">Name:</q-item-label>
                </q-item-section>
                <q-item-section>
                  <div v-if="user.name">
                    {{ user.name }}
                  </div>
                  <q-skeleton v-else :type="text" />
                </q-item-section>
              </q-item>
              <q-item dense class="q-px-none">
                <q-item-section>
                  <q-item-label class="text-body1">Weight:</q-item-label>
                </q-item-section>
                <q-item-section>
                  <div v-if="user.weight">{{ user.weight }}</div>
                  <q-skeleton v-else :type="text" />
                </q-item-section>
              </q-item>
            </q-list>
          </q-card-section>

          <q-separator inset />
        </q-card-section>
      </q-card>
    </q-page>
  </transition>
</template>

<script setup lang="ts">

</script>

<style scoped></style>
