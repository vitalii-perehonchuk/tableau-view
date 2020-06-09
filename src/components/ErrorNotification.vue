<script>
import { Component, Vue, Prop } from 'vue-property-decorator';

@Component
export default class ErrorNotification extends Vue {
  @Prop({ default: undefined }) error = undefined;
}
</script>
<style lang="scss" scoped>
.error {
  border-radius: 6px;
  bottom: 20px;
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
