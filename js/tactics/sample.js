export class Tactics {
    exec(time, friend, enemy) {
        var result = [];

        if (friend.money < 2000) {
            return result;
        }

        for (var e of enemy.arms) {
            var safe = false;
            for (var f of friend.arms) {
                if (e.onAir && f.type == "missile" && f.x < e.x && Math.abs(e.y - f.y) <= 10) {
                    safe = true;
                }
                if (!e.onAir && f.type == "tank" && f.x < e.x && Math.abs(e.y - f.y) <= 10) {
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

        result.push([Math.floor(Math.random() * 100), "infantry", {}]);

        return result;
    }
}
