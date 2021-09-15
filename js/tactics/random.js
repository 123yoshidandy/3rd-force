export class Tactics {
    exec(time, friend, enemy) {
        var height = 100;
        var types = ["infantry", "tank", "rocket", "missile", "attacker", "fighter", "bomber"];

        if (friend.money < 2000) {
            return [];
        }

        return [
            [Math.floor(Math.random() * height), types[Math.floor(Math.random() * types.length)]],
        ]
    }
}
