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
.el-tabs__item {
	margin-bottom: 1px;
    height: 45px;
    box-sizing: border-box;
    line-height: 45px;
    display: inline-block;
    list-style: none;
    font-size: 14px;
    color: #333333;
    position: relative;
    width: 188px;
    text-align: center;
    background-color: #e6e6e6;
    border-radius: 1px;
    border-left: 1px solid #ccc;
}
.el-tabs__item.is-active {
    background-color: #fff;
    color: #333333;
}
.el-tabs__active-bar {
    height: 0px; 
}
.el-tabs__nav {
    border-top: 1px solid #ccc;
    border-right: 1px solid #ccc;
}
.el-upload{
	border: 1px dashed #e6e6e6;
}



</style>
