<template>
  <div class="map-screen-pop-layout">
    <div class="map-screen-pop-left-container">
      <div v-for="(val , key , index) in leftPops">
        <div style="width: 100%;height:160px;">
          <bv-border-box name="border1">
            <div class="border-content">
              <div>id : {{val.data.id}}</div>
            </div>
          </bv-border-box>
        </div>
      </div>

    </div>
    <div class="map-screen-pop-right-container">
      <div v-for="(val , key , index) in rightPops">
        <div style="width: 100%;height:160px;">
          <bv-border-box name="border1">
            <div class="border-content">
              <div>id : {{val.data.id}}</div>
            </div>
          </bv-border-box>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
  import {onMounted , ref} from "vue";

  let props = defineProps({
    screenManager : Object
  })
  let leftPops = ref([])
  let rightPops = ref([])

  let testLeft = ref([])
  testLeft.value.push({
    id : 123
  })
  testLeft.value.push({
    id : 1234
  })
  testLeft.value.push({
    id : 1235
  })
  // 初始化
  onMounted(()=>{
    props.screenManager.onChange = ()=>{
      let leftTmpArr = []
      let rightTmpArr = []
      for (const id in  props.screenManager.leftPopMap) {
        leftTmpArr.push(props.screenManager.leftPopMap[id])
      }
      for (const id in props.screenManager.rightPopMap) {
        rightTmpArr.push(props.screenManager.rightPopMap[id])
      }
      leftPops.value = leftTmpArr
      rightPops.value = rightTmpArr
    }
  })
</script>

<style scoped>
  .map-screen-pop-layout{
    width: 100vw;
    height: 100vh;
    position: absolute;
    z-index: 99999;
  }

  .map-screen-pop-left-container{
    width: 200px;
    height: 900px;
    margin-top: 10vh;
    margin-left: 5px;
    float: left;
  }

  .map-screen-pop-right-container{
    width: 200px;
    height: 900px;
    margin-top: 10vh;
    margin-right: 5px;
    float: right;
  }

  .border-content{
    padding: 10px;
    width: 90%;
    margin: auto;
    height: 100%;
  }

</style>
