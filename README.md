# JSON to CSV Converter App

このアプリケーションは、Cognito User JSONデータをCSV形式に変換するNext.jsウェブアプリケーションです。エポックタイムスタンプへの変換とユーザー名をメールアドレスに設定するなど、特定の要件に合わせた対応が含まれています。

## 機能

- ドラッグ＆ドロップまたはファイル選択によるJSONファイルのアップロード
- JSONデータの直接入力
- ISO日時文字列をエポックタイムスタンプに変換
- ユーザー名をメールアドレスに設定
- CSV結果のプレビュー
- 変換されたCSVファイルのダウンロード
- エラー処理とバリデーション

## 技術スタック

- [Next.js](https://nextjs.org/) - Reactフレームワーク
- [TypeScript](https://www.typescriptlang.org/) - 型付きJavaScript
- [Tailwind CSS](https://tailwindcss.com/) - ユーティリティファーストのCSSフレームワーク
- [shadcn/ui](https://ui.shadcn.com/) - 美しいUIコンポーネント
- [Lucide React](https://lucide.dev/) - アイコンライブラリ

## プロジェクトセットアップ

### 前提条件

- Node.js 18.17.0以上
- npm または yarn

### インストール

```bash
# リポジトリをクローン
git clone https://github.com/yourusername/json-to-csv-converter.git
cd json-to-csv-converter

# 依存関係のインストール
npm install
# または
yarn install
```

### 開発サーバーの起動

```bash
npm run dev
# または
yarn dev
```

http://localhost:3000 を開いてアプリケーションを確認できます。

### ビルドと本番環境での起動

```bash
# ビルド
npm run build
# または
yarn build

# 本番モードで起動
npm start
# または
yarn start
```

## プロジェクト構造

```
json-to-csv-converter/
├── app/
│   ├── page.tsx        # メインページコンポーネント
│   ├── layout.tsx      # アプリケーションレイアウト
│   └── globals.css     # グローバルスタイル
├── components/
│   └── ui/             # shadcn/uiコンポーネント
├── lib/
│   └── jsonToCsvConverter.ts  # JSON→CSV変換ロジック
├── public/             # 静的ファイル
├── .gitignore
├── next.config.js
├── package.json
├── README.md
├── tailwind.config.js
└── tsconfig.json
```

## 使用方法

1. **JSONデータのアップロード/入力**:
   - 「ファイルアップロード」タブでJSONファイルをアップロード
   - または「JSONを貼り付け」タブでJSONデータを直接貼り付け

2. **変換**:
   - 「CSVに変換」ボタンをクリックして変換を実行

3. **ダウンロード**:
   - 必要に応じてファイル名を編集
   - 「ダウンロード」ボタンをクリックしてCSVファイルを保存

## コンバーターライブラリについて

`lib/jsonToCsvConverter.ts`には、JSONデータをCSVに変換するコア機能が実装されています。このライブラリは、他のプロジェクトでも再利用可能です。

主な機能:
- ISO日時文字列をエポックタイムスタンプに変換
- ユーザー属性の抽出
- 特定のスキーマに合わせたCSVフォーマット
- CSVフィールドのエスケープ処理

## 環境変数

このプロジェクトには特別な環境変数は必要ありません。標準的なNext.jsアプリケーションとして動作します。

## ライセンス

[MIT](LICENSE)