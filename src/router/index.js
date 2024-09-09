import { createRouter, createWebHistory } from 'vue-router';
import Dashboard from '../views/DashboardM.vue';
import ProductionTracking from '../views/ProductionTracking.vue';
import QualityControl from '../views/QualityControl.vue';
import ProductionScheduling from '../views/ProductionScheduling.vue';
import RawMaterialsManagement from '../views/RawMaterialsManagement.vue';

const routes = [
  { path: '/', name: 'Dashboard', component: Dashboard },
  {
    path: '/production-tracking',
    component: ProductionTracking,
    children: [
      {
        path: 'production-scheduling',
        component: ProductionScheduling,
      },
      {
        path: 'raw-materials-management',
        component: RawMaterialsManagement,
        alias: '',
      },
    ],
  },
  { path: '/quality-control', name: 'QualityControl', component: QualityControl },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
