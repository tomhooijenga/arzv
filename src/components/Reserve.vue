<template>
    <section class="drawer"
         :class="{show: boats.length > 0, full: state.full}">
      <div :class="{'uk-background-primary': state.full, 'uk-light': state.full, 'uk-text-bold': state.full}">
        <div class="uk-container"
             @click="state.full = !state.full">
          <div class="uk-padding-small uk-padding-remove-horizontal">
            {{ boats.length === 1 ? '1 boot' : `${boats.length} boten`}} afschrijven
          </div>
        </div>
      </div>

      <div class="uk-container uk-overflow-auto">
        <boat-list>
          <boat v-for="boat in boats"
                :key="boat.name"
                :boat="boat"/>
        </boat-list>
      </div>
    </section>
</template>

<script>
import { defineComponent, reactive } from 'vue'
import boat from '@/components/Boat.vue'
import boatList from '@/components/BoatList.vue'

export default defineComponent({
  props: {
    boats: Array
  },

  components: {
    boat,
    boatList
  },

  setup () {
    const state = reactive({
      full: false
    })

    return {
      state
    }
  }
})
</script>

<style lang="scss" scoped>
  .drawer {
    position: fixed;
    width: 100%;
    background: white;
    box-shadow: 0 -2px 8px rgba(0,0,0,0.08);
    bottom: 0;
    transform: translateY(100%);
    transition: transform .2s ease-in-out, height .2s ease-in-out;
    height: 54px;
  }

  .show {
    transform: translateY(0);
  }

  .full {
    height: 100vh;
  }

  .boats {
    height: calc(100vh - 54px);
  }
</style>
