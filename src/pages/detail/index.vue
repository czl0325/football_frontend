<template>
  <div class="app-container">
    <van-nav-bar title="详细分析" fixed placeholder left-arrow/>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue"
import { useRoute } from "vue-router"
import { getMatchInfo } from "@/http/api/football.ts"
import { IMatchInfo } from "@/models/match.ts"

defineOptions({
  name: "MatchDetail"
})
const route = useRoute()
const match = ref<IMatchInfo>({})
if (route.query.fid) {
  getMatchInfo(route.query.fid as string).then(res => {
    match.value = res
  })
}
</script>

<style lang="scss" scoped>

</style>
