<template>
  <div class="sm-div-graphic" style="pointer-events: all; display: block;  z-index: 8920788;">
    <div class="divpoint divpoint-theme-29baf1">
      <div class="label-wrap">
        <div class="pop-title">{{props.config.name || "aa"}}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
  let props = defineProps({
    config: Object
  })
</script>

<style scoped>
.divpoint {
  background: url(../assets/img/qipao3.png) no-repeat;
  background-size: cover;
  width: 116px;
  height: 120px;
}

.label-wrap {
  box-sizing: border-box;
  padding-top: 10px;
  padding-left: 51px;
}
</style>