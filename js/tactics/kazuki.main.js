export class Tactics {
    exec(time, friend, enemy) {
        setDestination();
        setReturn();

        var result = [];  // [ [y , 兵種 , option] ]

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
                    var vsAir = false;  // 対空の兵器が存在するか
                    for (var e2 of enemy.arms) {
                        if (Math.abs(e.y - e2.y) <= 10 && ["fighter", "missile"].includes(e2.type)) {
                            vsAir = true;
                        }
                    }
                    if (vsAir) {
                        result.push([e.y, "tank", {}]);
                    } else {
                        result.push([e.y, "attacker", {}]);
                    }
                }
            }
        }

        if (friend.money> 10000) {
            if (Math.random() < 0.6) {
                result.push([  0,   "tank", {}]);
                result.push([  7, "rocket", {}]);
                result.push([ 14,   "tank", {}]);
                result.push([ 21, "rocket", {}]);

                result.push([ 79, "rocket", {}]);
                result.push([ 86,   "tank", {}]);
                result.push([ 93, "rocket", {}]);
                result.push([100,   "tank", {}]);
            } else if (Math.random() < 0.5) {
                result.push([  0, "missile", {}]);
                result.push([  7, "missile", {}]);
                result.push([ 93, "missile", {}]);
                result.push([100, "missile", {}]);
            } else {
                result.push([  0, "infantry", {}]);
                result.push([  7, "infantry", {}]);
                result.push([ 93, "infantry", {}]);
                result.push([100, "infantry", {}]);
            }
        }

        return result;

        function setDestination() {
            for (var self of friend.arms) {

                if (["infantry", "bomber"].includes(self.type)) {  // 基本となる目的地設定
                    self.destination = WIDTH;
                } else {
                    self.destination = WIDTH - self.range;
                }

                for (var e of enemy.arms) {
                    if (self.x < e.x && Math.abs(e.y - self.y) <= 10) {  // 前方かつ縦範囲内

                        if (self.type == "tank" && ["attacker"].includes(e.type)) {
                            self.destination = e.x - 60;
                        }

                        else if (self.type == "rocket" && !e.onAir) {
                            self.destination = e.x - 60;
                        }

                        else if (self.type == "attacker" && ["missile", "fighter"].includes(e.type)) {
                            self.destination = e.x - 60;
                        }
                    }
                }
            }
        }

        function setReturn() {
            for (var self of friend.arms) {

                if (self.bullets <= 0) {
                    self.return = true;
                }

                else if (["missile", "fighter"].includes(self.type)) {
                    self.return = true;
                    for (var e of enemy.arms) {
                        if (self.x < e.x && Math.abs(e.y - self.y) <= 10) {  // 前方かつ縦範囲内
                            if (["attacker", "fighter", "bomber"].includes(e.type)) {
                                self.return = false;
                            }
                        }
                    }
                }

                else if (["attacker"].includes(self.type)) {
                    self.return = true;
                    for (var e of enemy.arms) {
                        if (self.x < e.x && Math.abs(e.y - self.y) <= 10) {  // 前方かつ縦範囲内
                            if (["tank", "rocket", "infantry"].includes(e.type)) {
                                self.return = false;
                            }
                        }
                    }
                }
            }
        }
    }
}
