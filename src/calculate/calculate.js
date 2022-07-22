import {Match} from "@/calculate/Match";

export function calculate_kda(res) {
    //console.log(res);
    let arr = formatJson(res)
    let kd = [], assis = [], kills = [], deaths = [], magicDamageDealt = [], physicalDamageDealt = [],
        totalDamageDealt = [], totalMinionsKilled = [], win = [],
        creepsPerMinDeltas = [], goldPerMinDeltas = []
    let doubleKills = 0, firstBloodKill = 0, tripleKills = 0, pentaKills = 0, quadraKills = 0


    for (let i = 0; i < arr.length; i++) {
        kd.push((arr[i].kills + arr[i].assists) / arr[i].deaths)
        assis.push(arr[i].deaths)
        kills.push(arr[i].kills)
        deaths.push(arr[i].deaths)
        tripleKills = tripleKills + arr[i].tripleKills
        doubleKills = doubleKills + arr[i].doubleKills
        pentaKills = pentaKills + arr[i].pentaKills
        firstBloodKill = firstBloodKill + arr[i].firstBloodKill
        magicDamageDealt.push(arr[i].magicDamageDealt)
        physicalDamageDealt.push(arr[i].physicalDamageDealt)
        quadraKills = quadraKills + arr[i].quadraKills
        totalDamageDealt.push(arr[i].totalDamageDealt)
        totalMinionsKilled.push(arr[i].totalMinionsKilled)
        win.push(arr[i].win)
        creepsPerMinDeltas.push(arr[i].creepsPerMinDeltas)
        goldPerMinDeltas.push(arr[i].goldPerMinDeltas)
    }

    let responseData = {
        kd: kd.length == 0 ? [] : () => {
            let a = 0
            for (let i = 0; i < kd.length; i++) {
                a = a + kd[i]
            }
            return a / kd.length

        },
        assis: assis.length == 0 ? [] : () => {
            let a = 0
            for (let i = 0; i < assis.length; i++) {
                a = a + assis[i]
            }
            return a / assis.length
        },
        kills: kills.length == 0 ? [] : () => {
            let a = 0
            for (let i = 0; i < kills.length; i++) {
                a = a + kills[i]
            }
            return a / kills.length
        },
        deaths: deaths.length == 0 ? [] : () => {
            let a = 0
            for (let i = 0; i < deaths.length; i++) {
                a = a + deaths[i]
            }
            return a / deaths.length
        },
        magicDamageDealt: magicDamageDealt.length == 0 ? [] : () => {
            let a = 0
            for (let i = 0; i < magicDamageDealt.length; i++) {
                a = a + magicDamageDealt[i]
            }
            return a / magicDamageDealt.length
        },
        physicalDamageDealt: physicalDamageDealt.length == 0 ? [] : () => {
            let a = 0
            for (let i = 0; i < physicalDamageDealt.length; i++) {
                a = a + physicalDamageDealt[i]
            }
            return a / physicalDamageDealt.length
        },
        totalDamageDealt: totalDamageDealt.length == 0 ? [] : () => {
            let a = 0
            for (let i = 0; i < totalDamageDealt.length; i++) {
                a = a + totalDamageDealt[i]
            }
            return a / totalDamageDealt.length
        },
        totalMinionsKilled: totalMinionsKilled.length == 0 ? [] : () => {
            let a = 0
            for (let i = 0; i < totalMinionsKilled.length; i++) {
                a = a + totalMinionsKilled[i]
            }
            return a / totalMinionsKilled.length
        },
        creepsPerMinDeltas: creepsPerMinDeltas.length == 0 ? [] : () => {
            let a = 0
            for (let i = 0; i < creepsPerMinDeltas.length; i++) {
                if (creepsPerMinDeltas[i]['0-10'] === creepsPerMinDeltas[i]['0-10'] && creepsPerMinDeltas[i]['0-10'] != undefined) {
                    a += creepsPerMinDeltas[i]['0-10']
                }
                if (creepsPerMinDeltas[i]['10-20'] === creepsPerMinDeltas[i]['10-20'] && creepsPerMinDeltas[i]['10-20'] != undefined) {
                    a += creepsPerMinDeltas[i]['10-20']
                }
            }
            return a / (creepsPerMinDeltas.length * 2)
        },
        goldPerMinDeltas: goldPerMinDeltas.length == 0 ? [] : () => {
            let a = 0
            for (let i = 0; i < goldPerMinDeltas.length; i++) {
                if (goldPerMinDeltas[i]['0-10'] === goldPerMinDeltas[i]['0-10'] && goldPerMinDeltas[i]['0-10'] != undefined) {
                    a += Math.trunc(goldPerMinDeltas[i]['0-10'])
                }
                if (goldPerMinDeltas[i]['10-20'] === goldPerMinDeltas[i]['10-20'] && goldPerMinDeltas[i]['10-20'] != undefined) {
                    a += Math.trunc(goldPerMinDeltas[i]['10-20'])
                }
            }
            //console.log(a)
            //console.log(a / (goldPerMinDeltas.length * 2))

            return a / (goldPerMinDeltas.length * 2)
        },
        win: win.length == 0 ? [] : () => {
            let a = 0
            for (let i = 0; i < win.length; i++) {
                if (win[i]) {
                    a++
                }
            }
            return a
        },
        doubleKills: doubleKills,
        firstBloodKill: firstBloodKill,
        tripleKills: tripleKills,
        pentaKills: pentaKills,
        quadraKills: quadraKills,
    }

    return responseData

}

