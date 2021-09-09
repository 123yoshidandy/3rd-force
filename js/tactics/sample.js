export class Tactics {
    exec(time, friend, enemy) {
        var result = [];

        if (friend.money < 1000) {
            return result;
        }

        for (var y = 0; y < 10; y++) {
            var near = null;
            for (var e of enemy.characters) {
                if (e.y == y && (near == null || e.x < near.x)) {
                    near = e;
                }
            }

            if (near != null) {
                var safe = false;
                for (var f of friend.characters) {
                    if (f.y == y && f.type == "g" && f.x < near.x) {
                        safe = true;
                    }
                }

                if (!safe) {
                    result.push([y, "g"]);
                }
            }
        }

        for (var y = 0; y < 10; y++) {
            var none = true;
            for (var f of friend.characters) {
                if (f.y == y && f.type == "r") {
                    none = false;
                }
            }
            if (none) {
                result.push([y, "r"]);
                break;
            }
        }

        return result;
    }
}
