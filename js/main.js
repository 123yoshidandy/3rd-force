const WIDTH = 200;
const HEIGHT = 100;

const ASPECT_RATIO = 5;
const ARM_SIZE = 20;

const FIRE_RANGE = 10;

const TACTICS = ["sample", "random", "kazuki.main"];

const ARM_TYPES = {
    infantry: {
        type: "infantry",
        onAir: false,
        vsEarth: true,
        vsAir: false,
        life: 100,
        attack: 100,
        range: 10,
        cooltime: 10,
        bullets: 4,
        speed: 0.8,
        cost: 500,
        color: "red",
    },
    tank: {
        type: "tank",
        onAir: false,
        vsEarth: true,
        vsAir: false,
        life: 400,
        attack: 200,
        range: 20,
        cooltime: 15,
        bullets: 4,
        speed: 1.0,
        cost: 1000,
        color: "green",
    },
    rocket: {
        type: "rocket",
        onAir: false,
        vsEarth: true,
        vsAir: false,
        life: 200,
        attack: 100,
        range: 40,
        cooltime: 10,
        bullets: 8,
        speed: 1.0,
        cost: 1000,
        color: "yellow",
    },
    missile: {
        type: "missile",
        onAir: false,
        vsEarth: false,
        vsAir: true,
        life: 200,
        attack: 200,
        range: 40,
        cooltime: 25,
        bullets: 4,
        speed: 1.0,
        cost: 1000,
        color: "blue",
    },
    cannon: {
        type: "cannon",
        onAir: false,
        vsEarth: true,
        vsAir: true,
        life: 300,
        attack: 100,
        range: 20,
        cooltime: 10,
        bullets: 8,
        speed: 1.0,
        cost: 1000,
        color: "gray",
    },
    attacker: {
        type: "attacker",
        onAir: true,
        vsEarth: true,
        vsAir: false,
        life: 200,
        attack: 400,
        range: 20,
        cooltime: 10,
        bullets: 4,
        speed: 1.5,
        cost: 2000,
        color: "lime",
    },
    fighter: {
        type: "fighter",
        onAir: true,
        vsEarth: false,
        vsAir: true,
        life: 400,
        attack: 400,
        range: 40,
        cooltime: 10,
        bullets: 4,
        speed: 2.0,
        cost: 2000,
        color: "aqua",
    },
    bomber: {
        type: "bomber",
        onAir: true,
        vsEarth: false,
        vsAir: false,
        life: 200,
        attack: 100,
        range: 0,
        cooltime: 10,
        bullets: 4,
        speed: 2.0,
        cost: 2000,
        color: "red",
    },
};

var state = {};
var timer = null;
var scene = null
var images = {};

var IS_VIEW = true;
var IS_THREE_VIEW = false;
var IS_RANKING = true;
var interval = 0;

var winners = {};
var rankingA = 0;
var rankingB = 0;

window.addEventListener('load', init);

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
    restart();
}

function restart() {
    IS_VIEW = document.getElementById('view.select').value == "on";
    IS_THREE_VIEW = document.getElementById('three.select').value == "on";
    IS_RANKING = document.getElementById('ranking.select').value == "ranking";

    if (IS_VIEW) {
        for (var arm in ARM_TYPES) {
            images[arm + "A"] = new Image();
            images[arm + "A"].src = "./img/" + arm + "A.png";
            images[arm + "B"] = new Image();
            images[arm + "B"].src = "./img/" + arm + "B.png";
        }
    }
    if (IS_THREE_VIEW) {
        init_three();
    }

    state = {
        time: 0,
        teamA: {
            life: 1000,
            money: 1000,
            arms: [],
        },
        teamB: {
            life: 1000,
            money: 1000,
            arms: [],
        },
        fired: [],
        bursted: [],
    };
    state.teamA.enemy = state.teamB;
    state.teamB.enemy = state.teamA;

    IS_VIEW = document.getElementById('view.select').value == "on";
    IS_THREE_VIEW = document.getElementById('three.select').value == "on";
    IS_RANKING = document.getElementById('ranking.select').value == "ranking";

    if (timer != null) {
        clearInterval(timer);
    }
    timer = setInterval(loop, interval);
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
    if (state.teamA.life <= 0 || state.teamB.life <= 0 || state.time >= 5000) {
        var winner;
        if (state.teamA.life > state.teamB.life) {
            winner = document.getElementById('teamA.select').value;
        } else if (state.teamA.life < state.teamB.life) {
            winner = document.getElementById('teamB.select').value;
        } else {
            winner = null;
        }

        clearInterval(timer);
        document.getElementById("time_text").textContent = "Winner is " + winner;

        if (IS_RANKING) {
            if (rankingA != rankingB && winner != null) {
                if (winners[winner] == undefined || winners[winner] == null) {
                    winners[winner] = 0;
                }
                winners[winner]++;
                document.getElementById("ranking_text").textContent = JSON.stringify(winners);
            }

            rankingA++;
            if (rankingA >= TACTICS.length) {
                rankingA = 0;
                rankingB++;
            }
            if (rankingB >= TACTICS.length) {
                document.getElementById("ranking_text").textContent = JSON.stringify(winners);
                return;
            }
            document.getElementById('teamA.select').value = TACTICS[rankingA];
            document.getElementById('teamB.select').value = TACTICS[rankingB];
            restart();
        }
    }

    state.time++;
}

