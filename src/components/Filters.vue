<script>
import { Component, Vue } from 'vue-property-decorator';
import FilterControl from './FilterControl.vue';

@Component({
  components: {
    'filter-control': FilterControl,
  },
})
export default class Filters extends Vue {
  get createdOptions() {
    return this.$store.getters['tableau/createdOptions'];
  }
  get owners() {
    return this.$store.getters['tableau/owners'];
  }
}
</script>
<style lang="scss" scoped>
.filters {
  display: flex;
  flex-direction: row;
}
</style>
<template>
  <div class="filters">
    <filter-control
      criterion="owner.fullName"
      label="Owner"
      :options="owners"
      typeName="Owner"
    />
    <filter-control
      criterion="createdAt"
      label="Created"
      :options="createdOptions"
      typeName="Date"
    />
  </div>
</template>
