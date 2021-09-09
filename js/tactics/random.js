export class Tactics {
    exec(time, friend, enemy) {
        var height = 10;
        var types = ["r", "g", "y"];

        return [
            [Math.floor(Math.random() * height), types[Math.floor(Math.random() * types.length)]],
        ]
    }
}
