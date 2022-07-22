//const reg = /<div class="main_txt">(([sS])*?)<\/div>/

import {jsonp} from "vue-jsonp";

const httpOptions = {
    //cert: fs.readFileSync("../a.pem")
    rejectUnauthorized: false,
}

export async function https(options, lcuAuth) {
    return await new Promise((resolve, reject) => {
        //console.log(url)
        const req = window.https.request({
            host: '127.0.0.1',
            port: lcuAuth.port,
            path: options.url,
            method: options.type,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': lcuAuth.token
            },
            agent: new window.https.Agent(httpOptions)
        }, (res) => {
            //console.log(res)
            let s = '';
            res.on('data', (data) => {
                s += data
            })
            res.on('end', () => {
                try {
                    let obj = JSON.parse(s)
                    resolve(obj)
                } catch (err) {
                    console.log(err);
                    resolve(s)
                }


            })
        })
        if (options.body != undefined) {
            req.write(Buffer.from(JSON.stringify(options.body)))
        }
        req.on('error', (err) => {
            reject(err)
        })
        req.end()
    })
}

export async function httpsRank(options) {

    return await new Promise((resolve, reject) => {

        if (options.type === 0) {
            jsonp("https://www.lolhelper.cn", {

                callbackName: ''
            }).then(res => {
                resolve(res)
            }).catch(err => {
                reject(err)
            })
        }
    })

}

export async function httpsImg(options, lcuAuth) {
    return await new Promise((resolve, reject) => {
        //console.log(url)
        const req = window.https.request({
            host: '127.0.0.1',
            port: lcuAuth.port,
            path: options.url,
            method: options.type,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': lcuAuth.token
            },
            agent: new window.https.Agent(httpOptions)
        }, (res) => {
            let s = new Array();
            let temp = 0
            res.on('data', (data) => {
                //console.log(data)
                s[temp] = data
                temp++
            })
            //console.log(s)
            res.on('end', () => {
                const bf = Buffer.concat(s)
                //console.log(bf)
                resolve(bf)
            })
        })
        req.on('error', (err) => {
            reject(err)
        })
        req.end()
    })

}
