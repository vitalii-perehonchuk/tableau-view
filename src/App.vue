<script>
import { Component, Vue } from 'vue-property-decorator';
import SpinnerOverlay from './components/SpinnerOverlay.vue';
import ErrorNotification from './components/ErrorNotification.vue';

@Component({
  components: {
    'error-notification': ErrorNotification,
    'spinner-overlay': SpinnerOverlay,
  },
})
export default class App extends Vue {
  get error() {
    return this.$store.getters.error;
  }
  get isLoading() {
    return this.$store.getters.isLoading;
  }
}
</script>
<style lang="scss">
@import 'bootstrap/scss/bootstrap.scss';
#app {
  font-family: Nunito, Helvetica, Arial, sans-serif;
  font-size: 11px;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  letter-spacing: 0.1em;
  text-align: center;
  color: #2c3e50;
  #nav {
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    padding: 26px;
    width: 100%;
    .data-source {
      align-self: right;
      width: 65px;
    }
  }
}

#nav {
  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>

<template>
  <div id="app">
    <!-- <div id="nav">
      <router-link to="/">Home</router-link> |
      <router-link to="/about">About</router-link>
    </div> -->
    <router-view />
    <spinner-overlay v-if="isLoading" />
    <error-notification v-if="error" :error="error" />
  </div>
</template>
