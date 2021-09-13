const WIDTH = 200;
const HEIGHT = 100;
const TACTICS = ["sample", "random", "kazuki.main"];

const ARM_TYPES = {
    infantry: {
        type: "infantry",
        onAir: false,
        vsAir: false,
        life: 100,
        attack: 100,
        range: 10,
        cooltime: 10,
        speed: 0.8,
        cost: 500,
        color: "red",
    },
    tank: {
        type: "tank",
        onAir: false,
        vsAir: false,
        life: 400,
        attack: 200,
        range: 20,
        cooltime: 15,
        speed: 1.0,
        cost: 1000,
        color: "green",
    },
    rocket: {
        type: "rocket",
        onAir: false,
        vsAir: false,
        life: 200,
        attack: 100,
        range: 40,
        cooltime: 10,
        speed: 1.0,
        cost: 1000,
        color: "yellow",
    },
    missile: {
        type: "missile",
        onAir: false,
        vsAir: true,
        life: 200,
        attack: 200,
        range: 40,
        cooltime: 25,
        speed: 1.0,
        cost: 1000,
        color: "blue",
    },
    attacker: {
        type: "attacker",
        onAir: true,
        vsAir: false,
        life: 200,
        attack: 400,
        range: 20,
        cooltime: 10,
        speed: 1.5,
        cost: 2000,
        color: "lime",
    },
    fighter: {
        type: "fighter",
        onAir: true,
        vsAir: true,
        life: 400,
        attack: 400,
        range: 40,
        cooltime: 10,
        speed: 2.0,
        cost: 1000,
        color: "aqua",
    },
};

var state = {};
var timer = null;

init();
restart();

function init() {
    var selectTeamA = document.getElementById("teamA.select");
    for (var i of TACTICS) {
        var optionElement = document.createElement("option");
        optionElement.textContent = i;
        optionElement.value = i;
        selectTeamA.appendChild(optionElement);
    }
    var selectTeamB = document.getElementById("teamB.select");
    for (var i of TACTICS) {
        var optionElement = document.createElement("option");
        optionElement.textContent = i;
        optionElement.value = i;
        selectTeamB.appendChild(optionElement);
    }
}

function restart() {
    state = {
        time: 0,
        teamA: {
            life: 1000,
            money: 1000,
            arms : [],
        },
        teamB: {
            life: 1000,
            money: 1000,
            arms : [],
        },
        fired: [],
        bursted: [],
        winner: null,
    }

    if (timer != null) {
        clearInterval(timer);
    }
    timer = setInterval(loop, 20);
}

function loop() {
    if (state.time % 2 == 0) {
        move();
        command();
    } else if (state.time % 2 == 1) {
        attack_enemy();
        attack_area();
        state.teamA.money += 50;
        state.teamB.money += 50;
    }

    view();
    if (state.teamA.life <= 0) {
        clearInterval(timer);
        document.getElementById("time_text").textContent = "teamB is win";
        return;
    } else if (state.teamB.life <= 0) {
        clearInterval(timer);
        document.getElementById("time_text").textContent = "teamA is win";
        return;
    }

    state.time++;
}

function view() {
    document.getElementById("time_text").textContent = "time  : " + state.time;
    document.getElementById("teamA.life").value = state.teamA.life;
    document.getElementById("teamA.money").innerText = state.teamA.money;
    document.getElementById("teamB.life").value = state.teamB.life;
    document.getElementById("teamB.money").innerText = state.teamB.money;

    const canvas = document.getElementById('field_canvas');
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (var x = 0; x < 20; x++) {
        for (var y = 0; y < 10; y++) {
            ctx.fillStyle = "#455A64";
            ctx.fillRect(x * 50, y * 50, 49, 49);
        }
    }

    for (var arm of state.teamA.arms.concat(state.teamB.arms)) {
        ctx.fillStyle = ARM_TYPES[arm.type].color;
        ctx.fillRect(5 * arm.x, 5 * arm.y - 10, 20, 20);
    }

    for (var fired of state.fired) {
        ctx.beginPath();
        ctx.moveTo(5 * fired[0], 5 * fired[1]);
        ctx.lineTo(5 * fired[2], 5 * fired[3]);
        ctx.strokeStyle = "white";
        ctx.lineWidth = 2;
        ctx.stroke();
    }
    state.fired = [];

    for (var bursted of state.bursted) {
        ctx.beginPath();
        ctx.arc(5 * bursted[0], 5 * bursted[1], 100, 0 * Math.PI / 180, 360 * Math.PI / 180,);
        ctx.fillStyle = "red";
        ctx.fill();
    }
    state.bursted = [];
}

function move() {
    for (var arm of state.teamA.arms.concat(state.teamB.arms)) {
        if (arm.x < arm.destination) {
            arm.x += arm.speed;
        } else if (arm.x > arm.destination) {
            arm.x -= arm.speed;
        }
    }
}

