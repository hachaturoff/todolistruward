<template>
  <div class="max-w-xl mx-auto p-4">
    <h1 class="text-2xl font-bold mb-4">Список задач</h1>

    <TaskInput @add-task="addTask"/>

    <TaskFilter v-model="currentFilter" :filters="filters"/>  

    <button 
      class="mt-4 bg-green-600 px-3 py-1 rounded text-white"
      @click="toggleSortOrder"
    >
      Сортировать по дате
      <span class="ml-1">{{ sortAsc ? '↑' : '↓' }}</span>
    </button>  

    <ul>
      <TaskItem
        v-for="task in sortedFilteredTasks"
        :key="task.id"
        :task="task"
        @toggle-completed="toggleCompleted(task.id)"
        @delete-task="deleteTask(task.id)"
      />
    </ul>

    <button
      @click="deleteCompleted"
      class="mt-4 bg-red-600 px-3 py-1 rounded text-white"
      :disabled="completedCount === 0"
    >
      Удалить все завершенные
    </button>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import TaskItem from './components/TaskItem.vue'
import TaskInput from './components/TaskInput.vue'
import TaskFilter from './components/TaskFilter.vue'

const STORAGE_KEY = 'vue-todo-list'

const tasks = ref(
  JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]').map(t => ({
    ...t,
    date: new Date(t.date)
  }))
)

const currentFilter = ref('all')
const sortAsc = ref(true)

function toggleSortOrder() {
  sortAsc.value = !sortAsc.value
}

function addTask(task) {  
  if (!task.text.trim()) return;

  tasks.value.push({
    id: Date.now(),
    text: task.text.trim(),
    completed: false,
    date: task.date
  })
}

function toggleCompleted(id) {
  const task = tasks.value.find(t => t.id === id)
  if (task) task.completed = !task.completed
}

function deleteTask(id) {
  tasks.value = tasks.value.filter(t => t.id !== id)
}

function deleteCompleted() {
  tasks.value = tasks.value.filter(t => !t.completed)
}

const filteredTasks = computed(() => {
  const now = new Date()
  switch (currentFilter.value) {
    case 'active':
      return tasks.value.filter(t => !t.completed)
    case 'completed':
      return tasks.value.filter(t => t.completed)
    case 'today':
      return tasks.value.filter(t =>
        t.date.toDateString() === now.toDateString()
      )
    case 'future':
      return tasks.value.filter(t => t.date > now && !t.completed)
    case 'late':
      return tasks.value.filter(t => t.date < now && !t.completed)
    default:
      return tasks.value
  }
})

const sortedFilteredTasks = computed(() =>
  filteredTasks.value.slice().sort((a, b) =>
    sortAsc.value
      ? a.date - b.date          // старые вверху
      : b.date - a.date          // новые вверху
  )
)

const completedCount = computed(() =>
  tasks.value.filter(t => t.completed).length
)

watch(
  tasks,
  (tasks) => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(tasks.map(t => ({...t, date: t.date.toISOString()})))
    )
  },
  { deep: true }
)
</script>

<style scoped>
.completed {
  text-decoration: line-through;
  opacity: 0.6;
}
</style>
