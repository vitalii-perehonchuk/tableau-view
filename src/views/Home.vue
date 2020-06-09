<script>
import { Component, Vue } from 'vue-property-decorator';
import ItemView from '../components/ItemView.vue';
import DataSourceSetup from '../components/DataSourceSetup.vue';
import ActiveItemView from '../components/ActiveItemView.vue';
import Filters from '../components/Filters.vue';

@Component({
  components: {
    'active-item-view': ActiveItemView,
    'data-source-setup': DataSourceSetup,
    filters: Filters,
    item: ItemView,
  },
})
export default class Home extends Vue {
  get nameSortDirection() {
    return this.$store.state.tableau.sortCriteria.name;
  }
  get ownerSortDirection() {
    return this.$store.state.tableau.sortCriteria['owner.fullName'];
  }
  toggleNameSort() {
    this.toggleSort('name');
  }
  toggleOwnerSort() {
    this.toggleSort('owner.fullName');
  }
  toggleSort(sortCriterion) {
    const currentDirection = this.$store.state.tableau.sortCriteria[
      sortCriterion
    ];
    if (!currentDirection) {
      this.$store.commit('tableau/setSortCriterion', {
        direction: 'asc',
        sortCriterion,
      });
    } else if (currentDirection === 'asc') {
      this.$store.commit('tableau/setSortCriterion', {
        direction: 'desc',
        sortCriterion,
      });
    } else {
      this.$store.commit('tableau/setSortCriterion', {
        direction: undefined,
        sortCriterion,
      });
    }
  }
  toggleUpdatedSort() {
    this.toggleSort('updatedAt');
  }
  get updatedSortDirection() {
    return this.$store.state.tableau.sortCriteria.updatedAt;
  }
  get workbooks() {
    return this.$store.getters['tableau/workbooks'];
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
      cursor: pointer;
      // display: table-row;
      display: flex;
      justify-content: stretch;
      text-align: center;
      text-transform: uppercase;
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
        .sort-triangle {
          border-left: 5px solid transparent;
          border-right: 5px solid transparent;
          height: 0;
          margin-right: 5px;
          width: 0;
          &.asc {
            border-bottom: 5px solid #828282;
          }
          &.desc {
            border-top: 5px solid #828282;
          }
        }
      }
      .owner,
      .updated-at {
        flex-basis: 180px;
        flex-grow: 0;
        padding: 20px;
      }
    }
    .pagination {
      display: flex;
      flex-direction: row;
      justify-content: center;
      margin-top: 25px;
      width: 100%;
      .arrow-left {
        margin-right: 16px;
      }
      .arrow-right {
        margin-left: 16px;
      }
      .go-to-page {
        border-radius: 50%;
        color: #5f68ad;
        cursor: pointer;
        font-size: 13px;
        height: 24px;
        line-height: 24px;
        text-align: center;
        width: 24px;
        &.active {
          background-color: #5f68ad;
          color: white;
          cursor: initial;
        }
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
      <filters />
      <div class="heading">
        <div class="name" @click="toggleNameSort" title="Sort">
          <div class="sort-triangle" :class="nameSortDirection"></div>
          Workbook
        </div>
        <div class="owner" @click="toggleOwnerSort" title="Sort">
          <div class="sort-triangle" :class="ownerSortDirection"></div>
          Owner
        </div>
        <div class="updated-at" @click="toggleUpdatedSort" title="Sort">
          <div class="sort-triangle" :class="updatedSortDirection"></div>
          Last updated
        </div>
      </div>
      <item
        :key="workbook.id"
        :workbook="workbook"
        v-for="workbook in workbooks"
      />
      <div class="pagination">
        <img src="../assets/arrow-left.svg" class="arrow-left" alt="Back" />
        <div class="go-to-page active">1</div>
        <img src="../assets/arrow-right.svg" class="arrow-right" alt="Back" />
      </div>
    </div>
    <div class="details"><active-item-view /></div>
  </div>
</template>
