export class Tactics {
    exec(time, friend, enemy) {
        var height = 100;
        var types = ["infantry", "tank", "rocket", "missile", "attacker", "fighter", "bomber"];

        if (friend.money < 2000) {  // お金が貯まるまで待機
            return [];
        }

        return [  // ランダム地点にランダム兵器を生成
            [Math.floor(Math.random() * height), types[Math.floor(Math.random() * types.length)], {}],
        ]
    }
}
