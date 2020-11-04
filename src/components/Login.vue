<template>
  <div class="uk-section uk-section-muted uk-margin">
    <div class="uk-container uk-text-center">
      <button type="button"
              class="uk-button uk-button-secondary"
              @click="showModal = true">
        Log in
      </button> <br />
      om reserveringen te kunnen zien en maken.
    </div>
  </div>
  <modal :show="showModal"
         @close="showModal = false">
    <div class="uk-form-stacked">

      <div class="uk-margin">
        <label class="uk-form-label" for="username">Gebruikersnaam</label>
        <div class="uk-flex">
          <input id="username"
                 v-model="username"
                 class="uk-input"
                 type="text"/>
        </div>
      </div>

      <div class="uk-margin">
        <label class="uk-form-label" for="username">Wachtwoord</label>
        <div class="uk-flex">
          <input id="password"
                 v-model="password"
                 class="uk-input"
                 type="password"/>
        </div>
      </div>
    </div>
    <div class="uk-flex uk-flex-nowrap">
      <button class="uk-button uk-button-primary" type="button" @click="login">Inloggen</button>
      <button class="uk-button uk-button-default uk-margin-left" type="button" @click="showModal = false">Annuleer</button>
    </div>
  </modal>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import modal from '@/components/Modal.vue'

export default defineComponent({
  components: {
    modal
  },

  setup () {
    return {
      username: ref(''),
      password: ref(''),
      showModal: ref(false)
    }
  }
})
</script>

<style scoped lang="scss">

</style>