function view() {
    document.getElementById("time_text").textContent = "time  : " + state.time;
    document.getElementById("teamA.life").value = state.teamA.life;
    document.getElementById("teamA.money").innerText = state.teamA.money;
    document.getElementById("teamB.life").value = state.teamB.life;
    document.getElementById("teamB.money").innerText = state.teamB.money;

    if (!IS_VIEW) {
        return;
    }

    const canvas = document.getElementById('field_canvas');
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (var x = 0; x < 20; x++) {
        for (var y = 0; y < 10; y++) {
            ctx.fillStyle = "#455A64";
            ctx.fillRect(x * 50, y * 50, 49, 49);
        }
    }

    for (var arm of state.teamA.arms) {
        ctx.drawImage(images[arm.type + "A"], arm.x * ASPECT_RATIO, arm.y * ASPECT_RATIO - 10, ARM_SIZE * 1.5, ARM_SIZE * 1.5);
    }

    for (var arm of state.teamB.arms) {
        ctx.drawImage(images[arm.type + "B"], arm.x * ASPECT_RATIO, arm.y * ASPECT_RATIO - 10, ARM_SIZE * 1.5, ARM_SIZE * 1.5);
    }

    for (var fired of state.fired) {
        ctx.beginPath();
        ctx.moveTo(fired[0] * ASPECT_RATIO, fired[1] * ASPECT_RATIO);
        ctx.lineTo(fired[2] * ASPECT_RATIO, fired[3] * ASPECT_RATIO);
        ctx.strokeStyle = "white";
        ctx.lineWidth = 2;
        ctx.stroke();
    }
    state.fired = [];

    for (var bursted of state.bursted) {
        ctx.beginPath();
        ctx.arc(bursted[0] * ASPECT_RATIO, bursted[1] * ASPECT_RATIO, 100, 0 * Math.PI / 180, 360 * Math.PI / 180);
        ctx.fillStyle = "red";
        ctx.fill();
    }
    state.bursted = [];
}

function move() {
    for (var i = state.teamA.arms.length - 1; i >= 0; i--) {
        if (state.teamA.arms[i].return) {
            if (IS_THREE_VIEW) {
                scene.remove(state.teamA.arms[i].mesh);
            }
            state.teamA.money += state.teamA.arms[i].cost;
            state.teamA.arms.splice(i, 1);
        }
    }
    for (var i = state.teamB.arms.length - 1; i >= 0; i--) {
        if (state.teamB.arms[i].return) {
            if (IS_THREE_VIEW) {
                scene.remove(state.teamB.arms[i].mesh);
            }
            state.teamB.money += state.teamB.arms[i].cost;
            state.teamB.arms.splice(i, 1);
        }
    }

    for (var arm of state.teamA.arms.concat(state.teamB.arms)) {
        arm.stoped = true;
        var conflict = false;
        for (var friend of arm.friend.arms) {
            if (arm != friend && Math.abs(arm.x - friend.x) <= ASPECT_RATIO && Math.abs(arm.y - friend.y) <= ASPECT_RATIO && friend.stoped) {
                conflict = true;
            }
        }

        if (conflict) {
            arm.y -= arm.speed;
            if (IS_THREE_VIEW) {
                arm.mesh.position.y -= arm.speed * ASPECT_RATIO;
            }
            arm.stoped = false;

        } else if (arm.x < arm.destination) {
            if (arm.friend == state.teamA) {
                arm.x = Math.min(arm.x + arm.speed, arm.destination);
            } else {
                arm.x = Math.min(arm.x + 0.5 * arm.speed, arm.destination);
            }
            if (IS_THREE_VIEW) {
                arm.mesh.position.x = arm.x * ASPECT_RATIO;
            }

        } else if (arm.x > arm.destination) {
            if (arm.friend == state.teamA) {
                arm.x = Math.max(arm.x - 0.5 * arm.speed, arm.destination);
            } else {
                arm.x = Math.max(arm.x - arm.speed, arm.destination);
            }
            if (IS_THREE_VIEW) {
                arm.mesh.position.x = arm.x * ASPECT_RATIO;
            }
        }
    }
}

