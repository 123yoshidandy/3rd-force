export class Tactics {
    exec(time, friend, enemy) {
        var result = [];

        if (friend.money < 1000) {
            return result;
        }

        for (var e of enemy.characters) {
            var safe = false;
            for (var f of friend.characters) {
                if (f.type == "g" && f.x < e.x && Math.abs(e.y - f.y) <= 10) {
                    safe = true;
                }
            }
            if (!safe) {
                result.push([e.y, "g"]);
            }
        }

        result.push([Math.floor(Math.random() * 100), "r"]);

        return result;
    }
}
