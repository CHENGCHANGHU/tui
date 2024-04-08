<template>
  <div class="test-component-box">
    <div class="test-component-container">
      Test Component {{ testData }}.
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      testData: [123, 'abc', true, false, []],
    };
  },
};
</script>

<style lang="scss" scoped>
.test-component-box {
  padding: 8px;
  background-color: yellowgreen;
  border: 1px solid green;
  box-sizing: border-box;

  .test-component-container {
    padding: 4px;
    background-color: red;
    border: 1px solid blue;
    box-sizing: border-box;
  }
}
</style>
