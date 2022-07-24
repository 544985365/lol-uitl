import {getToken} from "@/lcu/LcuApi";
import {https} from "@/lcu/LcuHttps";
import {calculate_kda} from "@/calculate/calculate";

export async function getTemp(data) {
    return new Promise((resolve, reject) => {
        getToken().then(async resp => {
            let arr = new Array();
            for (let summonerId of data) {
                await https({
                    url: '/lol-match-history/v3/matchlist/account/' + summonerId.summonerId + '?begIndex=0&endIndex=10',
                    type: 'GET'
                }, resp).then(res => {
                    calculate_kda(res).then(temp => {
                        temp.name = summonerId.name
                        //console.log(res)
                        arr.push(temp)
                    })
                })
            }
            arr = arr.sort((a, b) => {
                return a.kd - b.kd
            })
            resolve(arr)
        }).catch(err => {
            reject(err)
        })

    })
}