function attack_enemy() {
    for (var armA of state.teamA.arms) {
        if (state.time > armA.fired + armA.cooltime) {
            var targets = [];
            for (var armB of state.teamB.arms) {
                if (armA.x <= armB.x
                    && armB.x <= armA.x + armA.range
                    && Math.abs(armA.y - armB.y) <= 10
                    && ((armA.vsAir && armB.onAir) || (!armA.vsAir && !armB.onAir))
                ) {
                    targets.push(armB);
                }
            }
            if (targets.length > 0) {
                var target = Math.floor(Math.random() * targets.length);
                targets[target].life -= armA.attack;
                armA.fired = state.time;
                state.fired.push([armA.x, armA.y, targets[target].x, targets[target].y]);
            }
        }
    }

    for (var armB of state.teamB.arms) {
        if (state.time > armB.fired + armB.cooltime) {
            var targets = [];
            for (var armA of state.teamA.arms) {
                if (armA.x <= armB.x
                    && armB.x - armB.range <= armA.x
                    && Math.abs(armA.y - armB.y) <= 10
                    && ((armB.vsAir && armA.onAir) || (!armB.vsAir && !armA.onAir))
                ) {
                    targets.push(armA);
                }
            }
            if (targets.length > 0) {
                var target = Math.floor(Math.random() * targets.length);
                targets[target].life -= armB.attack;
                armB.fired = state.time;
                state.fired.push([armB.x, armB.y, targets[target].x, targets[target].y]);
            }
        }
    }

    for (var i = state.teamA.arms.length - 1; i >= 0; i--) {
        if (state.teamA.arms[i].life <= 0) {
            state.teamA.arms.splice(i, 1);
        }
    }
    for (var i = state.teamB.arms.length - 1; i >= 0; i--) {
        if (state.teamB.arms[i].life <= 0) {
            state.teamB.arms.splice(i, 1);
        }
    }
}

function attack_area() {
    for (var i = state.teamA.arms.length - 1; i >= 0; i--) {
        if (state.teamA.arms[i].type == "infantry" && state.teamA.arms[i].x >= WIDTH - 1) {
            state.teamB.life -= state.teamA.arms[i].attack;
            state.bursted.push([state.teamA.arms[i].x, state.teamA.arms[i].y]);
            state.teamA.arms.splice(i, 1);
        }
    }

    for (var i = state.teamB.arms.length - 1; i >= 0; i--) {
        if (state.teamB.arms[i].type == "infantry" && state.teamB.arms[i].x <= 0) {
            state.teamA.life -= state.teamB.arms[i].attack;
            state.bursted.push([state.teamB.arms[i].x, state.teamB.arms[i].y]);
            state.teamB.arms.splice(i, 1);
        }
    }
}

async function command() {
    let element1 = document.getElementById('teamA.select');
    const path1 = "./tactics/" + element1.value + ".js";
    const module1 = await import(path1);
    const tactics1 = new module1.Tactics();
    const result1= tactics1.exec(state.time, state.teamA, state.teamB);

    for (var arm of state.teamA.arms.concat(state.teamB.arms)) {
        arm.x = WIDTH - 1 - arm.x;
        arm.y = HEIGHT - 1 - arm.y;
    }

    let element2 = document.getElementById('teamB.select');
    const path2 = "./tactics/" + element2.value + ".js";
    const module2 = await import(path2);
    const tactics2 = new module2.Tactics();
    const result2 = tactics2.exec(state.time, state.teamB, state.teamA);

    for (var arm of state.teamA.arms.concat(state.teamB.arms)) {
        arm.x = WIDTH - 1 - arm.x;
        arm.y = HEIGHT - 1 - arm.y;
    }

    for (var result of result1) {
        generate("teamA", result[1], result[0]);
    }

    for (var result of result2) {
        generate("teamB", result[1], HEIGHT - 1 - result[0]);
    }
}

function generate(team, type, y) {
    if (state[team].money >= ARM_TYPES[type].cost) {

        var x = 0;
        var destination = WIDTH - ARM_TYPES[type].range;
        if (type == "infantry") {
            destination = WIDTH;
        }
        if (team == "teamB") {
            x = WIDTH;
            destination = WIDTH - destination;
        }

        state[team].arms.push({
            team: team,
            type: type,
            onAir: ARM_TYPES[type].onAir,
            vsAir: ARM_TYPES[type].vsAir,
            life: ARM_TYPES[type].life,
            attack: ARM_TYPES[type].attack,
            range: ARM_TYPES[type].range,
            cooltime: ARM_TYPES[type].cooltime,
            speed: ARM_TYPES[type].speed,
            destination: destination,
            fired: -100,
            x: x,
            y: y,
        });
        state[team].money -= ARM_TYPES[type].cost;
    }
}
