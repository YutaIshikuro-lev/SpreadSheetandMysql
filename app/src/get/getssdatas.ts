import { GoogleSpreadsheet } from "google-spreadsheet";
import * as dotenv from "dotenv";
import yargs from 'yargs';

import { dbinsert } from "../insert/insertdb"
import {valimonth, valirange, valistartmonth, valiendmonth, validay} from "../validation/validation"

// dotenv.config({path: "../../../.env"});
dotenv.config({path: "/app/.env"});

const args = yargs
  .options({
    month: {
      alias: "m",
      type: "number",
      describe: "1 ~ 12 の数字を入力",
      default: NaN,
    },
  })
  .options({
    range: {
      alias: "r",
      type: "string",
      describe: "month(月単位) か day(日単位) か long(複数の月を使用する場合) か all(全データ)",
      default: '',
    },
  })
  .options({
    day: {
      alias: "d",
      type: "number",
      describe: "1 ~ 31 の日付を入力",
      default: NaN,
    },    
  })
  .options({
    startmonth: {
      alias: "s",
      type: "number",
      describe: "renge オプション long 使用時 開始月 1 ~ 12 の数字を入力",
      default: NaN,
    },    
  })
  .options({
    endmonth: {
      alias: "e",
      type: "number",
      describe: "renge オプション long 使用時 終了月 1 ~ 12 の数字を入力",
      default: NaN,
    },    
  })
  .parseSync();

const sheetId = process.env.SHEET_ID
const clientEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL
const privateKey = process.env.GOOGLE_PRIVATE_KEY

var month:number;
var range:string;
var day:number;
var startmonth:number;
var endmonth:number;
// var insertsqlcmd:string = '';
var insertsqlcmd:string = 'INSERT INTO test (dates, temp) VALUES ';

var d:number;
var t:string;

var Jandays:any[] = new Array();
var Jantemps:any[] = new Array();
var Febdays:any[] = new Array();
var Febtemps:any[] = new Array();
var Mardays:any[] = new Array();
var Martemps:any[] = new Array();
var Aprdays:any[] = new Array();
var Aprtemps:any[] = new Array();
var Maydays:any[] = new Array();
var Maytemps:any[] = new Array();
var Jundays:any[] = new Array();
var Juntemps:any[] = new Array();
var Juldays:any[] = new Array();
var Jultemps:any[] = new Array();
var Augdays:any[] = new Array();
var Augtemps:any[] = new Array();
var Sepdays:any[] = new Array();
var Septemps:any[] = new Array();
var Octdays:any[] = new Array();
var Octtemps:any[] = new Array();
var Novdays:any[] = new Array();
var Novtemps:any[] = new Array();
var Decdays:any[] = new Array();
var Dectemps:any[] = new Array();

var rows:any;

