<template>
  <div class="app-container padding-tabbar">
    <van-nav-bar class="w-full" title="设置" fixed/>
    <div class="w-full overflow-y-auto grow">
      <van-cell-group title="赔率公司配置" class="w-full text-left" >
        <van-cell title="欧赔公司配置" is-link @click="showEuropePopover=true"/>
        <van-cell title="亚盘公司配置" is-link @click="showAsiaPopover=true"/>
        <van-cell title="大小球公司配置" is-link @click="showSizePopover=true"/>
      </van-cell-group>
      <van-cell-group title="组合配置" class="w-full text-left" >
        <van-cell title="亚盘组合大小球">
          <template #right-icon>
            <van-switch v-model="asiaCompose" :active-value="1" :inactive-value="0"/>
          </template>
        </van-cell>
        <van-cell title="大小球组合亚盘">
          <template #right-icon>
            <van-switch v-model="sizeCompose" :active-value="1" :inactive-value="0"/>
          </template>
        </van-cell>
      </van-cell-group>
      <van-cell-group title="优化方案" class="w-full text-left" >
        <van-cell title="亚盘剔除非主流赔率" label="个别公司开出的让球数和主流不一致，不匹配这些公司">
          <template #right-icon>
            <van-switch v-model="asiaNonMainstream" :active-value="1" :inactive-value="0"/>
          </template>
        </van-cell>
        <van-cell title="大小球剔除非主流赔率" label="个别公司开出的大小球数和主流不一致，不匹配这些公司">
          <template #right-icon>
            <van-switch v-model="sizeNonMainstream" :active-value="1" :inactive-value="0"/>
          </template>
        </van-cell>
        <van-cell title="不匹配友谊赛">
          <template #right-icon>
            <van-switch v-model="noFriendMatch" :active-value="1" :inactive-value="0"/>
          </template>
        </van-cell>
      </van-cell-group>
      <!--    <van-cell-group title="匹配配置" class="w-full text-left" >-->
      <!--      <van-cell title="不准确联赛" label="勾选后将不会匹配该联赛的数据" is-link @click="showMatchPopover=true"/>-->
      <!--    </van-cell-group>-->
    </div>
    <span class="w-full block text-center my-2" style="color: #ff5252">当前版本:{{ APP_VERSION }}</span>
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
    <van-popup v-model:show="showMatchPopover" position="bottom">
      <div class="w-full" style="height: 80vh">
        <no-compare-match />
      </div>
    </van-popup>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue"
import { useLocalStorage } from "@vueuse/core"
import { APP_VERSION, ASIA_COMPANY, EUROPE_COMPANY, SIZE_COMPANY } from "@/config.ts"
import NoCompareMatch from "@/pages/setting/src/NoCompareMatch.vue"

defineOptions({
  name: "Setting"
})
const showEuropePopover = ref(false)
const showAsiaPopover = ref(false)
const showSizePopover = ref(false)
const showMatchPopover = ref(false)
const europeCompanies = useLocalStorage("europe", EUROPE_COMPANY)
const checkEuropeCompanies = useLocalStorage("check_europe", EUROPE_COMPANY.map((item: any) => item.value))
const asiaCompanies = useLocalStorage("asia", ASIA_COMPANY)
const checkAsiaCompanies = useLocalStorage("check_asia", ASIA_COMPANY.map((item: any) => item.value))
const sizeCompanies = useLocalStorage("size", SIZE_COMPANY)
const checkSizeCompanies = useLocalStorage("check_size", SIZE_COMPANY.map((item: any) => item.value))
const asiaCompose = useLocalStorage("asia_compose", 0)
const sizeCompose = useLocalStorage("size_compose", 0)
const asiaNonMainstream = useLocalStorage("asia_nonMainstream", 1)
const sizeNonMainstream = useLocalStorage("size_nonMainstream", 1)
const noFriendMatch = useLocalStorage("no_friend_match", 1)
</script>

<style lang="less" scoped>
:deep(.van-checkbox-group) {
  .van-checkbox + .van-checkbox {
    margin-top: 8px;
  }
}
</style>
