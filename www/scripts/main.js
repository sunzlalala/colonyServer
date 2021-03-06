var canvas = document.getElementById('main_canvas'),
    ctx = canvas.getContext('2d'),
    background = new Image(),
    res = new Image();
background.src = './images/background.main.jpg'; //主界面的背景图
res.src = './images/resources.png'; //图标资源

var camp = 1, //阵营
    ratio = 1, //客户端的
    lastSelect, //只点击星球一次时
    lastTime, //上一帧的时间，计算fps
    timer = 0, //游戏进行的时间
    debug = false, //显示调试信息
    pause = false, //是否暂停游戏
    zoom = 1, //界面相对于2000*1000的缩放倍率
    fps = 60, //fps
    mapSelect, //所选地图在data数组中的索引
    uievent = false; //是否运行过controlUI，防止多次注册事件

var innerMapData = {
    "maps": [{
        "map": [
            [400, 400, 2, 1, 1],
            [1200, 800, 1, 2, 1]
        ],
        "equality": false, //地图是否对所以玩家平等
        "maxCamp": 2 //最大玩家数
    }, {
        "map": [
            [400, 400, 1, 1, 1],
            [400, 800, 2, 1, 1],
            [1200, 800, 3, 2, 2, 1200, 600, 200, 200, 0.75],
            [1200, 400, 3, 3, 3],
            [600, 200, 1, 0, 1]
        ],
        "equality": false,
        "maxCamp": 6
    }, {
        "map": [
            [1000, 500, 4, 2, 1],
            [400, 200, 2, 1, 1],
            [1600, 200, 2, 1, 1],
            [1000, 800, 2, 1, 1]
        ],
        "equality": true,
        "maxCamp": 2
    }, {
        "map": [
            [400, 400, 4, 1, 1],
            [1200, 400, 2, 2, 1],
            [800, 800, 2, 3, 1],
            [1400, 800, 2, 1, 1]
        ],
        "equality": true,
        "maxCamp": 3
    }, {
        "map": [
            [400, 200, 1, 1, 1],
            [600, 200, 1, 1, 1],
            [400, 500, 1, 1, 1],
            [600, 500, 1, 1, 1],
            [400, 800, 1, 1, 1],
            [600, 800, 1, 1, 1],
            [1500, 200, 1, 2, 1],
            [1500, 400, 1, 2, 1],
            [1500, 600, 1, 2, 1],
            [1500, 800, 1, 2, 1],
            [1400, 300, 1, 2, 1],
            [1400, 800, 1, 2, 1],
            [1600, 800, 1, 2, 1]
        ],
        "equality": true,
        "maxCamp": 2
    }, {
        "map": [
            [600, 200, 1, 1, 1],
            [400, 400, 1, 1, 1],
            [1600, 800, 1, 1, 1],
            [1000, 500, 3, 1, 1],
            [800, 800, 4, 2, 1],
            [1200, 600, 1, 2, 1]
        ],
        "equality": true,
        "maxCamp": 2
    }, {
        "map": [
            [600, 200, 1, 1, 1],
            [400, 400, 1, 1, 1],
            [1600, 800, 1, 1, 1],
            [1000, 500, 3, 1, 1],
            [800, 800, 4, 2, 1],
            [1200, 600, 1, 2, 1]
        ],
        "equality": true,
        "maxCamp": 2
    }, {
        "map": [
            [400, 200, 2, 2, 1],
            [1600, 200, 2, 2, 1],
            [1000, 900, 2, 2, 1],
            [800, 400, 2, 1, 1],
            [1200, 400, 2, 1, 1],
            [1000, 600, 2, 1, 1]
        ],
        "equality": true,
        "maxCamp": 2
    }, {
        "map": [
            [1000, 200, 1, 3, 1],
            [1000, 500, 1, 3, 1],
            [1000, 800, 1, 3, 1],
            [700, 500, 4, 1, 1],
            [1300, 500, 4, 2, 1]
        ],
        "equality": true,
        "maxCamp": 3
    }, {
        "map": [
            [800, 400, 1, 0, 1],
            [1000, 500, 2, 0, 1],
            [1200, 600, 1, 0, 1],
            [600, 600, 3, 1, 1],
            [1400, 400, 3, 2, 1]
        ],
        "equality": true,
        "maxCamp": 2
    }, {
        "map": [
            [400, 400, 2, 1, 1],
            [400, 600, 2, 1, 1],
            [600, 500, 1, 0, 1],
            [800, 400, 4, 0, 1],
            [900, 540, 3, 0, 1],
            [1100, 460, 3, 0, 1],
            [1200, 600, 4, 0, 1],
            [1400, 500, 1, 0, 1],
            [1600, 400, 2, 2, 1],
            [1600, 600, 2, 2, 1]
        ],
        "equality": true,
        "maxCamp": 2
    }, {
        "map": [
            [200, 200, 2, 1, 1],
            [200, 800, 2, 1, 1],
            [300, 500, 2, 1, 1],
            [500, 500, 2, 1, 1],
            [600, 200, 2, 1, 1],
            [600, 800, 2, 1, 1],
            [800, 200, 2, 2, 1],
            [800, 800, 2, 2, 1],
            [1200, 200, 2, 2, 1],
            [1000, 400, 2, 2, 1],
            [1000, 600, 2, 2, 1],
            [1200, 800, 2, 2, 1],
            [1400, 200, 2, 3, 1],
            [1600, 200, 2, 3, 1],
            [1800, 200, 2, 3, 1],
            [1600, 400, 2, 3, 1],
            [1600, 600, 2, 3, 1],
            [1600, 800, 2, 3, 1]
        ],
        "equality": true,
        "maxCamp": 3
    }],
    "date": "2017.1.24",
    "author": "w12101111"
}; //内置地图

