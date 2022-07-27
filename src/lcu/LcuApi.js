import LcuAuth from "@/lcu/LcuAuth";


const portRegex = /--app-port=([0-9]+)/
const passwordRegex = /--remoting-auth-token=([\w-_]+)/

export function getToken() {
    return  new Promise((resolve,reject)=>{
        //Get-CimInstance -Query "SELECT * from Win32_Process WHERE name LIKE 'LeagueClientUx.exe'" | Select-Object CommandLine | fl
        //Get-WmiObject Win32_Process -Filter "name='LeagueClientUx.exe'" | Select-Object CommandLIne
        //WMIC PROCESS WHERE name='LeagueClientUx.exe' GET commandline
        window.shelljs.exec("WMIC PROCESS WHERE name='LeagueClientUx.exe' GET commandline", {
            encoding: "base64",
            //shell: 'powershell'
        }, (code, data,error) => {
            //Get-CimInstance -Query "SELECT * from Win32_Process WHERE name LIKE 'LeagueClientUx.exe'" | Select-Object CommandLine | fl
            if (code == 0) {
                let strout = window.iconv.decode(window.iconv.encode(data, 'base64'), 'gb2312');
                strout = strout.replaceAll('\n','').replaceAll(' ','').replaceAll('\r','').trim()
                console.log(strout);
                const d = {
                    port: strout == '' ? '' : strout.match(portRegex)[1],
                    password: strout == '' ? '' : "Basic " + Buffer.from('riot:' + strout.match(passwordRegex)[1]).toString('base64'),
                }

                resolve(new LcuAuth(d.port,d.password))
            }else{
                reject(error)
            }
        })
    })
}

export default {getToken}
