# 3rd Force

https://yoshida-kazuki.github.io/game-3rd-force/

## はじめに

本ゲームは、 [マメッコホームページ](http://mamecco.es.land.to/) の「3rd Force」を独自に実装したものである。
ゲームシステムはタワーディフェンスに近いが、兵器の生成等の戦術アルゴリズムをユーザが実装することが特徴的である。
つまり、戦局（現在の優劣勢、相手が生成した兵器種別等）に応じて、適切な兵器配置により勝利を目指す。
<br>
イメージを掴むために、まずは当ページ上部に記載したURLへアクセスしてほしい。
左右から現れる赤と緑の四角は兵器であり、それぞれ歩兵と戦車を表す。
兵器生成のためにはMoneyが必要であり、これは時間により自然増加する。
赤四角（歩兵）が敵陣まで到達すると、ダメージを与えることができる。
ダメージを与えて相手のLifeがなくなると勝利となる。
<br>

## 遊び方

詳細は既存コードを参考にしてもらうものとし、手順のみ記す。

1. GitHubリポジトリをfork→cloneする。
   https://github.com/yoshida-kazuki/game-3rd-force
2. 戦術アルゴリズムを実装する。
   https://github.com/yoshida-kazuki/game-3rd-force/tree/main/js/tactics
3. 戦術アルゴリズムをアルゴリズム一覧に追加する。
   https://github.com/yoshida-kazuki/game-3rd-force/blob/main/js/main.js#L3
4. 以下などを活用し、動作検証する。
   https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer
5. いい感じにできたら、yoshida-kazukiのリポジトリにプルリクエストを発行する。

## 兵器一覧

| 兵器種別       | ID       | 特徴 ※[詳細](https://github.com/yoshida-kazuki/game-3rd-force/blob/main/js/main.js#L5) |
| --            | --       | -- |
| 歩兵          | infantry | 陣地への攻撃ができる唯一の兵器 |
| 戦車          | tank     | 耐久力・攻撃力に優れる戦闘の要 |
| ロケット砲     | rocket   | 攻撃力は低いが遠距離攻撃が可能 |
| 対空ミサイル   | missile  | 航空機への攻撃が得意 |
| 攻撃機        | attacker | コストは高いが、対地性能に優れる航空機 |
| 戦闘機        | fighter  | コストは高いが、対空性能に優れる航空機 |

## TODO

* ランキング機能の導入（戦術アルゴリズムを自動高速戦闘させ、ランキングを動的生成する）
* 兵器間のバランス調整
* 退却