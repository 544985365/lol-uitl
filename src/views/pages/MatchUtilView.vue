<template>
  <div>
    <el-col>
      <el-button @click="sendMessage" plain v-if="sendMessageBtn">发送战绩信息</el-button>
      <el-table :data="participantsList" style="width: 100%">
        <el-table-column prop="name" label="召唤师" width="130"/>
        <el-table-column prop="challengeCrystalLevel" label="段位" width="120">
          <template #default="scope">

            <el-tag class="ml-2" type="info" v-if="scope.row.lol.challengeCrystalLevel == 'IRON'">黑铁</el-tag>
            <el-tag class="ml-2" type="info" v-if="scope.row.lol.challengeCrystalLevel == 'BRONZE'">青铜</el-tag>
            <el-tag class="ml-2" type="info" v-if="scope.row.lol.challengeCrystalLevel == 'SILVER'">白银</el-tag>
            <el-tag class="ml-2" type="info" v-if="scope.row.lol.challengeCrystalLevel == 'GOLD'">黄金</el-tag>
            <el-tag class="ml-2" type="info" v-if="scope.row.lol.challengeCrystalLevel == 'PLATINUM'">铂金</el-tag>
            <el-tag class="ml-2" type="info" v-if="scope.row.lol.challengeCrystalLevel == 'DIAMOND'">钻石</el-tag>
            <el-tag class="ml-2" type="info" v-if="scope.row.lol.challengeCrystalLevel == 'MASTER'">大师</el-tag>
            <el-tag class="ml-2" type="info" v-if="scope.row.lol.challengeCrystalLevel == 'GRANDMASTER'">宗师</el-tag>
            <el-tag class="ml-2" type="info" v-if="scope.row.lol.challengeCrystalLevel == 'CHALLENGER'">最强王者</el-tag>
            <el-tag class="ml-2" type="info" v-if="scope.row.lol.challengeCrystalLevel == 'UNRANKED'">无</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="120">
          <template #default="scope">
            <el-button @click="lookUserScope(scope.row.name)" size="small" type="info">查看战绩</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-col>

    <el-col>

    </el-col>
  </div>
</template>

<script>
import {getToken} from "@/lcu/LcuApi";
import {https} from "@/lcu/LcuHttps";
import {ref} from "vue";
import {ElLoading} from "element-plus";
import {getTemp} from "@/js/matchUtilInit";

const loading = ref(false)
export default {
  name: "MatchUtilView",
  data() {
    return {
      sendMessageBtn: localStorage.getItem('auto_send_message') === 'no',
      participantsList: [],
      romId: '',
      summonerIds: [],
      title: [
        {name: '上等马'},
        {name: '中等马'},
        {name: '下等马'},
        {name: '牛马'},
        {name: '马粪'},
      ]
    }
  },
  methods: {
    lookUserScope(name) {
      window.ipcRenderer.send("select-summoner-name", name)
    },
    sendMessage() {
      getToken().then(resp => {
        getTemp(this.summonerIds).then(arr => {
          console.log(arr);
          for (let i = 0; i < arr.length; i++) {

            let msg = this.title[i].name + "      " + arr[i].name + '     KDA:  ' + Math.round((arr[i].kd * 100) / 100) + "   近十场胜率:" + arr[i].win() + "0%"
            https({
              url: '/lol-chat/v1/conversations/' + this.romId + '/messages',
              type: 'POST',
              body: {
                'body': msg,
                'type': 'chat'
              }
            }, resp)
          }
        })

      })
    }
  },
  mounted() {

    loading.value = ElLoading.service({
      lock: true,
      text: '正在加载',
      background: 'rgba(0,0,0,0.7)'
    })

    let lcu = new window.LCU();
    lcu.events.on('/lol-champ-select-legacy/v1/session', (data) => {
      console.log(data)
    })

    getToken().then(resp => {
      https({
        url: '/lol-chat/v1/conversations',
        type: 'GET'
      }, resp).then(res => {
        //console.log(res);
        for (let i = 0; i < res.length; i++) {
          //console.log(res[i]);
          if (res[i].type === "championSelect") {
            this.romId = res[i].id
            https({
              url: '/lol-chat/v1/conversations/' + res[i].id + '/participants',
              type: 'GET'
            }, resp).then(res => {
              //console.log(res);
              this.participantsList = res
              for (let re of res) {
                this.summonerIds.push({name: re.name, summonerId: re.summonerId})
              }

            })
            break
          }
        }

      }).then(() => {
        if (localStorage.getItem('auto_send_message') === 'yes') {
          this.sendMessage()
        }
      })
      loading.value.close()
    })


  }
}
</script>

<style scoped>

</style>
