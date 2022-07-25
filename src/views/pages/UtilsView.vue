<template>
  <div>
    <el-col>
      <el-card shadow="hover" style="position: relative;top: 10px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="自动接受对局">
              <el-switch
                  @change="lisAccept"
                  v-model="auto_accept"
                  class="ml-2"
                  inline-prompt
                  style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949;"
                  active-text="开启"
                  inactive-text="关闭"
                  :width="80"
              />
            </el-form-item>

            <el-form-item label="自动选择英雄">
              <el-switch
                  @change="lisChoose"
                  v-model="auto_choose"
                  class="ml-2"
                  inline-prompt
                  style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949;"
                  active-text="开启"
                  inactive-text="关闭"
                  :width="80"
              />
            </el-form-item>
            <el-tooltip
                class="box-item"
                effect="dark"
                content="本选项配合创建对局使用,开启前请先到设置中选取位置"
                placement="top-end"
            >
              <el-form-item label="自动选择位置(排位)">
                <el-switch
                    @change="lisChooseRank"
                    v-model="auto_choose_rank"
                    class="ml-2"
                    inline-prompt
                    style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949;"
                    active-text="开启"
                    inactive-text="关闭"
                    :width="80"
                />
              </el-form-item>
            </el-tooltip>

            <el-form-item label="开启对局工具">
              <el-switch
                  @change="liAuto_start_match_utils"
                  v-model="auto_start_match_utils"
                  class="ml-2"
                  inline-prompt
                  style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949;"
                  active-text="开启"
                  inactive-text="关闭"
                  :width="80"
              />
            </el-form-item>

            <el-form-item label="自动发送战绩信息">
              <el-switch
                  @change="lisSendMessage"
                  v-model="auto_send_message"
                  class="ml-2"
                  inline-prompt
                  style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949;"
                  active-text="开启"
                  inactive-text="关闭"
                  :width="80"
              />
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="创建对局">
              <el-select v-model="matchListSelected" @change="createMatch">
                <el-option :value="item.value" v-for="item in matchList" :key="item.value" :label="item.label">
                </el-option>
              </el-select>
              <el-select v-model="matchListSSelected" @change="createMatchS">
                <el-option v-for="item in matchListS" :key="item.value" :label="item.label"
                           :value="item.value"></el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="状态伪造">
              <el-select v-model="stats.onlineModel" placeholder="在线状态">
                <el-option v-for="item in stats.online" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>

              <el-select v-model="stats.rankModel" placeholder="段位">
                <el-option v-for="item in stats.rank" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>

              <el-select v-model="stats.rankTypeModel" placeholder="段位类型">
                <el-option v-for="item in stats.rankType" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>

              <el-select v-model="stats.rankLevelModel" placeholder="段位等级">
                <el-option v-for="item in stats.rankLevel" :key="item" :label="item" :value="item">
                </el-option>
              </el-select>
              <el-button style="width: 75%" plain @click="changeStats">确认修改</el-button>
            </el-form-item>

          </el-col>
        </el-row>

      </el-card>

    </el-col>
  </div>
</template>

<script>
import {ElMessage, ElNotification} from "element-plus";
import {getToken} from "@/lcu/LcuApi";
import {https} from "@/lcu/LcuHttps";

