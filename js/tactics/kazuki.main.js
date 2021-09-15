export class Tactics {
    exec(time, friend, enemy) {
        var result = [];

        if (friend.money < 2000) {  // 金がある程度貯まるまで待機
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
                    result.push([e.y, "missile"]);
                } else {
                    if (Math.random() < 0.3) {
                        result.push([e.y, "attacker"]);
                    } else {
                        result.push([e.y, "tank"]);
                    }
                }
            }
        }

        if (friend.money >= 20000) {  // 金余剰のため勝ちに行く
            var y = Math.floor(Math.random() * 100);
            result.push([y, "rocket"]);
            result.push([y, "rocket"]);
            result.push([y, "rocket"]);
            result.push([y, "rocket"]);
            result.push([y, "missile"]);
            result.push([y, "missile"]);
            result.push([y, "infantry"]);
            result.push([y, "infantry"]);
            result.push([y, "infantry"]);
            result.push([y, "infantry"]);
            result.push([y, "infantry"]);
            result.push([y, "infantry"]);
            result.push([y, "infantry"]);
            result.push([y, "infantry"]);
            result.push([y, "infantry"]);
            result.push([y, "infantry"]);
        }

        return result;
    }
}