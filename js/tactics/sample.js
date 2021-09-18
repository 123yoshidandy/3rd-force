export class Tactics {
    exec(time, friend, enemy) {
        setDestination();
        setReturn();

        var height = 100;
        var types = ["infantry", "tank", "rocket", "missile", "cannon", "attacker", "fighter", "bomber"];
        var result = [];  // [ [y , 兵種 , option] ]

        if (friend.money < 4000) {  // お金が貯まるまで待機
            return result;
        }

        for (var e of enemy.arms) {  // 敵の兵種に応じた生成
            if (e.x > 100) {  // 中央を超えていない敵は対象外
                continue;
            }

            var safe = false;
            for (var f of friend.arms) {
                if (e.onAir && f.type == "missile" && f.x < e.x && Math.abs(e.y - f.y) <= 10) {  // 航空機には対空ミサイル
                    safe = true;
                }
                if (!e.onAir && f.type == "tank" && f.x < e.x && Math.abs(e.y - f.y) <= 10) {  // 地上機には戦車
                    safe = true;
                }
            }
            if (!safe) {
                if (e.onAir) {
                    result.push([e.y, "missile", {}]);
                } else {
                    result.push([e.y, "tank", {}]);
                }
            }
        }

        if (Math.random() < 0.1) {  // ときどき、ランダム地点にランダム兵器を生成
            result.push([Math.floor(Math.random() * height), types[Math.floor(Math.random() * types.length)], {}]);
        }

        if (Math.random() < 0.2) {  // しばしば、ランダム地点に歩兵を生成
            result.push([Math.floor(Math.random() * height), "infantry", {}]);
        }

        return result;

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
