# kpi-tree-generator

## サービス概要

報告用の KPI ツリー図を作る手間を削減したい企業社員向けの、KPI ツリージェネレーターです。
ユーザーは簡単な入力から KPI ツリー図を画像で出力でき、PowerPoint テンプレートや drawio とは違って、
テキスト(yaml)でのツリーの生成から、ブラウザ操作での値の更新シミュレーションまで簡単にできることが特徴です。

### 特徴

### 使い方

## 技術スタック

## 開発手順

### ローカルコンテナ起動・開発方法

1. リポジトリを clone する。

   ```bash
   $ git clone https://github.com/peno022/kpi-tree-generator.git
   ```

2. プロジェクトルート直下に移動して、コンテナ起動コマンドを実行する。

   ```bash
   # make up を実行すると、コンテナをビルドして docker compose 環境が起動します。
   $ cd kpi-tree-generator
   $ make up
   ```

3. ローカルコンテナに接続し、開発準備用のコマンドを実行する。

   ```bash
   # コンテナの中に入る
   $ make login

   # DB 等のセットアップ
   $ bin/setup

   # rails server の起動
   $ bin/dev
   # => ブラウザから http://localhost:3000 を開くと、アプリケーションにアクセスできます。
   ```

4. 開発する。

- ソースコードを修正した場合、ローカル開発画面を更新すれば変更が反映されます。
- gem を追加した場合などは、コンテナの再ビルドが必要になる可能性があります。

5. (任意) コンテナを再ビルドする。

   ```bash
   # (ローカル環境にて) コンテナの停止
   $ make down

   # コンテナの再ビルド
   $ make build

   # コンテナ起動
   $ make up

   # 手順 4 へ
   ```

6. lint/format を実行する。

   ```bash
   # (コンテナ内で)
   $ bin/lint
   ```

- 実行される lint/format は下記になります。
  - Ruby
    - rubocop
    - slim-lint
  - JavaScript
    - eslint
    - prettier

7. テストを実行する。

   ```bash
   # (コンテナ内で)
   # Railsのモデル・リクエスト・システムテスト
   $ bundle exec rspec

   # TypeScriptモジュール・Reactコンポーネントのテスト
   $ yarn jest
   ```

### 開発終了

1. コンテナを停止する。

   ```bash
   # コンテナ終了
   $ make down
   ```

### デプロイ

- 現状、[peno022](https://github.com/peno022) のみデプロイ作業実施可能です。

1. 開発した内容を feature ブランチにプッシュする。

   ```bash
   $ git add xxx
   $ git push origin feature/example
   ```

2. main ブランチに向けて PR を作成する。
3. approve 後、main ブランチにマージする。
4. GitHub Actions によって、Fly.io の環境にデプロイされる。
