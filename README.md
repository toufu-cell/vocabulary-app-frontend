# 単語学習アプリ フロントエンド

## 概要

このプロジェクトは単語学習アプリのフロントエンドを提供します。間隔反復学習法を活用した効率的な語彙学習をサポートするUIを実装しています。

## 機能

- 単語カードによる学習インターフェース
- 自己評価に基づく学習進捗の記録
- 単語の追加・管理
- 学習統計ダッシュボード
- データのインポート/エクスポート
- ダークモード対応

## 技術スタック

- React
- Axios (APIリクエスト)
- CSS (レスポンシブデザイン)

## インストールと実行

```bash
##依存関係のインストール
npm install
##開発サーバーの起動
npm start
```


## 環境変数

`.env`ファイルを作成して以下の変数を設定できます：

```bash
REACT_APP_API_URL=http://localhost:3001
```


## 主要コンポーネント

- `Quiz.js` - 単語学習インターフェース
- `AddWord.js` - 単語追加フォーム
- `WordList.js` - 単語一覧と管理
- `Dashboard.js` - 学習統計ダッシュボード
- `DataManagement.js` - データのインポート/エクスポート
- `Navbar.js` - ナビゲーションメニュー

## モバイル対応

このアプリはレスポンシブデザインを採用しており、スマートフォンやタブレットでも快適に利用できます。

## ビルドと本番デプロイ

```bash
npm run build
```


## 開発ガイドライン

- コンポーネントは機能ごとに分割
- CSSはコンポーネントごとに分離
- ダークモードはDarkMode.cssで一元管理

## バックエンドとの連携

このフロントエンドはバックエンドAPIと連携して動作します。バックエンドの起動方法については、バックエンドのREADMEを参照してください。