var config = {
    maxPopulation: 20, //size为1时最大人口
    initPopulation: 10, //开局时每个camp不为0且type为1或3的星球size为1时的人口
    maxCamp: 6, //最大阵营数
    globalSpeed: 1, //公共速度
    growthSpeed: 1, //人口增长速度
    shipSpeed: 100, //飞船飞行速度
    starspeed: 0.04, //行星移动速度
    combatSpeed: 3.5, //战斗速度
    captureSpeed: 0.2, //对行星的占领速度
    shootSpeed: 1.5, //可攻击行星的攻击速度
    shootRange: 100, //可攻击行星的攻击范围
    aiThinkSpeed: 500 //本地AI的运行间隔
};
var color = ["DimGray", "Orchid", "SpringGreen", "OrangeRed", "DodgerBlue", "Black", "IndianRed"]; //对应各camp的颜色
var resValue = {
    OffSetX: [0, 0], //res图片的x起始坐标
    OffSetY: [0, 0],
    w: [180, 180], //res图片一个图标的宽度
    h: [180, 180]
};


var data = {}; //地图集
var stars = []; //行星对象的数组
var ships = []; //飞船对象的数组

function canvasResize() { //窗口缩放时运行，使canvas全屏
    ctx.scale(1 / zoom, 1 / zoom); //将原缩放恢复
    var w = window.innerWidth,
        h = window.innerHeight;
    var s = w / 2 > h;
    zoom = s ? h / 1000 : w / 2000;
    ctx.canvas.width = window.innerWidth;
    ctx.canvas.height = window.innerHeight;
    ctx.scale(zoom, zoom);
    $("#shipRatio").css("margin-left", window.innerWidth / 2 - 250 + "px"); //保证滑动条居中
}

function windowTocanvas(canvas, x, y) { //获取坐标
    var bbox = canvas.getBoundingClientRect();
    return {
        x: (x - bbox.left * (canvas.width / bbox.width)) / zoom,
        y: (y - bbox.top * (canvas.height / bbox.height)) / zoom //返回的是相对于2000*1000的坐标
    };
}

function calculateFpsAndTime() { //计算fps和总时间
    var now = Date.now();
    timer += now - lastTime;
    fps = 1000 / (now - lastTime);
    lastTime = now;
    document.getElementById("input_time").value = Math.floor(timer / 60000) + ":" + Math.floor(timer / 1000) % 60;
    document.getElementById("input_fps").value = 'fps: ' + fps.toFixed();
}

function distance(x1, y1, x2, y2) {
    return Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1));
}

function drawBackground(callback2) { //绘制背景
    function imageLoad(callback) {
        if (background.complete) {
            callback.call(background);
            return;
        }
        background.onload = function () {
            callback.call(background);
        };
    }
    try {
        imageLoad(function () {
            ctx.drawImage(this, 0, 0, canvas.width / zoom, canvas.height / zoom);
            if(callback2)callback2();
        });
    } catch (e) {
        console.log("background load fail!" + e);
    }
}


