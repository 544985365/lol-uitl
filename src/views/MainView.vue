<template>
  <div>
    <el-menu
        :default-active="activePage"
        class="el-menu-demo"
        mode="horizontal"
    >
      <el-menu-item index="1" @click="this.$router.push({path:'/index'})">主页</el-menu-item>
      <el-menu-item index="2" @click="this.$router.push({path:'/summoner'})">召唤师信息</el-menu-item>
      <el-menu-item index="3" @click="this.$router.push({path:'/utils'})">工具</el-menu-item>
      <el-menu-item index="4" @click="showQuery">战绩查询</el-menu-item>
      <el-menu-item index="5" @click="this.$router.push({path:'/setting'})">设置</el-menu-item>
    </el-menu>

    <el-col style="height: 485px">
      <router-view/>
    </el-col>
  </div>
</template>

<script>
import {ElLoading} from "element-plus";
import {ref} from "vue";
import {gameFlow} from "@/js/gameflow";
import {init} from "@/js/appStartInit";

const loading = ref(false)
export default {
  name: "MainView",
  data() {
    return {
      activePage: '1'
    }
  },
  mounted() {
    window.ipcRenderer.on('mainView-show', () => {
      //console.log(123123)
      this.showQuery()
    })

    init()
    this.main_loading()
    const lcu = new window.LCU();
    lcu.wsEvents.on('connect', () => {
      this.main_loading_close()
    })

    lcu.wsEvents.on('disconnect', () => {
      this.main_loading()
    })

    lcu.events.on('/lol-gameflow/v1/gameflow-phase', (data) => {
      gameFlow(data)
    })
  },
  methods: {
    showQuery() {
      this.$router.push({path: '/match-query'})
    },
    main_loading() {
      loading.value = ElLoading.service({
        lock: true,
        text: '等待英雄联盟运行',
        background: 'rgba(0,0,0,0.7)'
      })
    },
    main_loading_close() {
      loading.value.close()
    }

  }
}
</script>

<style scoped>

</style>
