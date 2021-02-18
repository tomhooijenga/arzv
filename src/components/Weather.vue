<template>
  <section :class="{'ban-active': weather && weather.ban.active}" class="weather-banner uk-background-muted">
    <div class="uk-flex uk-container uk-flex-between uk-text-nowrap weather">
      <weather-item :loading="!weather" icon="thermostat">
        <template v-slot:skeleton>
          1&deg;
        </template>
        <template v-slot>
          {{ weather.temperature.toFixed(0) }}&deg;
        </template>
      </weather-item>

      <weather-item :loading="!weather" icon="windsock">
        <template v-slot:skeleton>
          1 <small>Bft</small>
        </template>
        <template v-slot>
          <span>
            {{ weather.wind }} <small class="uk-text-light">Bft</small>
          </span>
        </template>
      </weather-item>

      <weather-item :loading="!weather" icon="air">
        <template v-slot:skeleton>
          1 <small>Bft</small>
        </template>
        <template v-slot>
          <span>
            {{ weather.gusts }} <small class="uk-text-light">Bft</small>
          </span>
        </template>
      </weather-item>

      <weather-item v-if="weather?.ban.active"
                    :loading="false"
                    class="uk-text-warning"
                    icon="warning"
                    @click="showBan = !showBan">
        <template v-slot:skeleton>
          Vaarverbod
          <Icon name="expand_more"/>
        </template>
        <template v-slot>
          Vaarverbod
          <Icon :name="showBan ? 'expand_less' : 'expand_more'"
                class="icon"/>
        </template>
      </weather-item>
    </div>

    <div v-if="showBan" class="ban-info uk-section-muted">
      <div class="uk-container uk-text-center uk-text-warning uk-margin-top uk-margin-bottom">
        Er geldt een vaarverbod vanaf {{ $formatDate(weather.ban.start, 'PP p') }}
      </div>
    </div>
  </section>
</template>

<script>
import { defineComponent } from 'vue'
import { useWeather } from '@/effects/use-weather'
import WeatherItem from '@/components/WeatherItem'
import Icon from '@/components/Icon.vue'

export default defineComponent({
  components: {
    WeatherItem,
    Icon
  },
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
  border-bottom: 1px solid $global-border;
  z-index: 1;
  transition: border-bottom-color .2s linear;
  height: 2rem;
  position: relative;
}

.ban-active {
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
  border-bottom: 1px solid $global-warning-background;
  z-index: 2;
  box-shadow: 0 2px 2px 0 rgb(0, 0, 0, 0.08)
}
</style>
