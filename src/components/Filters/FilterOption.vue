<script>
import { Component, Vue, Prop } from 'vue-property-decorator';

@Component
export default class FilterOption extends Vue {
  activate() {
    this.$store.commit('tableau/setFilter', {
      criterion: this.criterion,
      value: this.value,
    });
    this.$store.commit('tableau/setFilterOpen', {
      criterion: this.criterion,
      value: false,
    });
  }
  @Prop(String)
  criterion = undefined;
  get isOpen() {
    return this.$store.state.tableau.openFilters[this.criterion];
  }
  @Prop(String)
  optionName = undefined;
  toggle() {
    this.$store.commit('tableau/setFilterOpen', {
      criterion: this.criterion,
      value: !this.isOpen,
    });
  }
  @Prop(String)
  value = undefined;
}
</script>
<style lang="scss" scoped>
.filter-option {
  min-width: 120px;
  &:hover {
    text-decoration: underline;
  }
}
</style>
<template>
  <div class="filter-option" @click.stop="activate">
    {{ optionName }}
  </div>
</template>