function shipOut(from, to, camp, ratio, isReceive) { //移动飞船
    if (from === to) return; //from：飞船出发的星球索引，to：飞船前往的星球索引，camp：飞船的阵营，ratio：派走的比例
    if (!stars[from].population[camp]) return;
    var movePopulation = stars[from].population[camp] * ratio; //不必为整数
    stars[from].out(movePopulation, camp);
    var shipArray = [stars[from].x, stars[from].y, from, to, camp, movePopulation, stars[from].x, stars[from].y]
    var aship = new Ship(shipArray);
    if (connected && !isReceive) { //isReceive为真，表示该操作为服务器传来，无需再向服务器发送
        sendMsg(JSON.stringify({ //发送操作
            type: "ship",
            ship: [from, to, camp, ratio]
        }));
    }
    ships.push(aship); //推入ships队列
}


function title() { //加载后的初始界面
    drawBackground(function () {
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.font = "160pt Arial";
        ctx.fillText("colony", 1000, 400);
        ctx.font = "42pt Arial";
        ctx.fillStyle = "black";
        ctx.fillText("click to start", 1000, 800);
    });
}


function init() { //程序入口
    window.addEventListener("resize", canvasResize); //缩放时执行
    window.addEventListener("resize", title);
    canvasResize();
    title();
    document.getElementById("connect").onclick = function (e) {//连接服务器
        wsUrl = document.getElementById("ip").value;
        id = document.getElementById("id").value;
        if (!id) {
            alert("Id must not be empty");
            return;
        }
        createWebSocket(wsUrl);
        $("#connect").hide();
        $("#ip").hide();
        $("#id").hide();
    };
    document.getElementById("cancel").onclick = function () { //取消等待
        sendMsg(JSON.stringify({
            type: "exit",
            id: id,
            uuid: uuid
        }));
        reconnect = true;
        id=undefined;
        uuid=undefined;
        ws.close();
    };
    document.getElementById("main_canvas").onclick = function (e) { //使用内置地图
        $(".file").hide();
        data = innerMapData;
        main(0);
        this.onclick = undefined;
        window.removeEventListener("resize", title);
    };
    document.getElementById("file").onchange = function (e) {
        var selectedFile = e.target.files[0];
        var reader = new FileReader();
        reader.readAsText(selectedFile);
        reader.onload = function () {
            data = JSON.parse(this.result);
            $(".file").hide();
            main(0);
            window.removeEventListener("resize", title);
        };
    }
}

function main(status) {
    if (status === 1) {

        $("#pos").hide();
        stars = [];
        ships = [];
    } else if (status === 2) {
        $("#pos").hide();

        stars = [];
        ships = [];
    } else if (status === 3) {
        $("#pos").hide();
        stars = [];
        ships = [];
    } else if (status === 4) {
        window.removeEventListener("resize", title);
        document.getElementById("main_canvas").onclick = undefined;
        $(".file").hide();
        var title = function () {
            drawBackground(function () {
                ctx.textAlign = "center";
                ctx.textBaseline = "middle";
                ctx.font = "160pt Arial";
                ctx.fillText("colony", 1000, 400);
                ctx.font = "42pt Arial";
                ctx.fillStyle = "black";
                ctx.fillText("wait for other player ...", 1000, 800);
            });
        };
        window.addEventListener("resize", title);
        title();
        $("#pos").hide();
        $("#cancel").show();
        return;
    }
    canvasResize();
    drawBackground();
    var len = data.maps.length;
    var text = "<div id=\"choose\">";
    for (var i = 1; i <= len; i++) {
        text += "<button type=\"button\" class=\"choose_map\" id=\"map" + i + "\">" + i + "</button>";
    }
    text += "</div>";
    $("#pos").before(text);
    $("button.choose_map").click(function () {
        mapSelect = parseInt($(this).attr("id").substring(3)); //mapX
        $("button.choose_map").hide();
        if (!isadmin) {
            loadMap();
        } else {
            sendMsg(JSON.stringify({
                type: "mapUpload",
                map: data.maps[mapSelect - 1]
            }));
        }
    });
}

function loadMap() {
    lastSelect = undefined;
    ratio = 1;
    pause = false;
    lastTime = Date.now();
    timer = 0;
    config.maxCamp = data.maps[mapSelect - 1].maxCamp;
    for (var i = 0, len = data.maps[mapSelect - 1].map.length; i < len; i++) {
        var starArray = data.maps[mapSelect - 1].map[i];
        var astar = new Star(starArray, i);
        stars.push(astar);
    }
    $("#pos").show();
    $("#range").show();
    window.requestAnimationFrame(animation);
    ai();
    controlUI();
    background.src = "./images/background.jpg";
}

