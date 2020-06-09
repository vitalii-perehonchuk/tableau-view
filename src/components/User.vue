<script>
import { Component, Vue, Prop } from 'vue-property-decorator';
import defaultUserImage from '../assets/user.png';

@Component
export default class User extends Vue {
  imageSrc = defaultUserImage;
  get name() {
    if (!this.user) return '';
    return this.user.fullName || this.user.name;
  }
  @Prop(Object)
  user = undefined;
}
</script>
<style lang="scss" scoped>
.user {
  align-items: center;
  display: flex;
  flex-direction: row;
  height: 100%;
  img {
    height: 16px;
    margin-right: 7px;
  }
}
</style>
<template>
  <div class="user">
    <img :alt="name" :src="imageSrc" />
    <div class="name">{{ name }}</div>
  </div>
</template>
