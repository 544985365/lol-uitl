
export class Match{
    accountId

    summonerName
    //游戏开始时间
    gameCreationDate
    //游戏持续时间 分钟
    gameDuration
    gameId
    gameMode
    gameType
    mapId
    championId
    //助攻
    assists
    //是否提前投降
    causedEarlySurrender
    //英雄等级
    champLevel
    //对防御塔伤害
    damageDealtToTurrets
    //自我缓和伤害
    damageSelfMitigated
    //死亡
    deaths
    //双杀次数
    doubleKills
    //提前投降时  是否点击投降
    earlySurrenderAccomplice
    //是否一血助攻
    firstBloodAssist
    //是否一血
    firstBloodKill
    //一血塔助攻
    firstTowerAssist
    //一血塔
    firstTowerKill
    //提前投降
    gameEndedInEarlySurrender
    //投降
    gameEndedInSurrender

    //获得金币
    goldEarned
    //花掉金币
    goldSpent
    //大杀特杀次数
    killingSprees

    kills
    //最多多杀
    largestKillingSpree
    //最长存活时间
    longestTimeSpentLiving
    //造成魔法伤害
    magicDamageDealt
    //对英雄造成魔法伤害
    magicDamageDealtToChampions
    //野怪击杀数量
    neutralMinionsKilled
    //敌方野区野怪击杀数量
    neutralMinionsKilledEnemyJungle
    //我方野区野怪击杀数量
    neutralMinionsKilledTeamJungle
    //五杀
    pentaKills
    //造成物理伤害
    physicalDamageDealt
    //对英雄造成物理伤害
    physicalDamageDealtToChampions
    //四杀
    quadraKills
    //购买真眼
    sightWardsBoughtInGame
    //造成总伤害
    totalDamageDealt
    //对英雄造成总伤害
    totalDamageDealtToChampions
    //总回复
    totalHeal
    //补兵数
    totalMinionsKilled
    //排位加分
    totalScoreRank
    //总控制时间
    totalTimeCrowdControlDealt
    //三杀
    tripleKills
    //造成真实伤害
    trueDamageDealt
    //对英雄造成真实伤害
    trueDamageDealtToChampions
    //击杀防御塔
    turretKills
    //排除真眼
    wardsKilled
    //摆放真眼
    wardsPlaced
    //是否胜利
    win
    //每分钟击杀小兵   json   { '0-10' : 123}
    creepsPerMinDeltas
    //每分钟造成伤害 json
    damageTakenPerMinDeltas
    //每分钟金币
    goldPerMinDeltas
    //分路
    lane
    //
    role
    //每分钟经验获得
    xpPerMinDeltas
    queueId
    seasonId
    //数组
    team


    constructor() {
    }
}