class SheetData {
  public static get = async () => {

    try {
      console.log('Start fetching data from google sheets');
    
      const doc = new GoogleSpreadsheet(process.env.SHEET_ID);
      console.log('SHEET_ID is OK');  
      if(clientEmail != null && privateKey !=null){
        console.log('client check is OK')
        await doc.useServiceAccountAuth({
          client_email: clientEmail,
          private_key: privateKey.replace(/\\n/g, '\n'),
        });
      }else{
        console.log('null', sheetId, " ",clientEmail, " ",privateKey )
      }
      
      await doc.loadInfo()
      console.log('loadinfo is OK');
      const sheet = doc.sheetsByIndex[0]
      
      rows = await sheet.getRows();
      await this.dopush();

      if(args.month || args.day || args.range || args.startmonth || args.endmonth){
        
        month = args.month;
        day = args.day;
        range = args.range;
        startmonth = args.startmonth;
        endmonth = args.endmonth;

        // 引数のバリデーションチェック
        if(month){
          await valimonth(month);
        }
        if(range){
          await valirange(range);
        }
        if(startmonth){
          await valistartmonth(startmonth);
        }
        if(endmonth){
          await valiendmonth(endmonth);
        }
        if(day){
          await validay(day);
        }

        if(range.match('all')){
          // rangeオプションがallで合った場合全ての値をインサートする
          console.log('all range')
          await this.allinsert();
          throw '終了'
        }
        
        if(month && !day && !range && !startmonth && !endmonth){
          //month のみの場合
          await this.dbInsertOption(month);
          throw 'month onry 終了'
        }else if(month && range.match('month')){
          // month と range(month)である場合
          await this.dbInsertOption(month);
          throw 'month range 終了'
        }else if(month && range.match('day') && day){
          // month と range(day)である場合
          await this.daydbInsertOption(month,day);
          throw 'day range 終了'
        }else if(month && !range && day){
          // month と day のみある場合
          await this.daydbInsertOption(month, day);
          throw 'day only 終了'
        }else if(month && range.match('long') && startmonth && endmonth && month == startmonth){
          // month と range(long)がありstartmonth と endmonthがある場合
          for(var s = startmonth; s <= endmonth; s++){
            await this.dbInsertOption(s);
          }
          throw 'long range 終了'
        }else if(range.match('long') && startmonth && endmonth){
          // range(long)がありstartmonth と endmonthがある場合
          for(var s = startmonth; s <= endmonth; s++){
            await this.dbInsertOption(s);
          }
          throw 'long range start and end 終了'
        }else if(month && range.match('long') && !startmonth && endmonth){
          // month と range(long)、endmonthがありstartmonthがない場合
          for(var s = month; s <= endmonth; s++){
            await this.dbInsertOption(s);
          }
          throw 'long range month and end 終了'
        }else if(month && range.match('long') && startmonth && endmonth && month != startmonth){
          throw 'Error: month と startmonth を使用しておりmonth と startmonthの値が異なっています。どちらか片方を使用するか値を一致させてください。'
        }else if(month && range.match('long') && !endmonth){
          throw 'Error: rangeオプション(long)を使用する場合は、endmonth を入れてください'
        }else if(startmonth && range.match('long') && !endmonth){
          throw 'Error: rangeオプション(long)を使用する場合は、endmonth を入れてください'
        }else if(!month && range.match('long') && !startmonth && !endmonth){
          throw 'Error: rangeオプション(long)を使用する場合は、month か startmonth と endmonth を入れてください'
        }else if(range.match('long') && !startmonth && !endmonth){
          throw 'Error: rangeオプション(long)を使用する場合は、month か startmonth と endmonth を入れてください'
        }else if(!range && startmonth && endmonth){
          throw 'Error: 期間で設定する場合は、rangeオプション(long)を使用してください。'
        }else if(!month && day){
          throw 'Error: dayオプションを使用する場合は、monthオプションも使用してください。'
        }else if(range && !month && !day && !startmonth && !endmonth && !range.match('all')){
          throw 'Error: rangeオプション(all以外)を使用する場合は他のオプションも使用してください。'
        }else if(month && range.match('day') && !day){
          console.log(day)
          throw 'Error: rangeオプションでday使用時はdayオプションも使用してください。値は1 ~ 31の整数を使用してください'
        }

      }else{
        // 引数がなかった場合全ての値をinsert
        await this.allinsert();
      }
    }
    catch(e){
      console.log(e);
    }
  }
  
  // 全ての値をinsertするメソッド
  public static allinsert = async () => {
    console.log('all insert start');
    for(var i = 1; i <= 12; i++){
      await this.dbInsertOption(i);
    }
    console.log('all insert end');
  }
  