export function formatJson(res) {
    let arr = new Array()
    let matchList = res.games.games
    for (let i = 0; i < matchList.length; i++) {
        let match = new Match()
        match.accountId = matchList[i].participantIdentities[0].player.accountId
        match.summonerName = matchList[i].participantIdentities[0].player.summonerName
        match.gameDuration = matchList[i].gameDuration
        match.gameCreationDate = matchList[i].gameCreationDate
        match.gameMode = matchList[i].gameMode
        match.gameType = matchList[i].gameType
        match.mapId = matchList[i].mapId
        match.championId = matchList[i].participants[0]
        match.assists = matchList[i].participants[0].stats.assists
        match.causedEarlySurrender = matchList[i].participants[0].stats.causedEarlySurrender
        match.champLevel = matchList[i].participants[0].stats.champLevel
        match.damageDealtToTurrets = matchList[i].participants[0].stats.damageDealtToTurrets
        match.damageSelfMitigated = matchList[i].participants[0].stats.damageSelfMitigated
        match.deaths = matchList[i].participants[0].stats.deaths
        match.doubleKills = matchList[i].participants[0].stats.doubleKills
        match.earlySurrenderAccomplice = matchList[i].participants[0].stats.earlySurrenderAccomplice
        match.firstBloodAssist = matchList[i].participants[0].stats.firstBloodAssist
        match.firstBloodKill = matchList[i].participants[0].stats.firstBloodKill
        match.firstTowerAssist = matchList[i].participants[0].stats.firstTowerAssist
        match.firstTowerKill = matchList[i].participants[0].stats.firstTowerKill
        match.gameEndedInEarlySurrender = matchList[i].participants[0].stats.gameEndedInEarlySurrender
        match.gameEndedInSurrender = matchList[i].participants[0].stats.gameEndedInSurrender
        match.goldEarned = matchList[i].participants[0].stats.goldEarned
        match.goldSpent = matchList[i].participants[0].stats.goldSpent
        match.killingSprees = matchList[i].participants[0].stats.killingSprees
        match.kills = matchList[i].participants[0].stats.kills
        match.largestKillingSpree = matchList[i].participants[0].stats.largestKillingSpree
        match.longestTimeSpentLiving = matchList[i].participants[0].stats.longestTimeSpentLiving
        match.magicDamageDealt = matchList[i].participants[0].stats.magicDamageDealt
        match.magicDamageDealtToChampions = matchList[i].participants[0].stats.magicDamageDealtToChampions
        match.neutralMinionsKilled = matchList[i].participants[0].stats.neutralMinionsKilled
        match.neutralMinionsKilledEnemyJungle = matchList[i].participants[0].stats.neutralMinionsKilledEnemyJungle
        match.neutralMinionsKilledTeamJungle = matchList[i].participants[0].stats.neutralMinionsKilledTeamJungle
        match.pentaKills = matchList[i].participants[0].stats.pentaKills
        match.physicalDamageDealt = matchList[i].participants[0].stats.physicalDamageDealt
        match.physicalDamageDealtToChampions = matchList[i].participants[0].stats.physicalDamageDealtToChampions
        match.quadraKills = matchList[i].participants[0].stats.quadraKills
        match.sightWardsBoughtInGame = matchList[i].participants[0].stats.sightWardsBoughtInGame
        match.totalDamageDealt = matchList[i].participants[0].stats.totalDamageDealt
        match.totalDamageDealtToChampions = matchList[i].participants[0].stats.totalDamageDealtToChampions
        match.totalHeal = matchList[i].participants[0].stats.totalHeal
        match.totalMinionsKilled = matchList[i].participants[0].stats.totalMinionsKilled
        match.totalScoreRank = matchList[i].participants[0].stats.totalScoreRank
        match.totalTimeCrowdControlDealt = matchList[i].participants[0].stats.totalTimeCrowdControlDealt
        match.tripleKills = matchList[i].participants[0].stats.tripleKills
        match.trueDamageDealt = matchList[i].participants[0].stats.trueDamageDealt
        match.trueDamageDealtToChampions = matchList[i].participants[0].stats.trueDamageDealtToChampions
        match.turretKills = matchList[i].participants[0].stats.turretKills
        match.wardsKilled = matchList[i].participants[0].stats.wardsKilled
        match.wardsPlaced = matchList[i].participants[0].stats.wardsPlaced
        match.win = matchList[i].participants[0].stats.win
        match.creepsPerMinDeltas = matchList[i].participants[0].timeline.creepsPerMinDeltas
        match.goldPerMinDeltas = matchList[i].participants[0].timeline.goldPerMinDeltas
        match.lane = matchList[i].participants[0].timeline.lane
        match.role = matchList[i].participants[0].timeline.role
        match.xpPerMinDeltas = matchList[i].participants[0].timeline.xpPerMinDeltas
        match.queueId = matchList[i].queueId
        match.seasonId = matchList[i].seasonId
        match.team = matchList[i].team
        arr.push(match)
    }

    return arr
}

export default {calculate_kda, formatJson}
