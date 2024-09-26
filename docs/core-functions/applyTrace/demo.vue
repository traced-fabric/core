<script setup lang="ts">
import { reactive, ref, watch } from 'vue';
import { applyTrace } from '../../../packages/core/src/applyTrace';
import { traceFabric } from '../../../packages/core/src/traceFabric';
import Button from '../../.vitepress/components/Button.vue';
import DemoContainer from '../../.vitepress/components/DemoContainer.vue';

type Todo = {
  name: string;
  done: boolean;
};

const todoListValueRef = ref<HTMLElement | undefined>();
const todoListTraceRef = ref<HTMLElement | undefined>();

const todoList = traceFabric<Todo[]>(reactive([{
  name: '📝 Add todo items',
  done: false,
}]));
todoList.trace = reactive([]);

const nonTracedTodoList = reactive([{
  name: '📝 Add todo items',
  done: false,
}]);

watch(todoList.value, () => window.requestAnimationFrame(() => todoListValueRef.value?.scrollTo({
  top: todoListValueRef.value.scrollHeight,
  behavior: 'smooth',
})));

watch(todoList.trace, () => window.requestAnimationFrame(() => todoListTraceRef.value?.scrollTo({
  top: todoListTraceRef.value.scrollHeight,
  behavior: 'smooth',
})));

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

function applyChanges(): void {
  applyTrace(nonTracedTodoList, todoList.trace);
  todoList.trace.splice(0);
}

function reset(): void {
  todoList.value.splice(0);
  todoList.value.push({
    name: '📝 Add todo items',
    done: false,
  });

  todoList.trace.splice(0);
}
</script>

<template>
  <DemoContainer class="grid gap-2">
    <div class="flex gap-2">
      <Button type="button" @click="addItem">
        Add Item
      </Button>

      <Button type="button" @click="removeItem">
        Remove Item
      </Button>

      <Button type="button" class="ml-auto" @click="reset">
        Reset
      </Button>
    </div>

    <hr>

    <div class="grid grid-cols-2 gap-2">
      <div class="flex flex-col gap-2">
        <span>
          Todo list
          <span class="text-neutral-400">(as JS object)</span>
        </span>

        <pre
          ref="todoListValueRef"
          class="overflow-auto max-h-96"
        >{{ todoList.value }}</pre>
      </div>

      <div class="flex flex-col gap-2">
        <span>
          Trace
          <span class="text-neutral-400">(all mutations of the todoList)</span>
        </span>

        <pre
          ref="todoListTraceRef"
          class="overflow-auto max-h-96"
        >{{ todoList.trace }}</pre>
      </div>
    </div>

    <hr>

    <div class="grid grid-cols-2 gap-2">
      <div class="flex flex-col gap-2">
        <div>
          <Button type="button" @click="applyChanges">
            applyTrace
          </Button>
        </div>

        <span class="text-neutral-400">
          The trace will be cleared after applying the changes.
        </span>

        <span class="text-neutral-400">
          All changes made to the todo list will be applied to the non-traced todo list.
        </span>

        <span class="text-neutral-400">
          Please note that initial state of the non-traced todo list is not the same as the traced one.
        </span>
      </div>

      <div class="flex flex-col gap-2">
        <span>Copy of the Todo List <span class="text-neutral-400">(non-traced)</span></span>

        <pre class="overflow-auto max-h-96">{{ nonTracedTodoList }}</pre>
      </div>
    </div>
  </DemoContainer>
</template>
