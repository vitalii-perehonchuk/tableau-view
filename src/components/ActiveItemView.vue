<script>
import { Component, Vue } from 'vue-property-decorator';
import defaultWorkbookPreview from '../assets/workbook.png';

@Component
export default class ActiveItemView extends Vue {
  get activeItem() {
    return this.$store.getters['tableau/activeItem'];
  }
  get name() {
    if (!this.activeItem) return '';
    return this.activeItem.name;
  }
  get previewImageSrc() {
    if (!this.activeItem) return defaultWorkbookPreview;
    const image = this.$store.state.tableau.workbooksPreviewImages[
      this.activeItem.id
    ];
    if (!image) return defaultWorkbookPreview;
    return `data:image/png;base64, ${image}`;
  }
}
</script>
<style lang="scss" scoped>
.active-item-view {
  .preview-image {
    width: 100%;
  }
}
</style>
<template>
  <div class="active-item-view" v-if="activeItem">
    <img class="preview-image" :alt="name" :src="previewImageSrc" />
  </div>
</template>
