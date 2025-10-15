<template>
  <div>
    <div class="home">
      <aui-image style="width: 100px; height: 100px" :src="logo"></aui-image>
      <h1>标准模板</h1>
    </div>
  </div>
</template>

<script setup lang="ts">
</script>

<style scoped>
.home {
  padding: 75px 50px 8px 50px;
  text-align: center;

  .description {
    font-weight: 400;
    font-size: 14px;
    line-height: 22px;
    color: #595959;
  }

  .button-wrap {
    margin-top: 32px;

    &>button {
      margin-right: 8px;
    }
  }
}

h1 {
  text-align: center;
  font-size: 30px;
  font-weight: 700;
  margin-bottom: 8px;
}
</style>
