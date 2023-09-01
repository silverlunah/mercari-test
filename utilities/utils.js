/** Store all globally re-usable helpers here */

// --------------------------------------------- //
//                    Loggers                    //
// --------------------------------------------- //
export async function logInfo(message) {
    console.log("[Info] " + message)
}
export async function logDebug(message) {
    console.log("[Debug] " + message)
}
export async function logWarning(message) {
    console.log("[Warning] " + message)
}