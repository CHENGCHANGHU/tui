<template>
  <div class="playground-box">
    <h1>
      playground
    </h1>
    <TestComponent />
    <EdsButton @click="handleOpen">Open</EdsButton>
    <Drawer :visible="drawerVisible" @close="drawerVisible = false;" @confirm="drawerVisible = false;" />
  </div>
</template>

<script>
import { EdsButton } from 'eds-vue';
import { TestComponent } from '@tui/test-component/src';
import { Drawer } from '@tui/drawer';

export default {
  components: {
    EdsButton,
    TestComponent,
    Drawer,
  },
  data() {
    return {
      drawerVisible: false,
    };
  },
  methods: {
    handleOpen() {
      console.log(this.drawerVisible);
      this.drawerVisible = true;
    },
  },
};
</script>

<style lang="scss" scoped>
.playground-box {
  h1 {
    color: red;
  }
}
</style>
