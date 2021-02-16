<template>
  <section class="weather-banner" :class="{'ban-active': weather && weather.ban.active}">
    <transition name="fade">
      <section v-if="weather" class="uk-flex uk-container uk-text-nowrap weather">
        <span class="uk-flex uk-flex-auto uk-flex-middle uk-flex-center">
          <Icon class="icon" name="thermostat"/>
          <span>
            {{ weather.temperature.toFixed(0) }}&deg;
          </span>
        </span>

          <span class="uk-flex uk-flex-auto uk-flex-middle uk-flex-center">
          <Icon class="icon" name="windsock"/>
          <span>
            {{ weather.wind }} <small>Bft</small>
          </span>
        </span>

          <span class="uk-flex uk-flex-auto uk-flex-middle uk-flex-center">
          <Icon class="icon" name="air"/>
          <span>
            {{ weather.gusts }} <small>Bft</small>
          </span>
        </span>

        <span class="uk-flex uk-flex-auto uk-flex-middle uk-flex-center uk-text-warning"
              v-if="weather.ban.active"
                @click="showBan = !showBan" >
          <Icon class="icon" name="warning"/>
          <span>Vaarverbod</span>
          <Icon :name="showBan ? 'expand_less' : 'expand_more'"
                class="icon"/>
        </span>
      </section>
    </transition>

    <div v-if="showBan" class="ban-info">
      <div class="uk-container uk-text-center uk-text-warning uk-margin-top uk-margin-bottom">
        Er geldt een vaarverbod vanaf {{ $formatDate(weather.ban.start, 'PP p') }}
      </div>
    </div>
  </section>
</template>

<script>
import { defineComponent } from 'vue'
import { useWeather } from '@/effects/use-weather'
import Icon from '@/components/Icon'

export default defineComponent({
  components: { Icon },
  setup () {
    const { weather, showBan } = useWeather()

    return {
      weather,
      showBan
    }
  }
})
</script>

<style lang="scss" scoped>
@import "@/assets/theme";

.weather-banner {
  border-bottom: 1px solid transparent;
  background: white;
  z-index: 1;
  transition: border-bottom-color .2s linear;
  height: 2rem;

}

.ban-active {
  position: sticky;
  top: 0;
  border-bottom-color: $global-warning-background;
}

.weather {
  height: 2rem;
}

.ban-info {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: white;
  border-bottom: 1px solid $global-warning-background;
  z-index: 2;
  box-shadow: 0 2px 2px 0 rgb(0, 0, 0, 0.08)
}

.icon {
  font-size: 1.5rem;
  margin-right: 0.5rem;
}
</style>
