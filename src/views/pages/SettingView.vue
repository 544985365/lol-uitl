<template>
  <div>
    <el-col>
      <el-card shadow="hover">
        <el-row>
          <el-col :span="24">
            <el-form-item label="自动选择英雄">
              <el-select v-model="selectVal" no-data-text="请选择英雄" filterable @change="select_auto_choose">
                <el-option v-for="item in champList" :key="item.id" :value="item.id" :label="item.name">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="24"></el-col>
        </el-row>
      </el-card>
    </el-col>
  </div>
</template>

<script>
import {getToken} from "@/lcu/LcuApi";
import {https} from "@/lcu/LcuHttps";

export default {
  name: "SettingView",
  data() {
    return {
      champList: [],
      selectVal: '无'
    }
  },
  methods: {
    select_auto_choose(val) {
      if (val != -1) {
        localStorage.setItem("choose_champ", val)
      }else {
        localStorage.removeItem('choose_champ')
      }
    }
  },
  mounted() {
    getToken().then(res => {
      https({
        url: '/lol-game-data/assets/v1/champion-summary.json',
        type: 'GET'
      }, res).then(res => {
        this.champList = res
        if (localStorage.getItem('choose_champ') !== '-1') {
          for (let resKey of res) {
            if (resKey.id == Number(localStorage.getItem('choose_champ'))) {
              this.selectVal = resKey.name
              break
            }
          }
        }

      })
    })
  }
}

</script>

<style scoped>

</style>