function attack_enemy() {
    for (var armA of state.teamA.arms) {
        if (armA.bullets > 0 && state.time > armA.fired + armA.cooltime) {
            var targets = [];
            for (var armB of state.teamB.arms) {
                if (armA.x <= armB.x
                    && armB.x <= armA.x + armA.range
                    && Math.abs(armA.y - armB.y) <= FIRE_RANGE
                    && ((armA.vsAir && armB.onAir) || (armA.vsEarth && !armB.onAir))
                ) {
                    targets.push(armB);
                }
            }
            if (targets.length > 0) {
                var target = Math.floor(Math.random() * targets.length);
                targets[target].life -= armA.attack;
                armA.bullets--;
                armA.fired = state.time;
                state.fired.push([armA.x, armA.y, targets[target].x, targets[target].y]);
            }
        }
    }

    for (var armB of state.teamB.arms) {
        if (armB.bullets > 0 && state.time > armB.fired + armB.cooltime) {
            var targets = [];
            for (var armA of state.teamA.arms) {
                if (armA.x <= armB.x
                    && armB.x - armB.range <= armA.x
                    && Math.abs(armA.y - armB.y) <= FIRE_RANGE
                    && ((armB.vsAir && armA.onAir) || (armB.vsEarth && !armA.onAir))
                ) {
                    targets.push(armA);
                }
            }
            if (targets.length > 0) {
                var target = Math.floor(Math.random() * targets.length);
                targets[target].life -= armB.attack;
                armB.bullets--;
                armB.fired = state.time;
                state.fired.push([armB.x, armB.y, targets[target].x, targets[target].y]);
            }
        }
    }

    for (var i = state.teamA.arms.length - 1; i >= 0; i--) {
        if (state.teamA.arms[i].life <= 0) {
            if (IS_THREE_VIEW) {
                scene.remove(state.teamA.arms[i].mesh);
            }
            state.teamA.arms.splice(i, 1);
        }
    }
    for (var i = state.teamB.arms.length - 1; i >= 0; i--) {
        if (state.teamB.arms[i].life <= 0) {
            if (IS_THREE_VIEW) {
                scene.remove(state.teamB.arms[i].mesh);
            }
            state.teamB.arms.splice(i, 1);
        }
    }
}

function attack_area() {
    for (var i = state.teamA.arms.length - 1; i >= 0; i--) {
        if (["infantry", "bomber"].includes(state.teamA.arms[i].type) && state.teamA.arms[i].x >= WIDTH - 1) {
            state.teamB.life -= state.teamA.arms[i].attack;
            state.bursted.push([state.teamA.arms[i].x, state.teamA.arms[i].y]);
            if (IS_THREE_VIEW) {
                scene.remove(state.teamA.arms[i].mesh);
            }
            state.teamA.arms.splice(i, 1);
        }
    }

    for (var i = state.teamB.arms.length - 1; i >= 0; i--) {
        if (["infantry", "bomber"].includes(state.teamB.arms[i].type) && state.teamB.arms[i].x <= 0) {
            state.teamA.life -= state.teamB.arms[i].attack;
            state.bursted.push([state.teamB.arms[i].x, state.teamB.arms[i].y]);
            if (IS_THREE_VIEW) {
                scene.remove(state.teamB.arms[i].mesh);
            }
            state.teamB.arms.splice(i, 1);
        }
    }
}

async function command() {
    let element1 = document.getElementById('teamA.select');
    const path1 = "./tactics/" + element1.value + ".js";
    const module1 = await import(path1);
    const tactics1 = new module1.Tactics();
    const result1 = tactics1.exec(state.time, state.teamA, state.teamB);

    for (var arm of state.teamA.arms.concat(state.teamB.arms)) {
        arm.x = WIDTH - 1 - arm.x;
        arm.y = HEIGHT - 1 - arm.y;
        arm.destination = WIDTH - 1 - arm.destination;
    }

    let element2 = document.getElementById('teamB.select');
    const path2 = "./tactics/" + element2.value + ".js";
    const module2 = await import(path2);
    const tactics2 = new module2.Tactics();
    const result2 = tactics2.exec(state.time, state.teamB, state.teamA);

    for (var arm of state.teamA.arms.concat(state.teamB.arms)) {
        arm.x = WIDTH - 1 - arm.x;
        arm.y = HEIGHT - 1 - arm.y;
        arm.destination = WIDTH - 1 - arm.destination;
    }

    for (var result of result1) {
        generate(state.teamA, result[1], result[0], {});  // TODO
    }

    for (var result of result2) {
        generate(state.teamB, result[1], HEIGHT - 1 - result[0], {});  // TODO
    }
}

