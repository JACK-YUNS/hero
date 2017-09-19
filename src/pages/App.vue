<template>
  <div class="view-page">
    <left-slide></left-slide>
    <main-content>
      <keep-alive>
        <router-view v-if="$route.meta.keepAlive">
          <!-- 这里是会被缓存的视图组件，比如 Home！ -->
        </router-view>
      </keep-alive>

      <router-view v-if="!$route.meta.keepAlive">
        <!-- 这里是不被缓存的视图组件，比如 Edit！ -->
      </router-view>
    </main-content>
  </div>
</template>
<script type="text/javascript">
  import {mainContent, leftSlide} from 'components'

  export default{
    name: 'page',
    components: {
      mainContent,
      leftSlide
    }
  }
</script>
