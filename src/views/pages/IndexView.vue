<template>
  <div>
    <el-button @click="test">test</el-button>
    <el-button @click="testClose">test2</el-button>
  </div>
</template>

<script>
export default {
  name: "IndexView",
  methods:{
    test(){
      window.ipcRenderer.send("MatchUtil")
    },
    testClose(){
      window.ipcRenderer.send('MatchUtilClose')
    }
  },
  mounted() {

  }
}
</script>

<style scoped>

</style>
