<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated class="bg-deep-orange-5">
      <q-toolbar>
        <q-toolbar-title
          @click="$router.push({ name: 'main' })"
          style="cursor: pointer"
        >
          BioState
        </q-toolbar-title>
        <div class="row q-gutter-xs">
          <q-btn flat :to="{ name: 'login' }">Sign in</q-btn>
          <q-btn flat :to="{ name: 'register' }">Sign up</q-btn>
        </div>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
defineOptions({
  name: 'AuthLayout',
});
</script>
