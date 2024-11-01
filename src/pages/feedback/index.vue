<template>
  <div class="app-container padding-tabbar">
    <van-nav-bar title="帮助反馈" fixed />
    <div class="grow w-full flex flex-col p-4 items-center text-xl">
      <span>请在github上提交issue，告知不准确的联赛和具体场次，以便我改进算法。有什么好的思路也可以提出。</span>
      <a class="mt-3" href="https://github.com/czl0325/football_frontend" target="_blank" >跳转链接，给个star</a>
      <span class="mt-3 text-xl block text-left w-full text-blue-700">分析思路:</span>
      <div class="text-red-700 text-xl mt-3">
        以23/24英超第22轮利物浦主场对阵切尔西为例，利物浦赛前排名第一，积分48，切尔西赛前排名第10，积分31，每家公司开出初赔，初赔主队水位，客队水位，以及即时赔率，即时赔率主队水位，客队水位。<br>
        通过大数据找出历史比赛中，初赔同样让球，主客队水位相同的比赛(误差±0.015)，即时赔率同样让球，主客队水位相同的比赛，如果是联赛，且联赛赛程已经超过1/4，因为利物浦排名比切尔西高，再加入筛选条件主队排名高于客队的比赛，以及主队积分>=客队积分+(48-31)的比赛，最终将找到的所有比赛计算赢盘输盘的场次，来得出赢盘输盘的概率。
      </div>
      <span class="mt-3 text-xl block text-left w-full text-emerald-700">加群讨论</span>
      <van-image :src="getAssetsFile('wx.jpg')" class="pay"/>
      <span class="mt-3 text-xl block text-left w-full text-green-800">请作者吃碗沙茶面</span>
      <van-image :src="getAssetsFile('alipay.jpg')" class="pay" />
      <van-image :src="getAssetsFile('wxpay.jpg')" class="pay"/>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { getAssetsFile } from "@/utils/tools.ts"

defineOptions({
  name: "Feedback"
})
</script>

<style lang="less" scoped>
.pay {
  margin-top: 15px;
  width: 200px;
  height: 300px;
}
</style>
