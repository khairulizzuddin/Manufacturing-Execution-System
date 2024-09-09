<template>
    <div class="p-6 space-y-10">
  
      <div>
        <h2 class="text-2xl font-bold mb-4 text-gray-700">Inventory Tracking</h2>
        <ul v-if="inventory.length > 0" class="list-none space-y-4">
          <li v-for="item in inventory" :key="item.id" class="bg-white p-4 rounded-lg shadow-md flex justify-between items-center">
            <div>
              <span class="font-medium text-gray-900">{{ item.name }}</span>
              <span class="text-gray-500">| Quantity: {{ item.quantity }}, Supplier: {{ item.supplier }}, Reorder Point: {{ item.reorderPoint }}</span>
            </div>
            <div class="space-x-2">
              <button @click="startEdit('inventory', item)" class="bg-blue-500 text-white px-3 py-1 rounded-md shadow-sm hover:bg-blue-600">
                Edit
              </button>
              <button @click="deleteInventory(item.id)" class="bg-red-500 text-white px-3 py-1 rounded-md shadow-sm hover:bg-red-600">
                Delete
              </button>
            </div>
          </li>
        </ul>
  
        <div class="mt-6 bg-gray-100 p-6 rounded-lg shadow-md space-y-4">
          <h3 class="text-lg font-semibold text-gray-700">{{ isEditing.inventory ? 'Edit Inventory' : 'Add Inventory' }}</h3>
          <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
            <input v-model="editData.inventory.name" placeholder="Name" class="border-gray-300 p-2 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            <input v-model="editData.inventory.quantity" type="number" placeholder="Quantity" class="border-gray-300 p-2 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            <input v-model="editData.inventory.supplier" placeholder="Supplier" class="border-gray-300 p-2 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            <input v-model="editData.inventory.reorderPoint" type="number" placeholder="Reorder Point" class="border-gray-300 p-2 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <button @click="saveInventory()" class="mt-4 bg-blue-500 text-white px-4 py-2 rounded-md shadow-sm hover:bg-blue-600 transition duration-300">
            {{ isEditing.inventory ? 'Update Inventory' : 'Add Inventory' }}
          </button>
        </div>
      </div>
  
      <h2 class="text-2xl font-bold mb-4 text-gray-700">Receiving and Inspection</h2>
<ul v-if="receivingInspection.length > 0" class="list-none space-y-4">
  <li v-for="item in receivingInspection" :key="item.id" class="bg-white p-4 rounded-lg shadow-md flex justify-between items-center">
    <div>
      <span class="font-medium text-gray-900">{{ item.name }}</span>
      <span class="text-gray-500">| Received Date: {{ formatDateTime(item.receivedDate) }}</span>
      <span :class="item.qualityCheck === 'Passed' ? 'text-green-500' : 'text-red-500'">
        | Quality Check: {{ item.qualityCheck }}
      </span>
    </div>
    <div class="space-x-2">
      <button @click="startEdit('receivingInspection', item)" class="bg-blue-500 text-white px-3 py-1 rounded-md shadow-sm hover:bg-blue-600">
        Edit
      </button>
      <button @click="deleteReceivingInspection(item.id)" class="bg-red-500 text-white px-3 py-1 rounded-md shadow-sm hover:bg-red-600">
        Delete
      </button>
    </div>
  </li>
</ul>

  
<div class="mt-6 bg-gray-100 p-6 rounded-lg shadow-md space-y-4">
  <h3 class="text-lg font-semibold text-gray-700">{{ isEditing.receivingInspection ? 'Edit Inspection' : 'Add Inspection' }}</h3>
  <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
    <input v-model="editData.receivingInspection.name" placeholder="Name" class="border-gray-300 p-2 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
    <input v-model="editData.receivingInspection.receivedDate" type="datetime-local" class="border-gray-300 p-2 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
    
    <select v-model="editData.receivingInspection.qualityCheck" class="border-gray-300 p-2 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
      <option value="Passed">Passed</option>
      <option value="Failed">Failed</option>
    </select>
  </div>
  
  <button @click="saveReceivingInspection()" class="mt-4 bg-blue-500 text-white px-4 py-2 rounded-md shadow-sm hover:bg-blue-600 transition duration-300">
    {{ isEditing.receivingInspection ? 'Update Inspection' : 'Add Inspection' }}
  </button>
