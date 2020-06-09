<script>
import { Component, Vue } from 'vue-property-decorator';
import defaultWorkbookPreview from '../assets/workbook.png';
import { formatDistanceToNow, parseISO, format } from 'date-fns';
import ViewView from './ViewView.vue';

@Component({
  components: {
    'view-view': ViewView,
  },
})
export default class ActiveItemView extends Vue {
  get activeItem() {
    return this.$store.getters['tableau/activeItem'];
  }
  get createdAt() {
    if (!this.activeItem) return '';
    return format(parseISO(this.activeItem.createdAt), 'yyyy-MM-dd');
  }
  get href() {
    if (!this.activeItem) return undefined;
    return this.activeItem.webpageUrl;
  }
  get name() {
    if (!this.activeItem) return '';
    return this.activeItem.name;
  }
  get ownerName() {
    if (!this.activeItem || !this.activeItem.owner) return '';
    return this.activeItem.owner.fullName || this.activeItem.owner.name;
  }
  get previewImageSrc() {
    if (!this.activeItem) return defaultWorkbookPreview;
    const image = this.$store.state.tableau.workbooksPreviewImages[
      this.activeItem.id
    ];
    if (!image) return defaultWorkbookPreview;
    return `data:image/png;base64, ${image}`;
  }
  get projectDescription() {
    if (!this.activeItem || !this.activeItem.project) return '';
    return this.activeItem.project.description;
  }
  get projectName() {
    if (!this.activeItem || !this.activeItem.project) return '';
    return this.activeItem.project.name;
  }
  get updatedAgo() {
    if (!this.activeItem) return '';
    return formatDistanceToNow(parseISO(this.activeItem.updatedAt));
  }
  get views() {
    if (!this.activeItem) return [];
    const workbookData = this.$store.state.tableau.workbooksData[
      this.activeItem.id
    ];
    if (!workbookData) return [];
    return workbookData.views.view || [];
  }
  get workbookContentUrl() {
    if (!this.activeItem) return [];
    return this.activeItem.contentUrl;
  }
}
</script>
<style lang="scss" scoped>
.active-item-view {
  display: flex;
  flex-direction: column;
  text-decoration: none;
  color: #5f68ad;
  .preview-image {
    width: 100%;
  }
  .properties {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    font-size: 12px;
    justify-content: stretch;
    letter-spacing: 0.05em;
    line-height: 15px;
    width: 100%;
    .property {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      padding: 12px;
      width: 50%;
      .property-name {
        color: #2c3e50;
        text-transform: uppercase;
      }
      .property-value {
      }
    }
  }
  .views {
    width: 100%;
    .views-title {
      color: #2c3e50;
      text-align: center;
      text-transform: uppercase;
    }
  }
}
</style>
<template>
  <a
    class="active-item-view"
    :href="href"
    rel="noopener noreferrer"
    target="_blank"
    v-if="activeItem"
  >
    <img class="preview-image" :alt="name" :src="previewImageSrc" />
    <div class="properties">
      <div class="property">
        <div class="property-name">Updated</div>
        <div class="property-value">{{ updatedAgo }}</div>
      </div>
      <div class="property">
        <div class="property-name">Owner</div>
        <div class="property-value">{{ ownerName }}</div>
      </div>
      <div class="property">
        <div class="property-name">Created</div>
        <div class="property-value">{{ createdAt }}</div>
      </div>
      <div class="property">
        <div class="property-name">Project</div>
        <div class="property-value">{{ projectName }}</div>
      </div>
      <div class="project-description">{{ projectDescription }}</div>
      <ul class="views">
        <div class="views-title">Views</div>
        <view-view
          :key="view.id"
          :view="view"
          :workbook-content-url="workbookContentUrl"
          v-for="view in views"
        />
      </ul>
    </div>
  </a>
</template>
