const HEIGHT =10;
const WIDTH = 20;
const TD_SKIP = 9;

const CHARACTER_TYPES = {
    r: {
        type: "r",
        life: 100,
        attack: 100,
        range: 1,
        cost: 500,
    },
    g: {
        type: "g",
        life: 400,
        attack: 200,
        range: 2,
        cost: 1000,
    },
    y: {
        type: "y",
        life: 200,
        attack: 50,
        range: 4,
        cost: 1000,
    },
};

var state = {};
var cells = [];


init();
restart();

var timer = setInterval(function () {
    if (state.time % 2 == 0) {
        move();
        command();
    } else if (state.time % 2 == 1) {
        attack_enemy();
        attack_area();
        state.teamA.money += 100;
        state.teamB.money += 100;
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
}, 100);

function init() {
    var tableElement = document.getElementById("field_table");
    for (var row = 0; row < HEIGHT; row++) {
        var tr = document.createElement("tr");
        for (var col = 0; col < WIDTH; col++) {
            var td = document.createElement("td");
            tr.appendChild(td);
        }
        tableElement.appendChild(tr);
    }

    var td_array = document.getElementsByTagName("td");
    var index = 0;
    for (var row = 0; row < HEIGHT; row++) {
        cells.push([]);
        for (var col = 0; col < WIDTH; col++) {
            cells[row].push(td_array[TD_SKIP + index]);
            index++;
        }
    }

    var selectTeamA = document.getElementById("teamA.select");
    for (var i of ["sample", "random"]) {
        var optionElement = document.createElement("option");
        optionElement.textContent = i;
        optionElement.value = i;
        selectTeamA.appendChild(optionElement);
    }
    var selectTeamB = document.getElementById("teamB.select");
    for (var i of ["sample", "random"]) {
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
            characters : [],
        },
        teamB: {
            life: 1000,
            money: 1000,
            characters : [],
        },
        winner: null,
    }
}

function view() {
    document.getElementById("time_text").textContent = "time  : " + state.time;
    document.getElementById("teamA.life").innerText = state.teamA.life;
    document.getElementById("teamA.money").innerText = state.teamA.money;
    document.getElementById("teamB.life").innerText = state.teamB.life;
    document.getElementById("teamB.money").innerText = state.teamB.money;

    for (var row = 0; row < HEIGHT; row++) {
        for (var col = 0; col < WIDTH; col++) {
            cells[row][col].className = "";
            cells[row][col].style.border = "0px solid";
            cells[row][col].innerText = "";
        }
    }

    for (var i = 0; i < state.teamA.characters.length; i++) {
        cells[state.teamA.characters[i].y][state.teamA.characters[i].x].className = state.teamA.characters[i].type;
        cells[state.teamA.characters[i].y][state.teamA.characters[i].x].innerText = "│▶";
    }
    for (var i = 0; i < state.teamB.characters.length; i++) {
        if (cells[state.teamB.characters[i].y][state.teamB.characters[i].x].className != "") {
            cells[state.teamB.characters[i].y][state.teamB.characters[i].x].className = "b";
            cells[state.teamB.characters[i].y][state.teamB.characters[i].x].innerText = "▶◀";
        }
        cells[state.teamB.characters[i].y][state.teamB.characters[i].x].className = state.teamB.characters[i].type;
        cells[state.teamB.characters[i].y][state.teamB.characters[i].x].innerText = "◀│";
    }
}

function move() {
    for (var i = 0; i < state.teamA.characters.length; i++) {
        state.teamA.characters[i].x = Math.min(state.teamA.characters[i].x + 1, WIDTH - state.teamA.characters[i].range);
    }
    for (var i = 0; i < state.teamB.characters.length; i++) {
        state.teamB.characters[i].x = Math.max(state.teamB.characters[i].x - 1, state.teamB.characters[i].range - 1);
    }
}