</div>

  
      <div>
        <h2 class="text-2xl font-bold mb-4 text-gray-700">Material Usage</h2>
        <ul v-if="materialUsage.length > 0" class="list-none space-y-4">
          <li v-for="usage in materialUsage" :key="usage.id" class="bg-white p-4 rounded-lg shadow-md flex justify-between items-center">
            <div>
              <span class="font-medium text-gray-900">{{ usage.name }}</span>
              <span class="text-gray-500">| Quantity Used: {{ usage.quantityUsed }}, Date: {{ formatDateTime(usage.date) }}</span>
            </div>
            <div class="space-x-2">
              <button @click="startEdit('materialUsage', usage)" class="bg-blue-500 text-white px-3 py-1 rounded-md shadow-sm hover:bg-blue-600">
                Edit
              </button>
              <button @click="deleteMaterialUsage(usage.id)" class="bg-red-500 text-white px-3 py-1 rounded-md shadow-sm hover:bg-red-600">
                Delete
              </button>
            </div>
          </li>
        </ul>
  
        <div class="mt-6 bg-gray-100 p-6 rounded-lg shadow-md space-y-4">
          <h3 class="text-lg font-semibold text-gray-700">{{ isEditing.materialUsage ? 'Edit Usage' : 'Add Usage' }}</h3>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input v-model="editData.materialUsage.name" placeholder="Name" class="border-gray-300 p-2 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            <input v-model="editData.materialUsage.quantityUsed" type="number" placeholder="Quantity Used" class="border-gray-300 p-2 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            <input v-model="editData.materialUsage.date" type="datetime-local" class="border-gray-300 p-2 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <button @click="saveMaterialUsage()" class="mt-4 bg-blue-500 text-white px-4 py-2 rounded-md shadow-sm hover:bg-blue-600 transition duration-300">
            {{ isEditing.materialUsage ? 'Update Usage' : 'Add Usage' }}
          </button>
        </div>
      </div>
  
    </div>
  </template>
  
  <script>
  export default {
    name: 'RawMaterialsManagement',
    data() {
      return {
        inventory: [],
        receivingInspection: [],
        materialUsage: [],
        isEditing: {
          inventory: false,
          receivingInspection: false,
          materialUsage: false,
        },
        editData: {
          inventory: { id: null, name: '', quantity: 0, supplier: '', reorderPoint: 0 },
          receivingInspection: { id: null, name: '', receivedDate: '', qualityCheck: '' },
          materialUsage: { id: null, name: '', quantityUsed: 0, date: '' },
        },
        pollingInterval: 5000,
      };
    },
    mounted() {
      this.fetchRawMaterials();
      this.pollForUpdates();
    },
    methods: {
      fetchRawMaterials() {
        Promise.all([
          fetch('http://localhost:3000/inventory').then((res) => res.json()),
          fetch('http://localhost:3000/receivingInspection').then((res) => res.json()),
          fetch('http://localhost:3000/materialUsage').then((res) => res.json()),
        ])
          .then(([inventory, receivingInspection, materialUsage]) => {
            this.inventory = inventory;
            this.receivingInspection = receivingInspection;
            this.materialUsage = materialUsage;
          })
          .catch((error) => console.error('Error fetching raw materials:', error));
      },
  
      pollForUpdates() {
        setInterval(() => {
          this.fetchRawMaterials();
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
  
      startEdit(type, item) {
        this.isEditing[type] = true;
        this.editData[type] = { ...item };
      },
  
      resetEdit(type) {
        this.isEditing[type] = false;
        this.editData[type] = { id: null, name: '', quantity: 0, supplier: '', reorderPoint: 0, receivedDate: '', qualityCheck: '', quantityUsed: 0, date: '' };
      },
  
      saveInventory() {
        const url = 'http://localhost:3000/inventory';
        const method = this.editData.inventory.id ? 'PUT' : 'POST';
        const endpoint = this.editData.inventory.id ? `${url}/${this.editData.inventory.id}` : url;
  
        fetch(endpoint, {
          method,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(this.editData.inventory),
        })
          .then(() => {
            this.fetchRawMaterials();
            this.resetEdit('inventory');
          })
          .catch((error) => console.error('Error saving inventory:', error));
      },
  
      saveReceivingInspection() {
        const url = 'http://localhost:3000/receivingInspection';
        const method = this.editData.receivingInspection.id ? 'PUT' : 'POST';
        const endpoint = this.editData.receivingInspection.id ? `${url}/${this.editData.receivingInspection.id}` : url;
  
        fetch(endpoint, {
          method,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(this.editData.receivingInspection),
        })
          .then(() => {
            this.fetchRawMaterials();
            this.resetEdit('receivingInspection');
          })
          .catch((error) => console.error('Error saving receiving inspection:', error));
      },
  
      saveMaterialUsage() {
        const url = 'http://localhost:3000/materialUsage';
        const method = this.editData.materialUsage.id ? 'PUT' : 'POST';
        const endpoint = this.editData.materialUsage.id ? `${url}/${this.editData.materialUsage.id}` : url;
  
        fetch(endpoint, {
          method,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(this.editData.materialUsage),
        })
          .then(() => {
            this.fetchRawMaterials();
            this.resetEdit('materialUsage');
          })
          .catch((error) => console.error('Error saving material usage:', error));
      },
  
      deleteInventory(id) {
        fetch(`http://localhost:3000/inventory/${id}`, { method: 'DELETE' })
          .then(() => this.fetchRawMaterials())
          .catch((error) => console.error('Error deleting inventory:', error));
      },
  
      deleteReceivingInspection(id) {
        fetch(`http://localhost:3000/receivingInspection/${id}`, { method: 'DELETE' })
          .then(() => this.fetchRawMaterials())
          .catch((error) => console.error('Error deleting receiving inspection:', error));
      },
  
      deleteMaterialUsage(id) {
        fetch(`http://localhost:3000/materialUsage/${id}`, { method: 'DELETE' })
          .then(() => this.fetchRawMaterials())
          .catch((error) => console.error('Error deleting material usage:', error));
      },
    },
  };
  </script>
  
  
  