function generate(friend, type, y, opt) {
    var life = ARM_TYPES[type].life * getOpt(opt, "life");
    var attack = ARM_TYPES[type].attack * getOpt(opt, "attack");
    var range = ARM_TYPES[type].range * getOpt(opt, "range");
    var cooltime = ARM_TYPES[type].cooltime * getOpt(opt, "cooltime");
    var bullets = ARM_TYPES[type].bullets * getOpt(opt, "bullets");
    var speed = ARM_TYPES[type].speed * getOpt(opt, "speed");
    var cost = ARM_TYPES[type].cost
        * getOpt(opt, "life")
        * getOpt(opt, "attack")
        * getOpt(opt, "range")
        * (1 / getOpt(opt, "cooltime"))
        * getOpt(opt, "bullets")
        * getOpt(opt, "speed");

    if (friend.money >= cost) {
        var x = 0;
        var destination = WIDTH;
        if (friend == state.teamB) {
            x = WIDTH;
            destination = WIDTH - destination;
        }

        for (var arm of friend.arms) {
            if (Math.abs(arm.x - x) <= ASPECT_RATIO && Math.abs(arm.y - y) <= ASPECT_RATIO) {
                return;
            }
        }

        if (IS_THREE_VIEW) {
            var geometry = new THREE.BoxGeometry(ARM_SIZE, ARM_SIZE, ARM_SIZE);
            var material = new THREE.MeshPhongMaterial({ color: ARM_TYPES[type].color });
            var box = new THREE.Mesh(geometry, material);
            box.position.x = x * ASPECT_RATIO;
            box.position.y = HEIGHT * ASPECT_RATIO - y * ASPECT_RATIO;
            box.position.z = ARM_SIZE / 2;
            scene.add(box);
        }

        friend.arms.push({
            friend: friend,
            enemy: friend.enemy,
            type: type,
            onAir: ARM_TYPES[type].onAir,
            vsEarth: ARM_TYPES[type].vsEarth,
            vsAir: ARM_TYPES[type].vsAir,
            life: life,
            attack: attack,
            range: range,
            cooltime: cooltime,
            bullets: bullets,
            speed: speed,
            cost: cost,
            destination: destination,
            fired: -100,
            x: x,
            y: y,
            stoped: false,
            return: false,
            mesh: box,
        });
        friend.money -= cost;
    }
}

function getOpt(opt, key) {
    result = key in opt ? opt[key] : 1.0;
    result = Math.min(result, 1.5);
    result = Math.max(result, 0.5);
    return result;
}


function init_three() {
    const renderer = new THREE.WebGLRenderer({
        canvas: document.querySelector('#three_Canvas')
    });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(WIDTH * ASPECT_RATIO, HEIGHT * ASPECT_RATIO);

    scene = new THREE.Scene();

    scene.add(new THREE.AmbientLight(0xFFFFFF, 1.0));
    var directionalLight = new THREE.DirectionalLight(0xFFFFFF, 1.0);
    directionalLight.position.set(WIDTH * ASPECT_RATIO, HEIGHT * ASPECT_RATIO, 100);
    scene.add(directionalLight);

    const camera = new THREE.PerspectiveCamera(60, (WIDTH * ASPECT_RATIO) / (HEIGHT * ASPECT_RATIO), 1, 10000);

    const controls = new THREE.OrbitControls(camera, document.querySelector('#three_Canvas'));
    controls.enableDamping = true;
    controls.dampingFactor = 0.2;

    camera.position.set(-50, -50, 250);
    camera.lookAt(new THREE.Vector3(WIDTH * ASPECT_RATIO, HEIGHT * ASPECT_RATIO, 0));
    camera.rotation.x = 0.70;
    camera.rotation.y = -0.70;
    camera.rotation.z = -0.10;
    // TODO: controlへの適用

    var axes = new THREE.AxisHelper(25);
    scene.add(axes);

    var geometry = new THREE.BoxGeometry(WIDTH * ASPECT_RATIO, HEIGHT * ASPECT_RATIO, 1);
    var material = new THREE.MeshPhongMaterial({ color: 0x555555 });
    var box = new THREE.Mesh(geometry, material);
    box.position.x = WIDTH * ASPECT_RATIO / 2;
    box.position.y = HEIGHT * ASPECT_RATIO / 2;
    scene.add(box);

    tick();
    function tick() {
        renderer.render(scene, camera);
        requestAnimationFrame(tick);
    }
}
