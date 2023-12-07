<template>
  <div class="app-container">
    <van-nav-bar title="帮助反馈" fixed placeholder />
    <div class="grow w-full flex flex-col p-4">
      <span>请在github上提交issue，告知不准确的联赛和具体场次，以便我改进算法。有什么好的思路也可以提出。</span>
      <a class="mt-3" href="https://github.com/czl0325/football_frontend" target="_blank" >跳转链接，给个star。后续根据star开放分析权限</a>
    </div>
  </div>
</template>

<script lang="ts" setup>
defineOptions({
  name: "Feedback"
})
</script>

<style lang="less" scoped>

</style>
