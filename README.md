# Portfolio site

GitHub Pages向けの静的ポートフォリオサイトのベースです。

## まず変更するところ

### 1. パスワード
`js/site.js` の
`const PASSWORD = "portfolio";`
を好きな文字列に変更。

※この方式は「簡易的な閲覧制限」です。GitHub Pages上の本格的な非公開認証ではありません。

### 2. 作品追加
`data.js` に作品情報を1件追加。

作品本文は
`works/作品slug/content.json`
に記述します。

使える本文パーツ：

- `heading`：見出し
- `text`：文章
- `image`：画像＋キャプション
- `gallery`：2〜4列の画像グリッド

画像は作品フォルダに入れて、JSONからファイル名を指定します。

### 3. 実画像
`assets/` と各作品フォルダのサンプル画像を自分の画像に差し替えます。

## GitHub Pages

GitHubにリポジトリを作り、このフォルダの中身をpush。
GitHubの Settings → Pages で、デプロイ元を設定すると公開できます。

## 注意

このベースでは、詳細ページの本文を `fetch()` でJSONから読み込むため、ローカルで `file://` からHTMLを直接開くとブラウザの制約でJSONが読み込めない場合があります。
GitHub Pages上では通常どおり動作します。ローカル確認にはVS Code等のLive Serverを使うのがおすすめです。
