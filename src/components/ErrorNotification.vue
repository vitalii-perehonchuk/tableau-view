<script>
import { Component, Vue, Prop } from 'vue-property-decorator';

@Component
export default class ErrorNotification extends Vue {
  @Prop({ default: undefined }) error = undefined;
}
</script>
<style lang="scss" scoped>
.error {
  background-color: #0b0b2d;
  border-radius: 6px;
  bottom: 20px;
  color: white;
  font-family: Karla, sans-serif;
  padding: 16px 23px;
  position: fixed;
  right: 20px;
  z-index: 1;
}
</style>

<template>
  <div class="error">
    <h2>Error occured</h2>
    <p class="error-text">{{ error }}</p>
  </div>
</template>
