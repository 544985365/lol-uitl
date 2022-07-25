<template>
  <div>
    <el-card style="position:relative;top: 10px" shadow="hover">
      <el-row :gutter="20">
        <el-col :span="12" :offset="6" style="text-align: center">
          <p>请输入召唤师名</p>
          <el-input v-model="summonerName"></el-input>
          <el-button plain style="width: 100%" @click="query">查询</el-button>
        </el-col>
      </el-row>
      <el-col style="margin-top: 10px" v-if="matchList.length !== 0">
        <el-button @click="gameMode = ''">查看所有对局</el-button>
        <el-button @click="gameMode = 'CLASSIC'">查看排位对局</el-button>
        <el-button @click="gameMode = 'ARAM'">查看大乱斗对局</el-button>
      </el-col>
      <el-col style="margin-top: 10px">
        <div v-for="(item,index) in matchList" :key="item.gameId">
          <el-collapse v-show="show(item.gameType,item.gameMode)">
            <el-collapse-item
                :title="'对局时间:'+formatDate(item.gameCreationDate)+'&nbsp;&nbsp;&nbsp;对局类型:'+getGameModeName(item.gameMode)+'&nbsp;&nbsp;&nbsp;'+getKda(item)"
                :name="index">
              <el-descriptions title="详细信息" border size="small" :column="4" direction="vertical">
                <el-descriptions-item label="是否胜利">{{
                    item.participants[0].stats.win ? '是' : '否'
                  }}
                </el-descriptions-item>

                <el-descriptions-item label="所选英雄">{{
                    getChampNameById(item.participants[0].championId)
                  }}
                </el-descriptions-item>
                <el-descriptions-item label="击杀">{{ item.participants[0].stats.kills }}</el-descriptions-item>
                <el-descriptions-item label="助攻">{{ item.participants[0].stats.assists }}</el-descriptions-item>
                <el-descriptions-item label="死亡">{{ item.participants[0].stats.deaths }}</el-descriptions-item>
                <el-descriptions-item label="游戏持续时间">{{ Math.trunc(item.gameDuration / 60) }}分钟</el-descriptions-item>
                <el-descriptions-item label="英雄等级">{{ item.participants[0].stats.champLevel }}</el-descriptions-item>
                <el-descriptions-item label="对防御塔伤害">{{ item.participants[0].stats.damageDealtToTurrets }}
                </el-descriptions-item>
                <el-descriptions-item label="双杀">{{ item.participants[0].stats.doubleKills }}</el-descriptions-item>
                <el-descriptions-item label="三杀">{{ item.participants[0].stats.tripleKills }}</el-descriptions-item>
                <el-descriptions-item label="四杀">{{ item.participants[0].stats.quadraKills }}</el-descriptions-item>
                <el-descriptions-item label="五杀">{{ item.participants[0].stats.pentaKills }}</el-descriptions-item>
                <el-descriptions-item label="一血">{{
                    item.participants[0].stats.firstBloodKill ? '是' : '否'
                  }}
                </el-descriptions-item>
                <el-descriptions-item label="一塔">{{
                    item.participants[0].stats.firstTowerKill ? '是' : '否'
                  }}
                </el-descriptions-item>
                <el-descriptions-item label="获得金币">{{ item.participants[0].stats.goldEarned }}</el-descriptions-item>
                <el-descriptions-item label="花掉金币">{{ item.participants[0].stats.goldSpent }}</el-descriptions-item>
                <el-descriptions-item label="大杀特杀">{{
                    item.participants[0].stats.killingSprees
                  }}次
                </el-descriptions-item>
                <el-descriptions-item label="最长存活时间">{{
                    item.participants[0].stats.longestTimeSpentLiving
                  }}
                </el-descriptions-item>
                <el-descriptions-item label="造成魔法伤害">{{
                    item.participants[0].stats.magicDamageDealt
                  }}
                </el-descriptions-item>
                <el-descriptions-item label="对英雄造成魔法伤害">{{
                    item.participants[0].stats.magicDamageDealtToChampions
                  }}
                </el-descriptions-item>
                <el-descriptions-item label="造成物理伤害">{{
                    item.participants[0].stats.physicalDamageDealt
                  }}
                </el-descriptions-item>
                <el-descriptions-item label="对英雄造成物理伤害">{{
                    item.participants[0].stats.physicalDamageDealtToChampions
                  }}
                </el-descriptions-item>
                <el-descriptions-item label="购买真眼">{{
                    item.participants[0].stats.sightWardsBoughtInGame
                  }}
                </el-descriptions-item>
                <el-descriptions-item label="放置守卫">{{ item.participants[0].stats.wardsPlaced }}</el-descriptions-item>
                <el-descriptions-item label="排除守卫">{{ item.participants[0].stats.wardsKilled }}</el-descriptions-item>
                <el-descriptions-item label="野怪击杀数量">{{
                    item.participants[0].stats.neutralMinionsKilled
                  }}
                </el-descriptions-item>
                <el-descriptions-item label="总伤害">{{
                    item.participants[0].stats.totalDamageDealt
                  }}
                </el-descriptions-item>
                <el-descriptions-item label="对英雄总伤害">{{
                    item.participants[0].stats.totalDamageDealtToChampions
                  }}
                </el-descriptions-item>
                <el-descriptions-item label="补兵数">{{
                    item.participants[0].stats.totalMinionsKilled
                  }}
                </el-descriptions-item>
                <el-descriptions-item label="造成真实伤害">{{
                    item.participants[0].stats.trueDamageDealt
                  }}
                </el-descriptions-item>
                <el-descriptions-item label="对英雄造成真实伤害">{{
                    item.participants[0].stats.trueDamageDealtToChampions
                  }}
                </el-descriptions-item>
                <el-descriptions-item label="击杀防御塔">{{
                    item.participants[0].stats.turretKills
                  }}
                </el-descriptions-item>
                <el-descriptions-item label="分路">{{ item.participants[0].timeline.lane }}</el-descriptions-item>
              </el-descriptions>
            </el-collapse-item>
          </el-collapse>
        </div>

      </el-col>
    </el-card>


  </div>
