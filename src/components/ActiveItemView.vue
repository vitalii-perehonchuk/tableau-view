<script>
import format from 'date-fns/format';
import formatDistanceToNow from 'date-fns/formatDistanceToNow';
import parseISO from 'date-fns/parseISO';
import { Component, Vue } from 'vue-property-decorator';
import defaultWorkbookPreview from '../assets/workbook.png';
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
  get classes() {
    return this.isInFocusedMode ? 'focused' : '';
  }
  get createdAt() {
    if (!this.activeItem) return '';
    return format(parseISO(this.activeItem.createdAt), 'yyyy-MM-dd');
  }
  handleResize(event) {
    this.width = window.innerWidth - event.pageX;
  }
  handleResizeEnd(event) {
    event.preventDefault();
    document.removeEventListener('mousemove', this.handleResize);
    localStorage.setItem('active-item-view-width', this.width);
  }
  handleResizeStart(event) {
    event.preventDefault();
    document.addEventListener('mousemove', this.handleResize);
  }
  get href() {
    if (!this.activeItem) return undefined;
    return this.activeItem.webpageUrl;
  }
  isInEditMode = false;
  get isInFocusedMode() {
    return this.$store.state.tableau.isInFocusedMode;
  }
  mounted() {
    this.width = Number.parseInt(
      localStorage.getItem('active-item-view-width'),
    );
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
  get style() {
    if (!this.isInFocusedMode) {
      return undefined;
    }
    return {
      width: `${this.width}px`,
    };
  }
  toggleEdit(event) {
    event.preventDefault();
    this.isInEditMode = !this.isInEditMode;
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
  width = 300;
  get workbookContentUrl() {
    if (!this.activeItem) return [];
    return this.activeItem.contentUrl;
  }
}
</script>
<style lang="scss" scoped>
.active-item-view {
  background-color: white;
  color: #5f68ad;
  display: flex;
  flex-direction: column;
  flex-grow: 0;
  height: 100vh;
  position: relative;
  text-decoration: none;
  width: 25vw;
  &.focused {
    position: absolute;
    right: 0px;
    top: 0px;
    width: 75vw;
    z-index: 2;
  }
  .drag-control {
    cursor: ew-resize;
    height: 100vh;
    left: -10px;
    position: absolute;
    width: 20px;
  }
  .edit-button {
    align-items: center;
    background-color: #ffede6;
    border-style: none;
    border-radius: 4px;
    color: #fe7043;
    display: flex;
    font-weight: bold;
    font-size: 10px;
    height: 24px;
    justify-content: space-around;
    line-height: 20px;
    text-transform: uppercase;
    width: 100px;
  }
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
      flex-wrap: wrap;
      justify-content: space-between;
      padding: 12px;
      width: 50%;
      .property-name {
        color: #2c3e50;
        text-transform: uppercase;
      }
    }
  }
  .project-description {
    max-width: 100%;
    padding-left: 16px;
    text-align: left;
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
    :class="classes"
    :href="href"
    ref="activeItemView"
    rel="noopener noreferrer"
    :style="style"
    target="_blank"
    title="Open in Tableau"
    v-if="activeItem"
  >
    <div
      class="drag-control"
      @click.prevent
      @mousedown="handleResizeStart"
      @mouseup="handleResizeEnd"
      title="Resize"
      v-if="isInFocusedMode"
    ></div>
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
    </div>
    <div
      class="project-description"
      :contenteditable="isInEditMode"
      @click.stop.prevent
    >
      {{ projectDescription }}
    </div>
    <button class="edit-button" @click.stop="toggleEdit">
      <img src="../assets/tool.svg" /><span>Edit source</span>
    </button>
    <ul class="views">
      <div class="views-title">Views</div>
      <view-view
        :key="view.id"
        :view="view"
        :workbook-content-url="workbookContentUrl"
        v-for="view in views"
      />
    </ul>
  </a>
</template>
