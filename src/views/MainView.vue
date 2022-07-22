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
      <el-menu-item index="4" @click="this.$router.push({path:'/match-query'})">战绩查询</el-menu-item>
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
import {getToken} from "@/lcu/LcuApi";
import {https} from "@/lcu/LcuHttps";

const loading = ref(false)
export default {
  name: "MainView",
  data() {
    return {
      activePage: '1'
    }
  },
  mounted() {
    if (localStorage.getItem('auto_accept') == null) {
      localStorage.setItem('auto_accept', 'no')
    }

    if (localStorage.getItem('auto_choose') == null) {
      localStorage.setItem('auto_choose', 'no')
    }
    if (localStorage.getItem('auto_start_match_utils') == null) {
      localStorage.setItem('auto_start_match_utils', 'no')
    }


    this.main_loading()
    const lcu = new window.LCU();
    lcu.wsEvents.on('connect', () => {
      this.main_loading_close()
    })

    lcu.wsEvents.on('disconnect', () => {
      this.main_loading()
    })

    lcu.events.on('/lol-gameflow/v1/gameflow-phase', (data) => {
      if (data == 'ReadyCheck') {
        if (localStorage.getItem('auto_accept') === 'yes') {
          getToken().then(res => {
            https({
              url: '/lol-matchmaking/v1/ready-check/accept',
              type: 'POST'
            }, res)
          })
        }
      }
      if (data == 'ChampSelect') {
        if (localStorage.getItem('auto_choose') === 'yes') {
          getToken().then(res => {
            https({
              url: '/lol-champ-select-legacy/v1/session/actions/1',
              type: "PATCH",
              body: {
                "championId": localStorage.getItem('choose_champ'),
                "id": 1
              }
            }, res).then(() => {
              https({
                url: '/lol-champ-select-legacy/v1/session/actions/1/complete',
                type: "POST",
                body: {
                  "championId": localStorage.getItem('choose_champ'),
                  "id": 1
                }
              }, res)
            })
          })
        }

        if (localStorage.getItem('auto_start_match_utils') === 'yes'){
          window.ipcRenderer.send('MatchUtil')
        }
      }else {
        window.ipcRenderer.send('MatchUtilClose')
      }


    })
  },
  methods: {
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