</template>

<script>
import {getToken} from "@/lcu/LcuApi";
import {https} from "@/lcu/LcuHttps";
import {ElMessage} from "element-plus";

export default {
  name: "MatchQueryView",
  data() {
    return {
      token: '',
      summonerName: '',
      matchList: [],
      gameType: 'MATCHED_GAME',
      gameMode: '',
      champList: []
    }
  },
  methods: {
    show(gameType, gameMode) {
      if (gameType !== this.gameType) {
        return false
      }
      if (this.gameMode === '') {
        return true
      } else {
        return gameMode === this.gameMode
      }
      // eslint-disable-next-line no-unreachable
      return true
    },
    getChampNameById(id) {
      for (let i = 0; i < this.champList.length; i++) {
        if (id === this.champList[i].id) {
          return this.champList[i].name
        }
      }
    },
    getKda(item) {
      let temp = item.participants[0].stats
      return temp.kills + '/' + temp.deaths + '/' + temp.assists
    },
    getGameModeName(gameMode) {
      switch (gameMode) {
        case "ARAM":
          return '大乱斗'
        case 'CLASSIC':
          return 'rank'
        default:
          return '其他类型'
      }
    },
    formatDate(date) {
      let d = new Date(date),
          month = '' + (d.getMonth() + 1),
          day = '' + d.getDate(),
          year = d.getFullYear(),
          hour = '' + d.getHours(),
          minutes = '' + d.getMinutes()
      if (minutes.length < 2) minutes = '0' + minutes
      if (hour.length < 2) hour = '0' + hour
      if (month.length < 2) month = '0' + month;
      if (day.length < 2) day = '0' + day;

      return [year, month, day].join('-') + '   ' + [hour, minutes].join(':');
    },
    query() {
      getToken().then(token => {
        https({
          url: '/lol-summoner/v1/summoners?name=' + encodeURI(this.summonerName),
          type: 'GET'
        }, token).then(res => {
          //console.log(res);
          if (res.httpStatus === 404) {
            ElMessage({
              message: '未找到召唤师',
              type: 'warning'
            })
          } else {
            return res.summonerId
          }
        }).then(res => {
          return https({
            url: '/lol-match-history/v3/matchlist/account/' + res + "?begIndex=0&endIndex=20",
            type: 'GET'
          }, token)
        }).then(res => {
          //console.log(res);
          this.matchList = res.games.games
        })
      })
    }
  },
  mounted() {

    window.ipcRenderer.on('select-summoner-name-renderer', (event, args) => {
      //console.log(12333333333333);
      this.summonerName = args
      this.query()
    })

    getToken().then(resp => {
      this.token = resp
      https({
        url: '/lol-game-data/assets/v1/champion-summary.json',
        type: 'GET'
      }, resp).then(res => {
        this.champList = res
        //cname = res.name + " " + res.title
      })
    })
  }
}
</script>

<style scoped>

</style>
