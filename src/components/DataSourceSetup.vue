<script>
import { Component, Vue } from 'vue-property-decorator';
import Modal from './Modal.vue';

@Component({
  components: {
    modal: Modal,
  },
})
export default class DataSourceSetup extends Vue {
  closeModal() {
    this.isModalOpen = false;
  }
  isModalOpen = false;
  openModal() {
    this.isModalOpen = true;
  }
  password = '';
  async save(event) {
    event.preventDefault();
    await this.$store.dispatch('tableau/signIn', {
      password: this.password,
      url: this.url,
      user: this.user,
    });
    await this.$store.dispatch('tableau/fetchWorkbooks');
    this.closeModal();
  }
  url = '';
  user = '';
}
</script>
<style lang="scss" scoped>
.data-source-setup {
  display: flex;
  .trigger {
    background-color: #f5f6ff;
    border-radius: 4px;
    color: #92b0ff;
    padding: 8px 17px;
  }
  .modal-contents {
    background-color: white;
    margin: 0 auto;
    min-width: 460px;
    padding: 1vw 1vh;
    position: relative;
    text-align: left;
    .close {
      position: absolute;
      right: 1vw;
      top: 1vh;
    }
    form {
      display: flex;
      flex-direction: column;
      align-items: stretch;
    }
  }
}
</style>
<template>
  <div class="data-source-setup">
    <button class="btn btn-light trigger" @click="openModal">
      + New Template
    </button>
    <modal v-if="isModalOpen">
      <div class="modal-contents">
        <button
          type="button"
          class="close"
          @click="closeModal"
          aria-label="Close"
        >
          <span aria-hidden="true">&times;</span>
        </button>
        <form @submit="save">
          <div class="form-group">
            <h1>Tableau credentials</h1>
          </div>
          <div class="form-group">
            <label for="inputUrl">URL</label>
            <input
              autocomplete="url"
              class="form-control"
              id="inputUrl"
              placeholder="Enter URL"
              required
              type="url"
              v-model="url"
            />
          </div>
          <div class="form-group">
            <label for="inputEmail">Email address</label>
            <input
              autocomplete="email"
              class="form-control"
              id="inputEmail"
              placeholder="Enter email"
              required
              type="email"
              v-model="user"
            />
          </div>
          <div class="form-group">
            <label for="inputPassword">Password</label>
            <input
              autocomplete="current-password"
              class="form-control"
              id="inputPassword"
              placeholder="Password"
              required
              type="password"
              v-model="password"
            />
          </div>
          <button type="submit" class="btn btn-primary submit-button">
            Submit
          </button>
        </form>
      </div>
    </modal>
  </div>
</template>