  // insertするオプションを選ぶメソッド
  public static  daydbInsertOption = async (i:number, d:number) => {
    console.log('day DB Insert')
    var insertcnt = 0;
    if(i == 1){
      if(Juldays[d] != "" && Juldays[d]  != null && Juldays[d] != NaN){
        insertcnt++;
        insertsqlcmd = `INSERT INTO test (dates, temp) VALUES ("${i}/${d}", "${rows[d-1].Jantemp}") ON DUPLICATE KEY UPDATE temp = VALUES(\`temp\`)`
      }
    }
    if(i == 2){
      if(Febdays[d] != "" && Febdays[d]  != null && Febdays[d] != NaN){
        insertcnt++;
        insertsqlcmd = `INSERT INTO test (dates, temp) VALUES ("${i}/${d}", "${rows[d-1].Febtemp}") ON DUPLICATE KEY UPDATE temp = VALUES(\`temp\`)`
      }
    }
    if(i == 3){
      if(Mardays[d] != "" && Mardays[d]  != null && Mardays[d] != NaN){
        insertcnt++;
        insertsqlcmd = `INSERT INTO test (dates, temp) VALUES ("${i}/${d}", "${rows[d-1].Martemp}") ON DUPLICATE KEY UPDATE temp = VALUES(\`temp\`)`
      }
    }
    if(i == 4){
        if(Aprdays[d] != "" && Aprdays[d]  != null && Aprdays[d] != NaN){
          insertcnt++;
          insertsqlcmd = `INSERT INTO test (dates, temp) VALUES ("${i}/${d}", "${rows[d-1].Aprtemp}") ON DUPLICATE KEY UPDATE temp = VALUES(\`temp\`)`
        }
    }
    if(i == 5){
        if(Maydays[d] != "" && Maydays[d]  != null && Maydays[d] != NaN){
          insertcnt++;
          insertsqlcmd = `INSERT INTO test (dates, temp) VALUES ("${i}/${d}", "${rows[d-1].Maytemp}") ON DUPLICATE KEY UPDATE temp = VALUES(\`temp\`)`
        }
    }
    if(i == 6){
        if(Jundays[d] != "" && Jundays[d]  != null && Jundays[d] != NaN){
          insertcnt++;
          insertsqlcmd = `INSERT INTO test (dates, temp) VALUES ("${i}/${d}", "${rows[d-1].Juntemp}") ON DUPLICATE KEY UPDATE temp = VALUES(\`temp\`)`
        }
    }
    if(i == 7){
        if(Juldays[d] != "" && Juldays[d]  != null && Juldays[d] != NaN){
          insertcnt++;
          insertsqlcmd = `INSERT INTO test (dates, temp) VALUES ("${i}/${d}", "${rows[d-1].Jultemp}") ON DUPLICATE KEY UPDATE temp = VALUES(\`temp\`)`
        }
    }
    if(i == 8){
        if(Augdays[d] != "" && Augdays[d]  != null && Augdays[d] != NaN){
          insertcnt++;
          insertsqlcmd = `INSERT INTO test (dates, temp) VALUES ("${i}/${d}", "${rows[d-1].Augtemp}") ON DUPLICATE KEY UPDATE temp = VALUES(\`temp\`)`
        }
    }
    if(i == 9){
        if(Sepdays[d] != "" && Sepdays[d]  != null && Sepdays[d] != NaN){
          insertcnt++;
          insertsqlcmd = `INSERT INTO test (dates, temp) VALUES ("${i}/${d}", "${rows[d-1].Septemp}") ON DUPLICATE KEY UPDATE temp = VALUES(\`temp\`)`
        }
    }
    if(i == 10){
        if(Octdays[d] != "" && Octdays[d]  != null && Octdays[d] != NaN){
          insertcnt++;
          insertsqlcmd = `INSERT INTO test (dates, temp) VALUES ("${i}/${d}", "${rows[d-1].Octtemp}") ON DUPLICATE KEY UPDATE temp = VALUES(\`temp\`)`
        }
    }
    if(i == 11){
        if(Novdays[d] != "" && Novdays[d]  != null && Novdays[d] != NaN){
          insertcnt++;
          insertsqlcmd = `INSERT INTO test (dates, temp) VALUES ("${i}/${d}", "${rows[d-1].Novtemp}") ON DUPLICATE KEY UPDATE temp = VALUES(\`temp\`)`
        }
    }
    if(i == 12){
        if(Decdays[d] != "" && Decdays[d]  != null && Decdays[d] != NaN){
          insertcnt++;
          insertsqlcmd = `INSERT INTO test (dates, temp) VALUES ("${i}/${d}", "${rows[d-1].Dectemp}") ON DUPLICATE KEY UPDATE temp = VALUES(\`temp\`)`
        }
    }
    if(insertcnt > 0){
        await dbinsert(insertsqlcmd, 'test_db');
    }
  }
  
