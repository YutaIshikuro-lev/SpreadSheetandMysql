import { number } from "yargs";

const tsuru = 2;
const kame = 4;

var kamecon:number;
var tsurucon:number;

var atama = 5;
var ashi = 16;
// n 頭
// m 足
function kamekeisan (n: number, m:number) :number {
    kamecon = m / kame | 0
    return kamecon;
}
function tsurukeisan (n: number, m:number) :number {
    kamecon = m / kame | 0
    tsurucon = n - kamecon
    return tsurucon;
}
console.log('亀' + kamekeisan(atama,ashi) + "鶴" + tsurukeisan(atama,ashi));
