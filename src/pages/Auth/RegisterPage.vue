<template>
  <q-page class="row justify-center items-center">
    <div class="column q-pa-lg">
      <div class="row">
        <q-card class="shadow-12" style="width: 500px">
          <q-card-section>
            <h4 class="text-h5 text-center q-my-md">Registration</h4>
          </q-card-section>
          <q-separator class="q-ma-none" />
          <q-card-section>
            <q-form class="q-px-sm" @submit.prevent="register">
              <q-input v-model="user.name" type="text" label="Name">
                <template v-slot:prepend>
                  <q-icon name="person" />
                </template>
              </q-input>
              <q-input v-model="user.email" type="email" label="Email">
                <template v-slot:prepend>
                  <q-icon name="email" />
                </template>
              </q-input>
              <q-input v-model="user.password" type="password" label="Password">
                <template v-slot:prepend>
                  <q-icon name="lock" />
                </template>
              </q-input>
              <q-input
                v-model="user.password_confirmation"
                type="password"
                label="Repeat password"
              >
                <template v-slot:prepend>
                  <q-icon name="lock" />
                </template>
              </q-input>
            </q-form>
          </q-card-section>
          <q-card-actions class="q-px-lg q-mt-lg">
            <q-btn
              unelevated
              size="lg"
              color="deep-orange-6"
              class="full-width text-white"
              label="Sign up"
              @click="register"
            />
          </q-card-actions>
          <q-card-section class="text-center q-py-md">
            <p class="text-grey-6 q-mb-sm">Already registered??</p>
            <RouterLink to="/login" class="cursor-pointer">Sign in</RouterLink>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '../../stores/userStore';

const user = ref({
  name: '',
  email: '',
  password: '',
  password_confirmation: '',
});

const router = useRouter();
const userStore = useUserStore();

function register() {
  userStore.register(user.value).then(() => {
    router.push({ name: 'profile' });
  });
}
</script>

<style scoped></style>
