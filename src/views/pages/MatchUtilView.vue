<template>
  <div>
    <el-col>
      <el-button>发送战绩信息</el-button>
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
            <el-button @click="lookUserScope(scope.row.summonerId)" size="small" type="info">查看战绩</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-col>
  </div>
</template>

<script>
import {getToken} from "@/lcu/LcuApi";
import {https} from "@/lcu/LcuHttps";

export default {
  name: "MatchUtilView",
  data() {
    return {
      participantsList: []
    }
  },
  methods: {
    lookUserScope(id) {
      console.log(id)
    }
  },
  mounted() {
    getToken().then(resp => {
      https({
        url: '/lol-chat/v1/conversations',
        type: 'GET'
      }, resp).then(res => {
        //console.log(res);
        for (let i = 0; i < res.length; i++) {
          //console.log(res[i]);
          if (res[i].type === "championSelect") {
            https({
              url: '/lol-chat/v1/conversations/' + res[i].id + '/participants',
              type: 'GET'
            }, resp).then(res => {
              console.log(res);
              this.participantsList = res
            })
            break
          }
        }

      })
    })
  }
}
</script>

<style scoped>

</style>
