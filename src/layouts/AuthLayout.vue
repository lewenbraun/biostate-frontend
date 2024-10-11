<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated class="bg-deep-orange-5">
      <q-toolbar>
        <q-toolbar-title> What-to-eat-a </q-toolbar-title>

        <div class="row q-gutter-xs">
          <q-btn flat>Sign in</q-btn>
          <q-btn flat>Sign up</q-btn>
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