  // insertするオプションを選ぶメソッド
  public static  dbInsertOption = async (i:number) => {
    var m = 0
    var insertcnt = 0;
    if(i == 1){
      insertsqlcmd = 'INSERT INTO test (dates, temp) VALUES ';
      for(m = 0; m < Jandays.length; m++){
        if(Jandays[m] != "" && Jandays[m]  != null && Jandays[m] != NaN){
          insertsqlcmd = insertsqlcmd + `("${i}/${rows[m].Jan}", "${rows[m].Jantemp}")`
        }
        if(m < Jandays.length - 1){
          insertsqlcmd = insertsqlcmd + ', '
        }
        else{
          insertsqlcmd = insertsqlcmd + ' ON DUPLICATE KEY UPDATE temp = VALUES(`temp`)'
          insertcnt++;
        }
      }
    }
    if(i == 2){
      insertsqlcmd = 'INSERT INTO test (dates, temp) VALUES ';
      for(m = 0; m < Febdays.length; m++){
        if(Febdays[m] != "" && Febdays[m]  != null && Febdays[m] != NaN){
          insertsqlcmd = insertsqlcmd + `("${i}/${rows[m].Feb}", "${rows[m].Febtemp}")`
        }
        if(m < Febdays.length - 1){
          insertsqlcmd = insertsqlcmd + ', '
        }
        else{
          insertsqlcmd = insertsqlcmd + ' ON DUPLICATE KEY UPDATE temp = VALUES(`temp`)'
          insertcnt++;
        }
      }
    }
    if(i == 3){
      insertsqlcmd = 'INSERT INTO test (dates, temp) VALUES ';
      for(m = 0; m < Mardays.length; m++){
        if(Mardays[m] != "" && Mardays[m]  != null && Mardays[m] != NaN){
          insertsqlcmd = insertsqlcmd + `("${i}/${rows[m].Mar}", "${rows[m].Martemp}")`
        }
        if(m < Mardays.length - 1){
          insertsqlcmd = insertsqlcmd + ', '
        }
        else{
          insertsqlcmd = insertsqlcmd + ' ON DUPLICATE KEY UPDATE temp = VALUES(`temp`)'
          insertcnt++;
        }
      }
    }
    if(i == 4){
      insertsqlcmd = 'INSERT INTO test (dates, temp) VALUES ';
      for(m = 0; m < Aprdays.length; m++){
        if(Aprdays[m] != "" && Aprdays[m]  != null && Aprdays[m] != NaN){
          insertsqlcmd = insertsqlcmd + `("${i}/${rows[m].Apr}", "${rows[m].Aprtemp}")`
        }
        if(m < Aprdays.length - 1){
          insertsqlcmd = insertsqlcmd + ', '
        }
        else{
          insertsqlcmd = insertsqlcmd + ' ON DUPLICATE KEY UPDATE temp = VALUES(`temp`)'
          insertcnt++;
        }
      }
    }
    if(i == 5){
      insertsqlcmd = 'INSERT INTO test (dates, temp) VALUES ';
      for(m = 0; m < Maydays.length; m++){
        if(Maydays[m] != "" && Maydays[m]  != null && Maydays[m] != NaN){
          insertsqlcmd = insertsqlcmd + `("${i}/${rows[m].May}", "${rows[m].Maytemp}")`
        }
        if(m < Maydays.length - 1){
          insertsqlcmd = insertsqlcmd + ', '
        }
        else{
          insertsqlcmd = insertsqlcmd + ' ON DUPLICATE KEY UPDATE temp = VALUES(`temp`)'
          insertcnt++;
        }
      }
    }
    if(i == 6){
      insertsqlcmd = 'INSERT INTO test (dates, temp) VALUES ';
      for(m = 0; m < Jundays.length; m++){
        if(Jundays[m] != "" && Jundays[m]  != null && Jundays[m] != NaN){
          insertsqlcmd = insertsqlcmd + `("${i}/${rows[m].Jun}", "${rows[m].Juntemp}")`
        }
        if(m < Jundays.length - 1){
          insertsqlcmd = insertsqlcmd + ', '
        }
        else{
          insertsqlcmd = insertsqlcmd + ' ON DUPLICATE KEY UPDATE temp = VALUES(`temp`)'
          insertcnt++;
        }
      }
    }
    if(i == 7){
      insertsqlcmd = 'INSERT INTO test (dates, temp) VALUES ';
      for(m = 0; m < Juldays.length; m++){
        if(Juldays[m] != "" && Juldays[m]  != null && Juldays[m] != NaN){
          insertsqlcmd = insertsqlcmd + `("${i}/${rows[m].Jul}", "${rows[m].Jultemp}")`
        }
        if(m < Juldays.length - 1){
          insertsqlcmd = insertsqlcmd + ', '
        }
        else{
          insertsqlcmd = insertsqlcmd + ' ON DUPLICATE KEY UPDATE temp = VALUES(`temp`)'
          insertcnt++;
        }
      }
    }
    if(i == 8){
      insertsqlcmd = 'INSERT INTO test (dates, temp) VALUES ';
      if(Augdays.length > 0){
        for(m = 0; m < Augdays.length; m++){
          if(Augdays[m] != "" && Augdays[m]  != null && Augdays[m] != NaN){
            insertsqlcmd = insertsqlcmd + `("${i}/${rows[m].Aug}", "${rows[m].Augtemp}")`
          }
          if(m < Augdays.length - 1 && Augdays[m] != "" && Augdays[m]  != null && Augdays[m] != NaN){
            insertsqlcmd = insertsqlcmd + ', '
          }
          else{
            insertsqlcmd = insertsqlcmd + ' ON DUPLICATE KEY UPDATE temp = VALUES(`temp`)'
            insertcnt++;
          }
        }
      }
    }
    if(i == 9){
      insertsqlcmd = 'INSERT INTO test (dates, temp) VALUES ';
      if(Sepdays.length > 0){
        for(m = 0; m < Sepdays.length; m++){
          if(Sepdays[m] != "" && Sepdays[m]  != null && Sepdays[m] != NaN){
            insertsqlcmd = insertsqlcmd + `("${i}/${rows[m].Sep}", "${rows[m].Septemp}")`
          }
          if(m < Sepdays.length - 1){
            insertsqlcmd = insertsqlcmd + ', '
          }
          else{
            insertsqlcmd = insertsqlcmd + ' ON DUPLICATE KEY UPDATE temp = VALUES(`temp`)'
            insertcnt++;
          }
        }
      }
    }
    if(i == 10){
      insertsqlcmd = 'INSERT INTO test (dates, temp) VALUES ';
      if(Octdays.length > 0){
        for(m = 0; m < Octdays.length; m++){
          if(Octdays[m] != "" && Octdays[m]  != null && Octdays[m] != NaN){
            insertsqlcmd = insertsqlcmd + `("${i}/${rows[m].Oct}", "${rows[m].Octtemp}")`
          }
          if(m < Octdays.length - 1){
            insertsqlcmd = insertsqlcmd + ', '
          }
          else{
            insertsqlcmd = insertsqlcmd + ' ON DUPLICATE KEY UPDATE temp = VALUES(`temp`)'
            insertcnt++;
          }
        }
      }
    }
    if(i == 11){
      insertsqlcmd = 'INSERT INTO test (dates, temp) VALUES ';
      if(Novdays.length > 0){
        for(m = 0; m < Novdays.length; m++){
          if(Novdays[m] != "" && Novdays[m]  != null && Novdays[m] != NaN){
            insertsqlcmd = insertsqlcmd + `("${i}/${rows[m].Nov}", "${rows[m].Novtemp}")`
          }
          if(m < Novdays.length - 1){
            insertsqlcmd = insertsqlcmd + ', '
          }
          else{
            insertsqlcmd = insertsqlcmd + ' ON DUPLICATE KEY UPDATE temp = VALUES(`temp`)'
            insertcnt++;
          }
        }
      }
    }
    if(i == 12){
      insertsqlcmd = 'INSERT INTO test (dates, temp) VALUES ';
      if(Decdays.length > 0){
        for(m = 0; m < Decdays.length; m++){
          if(Decdays[m] != "" && Decdays[m]  != null && Decdays[m] != NaN){
            insertsqlcmd = insertsqlcmd + `("${i}/${rows[m].Dec}", "${rows[m].Dectemp}")`
          }
          if(m < Decdays.length - 1){
            insertsqlcmd = insertsqlcmd + ', '
          }
          else{
            insertsqlcmd = insertsqlcmd + ' ON DUPLICATE KEY UPDATE temp = VALUES(`temp`)'
            insertcnt++;
          }
        }
      }
    }
    if(insertcnt > 0){
        await dbinsert(insertsqlcmd, 'test_db');
    }
  }

