<template>
  <div class="p-6 bg-gray-100 min-h-screen">
    <h1 class="text-4xl font-bold text-gray-800 mb-8">Dashboard</h1>

    <div class="bg-white p-6 rounded-lg shadow-lg mb-8 transition-transform transform hover:scale-105 duration-300">
      <h2 class="text-3xl font-semibold text-gray-700 mb-6">Quality Control Metrics</h2>
      <div class="text-lg text-gray-800 space-y-4">
        <p>Total Defects: <span class="font-semibold">{{ totalDefects }}</span></p>
        <p>Pass Rate: <span class="font-semibold">{{ passRate }}%</span></p>
        <p>Defect Percentage: <span class="font-semibold">{{ defectPercentage }}%</span></p>
        <p>Compliance Status:
          <span :class="complianceStatus === 'Pass' ? 'text-green-600 font-semibold' : 'text-red-600 font-semibold'">
            {{ complianceStatus }}
          </span>
        </p>
      </div>
    </div>

    <div class="bg-white p-6 rounded-lg shadow-lg mb-8 transition-transform transform hover:scale-105 duration-300">
      <h2 class="text-3xl font-semibold text-gray-700 mb-6">Production Status</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div>
          <h3 class="text-2xl font-semibold text-gray-700 mb-4">Inspections</h3>
          <ul class="list-disc pl-6 space-y-2">
            <li v-for="inspection in inspections" :key="inspection.id">
              <div :class="{
                'bg-gray-50 p-4 rounded-lg shadow-sm hover:bg-gray-100 transition-colors': true,
                'text-green-600': inspection.result === 'Pass',
                'text-red-600': inspection.result === 'Fail'
              }">
                {{ inspection.product }} - {{ inspection.stage }} - {{ inspection.date }} -
                <span :class="inspection.result === 'Pass' ? 'font-semibold' : 'font-semibold'">
                  {{ inspection.result }}
                </span> - {{ inspection.defects }}
              </div>
            </li>
          </ul>
        </div>
        <div>
          <h3 class="text-2xl font-semibold text-gray-700 mb-4">Defects</h3>
          <ul class="list-disc pl-6 space-y-2">
            <li v-for="defect in defects" :key="defect.id">
              <div class="bg-gray-50 p-4 rounded-lg shadow-sm hover:bg-gray-100 transition-colors">
                Inspection ID: {{ defect.inspectionId }} - {{ defect.description }} - Impact: {{ defect.impact }}
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>

    <div class="bg-white p-6 rounded-lg shadow-lg transition-transform transform hover:scale-105 duration-300">
      <h2 class="text-3xl font-semibold text-gray-700 mb-6">Charts</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        <div class="bg-gray-50 p-4 rounded-lg shadow-sm">
          <h3 class="text-2xl font-semibold text-gray-700 mb-4">Quality Control Metrics Chart</h3>
          <div class="h-64">
            <canvas id="qualityControlChart"></canvas>
          </div>
        </div>

        <div class="bg-gray-50 p-4 rounded-lg shadow-sm">
          <h3 class="text-2xl font-semibold text-gray-700 mb-4">Inspections by Product</h3>
          <div class="h-64">
            <canvas id="inspectionsByProductChart"></canvas>
          </div>
        </div>

        <div class="bg-gray-50 p-4 rounded-lg shadow-sm">
          <h3 class="text-2xl font-semibold text-gray-700 mb-4">Defects by Product</h3>
          <div class="h-64">
            <canvas id="defectsByProductChart"></canvas>
          </div>
        </div>

        <div class="bg-gray-50 p-4 rounded-lg shadow-sm">
          <h3 class="text-2xl font-semibold text-gray-700 mb-4">Inventory Levels</h3>
          <div class="h-64">
            <canvas id="inventoryLevelsChart"></canvas>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

