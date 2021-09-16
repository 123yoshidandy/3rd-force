export class Tactics {
    exec(time, friend, enemy) {
        var result = [];

        if (friend.money < 2000) {  // 金が貯まるまで待機
            return result;
        }

        for (var e of enemy.arms) {  // 近づいてきた敵を掃討
            if (e.x >= 50) {
                continue;
            }

            var safe = false;
            for (var f of friend.arms) {
                if (e.onAir && f.type == "missile" && f.x < e.x && Math.abs(e.y - f.y) <= 10) {
                    safe = true;
                }
                if (!e.onAir && (f.type == "tank" || f.type == "attacker") && f.x < e.x && Math.abs(e.y - f.y) <= 10) {
                    safe = true;
                }
            }

            if (!safe) {
                if (e.onAir) {
                    result.push([e.y, "missile", {}]);
                } else {
                    if (Math.random() < 0.3) {
                        result.push([e.y, "attacker", {}]);
                    } else {
                        result.push([e.y, "tank", {}]);
                    }
                }
            }
        }

        if (friend.money> 5000) {
            result.push([0,  "infantry", {}]);
            result.push([10, "tank",     {}]);
            result.push([20, "tank",     {}]);
            result.push([70, "tank",     {}]);
            result.push([80, "tank",     {}]);
            result.push([90, "infantry", {}]);
        }

        return result;
    }
}
