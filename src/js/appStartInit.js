export function init() {
    if (localStorage.getItem('auto_accept') == null) {
        localStorage.setItem('auto_accept', 'no')
    }
    if (localStorage.getItem('auto_choose') == null) {
        localStorage.setItem('auto_choose', 'no')
    }
    if (localStorage.getItem('auto_start_match_utils') == null) {
        localStorage.setItem('auto_start_match_utils', 'no')
    }
    if (localStorage.getItem("auto_choose_rank") == null) {
        localStorage.setItem('auto_choose_rank', 'no')
    }
    if (localStorage.getItem("auto_send_message") == null) {
        localStorage.setItem('auto_send_message', 'no')
    }
}
