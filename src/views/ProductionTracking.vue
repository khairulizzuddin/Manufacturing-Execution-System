<template>
  <div class="p-6">

    <nav class="mb-6">
      <router-link to="/production-tracking/raw-materials-management"
        class="mr-4 hover:text-red-400 transition-colors duration-300" exact-active-class="text-red-400 font-semibold">
        Raw Materials Management
      </router-link>
      <router-link to="/production-tracking/production-scheduling"
        class="mr-4 hover:text-red-400 transition-colors duration-300" exact-active-class="text-red-400 font-semibold">
        Production Scheduling
      </router-link>
    </nav>

    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'ProductionTracking',
};
</script>