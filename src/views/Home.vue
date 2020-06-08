<script>
import { Component, Vue } from 'vue-property-decorator';
import HelloWorld from '../components/HelloWorld.vue';

@Component({
  components: {
    HelloWorld,
  },
})
export default class Home extends Vue {}
</script>
<style lang="scss" scoped>
.home {
  border-top-color: #e5e6ff;
  border-top-style: solid;
  border-top-width: 1px;
  padding-right: 26px;
  padding-top: 26px;
  text-align: right;
  width: 100%;
}
</style>
<template>
  <div class="home">
    <HelloWorld msg="Welcome to Your Vue.js App" />
  </div>
</template>
