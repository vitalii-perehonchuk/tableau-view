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
  demaximize() {
    this.$store.commit('tableau/setInFocusedMode', false);
  }
  get isInFocusedMode() {
    return this.$store.state.tableau.isInFocusedMode;
  }
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
  max-width: 100vw;
  overflow: hidden;
  text-align: right;
  width: 100%;
  .items {
    background-color: #fafbff;
    border-top-color: #e5e6ff;
    border-top-style: solid;
    border-top-width: 1px;
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    max-width: 75vw;
    padding: 26px 60px;
    position: relative;
    .overlay {
      background-color: rgba(0, 0, 0, 0.25);
      bottom: 0px;
      left: 0px;
      position: fixed;
      right: 0px;
      top: 0px;
      z-index: 1;
    }
    .heading {
      color: #828282;
      cursor: pointer;
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
}
</style>
<template>
  <div class="home">
    <div class="items">
      <div class="overlay" @click="demaximize" v-if="isInFocusedMode"></div>
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
      <data-source-setup />
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
    <active-item-view />
  </div>
</template>
