<template>
  <div class="uk-section uk-section-muted uk-margin-small">
    <div class="uk-container uk-text-center">
      <button class="uk-button uk-button-secondary uk-margin-small-bottom"
              type="button"
              @click="state.showModal = true">
        Log in
      </button>
      <br/>
      om reserveringen te kunnen zien en maken.
    </div>
  </div>
  <modal :show="state.showModal"
         @close="state.showModal = false">
    <p v-if="state.error" class="uk-text-danger">Ongeldige gebruikersnaam of wachtwoord</p>

    <form class="uk-form-stacked"
          @submit.prevent="login">
      <div class="uk-margin">
        <label class="uk-form-label" for="username">Gebruikersnaam</label>
        <div class="uk-flex">
          <input id="username"
                 v-model="state.username"
                 class="uk-input"
                 type="text"
                 required/>
        </div>
      </div>

      <div class="uk-margin">
        <label class="uk-form-label" for="password">Wachtwoord</label>
        <div class="uk-flex">
          <input id="password"
                 v-model="state.password"
                 class="uk-input"
                 type="password"
                 required/>
        </div>
      </div>

      <div class="uk-flex uk-flex-nowrap">
        <button class="uk-button uk-button-primary" type="submit">Inloggen</button>
        <button class="uk-button uk-button-default uk-margin-left" type="button" @click="state.showModal = false">
          Annuleer
        </button>
      </div>
    </form>

    <div v-if="state.loading"
         class="uk-overlay-default uk-position-cover uk-flex">
      <div class="spinner uk-margin-auto uk-margin-auto-vertical"></div>
    </div>
  </modal>
</template>

<script lang="ts">
import { defineComponent, reactive } from 'vue'
import modal from '@/components/Modal.vue'
import { authenticate } from '@/arzv'

export default defineComponent({
  components: {
    modal
  },

  emits: ['authenticate'],

  setup (_, { emit }) {
    const state = reactive({
      username: '',
      password: '',
      error: false,
      loading: false,
      showModal: false
    })

    async function login () {
      state.loading = true
      try {
        const result = await authenticate(state.username, state.password)

        if (result.success) {
          state.error = false
          state.showModal = false
          emit('authenticate', { token: result.token, id: result.id })
        } else {
          state.error = true
        }
      } finally {
        state.loading = false
      }
    }

    return {
      state,
      login
    }
  }
})
</script>

<style lang="scss" scoped>
.uk-section {
  position: sticky;
  top: 0;
  z-index: 1;
}

.spinner {
  display: inline-block;
  width: 2rem;
  height: 2rem;
  vertical-align: text-bottom;
  border: .25em solid #1e87f0;
  border-right-color: transparent;
  border-radius: 50%;
  animation: spinner-border .75s linear infinite;
}

@keyframes spinner-border {
  to {
    transform: rotate(360deg);
  }
}
</style>
