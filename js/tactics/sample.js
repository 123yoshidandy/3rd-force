export class Tactics {
    exec(time, friend, enemy) {
        var height = 100;
        var types = ["infantry", "tank", "rocket", "missile", "cannon", "attacker", "fighter", "bomber"];
        var result = [];

        if (friend.money < 2000) {  // お金が貯まるまで待機
            return result;
        }

        for (var e of enemy.arms) {  // 敵の兵種に応じた生成
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
    }
}
