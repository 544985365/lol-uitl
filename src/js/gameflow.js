import {getToken} from "@/lcu/LcuApi";
import {https} from "@/lcu/LcuHttps";

export async function gameFlow(data){
    if (data == 'ReadyCheck') {
        if (localStorage.getItem('auto_accept') === 'yes') {
            getToken().then(res => {
                https({
                    url: '/lol-matchmaking/v1/ready-check/accept',
                    type: 'POST'
                }, res)
            })
        }
    }
    if (data =='Lobby'){
        if (localStorage.getItem('auto_choose_rank') ==='yes'){
            getToken().then(res=>{
                https({
                    url: '/lol-lobby/v1/lobby/members/localMember/position-preferences',
                    type: 'PUT',
                    body: JSON.parse(localStorage.getItem('choose_rank'))
                },res)
            })
        }
    }
    if (data == 'ChampSelect') {
        if (localStorage.getItem('auto_choose') === 'yes') {
            getToken().then(res => {
                https({
                    url: '/lol-champ-select-legacy/v1/session/actions/1',
                    type: "PATCH",
                    body: {
                        "championId": localStorage.getItem('choose_champ'),
                        "id": 1
                    }
                }, res).then(() => {
                    https({
                        url: '/lol-champ-select-legacy/v1/session/actions/1/complete',
                        type: "POST",
                        body: {
                            "championId": localStorage.getItem('choose_champ'),
                            "id": 1
                        }
                    }, res)
                })
            })
        }

        if (localStorage.getItem('auto_start_match_utils') === 'yes') {
            window.ipcRenderer.send('MatchUtil')
        }

    } else {
        window.ipcRenderer.send('MatchUtilClose')
    }
}
