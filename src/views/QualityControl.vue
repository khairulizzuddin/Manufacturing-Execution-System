<template>
  <div class="p-6 bg-gray-100 min-h-screen">
    <h1 class="text-3xl font-bold text-gray-800 mb-6">Quality Control</h1>

    <div v-if="inspections.length > 0" class="bg-white p-6 rounded-lg shadow-md">
      <h2 class="text-2xl font-semibold text-gray-700 mb-4">Scheduled Inspections</h2>
      <div v-for="product in uniqueProducts" :key="product" class="mb-6">
        <h3 class="text-xl font-semibold text-gray-600 mb-3">{{ product }}</h3>
        <ul class="space-y-3">
          <li v-for="inspection in getFilteredInspections(product)" :key="inspection.id"
            class="flex justify-between items-center border-b pb-2">
            <div>
              <p class="text-lg text-gray-800">{{ inspection.stage }} - {{ inspection.date }}</p>
            </div>
            <button class="text-indigo-600 font-semibold hover:text-indigo-800" @click="editInspection(inspection)">
              Edit
            </button>
          </li>
        </ul>
        <button
          class="mt-4 bg-indigo-600 text-white font-semibold px-4 py-2 rounded-lg hover:bg-indigo-800 transition duration-300"
          @click="generateReport(product)">
          Generate Report
        </button>
      </div>
    </div>

    <div v-if="selectedInspection" class="bg-white p-6 rounded-lg shadow-md mt-6" ref="inspectionForm">
      <h2 class="text-2xl font-semibold text-gray-700 mb-4">Edit Inspection</h2>
      <form @submit.prevent="updateInspection">
        <div class="mb-5">
          <label for="product" class="block text-sm font-medium text-gray-700">Product</label>
          <select id="product" v-model="selectedInspection.product"
            class="mt-1 block w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 p-2">
            <option v-for="product in uniqueProducts" :key="product" :value="product">{{ product }}</option>
          </select>
        </div>

        <div class="mb-5">
          <label for="stage" class="block text-sm font-medium text-gray-700">Stage</label>
          <select id="stage" v-model="selectedInspection.stage"
            class="mt-1 block w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 p-2">
            <option value="Raw Materials">Raw Materials</option>
            <option value="In-Process">In-Process</option>
            <option value="Final Product">Final Product</option>
          </select>
        </div>

        <div class="mb-5">
          <label for="date" class="block text-sm font-medium text-gray-700">Date</label>
          <input type="date" id="date" v-model="selectedInspection.date"
            class="mt-1 block w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 p-2" />
        </div>

        <div class="mb-5">
          <label for="result" class="block text-sm font-medium text-gray-700">Result</label>
          <select id="result" v-model="selectedInspection.result"
            class="mt-1 block w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 p-2">
            <option value="Pass">Pass</option>
            <option value="Fail">Fail</option>
          </select>
        </div>

        <div class="mb-5">
          <label for="defects" class="block text-sm font-medium text-gray-700">Defects</label>
          <input type="text" id="defects" v-model="selectedInspection.defects"
            class="mt-1 block w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 p-2"
            :placeholder="defectsData" />
        </div>

        <div class="flex justify-end">
          <button type="submit"
            class="bg-indigo-600 text-white font-semibold px-4 py-2 rounded-lg hover:bg-indigo-800 transition duration-300">
            Update Inspection
          </button>
        </div>
      </form>
    </div>

    <div class="bg-white p-6 rounded-lg shadow-md mt-6">
      <h2 class="text-2xl font-semibold text-gray-700 mb-4">Quality Control Metrics</h2>
      <div class="text-lg text-gray-800">
        <p>Total Defects: {{ totalDefects }}</p>
        <p>Pass Rate: {{ passRate }}%</p>
        <p>Defect Percentage: {{ defectPercentage }}%</p>
        <p>Compliance Status:
          <span :class="complianceStatus === 'Pass' ? 'text-green-600' : 'text-red-600'">
            {{ complianceStatus }}
          </span>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    defectsData: String
  },
  data() {
    return {
      inspections: [],
      selectedInspection: null,
    };
  },
  computed: {
    uniqueProducts() {
      return [...new Set(this.inspections.map(inspection => inspection.product))];
    },
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
  methods: {
    fetchInspections() {
      fetch("http://localhost:3000/inspections")
        .then(response => response.json())
        .then(data => {
          this.inspections = data;
        })
        .catch(error => console.error("Error fetching inspections:", error));
    },

    getFilteredInspections(product) {
      return this.inspections.filter(inspection => inspection.product === product);
    },

    editInspection(inspection) {
      this.selectedInspection = { ...inspection };
      this.$nextTick(() => {
        const element = this.$refs.inspectionForm;
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    },

    updateInspection() {
      if (!this.selectedInspection || !this.selectedInspection.id) return;

      fetch(`http://localhost:3000/inspections/${this.selectedInspection.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(this.selectedInspection),
      })
        .then(response => response.json())
        .then(() => {
          this.fetchInspections();
          this.selectedInspection = null;
        })
        .catch(error => console.error("Error updating inspection:", error));
    },

    generateReport(product) {
      const filteredInspections = this.getFilteredInspections(product);
      const reportWindow = window.open('', '_blank');
      reportWindow.document.write('<html><head><title>Product Report</title>');
      reportWindow.document.write('<style>body { font-family: Arial, sans-serif; margin: 20px; }</style>');
      reportWindow.document.write('</head><body>');
      reportWindow.document.write('<h1>Inspection Report for ' + product + '</h1>');
      reportWindow.document.write('<table border="1" cellpadding="5" cellspacing="0" style="border-collapse: collapse; width: 100%;">');
      reportWindow.document.write('<thead><tr><th>Stage</th><th>Date</th><th>Result</th><th>Defects</th></tr></thead>');
      reportWindow.document.write('<tbody>');
      filteredInspections.forEach(inspection => {
        reportWindow.document.write('<tr>');
        reportWindow.document.write('<td>' + inspection.stage + '</td>');
        reportWindow.document.write('<td>' + inspection.date + '</td>');
        reportWindow.document.write('<td>' + inspection.result + '</td>');
        reportWindow.document.write('<td>' + (inspection.defects || 'N/A') + '</td>');
        reportWindow.document.write('</tr>');
      });
      reportWindow.document.write('</tbody></table>');
      reportWindow.document.write('</body></html>');
      reportWindow.document.close();
    }
  },
  mounted() {
    this.fetchInspections();
  }
};
</script>