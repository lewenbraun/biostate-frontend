<template>
  <q-layout view="hHh Lpr lFf">
    <q-header elevated class="bg-deep-orange-5">
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />

        <q-toolbar-title
          @click="$router.push({ name: 'main' })"
          style="cursor: pointer"
        >
          What-to-eat-a
        </q-toolbar-title>
        <div v-if="!userAuth()" class="row q-gutter-xs">
          <q-btn flat :to="{ name: 'login' }">Sign in</q-btn>
          <q-btn flat :to="{ name: 'register' }">Sign up</q-btn>
        </div>
        <q-btn v-else flat round dense icon="account_circle">
          <q-menu>
            <q-list style="min-width: 100px">
              <q-item clickable v-close-popup>
                <q-item-section @click="logout()">Logout</q-item-section>
              </q-item>
            </q-list>
          </q-menu>
        </q-btn>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" show-if-above bordered>
      <q-list>
        <q-item-label header> Menu </q-item-label>

        <EssentialLink
          v-for="link in linksList"
          :key="link.title"
          v-bind="link"
        />
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useUserStore } from '../stores/userStore';
import EssentialLink, {
  EssentialLinkProps,
} from 'components/EssentialLink.vue';

const userStore = useUserStore();

const userAuth = ref(userStore.userAuth);

function logout() {
  userStore.logout();
}

defineOptions({
  name: 'MainLayout',
});

const linksList: EssentialLinkProps[] = [
  {
    title: 'Products',
    icon: 'egg',
    link: 'products',
  },
  {
    title: 'Daily Meal',
    icon: 'local_pizza',
    link: 'dailyMeal',
  },
  {
    title: 'Discord Chat Channel',
    caption: 'chat.quasar.dev',
    icon: 'lunch_dining',
    link: 'https://chat.quasar.dev',
  },
  {
    title: 'Forum',
    caption: 'forum.quasar.dev',
    icon: 'tapas',
    link: 'https://forum.quasar.dev',
  },
  {
    title: 'Twitter',
    caption: '@quasarframework',
    icon: 'breakfast_dining',
    link: 'https://twitter.quasar.dev',
  },
  {
    title: 'Facebook',
    caption: '@QuasarFramework',
    icon: 'egg',
    link: 'https://facebook.quasar.dev',
  },
  {
    title: 'Quasar Awesome',
    caption: 'Community Quasar projects',
    icon: 'fastfood',
    link: 'https://awesome.quasar.dev',
  },
];

const leftDrawerOpen = ref(false);

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value;
}
</script>
