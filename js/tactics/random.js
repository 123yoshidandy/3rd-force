export class Tactics {
    exec(time, friend, enemy) {
        var height = 100;
        var types = ["infantry", "tank", "rocket", "missile", "attacker", "fighter", "bomber"];
        var option = {
            life: 0.5 + Math.random(),
            attack: 0.5 + Math.random(),
            range: 0.5 + Math.random(),
            cooltime: 0.5 + Math.random(),
            speed: 0.5 + Math.random(),
        }
        if (friend.money < 2000) {
            return [];
        }

        return [
            [Math.floor(Math.random() * height), types[Math.floor(Math.random() * types.length)], option],
        ]
    }
}
