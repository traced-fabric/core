<script setup lang="ts">
import { reactive } from 'vue';
import { traceFabric } from '../../../packages/core/src/traceFabric';
import DemoContainer from '../../.vitepress/components/DemoContainer.vue';

type Todo = {
  name: string;
  done: boolean;
};

const todoList = traceFabric<Todo[]>(reactive([{
  name: 'Try out Traced Fabric 🚀',
  done: false,
}]));
todoList.trace = reactive([]);

let count = 0;
function addItem(): void {
  todoList.value.push({
    name: `Item ${count++}`,
    done: false,
  });
}

function removeItem(): void {
  todoList.value.pop();
}

function reset(): void {
  todoList.value.splice(0);
  todoList.trace.splice(0);
}
</script>

<template>
  <DemoContainer>
    <div>
      <p>Todo list:</p>

      <button type="button" @click="addItem">
        Add Item
      </button>

      <button type="button" @click="removeItem">
        Remove Item
      </button>

      <button type="button" @click="reset">
        Reset
      </button>
    </div>

    <pre>{{ todoList.value }}</pre>
    <pre>{{ todoList.trace }}</pre>
  </DemoContainer>
</template>
