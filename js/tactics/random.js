export class Tactics {
    exec(time, friend, enemy) {
        setDestination();
        setReturn();

        var height = 100;
        var types = ["infantry", "tank", "rocket", "missile", "cannon", "attacker", "fighter", "bomber"];

        if (friend.money < 2000) {  // お金が貯まるまで待機
            return [];
        }

        return [  // ランダム地点にランダム兵器を生成
            [Math.floor(Math.random() * height), types[Math.floor(Math.random() * types.length)], {}],
        ]

        function setDestination() {  // 目的地設定
            for (var self of friend.arms) {
                if (["infantry", "bomber"].includes(self.type)) {
                    self.destination = WIDTH;  // 歩兵、爆撃機は敵拠点
                } else {
                    self.destination = WIDTH - self.range;  // それ以外は敵拠点から射程分離れた位置
                }
            }
        }

        function setReturn() {  // 退却判定
            for (var self of friend.arms) {
                if (self.bullets <= 0) {  // 残弾がなくなったら
                    self.return = true;
                }
            }
        }
    }
}
