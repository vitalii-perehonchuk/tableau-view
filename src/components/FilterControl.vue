<script>
import isEmpty from 'lodash/isEmpty';
import { Component, Vue, Prop } from 'vue-property-decorator';
import FilterOption from './FilterOption.vue';
// import User from './User.vue';

@Component({
  components: {
    'filter-option': FilterOption,
  },
})
export default class FilterControl extends Vue {
  get classes() {
    return this.isOpen ? 'open' : '';
  }
  @Prop(String)
  criterion = undefined;
  get hasOptions() {
    return !isEmpty(this.options);
  }
  get hasSelection() {
    return !!this.$store.state.tableau.activeFilters[this.criterion];
  }
  get isOpen() {
    return this.$store.state.tableau.openFilters[this.criterion];
  }
  @Prop(String)
  label = undefined;
  @Prop({ default: () => [] })
  options;
  toggle() {
    if (!this.hasOptions) {
      return;
    }
    this.$store.commit('tableau/setFilterOpen', {
      criterion: this.criterion,
      value: !this.isOpen,
    });
  }
  get text() {
    return (
      this.$store.state.tableau.activeFilters[this.criterion] ||
      `Choose ${this.typeName}`
    );
  }
  @Prop(String)
  typeName = undefined;
}
</script>
<style lang="scss" scoped>
.filter-control {
  align-items: center;
  display: flex;
  flex-direction: row;
  margin-left: 16px;
  .label {
    color: #2c3e50;
    font-size: 8px;
    font-weight: normal;
    line-height: 17px;
    margin-right: 8px;
    text-transform: uppercase;
  }
  .dropdown {
    background-color: rgba(255, 255, 255, 0.7);
    border: 1px solid #e5e6ff;
    color: #828282;
    cursor: pointer;
    font-size: 11px;
    line-height: 17px;
    min-width: 120px;
    padding: 6px 12px;
    text-align: left;
  }
  .options {
    background-color: white;
    height: 0px;
    overflow: hidden;
    position: absolute;
    top: 100%;
  }
  &.open {
    .options {
      height: auto;
    }
  }
}
</style>
<template>
  <div class="filter-control" :class="classes">
    <div class="label">{{ label }}</div>
    <div class="dropdown" @click="toggle">
      <div class="selection">{{ text }}</div>
      <div class="options">
        <filter-option
          :value="undefined"
          :criterion="criterion"
          option-name="Disable"
          v-if="hasSelection"
        />
        <filter-option
          :key="option"
          :criterion="criterion"
          v-for="option in options"
          :value="option"
          :option-name="option"
        />
      </div>
    </div>
  </div>
</template>
