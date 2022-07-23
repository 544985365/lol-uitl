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
          </el-col>

          <el-col :span="12" style="background-color: black">

          </el-col>
        </el-row>

      </el-card>

    </el-col>
  </div>
</template>

<script>
import {ElNotification} from "element-plus";

export default {
  name: "UtilsView",
  data() {
    return {
      auto_accept: localStorage.getItem('auto_accept') === 'yes',
      auto_choose: localStorage.getItem('auto_choose') === 'yes',
      auto_choose_rank: false,
      auto_start_match_utils: false
    }
  },
  methods: {
    lisAccept(val) {
      let b = val ? 'yes' : 'no'
      localStorage.setItem('auto_accept', b)
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