  public static dopush = async () => {
    for(var i = 0; i < rows.length; i++){
      if(rows[i].Jan != "" && rows[i].Jan  != null && rows[i].Jan  != NaN){
        Jandays.push(rows[i].Jan);
        Jantemps.push(rows[i].Jantemp);
      }
      if(rows[i].Feb != "" && rows[i].Feb  != null && rows[i].Feb  != NaN){
        Febdays.push(rows[i].Feb);
        Febtemps.push(rows[i].Febtemp);
      }
      if(rows[i].Mar != "" && rows[i].Mar  != null && rows[i].Mar  != NaN){
        Mardays.push(rows[i].Mar);
        Martemps.push(rows[i].Martemp);
      }
      if(rows[i].Apr != "" && rows[i].Apr  != null && rows[i].Apr  != NaN){
        Aprdays.push(rows[i].Apr);
        Aprtemps.push(rows[i].Aprtemp);
      }
      if(rows[i].May != "" && rows[i].May  != null && rows[i].May  != NaN){
        Maydays.push(rows[i].May);
        Maytemps.push(rows[i].Maytemp);
      }
      if(rows[i].Jun != "" && rows[i].Jun  != null && rows[i].Jun  != NaN){
        Jundays.push(rows[i].Jun);
        Juntemps.push(rows[i].Juntemp);
      }
      if(rows[i].Jul != "" && rows[i].Jul  != null && rows[i].Jul  != NaN){
        Juldays.push(rows[i].Jul);
        Jultemps.push(rows[i].Jultemp);
      }
      if(rows[i].Aug != "" && rows[i].Aug  != null && rows[i].Aug  != NaN){
        Augdays.push(rows[i].Aug);
        Augtemps.push(rows[i].Augtemp);
      }
      if(rows[i].Sep != "" && rows[i].Sep  != null && rows[i].Sep  != NaN){
        Sepdays.push(rows[i].Sep);
        Septemps.push(rows[i].Septemp);
      }
      if(rows[i].Oct != "" && rows[i].Oct  != null && rows[i].Oct  != NaN){
        Octdays.push(rows[i].Oct);
        Octtemps.push(rows[i].Octtemp);
      }
      if(rows[i].Nov != "" && rows[i].Nov  != null && rows[i].Nov  != NaN){
        Novdays.push(rows[i].Nov);
        Novtemps.push(rows[i].Novtemp);
      }
      if(rows[i].Dec != "" && rows[i].Dec  != null && rows[i].Dec  != NaN){
        Decdays.push(rows[i].Dec);
        Dectemps.push(rows[i].Dectemp);
      }
    }
    console.log('push comp');
  }
}

SheetData.get();