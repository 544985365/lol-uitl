import {ipcRenderer} from 'electron'
import LCU from 'lcu-events'
import https from 'https'
import fs from 'fs'
import * as path from "path";

const shelljs = require('shelljs')
const iconv = require("iconv-lite")


window.ipcRenderer = ipcRenderer
window.LCU = LCU
window.shelljs = shelljs
window.iconv = iconv
window.https = https
window.fs = fs
window.path = path