function controlUI() {
    if (uievent) {
        return;
    }
    document.getElementById("main_canvas").onclick = undefined;
    canvas.addEventListener("touchstart", function (e) {
        select(e);
        e.preventDefault();
    });
    canvas.addEventListener("mousedown", function (e) {
        select(e);
        e.preventDefault();
    });
    window.addEventListener("resize", function () {
        updateFrame();
    });
    document.getElementById("pause").onclick = function (e) {
        e.preventDefault();
        e.stopPropagation();
        pause = !pause;
        this.innerText = pause ? "Start" : "Pause";
        if (!pause) {
            lastTime = Date.now(); //不把暂停时间计入总时间
            animation();
        }
    };
    document.getElementById("ship_control").onclick = function (e) {
        var shipControlInput = document.getElementById("ship_from_to").value; //from,to,camp
        var from = parseInt(shipControlInput),
            to = parseInt(shipControlInput.substring(from.toString().length + 1)),
            camp = parseInt(shipControlInput.substring(from.toString().length + to.toString().length + 2));
        shipOut(from, to, camp, ratio);
    };
    document.getElementById("shipRatio").onchange = function (e) {
        document.getElementById("shipRatioText").innerText = this.value + "%";
        ratio = parseInt(this.value) / 100;
    };
    document.getElementById("exit").onclick = function (e) {
        e.preventDefault();
        e.stopPropagation();
        pause = true;
        main(3);
    };
    uievent = true;
}

function select(e) {
    var cx = e.clientX || e.touches[0].clientX,
        cy = e.clientY || e.touches[0].clientY;
    var loc = windowTocanvas(canvas, cx, cy);
    var zx = parseInt(loc.x);
    var zy = parseInt(loc.y);
    var x = zx / zoom; //test only
    var y = zy / zoom; //test only
    document.getElementById("input_canvas").value = "X，Y：" + zx + "," + zy; //test only
    document.getElementById("input_map").value = "map X,Y: " + parseInt(x) + "," + parseInt(y); //test only
    if (pause) return;
    var match = false;
    for (var i = 0, len = stars.length; i < len; i++) {
        var astar = stars[i];
        var starDistance = distance(zx, zy, astar.x, astar.y);
        if (starDistance < 12 * astar.size + 36) {
            //document.getElementById("input_select").value = i; //test only
            if (typeof lastSelect === 'undefined') {
                lastSelect = i;
            } else {
                shipOut(lastSelect, i, camp, ratio);
                lastSelect = undefined;
            }
            match = true;
            break;
        }
    }
    if (!match) {
        //document.getElementById("input_select").value = "none"; //test only
        lastSelect = undefined;
    }
}

function updateFrame() {
    ctx.clearRect(0, 0, canvas.width / zoom, canvas.height / zoom);
    drawBackground();
    stars.forEach(function (star) {
        star.frame();
    });
    ships.forEach(function (ship) {
        //if (!ship) return;
        ship.frame();
    });
    wincheck();
}

function wincheck() {
    var allPopulation = [];
    var win = true;
    var fail = true;
    for (var i = 0; i < config.maxCamp + 1; i++) {
        allPopulation[i] = 0;
        for (var j = 0; j < stars.length; j++) {
            if (!stars[j].population[i]) continue;
            allPopulation[i] += stars[j].population[i];
        }
        for (j = 0; j < ships.length; j++) {
            if (!ships[j] || ships[j].camp !== i || !ships[j].population) continue;
            allPopulation[i] += ships[j].population;
        }
        if (allPopulation[i] && i !== 1) {
            win = false;
        }
    }
    if (allPopulation[1]) {
        fail = false;
    }
    if (win) {
        setTimeout(function () {
            pause = true;
            //main(1);
        }, 500);
    }
    if (fail) {
        setTimeout(function () {
            pause = true;
            //main(2);
        }, 500);
    }
}

function animation() {
    if (!pause) {
        updateFrame();
        calculateFpsAndTime();
        window.requestAnimationFrame(animation);
    }
}

function debugOn() {
    debug = true;
    $("#input_canvas").show();
    $("#input_map").show();
    $("#input_fps").show();
    $("#input_ping").show();
    $("#ship_control").show();
    $("#ship_from_to").show();
}
debugOn();