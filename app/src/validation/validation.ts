import { dbinsert } from "../insert/insertdb"

export function valimonth(month:number){
    console.log(month);
    if(month < 1 || 12 < month){
        throw 'Error: month コマンドの引数が正しくありません。1 ~ 12の数字を入れてください。'
    }else{
        console.log('month is ok')
    }
}

export function valirange(range:string){
    console.log(range);
    if(!range.match('month') && !range.match('day') && !range.match('long') && !range.match('all')){
        throw 'Error: range コマンドの引数が正しくありません。month か day か long か allを入れてください。'
    }else{
        console.log('range is ok')
    }
}

export function valistartmonth(startmonth:number){
    console.log(startmonth);
    if(startmonth < 1 || 12 < startmonth){
        throw 'Error: startmonth コマンドの引数が正しくありません。1 ~ 12の数字を入れてください。'
    }else{
        console.log('startmonth is ok')
    }
}

export function valiendmonth(endmonth:number){
    console.log(endmonth);
    if(endmonth < 1 || 12 < endmonth){
        throw 'Error: endmonth コマンドの引数が正しくありません。1 ~ 12の数字を入れてください。'
    }else{
        console.log('endmonth is ok')
    }
}

export function validay(day:number){
    console.log(day);
    if(day < 1 || 31 < day){
        throw 'Error: day コマンドの引数が正しくありません。1 ~ 31の数字を入れてください。'
    }else{
        console.log('day is ok')
    }
}