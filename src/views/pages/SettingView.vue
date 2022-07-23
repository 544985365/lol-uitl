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

            <el-form-item label="自动选择位置">
              <el-select v-model="first_choose" class="m-2" placeholder="首要位置" filterable @change="lisFirstChoose">
                <el-option
                    v-for="item in firstPosition"
                    :key="item.position"
                    :label="item.name"
                    :value="item.position"
                />
              </el-select>
              <el-select v-model="second_choose" class="m-2" placeholder="次要位置" style="margin-left: 10px" @change="lisSecondChoose">
                <el-option
                    v-for="item in secondPosition"
                    :key="item.position"
                    :label="item.name"
                    :value="item.position"
                />
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
      selectVal: '无',
      first_choose: localStorage.getItem('choose_rank') == null ? '' : JSON.parse(localStorage.getItem('choose_rank')).firstPreference,
      second_choose: localStorage.getItem('choose_rank') == null ? '' : JSON.parse(localStorage.getItem('choose_rank')).secondPreference,
      secondPosition: [
        {
          position: 'TOP',
          name: '上路'
        },
        {
          position: 'JUNGLE',
          name: '打野'
        },
        {
          position: 'MIDDLE',
          name: '中路'
        },
        {
          position: 'BOTTOM',
          name: '射手'
        },
        {
          position: 'UTILITY',
          name: '辅助'
        },
        {
          position: 'FULL',
          name: '补位'
        }
      ],
      firstPosition: [
        {
          position: 'TOP',
          name: '上路'
        },
        {
          position: 'JUNGLE',
          name: '打野'
        },
        {
          position: 'MIDDLE',
          name: '中路'
        },
        {
          position: 'BOTTOM',
          name: '射手'
        },
        {
          position: 'UTILITY',
          name: '辅助'
        },
        {
          position: 'UNSELECTED',
          name: '补位'
        }
      ]
    }
  },
  methods: {
    select_auto_choose(val) {
      if (val != -1) {
        localStorage.setItem("choose_champ", val)
      } else {
        localStorage.removeItem('choose_champ')
      }
    },
    lisFirstChoose(val) {
      console.log(123);
      let choose_rank = localStorage.getItem('choose_rank')
      if (choose_rank != null) {
        let json = JSON.parse(choose_rank)
        json.firstPreference = val
        localStorage.setItem('choose_rank', JSON.stringify(json))
      } else {

        let json = {
          firstPreference: val,
          secondPreference: ''
        }
        localStorage.setItem('choose_rank', JSON.stringify(json))
      }
    },
    lisSecondChoose(val) {
      let choose_rank = localStorage.getItem('choose_rank')
      if (choose_rank != null) {
        let json = JSON.parse(choose_rank)
        json.secondPreference = val
        localStorage.setItem('choose_rank', JSON.stringify(json))
      } else {
        let json = {
          firstPreference: '',
          secondPreference: val
        }
        localStorage.setItem('choose_rank', JSON.stringify(json))
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