export default {
  name: "UtilsView",
  data() {
    return {
      auto_accept: localStorage.getItem('auto_accept') === 'yes',
      auto_choose: localStorage.getItem('auto_choose') === 'yes',
      auto_choose_rank: localStorage.getItem('auto_choose_rank') === 'yes',
      auto_start_match_utils: localStorage.getItem('auto_start_match_utils') === 'yes',
      auto_send_message: localStorage.getItem('auto_send_message') === 'yes',
      matchList: [
        {label: '特殊对局', value: '0'},
        {label: '5V5训练模式', value: 'PRACTICETOOL'}
      ],
      matchListS: [
        {label: '普通对局', value: '0'},
        {label: '匹配模式', value: '430'},
        {label: '单双排位', value: '420'},
        {label: '灵活排位', value: '440'},
        {label: '大乱斗', value: '450'},
        {label: '云顶匹配', value: '1090'},
        {label: '云顶排位', value: '1100'},
      ],
      matchListSSelected: '0',
      matchListSelected: '0',
      stats: {
        onlineModel: '',
        online: [
          {label: '在线', value: 'chat'},
          {label: '离线', value: 'offline'},
          {label: '手机在线', value: 'mobile'},
          {label: '离开', value: 'away'},
        ],
        rankModel: '',
        rank: [
          {label: '坚韧黑铁', value: 'IRON'},
          {label: '英勇青铜', value: 'BRONZE'},
          {label: '不屈白银', value: 'SILVER'},
          {label: '荣耀黄金', value: 'GOLD'},
          {label: '华贵铂金', value: 'PLATINUM'},
          {label: '璀璨砖石', value: 'DIAMOND'},
          {label: '超凡大师', value: 'MASTER'},
          {label: '傲世宗师', value: 'GRANDMASTER'},
          {label: '最强王者', value: 'CHALLENGER'},
          {label: '没有段位', value: 'UNRANKED'},
        ],
        rankTypeModel: '',
        rankType: [
          {label: '单双排', value: 'RANKED_SOLO_5x5'},
          {label: '灵活组排5V5', value: 'RANKED_FLEX_SR'},
          {label: '云顶之弈', value: 'RANKED_TFT'},
        ],
        rankLevelModel: '',
        rankLevel: [
          'I', 'II', 'III', 'IV'
        ]
      }
    }
  },
  methods: {
    changeStats() {
      getToken().then(resp => {
        return https({
          url: '/lol-chat/v1/me',
          type: 'GET'
        }, resp)
      }).then(res => {
        if (this.stats.onlineModel !== '') {
          res.lol.availability = this.stats.onlineModel
        }
        if (this.stats.rankModel !== '') {
          res.lol.rankedLeagueTier = this.stats.rankModel
        }
        if (this.stats.rankTypeModel !== '') {
          res.lol.rankedLeagueQueue = this.stats.rankLevelModel
        }
        if (this.stats.rankLevelModel !== '') {
          res.lol.rankedLeagueDivision = this.stats.rankLevelModel
          res.lol.rankedPrevSeasonDivision = this.stats.rankLevelModel
        }

        getToken().then(resp => {
          https({
            url: '/lol-chat/v1/me',
            type: 'PUT',
            body: res
          }, resp).then(() => {
            ElMessage({
              message: '修改成功',
              type: 'success'
            })
          })
        })
      })
    },
    createMatchS(val) {
      if (val !== '0') {
        let body = {
          queueId: val
        }
        getToken().then(resp => {
          https({
            url: '/lol-lobby/v2/lobby',
            type: 'POST',
            body: body
          }, resp)
        })
      }
    },
    createMatch(val) {
      if (val !== '0') {
        let body = {
          "customGameLobby": {
            "configuration": {
              "gameMode": val,
              "gameMutator": "",
              "gameServerRegion": "",
              "mapId": 11,
              "mutators": {
                "id": 1
              },
              "spectatorPolicy": "AllAllowed",
              "teamSize": 5
            },
            "lobbyName": Buffer.from("test").toString('ucs-2'),
            "lobbyPassword": null
          },
          "isCustom": true
        }
        getToken().then(resp => {
          https({
            url: '/lol-lobby/v2/lobby',
            type: 'POST',
            body: body
          }, resp)
        })
      }
    },
    lisAccept(val) {
      let b = val ? 'yes' : 'no'
      localStorage.setItem('auto_accept', b)
    },
    lisSendMessage(val) {
      localStorage.setItem('auto_send_message', val ? 'yes' : 'no')
    },
    lisChoose(val) {
      if (val) {
        if (localStorage.getItem("choose_champ") === null) {
          ElNotification({
            title: '提示',
            message: '开启本选项前请先到设置中选择英雄',
            type: 'warning'
          })
          this.auto_choose = false
        } else {
          localStorage.setItem('auto_choose', 'yes')
        }
      } else {
        localStorage.setItem('auto_choose', 'no')
      }

    },
    lisChooseRank(val) {
      if (localStorage.getItem('choose_rank') === null) {
        this.auto_choose_rank = false
        ElNotification({
          title: '提示',
          message: '开启本选项前请先到设置中选择位置',
          type: 'warning'
        })
      } else {
        localStorage.setItem("auto_choose_rank", val ? 'yes' : 'no')
      }
    },
    liAuto_start_match_utils(val) {
      localStorage.setItem('auto_start_match_utils', val ? 'yes' : 'no')
    }
  }
}
</script>

<style scoped>

</style>
