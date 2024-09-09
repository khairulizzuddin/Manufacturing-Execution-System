<template>
  <div class="p-6 space-y-10">

    <div>
      <h2 class="text-2xl font-bold mb-4 text-gray-700">Master Production Schedule</h2>
      <ul v-if="masterSchedule.length > 0" class="list-none space-y-4">
        <li v-for="schedule in masterSchedule" :key="schedule.id"
          class="bg-white p-4 rounded-lg shadow-md flex justify-between items-center">
          <div>
            <span class="font-medium text-gray-900">{{ schedule.productName }}</span>
            <span class="text-gray-500">| {{ formatDateTime(schedule.plannedStartDate) }} - {{
              formatDateTime(schedule.plannedEndDate) }}</span>
          </div>
          <div class="space-x-2">
            <button @click="startEdit('master', schedule)"
              class="bg-blue-500 text-white px-3 py-1 rounded-md shadow-sm hover:bg-blue-600">
              Edit
            </button>
            <button @click="deleteSchedule('master', schedule.id)"
              class="bg-red-500 text-white px-3 py-1 rounded-md shadow-sm hover:bg-red-600">
              Delete
            </button>
          </div>
        </li>
      </ul>

      <div class="mt-6 bg-gray-100 p-6 rounded-lg shadow-md space-y-4">
        <h3 class="text-lg font-semibold text-gray-700">{{ isEditing.master ? 'Edit Schedule' : 'Add Schedule' }}</h3>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input v-model="editData.master.productName" placeholder="Product Name"
            class="border-gray-300 p-2 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          <input v-model="editData.master.plannedStartDate" type="datetime-local"
            class="border-gray-300 p-2 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          <input v-model="editData.master.plannedEndDate" type="datetime-local"
            class="border-gray-300 p-2 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <button @click="saveSchedule('master')"
          class="mt-4 bg-blue-500 text-white px-4 py-2 rounded-md shadow-sm hover:bg-blue-600 transition duration-300">
          {{ isEditing.master ? 'Update Schedule' : 'Add Schedule' }}
        </button>
      </div>
    </div>

    <div>
      <h2 class="text-2xl font-bold mb-4 text-gray-700">Manufacturing Production Schedule</h2>
      <ul v-if="manufacturingSchedule.length > 0" class="list-none space-y-4">
        <li v-for="schedule in manufacturingSchedule" :key="schedule.id"
          class="bg-white p-4 rounded-lg shadow-md flex justify-between items-center">
          <div>
            <span class="font-medium text-gray-900">{{ schedule.task }} ({{ schedule.assignedDepartment }})</span>
            <span class="text-gray-500">| {{ formatDateTime(schedule.startTime) }} - {{ formatDateTime(schedule.endTime)
              }}</span>
          </div>
          <div class="space-x-2">
            <button @click="startEdit('manufacturing', schedule)"
              class="bg-blue-500 text-white px-3 py-1 rounded-md shadow-sm hover:bg-blue-600">
              Edit
            </button>
            <button @click="deleteSchedule('manufacturing', schedule.id)"
              class="bg-red-500 text-white px-3 py-1 rounded-md shadow-sm hover:bg-red-600">
              Delete
            </button>
          </div>
        </li>
      </ul>

      <div class="mt-6 bg-gray-100 p-6 rounded-lg shadow-md space-y-4">
        <h3 class="text-lg font-semibold text-gray-700">{{ isEditing.manufacturing ? 'Edit Schedule' : 'Add Schedule' }}
        </h3>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input v-model="editData.manufacturing.task" placeholder="Task"
            class="border-gray-300 p-2 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          <input v-model="editData.manufacturing.assignedDepartment" placeholder="Assigned Department"
            class="border-gray-300 p-2 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          <input v-model="editData.manufacturing.startTime" type="datetime-local"
            class="border-gray-300 p-2 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          <input v-model="editData.manufacturing.endTime" type="datetime-local"
            class="border-gray-300 p-2 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <button @click="saveSchedule('manufacturing')"
          class="mt-4 bg-blue-500 text-white px-4 py-2 rounded-md shadow-sm hover:bg-blue-600 transition duration-300">
          {{ isEditing.manufacturing ? 'Update Schedule' : 'Add Schedule' }}
        </button>
      </div>
    </div>

    <div>
      <h2 class="text-2xl font-bold mb-4 text-gray-700">Retail Operations Schedule</h2>
      <ul v-if="retailSchedule.length > 0" class="list-none space-y-4">
        <li v-for="schedule in retailSchedule" :key="schedule.id"
          class="bg-white p-4 rounded-lg shadow-md flex justify-between items-center">
          <div>
            <span class="font-medium text-gray-900">{{ schedule.productName }}</span>
            <span class="text-gray-500">| Available Quantity: {{ schedule.quantityAvailable }}, Dispatch: {{
              formatDateTime(schedule.dispatchDate) }}, Retail Delivery: {{ formatDateTime(schedule.retailDeliveryDate)
              }}</span>
          </div>
          <div class="space-x-2">
            <button @click="startEdit('retail', schedule)"
              class="bg-blue-500 text-white px-3 py-1 rounded-md shadow-sm hover:bg-blue-600">
              Edit
            </button>
            <button @click="deleteSchedule('retail', schedule.id)"
              class="bg-red-500 text-white px-3 py-1 rounded-md shadow-sm hover:bg-red-600">
              Delete
            </button>
          </div>
        </li>
      </ul>

      <div class="mt-6 bg-gray-100 p-6 rounded-lg shadow-md space-y-4">
        <h3 class="text-lg font-semibold text-gray-700">{{ isEditing.retail ? 'Edit Schedule' : 'Add Schedule' }}</h3>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input v-model="editData.retail.productName" placeholder="Product Name"
            class="border-gray-300 p-2 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          <input v-model="editData.retail.quantityAvailable" type="number" placeholder="Quantity Available"
            class="border-gray-300 p-2 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          <input v-model="editData.retail.dispatchDate" type="datetime-local"
            class="border-gray-300 p-2 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          <input v-model="editData.retail.retailDeliveryDate" type="datetime-local"
            class="border-gray-300 p-2 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <button @click="saveSchedule('retail')"
          class="mt-4 bg-blue-500 text-white px-4 py-2 rounded-md shadow-sm hover:bg-blue-600 transition duration-300">
          {{ isEditing.retail ? 'Update Schedule' : 'Add Schedule' }}
        </button>
      </div>
    </div>

  </div>
