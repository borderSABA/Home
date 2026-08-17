# ボドゲ一覧ページ

`index.html` をそのまま GitHub Pages / Cloudflare Pages などに置けば使えます。

現在登録済み:
- 街コロ
- 宇宙カタン
- ニムト
- 宝石の煌き
- 大富豪

ゲーム追加方法:
index.html 下部の `const games = [...]` に以下の形で追加してください。

{
  title: "ゲーム名",
  url: "https://..."
}
