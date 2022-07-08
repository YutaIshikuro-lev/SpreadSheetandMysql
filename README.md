## 使用前に.envを作成すること
- 以下記載必要事項
 - MYSQL_DATABASE=データベース
 - MYSQL_USER=MySQL ユーザー
 - MYSQL_PASSWORD=MySQL ユーザーパスワード
 - MYSQL_ROOT_PASSWORD=MySQL root ユーザーパスワード
 - SHEET_ID=スプレッドシートのID
 - GOOGLE_SERVICE_ACCOUNT_EMAIL="Google API 用メールアドレス
 - GOOGLE_PRIVATE_KEY=Google API の認証鍵(JSON)
 


## Docker 起動およびイメージ作成
docker-compose up -d 

## Docker 停止及びコンテナ削除
docker-compose down -v

## Docker instance に接続
docker exec -it spreadsheet-db01-1 bash

## 実行コマンドの確認
docker exec -it spreadsheet-app01-1 npx ts-node /app/app/src/get/index3.ts --help

## 1月分データインサート
docker exec -it spreadsheet-app01-1 npx ts-node /app/app/src/get/index3.ts -m 1 