</template>

<script>
export default {
  name: 'ProductionScheduling',
  data() {
    return {
      masterSchedule: [],
      manufacturingSchedule: [],
      retailSchedule: [],
      isEditing: {
        master: false,
        manufacturing: false,
        retail: false,
      },
      editData: {
        master: { id: null, productName: '', plannedStartDate: '', plannedEndDate: '' },
        manufacturing: { id: null, task: '', assignedDepartment: '', startTime: '', endTime: '' },
        retail: { id: null, productName: '', quantityAvailable: 0, dispatchDate: '', retailDeliveryDate: '' },
      },
      pollingInterval: 5000,
    };
  },
  mounted() {
    this.fetchSchedules();
    this.pollForUpdates();
  },
  methods: {
    fetchSchedules() {
      Promise.all([
        fetch('http://localhost:3000/masterSchedule').then((res) => res.json()),
        fetch('http://localhost:3000/manufacturingSchedule').then((res) => res.json()),
        fetch('http://localhost:3000/retailSchedule').then((res) => res.json()),
      ])
        .then(([master, manufacturing, retail]) => {
          this.masterSchedule = master;
          this.manufacturingSchedule = manufacturing;
          this.retailSchedule = retail;
        })
        .catch((error) => console.error('Error fetching schedules:', error));
    },
    pollForUpdates() {
      setInterval(() => {
        this.fetchSchedules();
      }, this.pollingInterval);
    },

    formatDateTime(dateTime) {
      const options = {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      };
      return new Date(dateTime).toLocaleDateString('en-US', options);
    },

    startEdit(scheduleType, schedule) {
      this.isEditing[scheduleType] = true;
      this.editData[scheduleType] = { ...schedule };
    },

    saveSchedule(scheduleType) {
      const url = `http://localhost:3000/${scheduleType}Schedule`;
      const method = this.editData[scheduleType].id ? 'PUT' : 'POST';
      const endpoint = this.editData[scheduleType].id ? `${url}/${this.editData[scheduleType].id}` : url;

      fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(this.editData[scheduleType]),
      })
        .then(() => {
          this.fetchSchedules();
          this.resetEdit(scheduleType);
        })
        .catch((error) => console.error('Error saving schedule:', error));
    },
    deleteSchedule(scheduleType, id) {
      fetch(`http://localhost:3000/${scheduleType}Schedule/${id}`, {
        method: 'DELETE',
      })
        .then(() => this.fetchSchedules())
        .catch((error) => console.error('Error deleting schedule:', error));
    },
    resetEdit(scheduleType) {
      this.isEditing[scheduleType] = false;
      this.editData[scheduleType] = { id: null, productName: '', plannedStartDate: '', plannedEndDate: '' };
    },
  }
};
</script>