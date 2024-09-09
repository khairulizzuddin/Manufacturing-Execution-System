<template>
  <div class="app">
    <nav class="p-6 bg-gray-800 text-white">
      <router-link to="/" class="mr-4 hover:text-red-400 transition-colors duration-300"
        exact-active-class="text-red-400 font-semibold">
        Dashboard
      </router-link>
      <router-link to="/production-tracking" class="mr-4 hover:text-red-400 transition-colors duration-300"
        exact-active-class="text-red-400 font-semibold">
        Production Tracking
      </router-link>
      <router-link to="/quality-control" class="hover:text-red-400 transition-colors duration-300"
        exact-active-class="text-red-400 font-semibold">
        Quality Control
      </router-link>
    </nav>

    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'App',
};
</script>
