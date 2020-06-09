<script>
import { Component, Vue } from 'vue-property-decorator';
import ItemView from '../components/ItemView.vue';
import DataSourceSetup from '../components/DataSourceSetup.vue';
import ActiveItemView from '../components/ActiveItemView.vue';

@Component({
  components: {
    'active-item-view': ActiveItemView,
    'data-source-setup': DataSourceSetup,
    item: ItemView,
  },
})
export default class Home extends Vue {
  get workbooks() {
    return this.$store.state.tableau.workbooks;
  }
}
</script>
<style lang="scss" scoped>
.home {
  display: flex;
  flex-direction: row;
  text-align: right;
  width: 100%;
  .items {
    background-color: #fafbff;
    border-top-color: #e5e6ff;
    border-top-style: solid;
    border-top-width: 1px;
    padding-right: 26px;
    padding-top: 26px;
    // display: table;
    display: flex;
    flex-direction: column;
    width: 100%;
    padding: 60px;
    .heading {
      color: #828282;
      // display: table-row;
      display: flex;
      justify-content: stretch;
      text-align: center;
      text-transform: uppercase;
      // > * {
      //   // display: table-cell;
      // }
      .name {
        flex-basis: 400px;
        flex-grow: 5;
      }
      .name,
      .owner,
      .updated-at {
        align-items: center;
        display: flex;
        justify-content: center;
      }
      .owner,
      .updated-at {
        flex-basis: 180px;
        flex-grow: 0;
        padding: 20px;
      }
    }
  }
  .details {
    background-color: white;
    padding-top: 78px;
    width: 40vw;
  }
}
</style>
<template>
  <div class="home">
    <data-source-setup />
    <div class="items">
      <div class="heading">
        <div class="name">Workbook</div>
        <div class="owner">Owner</div>
        <div class="updated-at">Last updated</div>
      </div>
      <item
        :key="workbook.id"
        :workbook="workbook"
        v-for="workbook in workbooks"
      />
    </div>
    <div class="details"><active-item-view /></div>
  </div>
</template>