function attack_enemy() {
    for (var i = 0; i < state.teamA.characters.length; i++) {
        var targets = [];
        for (var j = 0; j < state.teamB.characters.length; j++) {
            if (state.teamA.characters[i].x <= state.teamB.characters[j].x
                && state.teamB.characters[j].x <= state.teamA.characters[i].x + state.teamA.characters[i].range
                && Math.abs(state.teamA.characters[i].y - state.teamB.characters[j].y) <= 1
            ) {
                targets.push(state.teamB.characters[j]);
            }
        }
        if (targets.length > 0) {
            var target = Math.floor(Math.random() * targets.length);
            targets[target].life -= state.teamA.characters[i].attack;
        }
    }

    for (var j = 0; j < state.teamB.characters.length; j++) {
        var targets = [];
        for (var i = 0; i < state.teamA.characters.length; i++) {
            if (state.teamA.characters[i].x <= state.teamB.characters[j].x
                && state.teamB.characters[j].x - state.teamB.characters[j].range <= state.teamA.characters[i].x
                && Math.abs(state.teamA.characters[i].y - state.teamB.characters[j].y) <= 1
            ) {
                targets.push(state.teamA.characters[i]);
            }
        }
        if (targets.length > 0) {
            var target = Math.floor(Math.random() * targets.length);
            targets[target].life -= state.teamB.characters[j].attack;
        }
    }

    for (var i = state.teamA.characters.length - 1; i >= 0; i--) {
        if (state.teamA.characters[i].life <= 0) {
            state.teamA.characters.splice(i, 1);
        }
    }
    for (var i = state.teamB.characters.length - 1; i >= 0; i--) {
        if (state.teamB.characters[i].life <= 0) {
            state.teamB.characters.splice(i, 1);
        }
    }
}

function attack_area() {
    for (var i = state.teamA.characters.length - 1; i >= 0; i--) {
        if (state.teamA.characters[i].type == "r" && state.teamA.characters[i].x == WIDTH - 1) {
            state.teamB.life -= state.teamA.characters[i].attack;
            state.teamA.characters.splice(i, 1);
        }
    }

    for (var i = state.teamB.characters.length - 1; i >= 0; i--) {
        if (state.teamB.characters[i].type == "r" && state.teamB.characters[i].x == 0) {
            state.teamA.life -= state.teamB.characters[i].attack;
            state.teamB.characters.splice(i, 1);
        }
    }
}

async function command() {
    let element1 = document.getElementById('teamA.select');
    const path1 = "./tactics/" + element1.value + ".js";
    const module1 = await import(path1);
    const tactics1 = new module1.Tactics();
    const result1= tactics1.exec(state.time, state.teamA, state.teamB);

    for (var i = 0; i < state.teamA.characters.length; i++) {
        state.teamA.characters[i].x = WIDTH - 1 - state.teamA.characters[i].x;
        state.teamA.characters[i].y = HEIGHT - 1 - state.teamA.characters[i].y;
    }
    for (var i = 0; i < state.teamB.characters.length; i++) {
        state.teamB.characters[i].x = WIDTH - 1 - state.teamB.characters[i].x;
        state.teamB.characters[i].y = HEIGHT - 1 - state.teamB.characters[i].y;
    }

    let element2 = document.getElementById('teamB.select');
    const path2 = "./tactics/" + element2.value + ".js";
    const module2 = await import(path2);
    const tactics2 = new module2.Tactics();
    const result2 = tactics2.exec(state.time, state.teamB, state.teamA);

    for (var i = 0; i < state.teamA.characters.length; i++) {
        state.teamA.characters[i].x = WIDTH - 1 - state.teamA.characters[i].x;
        state.teamA.characters[i].y = HEIGHT - 1 - state.teamA.characters[i].y;
    }
    for (var i = 0; i < state.teamB.characters.length; i++) {
        state.teamB.characters[i].x = WIDTH - 1 - state.teamB.characters[i].x;
        state.teamB.characters[i].y = HEIGHT - 1 - state.teamB.characters[i].y;
    }

    for (var i = 0; i < result1.length; i++) {
        generate(0, result1[i][0], "teamA", result1[i][1]);
    }

    for (var i = 0; i < result2.length; i++) {
        generate(WIDTH - 1, HEIGHT - 1 - result2[i][0], "teamB", result2[i][1]);
    }
}

function generate(x, y, team, type) {
    if (state[team].money >= CHARACTER_TYPES[type].cost) {
        state[team].characters.push({
            type: type,
            life: CHARACTER_TYPES[type].life,
            attack: CHARACTER_TYPES[type].attack,
            range: CHARACTER_TYPES[type].range,
            x: x,
            y: y,
        });
        state[team].money -= CHARACTER_TYPES[type].cost;
    }
}
