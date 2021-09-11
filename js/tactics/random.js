export class Tactics {
    exec(time, friend, enemy) {
        var height = 100;
        var types = ["r", "g", "y"];

        if (friend.money < 1000) {
            return [];
        }

        return [
            [Math.floor(Math.random() * height), types[Math.floor(Math.random() * types.length)]],
        ]
    }
}
