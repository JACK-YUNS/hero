<template>
  <section class="body-warp">
    <transition name="fade" mode="out-in">
      <router-view></router-view>
    </transition>
  </section>
</template>
<script type="text/javascript">
  export default {
    name: 'app'
  }
</script>
<style lang="scss" type="text/scss" rel="stylesheet/scss">
  @import '~assets/scss/main';

  .fade-enter-active,
  .fade-leave-active {
    transition: all .2s ease;
  }

  .fade-enter,
  .fade-leave-active {
    opacity: 0;
  }
  input[type="file"] {
    display: none;
}
.form-group .note-image-input{
	display: block;
}
.radio, .checkbox {
    position: relative;
    display: inline-block;
    margin-top: 0px;
    margin-bottom: 10px;
}

</style>
