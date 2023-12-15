<template>
  <div class="app-container padding-tabbar">
    <van-nav-bar class="w-full" title="设置" fixed/>
    <van-cell-group title="赔率公司配置" class="w-full text-left" >
      <van-cell title="欧赔公司配置" is-link @click="showEuropePopover=true"/>
      <van-cell title="亚盘公司配置" is-link @click="showAsiaPopover=true"/>
      <van-cell title="大小球公司配置" is-link @click="showSizePopover=true"/>
    </van-cell-group>
    <van-popup v-model:show="showEuropePopover" position="bottom">
      <div class="w-full p-3">
        <van-checkbox-group v-model="checkEuropeCompanies" shape="square">
          <van-checkbox v-for="item in europeCompanies" :key="item.value" :name="item.value" square>{{ item.name }}</van-checkbox>
        </van-checkbox-group>
      </div>
    </van-popup>
    <van-popup v-model:show="showAsiaPopover" position="bottom">
      <div class="w-full p-3">
        <van-checkbox-group v-model="checkAsiaCompanies" shape="square">
          <van-checkbox v-for="item in asiaCompanies" :key="item.value" :name="item.value" square>{{ item.name }}</van-checkbox>
        </van-checkbox-group>
      </div>
    </van-popup>
    <van-popup v-model:show="showSizePopover" position="bottom">
      <div class="w-full p-3">
        <van-checkbox-group v-model="checkSizeCompanies" shape="square">
          <van-checkbox v-for="item in sizeCompanies" :key="item.value" :name="item.value" square>{{ item.name }}</van-checkbox>
        </van-checkbox-group>
      </div>
    </van-popup>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue"
import { useLocalStorage } from "@vueuse/core"
import { ASIA_COMPANY, EUROPE_COMPANY, SIZE_COMPANY } from "@/config.ts"

defineOptions({
  name: "Setting"
})
const showEuropePopover = ref(false)
const showAsiaPopover = ref(false)
const showSizePopover = ref(false)
const europeCompanies = useLocalStorage("europe", EUROPE_COMPANY)
const checkEuropeCompanies = useLocalStorage("check_europe", EUROPE_COMPANY.map((item: any) => item.value))
const asiaCompanies = useLocalStorage("asia", ASIA_COMPANY)
const checkAsiaCompanies = useLocalStorage("check_asia", ASIA_COMPANY.map((item: any) => item.value))
const sizeCompanies = useLocalStorage("size", SIZE_COMPANY)
const checkSizeCompanies = useLocalStorage("check_size", SIZE_COMPANY.map((item: any) => item.value))
</script>

<style lang="less" scoped>
:deep(.van-checkbox-group) {
  .van-checkbox + .van-checkbox {
    margin-top: 8px;
  }
}
</style>
