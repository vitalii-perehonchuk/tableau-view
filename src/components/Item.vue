<script>
import distanceInWords from 'date-fns/formatDistanceToNow';
import parseISO from 'date-fns/parseISO';
import { Component, Vue, Prop } from 'vue-property-decorator';
import defaultWorkbookPreview from '../assets/workbook.png';
import User from './User.vue';

@Component({
  components: {
    user: User,
  },
})
export default class Item extends Vue {
  mounted() {
    if (!this.workbook) return;
    this.$store.dispatch('tableau/fetchWorkbook', this.workbook.id);
    this.$store.dispatch('tableau/fetchWorkbookPreviewImage', this.workbook.id);
  }
  get name() {
    if (!this.workbook) return '';
    return this.workbook.name;
  }
  get owner() {
    if (!this.workbook || !this.workbook.owner) return undefined;
    return this.workbook.owner;
  }
  get previewImageSrc() {
    if (!this.workbook) return defaultWorkbookPreview;
    const image = this.$store.state.tableau.workbooksPreviewImages[
      this.workbook.id
    ];
    if (!image) return defaultWorkbookPreview;
    return `data:image/png;base64, ${image}`;
  }
  get size() {
    if (!this.workbook) return '';
    return this.workbook.size;
  }
  get superTitle() {
    if (!this.workbook || !this.workbook.project) return '';
    return this.workbook.project.name;
  }
  get updatedAt() {
    if (!this.workbook) return '';
    return distanceInWords(parseISO(this.workbook.updatedAt), {
      addSuffix: true,
    });
  }
  @Prop(Object)
  workbook = undefined;
  get workbookData() {
    if (!this.workbook) return '';
    return this.$store.state.tableau.workbooksData[this.workbook.id];
  }
}
</script>
<style lang="scss" scoped>
.item {
  background-color: white;
  border-bottom: 1px solid #e5e6ff;
  // display: table-row;
  display: flex;
  flex-direction: row;
  height: 78px;
  // justify-content: stretch;
  text-align: left;
  width: 100%;
  .main-cell {
    display: flex;
    flex-basis: 400px;
    flex-direction: row;
    flex-grow: 5;
    .preview-image {
      height: 38px;
      margin: 20px;
      // width: 30px;
    }
    .main-cell-column {
      // display: table-cell;
      display: flex;
      flex-direction: column;
      .super-title {
        color: #5f68ad;
        font-size: 14px;
        font-weight: bold;
      }
      .title {
        color: #333333;
        font-weight: bold;
      }
      .size {
        display: flex;
        flex-direction: row;
        .size-number {
          margin-left: 6px;
        }
      }
    }
  }
  .owner,
  .updated-at {
    // display: table-cell;
    // display: flex;
    flex-basis: 180px;
    flex-grow: 0;
    line-height: 38px;
    padding: 20px;
    text-align: center;
  }
}
</style>
<template>
  <div class="item">
    <div class="main-cell">
      <img class="preview-image" alt="Preview image" :src="previewImageSrc" />
      <div class="main-cell-column">
        <div class="super-title">{{ superTitle }}</div>
        <div class="title">{{ name }}</div>
        <div class="size" title="Size">
          <img src="../assets/size.svg" alt="Size" />
          <div class="size-number">{{ size }}</div>
        </div>
      </div>
    </div>
    <div class="owner"><user :user="owner" v-if="owner" /></div>
    <div class="updated-at">{{ updatedAt }}</div>
  </div>
</template>
