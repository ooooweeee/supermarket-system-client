<template>
  <div>This is Home</div>
  <a-button>提交</a-button>
</template>

<script>
import { defineComponent } from 'vue';
import { Button } from 'ant-design-vue';

export default defineComponent({
  components: {
    [Button.name]: Button
  }
});
</script>
