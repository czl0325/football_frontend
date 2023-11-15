<template>
  <div class="item-container">
    <div class="header">
      <span>{{ match.match_group }}</span>
    </div>
    <div class="content">
      <span class="team">{{ match.home_team }}</span>
      <span class="score">{{ match.field_score ?? "vs" }}</span>
      <span class="team">{{ match.visit_team }}</span>
    </div>
    <div class="footer">
      <router-link :to="`/detail?fid=${match.fid}`">
        <van-button type="primary" size="small" >分析</van-button>
      </router-link>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useRouter } from "vue-router"
import { IMatchInfo } from "@/models/match.ts"

defineOptions({
  name: "MatchItem"
})
defineProps<{
  match: IMatchInfo
}>()
const router = useRouter()
</script>

<style lang="less" scoped>
.item-container {
  background-color: white;
  border-radius: 8px;
  box-shadow: 10px 10px 10px #E5E5E5;
  margin: 20px auto;
  width: 95%;
  display: flex;
  flex-direction: column;
  .header {
    display: flex;
    align-items: center;
    padding: 8px 15px;
    border-bottom: 1px solid #E5E5E5;
    font-size: 18px;
    font-weight: bold;
  }
  .content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 15px;
    .score {
      width: 60px;
      flex-shrink: 0;
      text-align: center;
    }
    .team {
      flex: 1;
      text-align: right;
      &:first-child {
        text-align: left;
      }
    }
  }
  .footer {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    border-top: 1px solid #E5E5E5;
    padding: 8px 15px;
  }
}
</style>