export default {
  data() {
    return {
      inspections: [],
      defects: [],
      masterSchedule: [],
      manufacturingSchedule: [],
      retailSchedule: [],
      inventory: [],
      receivingInspection: [],
      materialUsage: [],
    };
  },
  computed: {
    totalDefects() {
      return this.inspections.reduce((count, inspection) => count + (inspection.result === 'Fail' ? 1 : 0), 0);
    },
    passRate() {
      const passCount = this.inspections.filter(i => i.result === 'Pass').length;
      return ((passCount / this.inspections.length) * 100).toFixed(2);
    },
    defectPercentage() {
      return ((this.totalDefects / this.inspections.length) * 100).toFixed(2);
    },
    complianceStatus() {
      return this.passRate >= 80 ? 'Pass' : 'Fail';
    }
  },
  mounted() {
    this.fetchData();
  },
  methods: {
    fetchData() {
      Promise.all([
        fetch("http://localhost:3000/inspections").then(response => response.json()),
        fetch("http://localhost:3000/defects").then(response => response.json()),
        fetch("http://localhost:3000/masterSchedule").then(response => response.json()),
        fetch("http://localhost:3000/manufacturingSchedule").then(response => response.json()),
        fetch("http://localhost:3000/retailSchedule").then(response => response.json()),
        fetch("http://localhost:3000/inventory").then(response => response.json()),
        fetch("http://localhost:3000/receivingInspection").then(response => response.json()),
        fetch("http://localhost:3000/materialUsage").then(response => response.json())
      ])
        .then(([inspections, defects, masterSchedule, manufacturingSchedule, retailSchedule, inventory, receivingInspection, materialUsage]) => {
          this.inspections = inspections;
          this.defects = defects;
          this.masterSchedule = masterSchedule;
          this.manufacturingSchedule = manufacturingSchedule;
          this.retailSchedule = retailSchedule;
          this.inventory = inventory;
          this.receivingInspection = receivingInspection;
          this.materialUsage = materialUsage;
          this.createCharts();
        })
        .catch(error => console.error("Error fetching data:", error));
    },

    createCharts() {
      new Chart(document.getElementById('qualityControlChart'), {
        type: 'bar',
        data: {
          labels: ['Total Defects', 'Pass Rate', 'Defect Percentage'],
          datasets: [{
            label: 'Quality Control Metrics',
            data: [this.totalDefects, this.passRate, this.defectPercentage],
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1
          }]
        },
        options: {
          scales: {
            y: {
              beginAtZero: true
            }
          }
        }
      });

      const inspectionsByProduct = this.inspections.reduce((acc, inspection) => {
        acc[inspection.product] = (acc[inspection.product] || 0) + 1;
        return acc;
      }, {});

      new Chart(document.getElementById('inspectionsByProductChart'), {
        type: 'pie',
        data: {
          labels: Object.keys(inspectionsByProduct),
          datasets: [{
            label: 'Inspections by Product',
            data: Object.values(inspectionsByProduct),
            backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
          }]
        }
      });

      const defectsByProduct = this.defects.reduce((acc, defect) => {
        const inspection = this.inspections.find(i => i.id === defect.inspectionId);
        if (inspection) {
          acc[inspection.product] = (acc[inspection.product] || 0) + 1;
        }
        return acc;
      }, {});

      new Chart(document.getElementById('defectsByProductChart'), {
        type: 'bar',
        data: {
          labels: Object.keys(defectsByProduct),
          datasets: [{
            label: 'Defects by Product',
            data: Object.values(defectsByProduct),
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            borderColor: 'rgba(255, 99, 132, 1)',
            borderWidth: 1
          }]
        }
      });

      new Chart(document.getElementById('inventoryLevelsChart'), {
        type: 'line',
        data: {
          labels: this.inventory.map(item => item.name),
          datasets: [{
            label: 'Inventory Levels',
            data: this.inventory.map(item => item.quantity),
            fill: false,
            borderColor: 'rgba(75, 192, 192, 1)',
            tension: 0.1
          }]
        },
        options: {
          scales: {
            y: {
              beginAtZero: true
            }
          }
        }
      });
    }
  }
};
</script>