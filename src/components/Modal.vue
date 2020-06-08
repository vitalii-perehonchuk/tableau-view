<script>
import { Component, Vue } from 'vue-property-decorator';

@Component
export default class Modal extends Vue {}
</script>
<style lang="scss" scoped>
.modal {
  background-color: rgba(11, 11, 45, 0.5);
  bottom: 0px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  left: 0px;
  position: fixed;
  right: 0px;
  top: 0px;
  z-index: 1;
}
</style>

<template>
  <div class="modal">
    <slot></slot>
  </div>
</template>
