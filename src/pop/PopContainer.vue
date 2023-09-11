
<template>
  <div style = "display: block;  z-index: 8920788;">
    <component :is="com" :config = "props.param"></component>
  </div>
</template>

<script setup>
import {onMounted,onBeforeUnmount, ref} from "vue";
  import CarPop from "../pop/CarPop.vue"
  import BuildingPop from "../pop/BuildingPop.vue"
  let com = ref(null);
  let param2 = ref(null)
  let props = defineProps({
    type : String,
    param : Object,
    id : String
  })
  param2 = props.param
  if(props.type == "car"){
    com = CarPop
  }else if(props.type == "building"){
    com = BuildingPop
  }
  onMounted(()=>{
  })

  onBeforeUnmount(()=>{
    let containerDom = document.getElementById("mapContainer")
    let tmp = document.getElementById(props.id)
    containerDom.removeChild(tmp)
  })

  defineExpose({
    com : props.com
  })
</script>

<style>

</style>
