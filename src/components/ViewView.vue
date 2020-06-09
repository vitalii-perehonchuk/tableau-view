<script>
import { Component, Vue, Prop } from 'vue-property-decorator';
import User from './User.vue';

@Component({
  components: {
    user: User,
  },
})
export default class ViewView extends Vue {
  get href() {
    if (!this.view) return '';
    return `${this.$store.state.tableau.url}/views/${this.workbookContentUrl}/${this.view.viewUrlName}`;
  }
  get name() {
    if (!this.view) return '';
    return this.view.name;
  }
  @Prop(Object)
  view = undefined;
  @Prop(String)
  workbookContentUrl = undefined;
}
</script>
<style lang="scss" scoped>
.view-view {
  margin-top: 8px;
  text-align: left;
}
</style>
<template>
  <li class="view-view">
    <a :href="href" rel="noopener noreferrer" target="_blank">{{ name }}</a>
  </li>
</template>
