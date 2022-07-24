<template>
  <div>
    <el-col>
      <el-row style="position: relative;top: 10px">
        <el-col :span="5">

          <el-image style="width: 130px;height: 130px" :src="summonerImg" alt="正在加载"></el-image>
        </el-col>

        <el-col :span="17" style="margin-left: 10px">
          <el-col style="margin-top: 5px">
            <span class="sum-msg">召唤师: &nbsp;&nbsp;{{ summoner.displayName }}</span>
          </el-col>

          <el-col style="margin-top: 5px">
            <span class="sum-msg">等级: &nbsp;&nbsp;{{ summoner.summonerLevel }}</span>
          </el-col>

          <el-col style="margin-top: 5px;width: 70%">
            <el-progress :percentage="xp"/>
          </el-col>

          <el-col style="margin-top: 5px">
            <span class="sum-msg">精粹: &nbsp;&nbsp;{{ ip }}</span>
          </el-col>
          <el-col style="margin-top: 5px">
            <span class="sum-msg">点券: &nbsp;&nbsp;{{ rp }}</span>
          </el-col>
        </el-col>
      </el-row>

      <el-col :span="24"
              style="position:relative;top: 20px;">

        <el-col>
          <el-form-item label="状态信息">
            <el-input @blur="setChatStats" v-model="chatStats['chat-status-message']" placeholder="状态"
                      style="width: 45%"></el-input>
          </el-form-item>

        </el-col>
        <el-col>
          <el-tooltip
              effect="dark"
              content="取最近十场比赛进行统计"
              placement="top-end"
          >
            <el-card shadow="hover">
              <el-row>
                <el-col :span="8" class="user-message">
                  <p>KDA: {{ kda.kd }}</p>
                  <p>平均助攻: {{ kda.assis }}</p>
                  <p>平均击杀: {{ kda.kills }}</p>
                  <p>平均死亡: {{ kda.deaths }}</p>
                  <p>双杀: {{ kda.doubleKills }}</p>
                  <p>三杀: {{ kda.tripleKills }}</p>


                </el-col>
                <el-col :span="8" class="user-message">
                  <p>四杀: {{ kda.quadraKills }}</p>
                  <p>五杀: {{ kda.pentaKills }}</p>
                  <p>一血: {{ kda.firstBloodKill }}</p>
                  <p>平均魔法伤害: {{ kda.magicDamageDealt }}</p>
                  <p>平均物理伤害: {{ kda.physicalDamageDealt }}</p>
                  <p>平均真实伤害: {{ kda.totalDamageDealt }}</p>

                </el-col>
                <el-col :span="8" class="user-message">
                  <p>平均击杀小兵: {{ kda.totalMinionsKilled }}</p>
                  <p>平均击杀野怪: {{ kda.creepsPerMinDeltas }}</p>
                  <p>平均获得金币: {{ kda.goldPerMinDeltas }}</p>
                  <p>胜率: {{ (kda.win *10)}}%</p>

                </el-col>
              </el-row>

            </el-card>
          </el-tooltip>

        </el-col>


      </el-col>

    </el-col>
  </div>
</template>

<script>
import {getToken} from "@/lcu/LcuApi";
import {https} from "@/lcu/LcuHttps";
import {calculate_kda} from "@/calculate/calculate";

export default {
  name: "SummonerView",
  data() {
    return {
      xp: 10,
      summoner: {},
      chatStats: {},
      summonerImg: '',
      rp: '',
      ip: '',
      kda: {
        kd: '',
        assis: '',
        kills: '',
        deaths: '',
        tripleKills: '',
        doubleKills: '',
        pentaKills: '',
        firstBloodKill: '',
        magicDamageDealt: '',
        physicalDamageDealt: '',
        quadraKills: '',
        totalDamageDealt: '',
        totalMinionsKilled: '',
        win: '',
        creepsPerMinDeltas: '',
        goldPerMinDeltas: ''
      }
    }
  },
  async mounted() {
    getToken().then(token => {
      https({
        url: '/lol-summoner/v1/current-summoner',
        type: 'GET'
      }, token).then(res => {
        this.summoner = res
        //console.log(res.accountId);
        this.xp =100- Math.trunc(res.xpUntilNextLevel / (res.xpSinceLastLevel + res.xpUntilNextLevel) * 100)
        this.summonerImg = 'https://dlied1.qq.com/lolapp/lol/summoner/profileicon/' + this.summoner.profileIconId + '.jpg'
        console.log(this.summoner.accountId)
        https({
          url: '/lol-match-history/v3/matchlist/account/' + this.summoner.accountId + '?begIndex=0&endIndex=10',
          type: 'GET'
        }, token).then(res => {
          //console.log(res);
          calculate_kda(res).then(temp=>{
            //console.log(temp)
            this.kda.kd = temp.kd
            this.kda.assis = temp.assis
            this.kda.kills = temp.kills
            this.kda.deaths = temp.deaths()
            this.kda.tripleKills = temp.tripleKills
            this.kda.doubleKills = temp.doubleKills
            this.kda.pentaKills = temp.pentaKills
            this.kda.firstBloodKill = temp.firstBloodKill
            this.kda.magicDamageDealt = temp.magicDamageDealt()
            this.kda.physicalDamageDealt = temp.physicalDamageDealt()
            this.kda.quadraKills = temp.quadraKills
            this.kda.totalDamageDealt = temp.totalDamageDealt()
            this.kda.totalMinionsKilled = temp.totalMinionsKilled()
            this.kda.win = temp.win()
            this.kda.creepsPerMinDeltas = temp.creepsPerMinDeltas()
            this.kda.goldPerMinDeltas = temp.goldPerMinDeltas()
          })


        })
      })

      https({
        url: '/lol-store/v1/wallet',
        type: 'GET'
      }, token).then(res => {
        this.rp = res.rp
        this.ip = res.ip
      })
      https({
        url: '/lol-chat/v1/settings',
        type: 'GET'
      }, token).then(res => {
        this.chatStats = res
      })
    })

  },
  methods: {
    setChatStats() {
      getToken().then(res => {
        https({
          url: '/lol-chat/v1/settings',
          type: 'PUT',
          body: this.chatStats
        }, res)
      })
    }
  }
}
</script>

<style scoped>
.sum-msg {
  color: #666;
  font-size: 14px;
}

.user-message {
  color: #666666;
}
</style>
