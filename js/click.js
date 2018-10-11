
var app = new PIXI.Application(1920, 1080, { backgroundColor: 0x1099bb });
document.body.appendChild(app.view);

// create a background...
var background = PIXI.Sprite.fromImage('/assets/2.jpg');
background.width = app.screen.width;
background.height = app.screen.height;
// add background to stage...
app.stage.addChild(background);

// Scale mode for all textures, will retain pixelation
PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;

app.stage.interactive = true;
app.stage.buttonMode = true;

var touches = [];

app.stage
    .on('pointerdown', onDragStart)
    .on('pointerup', onDragEnd)
    .on('pointerupoutside', onDragEnd);
// app.stage
//     .on('touchstart', onDragStart)
//     .on('touchend', onDragEnd)
//     .on('touchendoutside', onDragEnd);
var isShowDot = false;
if (location.search === '?dot') {
    isShowDot = true;
}
function showDot() {
    isShowDot = true;
}
var testCircle1 = new PIXI.Graphics();
var testCircle2 = new PIXI.Graphics();
var testCircle3 = new PIXI.Graphics();
var dotNum;

function onDragStart(e) {
    this.data = e.data;
    this.dragging = true;
    dotNum = app.stage.children.length - 1;

    var touchPos = {
        x: Math.floor(this.data.global.x),
        y: Math.floor(this.data.global.y)
    }
    var touch = {
        // 主要依據 id 來判斷當下有幾隻手指在手機上
        id: this.data.identifier,
        pos: touchPos
    };
    if (touches.length <= 2) {
        touches.push(touch);
    }
    if (touches.length === 1) {
        testCircle1 = new PIXI.Graphics();
        if (isShowDot) {
            testCircle1.beginFill(0x99ffff);
        } else {
            testCircle1.beginFill(0x99ffff, 0);
        }
        testCircle1.drawCircle(touch.pos.x, touch.pos.y, 10);
        testCircle1.endFill();
        app.stage.addChild(testCircle1);
    }
    if (touches.length === 2) {
        testCircle2 = new PIXI.Graphics();
        if (isShowDot) {
            testCircle2.beginFill(0x99ffff);
        } else {
            testCircle2.beginFill(0x99ffff, 0);
        }
        testCircle2.drawCircle(touch.pos.x, touch.pos.y, 10);
        testCircle2.endFill();
        app.stage.addChild(testCircle2);
    }
    if (touches.length === 3) {
        testCircle3 = new PIXI.Graphics();
        if (isShowDot) {
            testCircle3.beginFill(0x99ffff);
        } else {
            testCircle3.beginFill(0x99ffff, 0);
        }
        testCircle3.drawCircle(touch.pos.x, touch.pos.y, 10);
        testCircle3.endFill();
        app.stage.addChild(testCircle3);
    }
    touchHandler();
}

function onDragEnd(e) {

    const dotNum = app.stage.children.length - 1;
    this.data = e.data;

    console.log('this.data.identifier: ', this.data.identifier);
    for (var i = 0; i < touches.length; i++) {
        // 當離開的手指存在在 touches 陣列裡時，移除該筆資料
        if (touches[i].id === this.data.identifier) {
            touches.splice(i, 1);
        }
    };
    this.dragging = false;
}

function touchHandler() {
    // 印出目前有幾隻手指按在螢幕上
    // console.log('印出目前有幾隻手指按在螢幕上: ', touches.length);
    if (touches.length === 3) {
        calcDistance();
    } else {
        app.stage.removeChild(stamp); // 把印章刪掉
        app.stage.removeChild(centerCircle); // 把中心點去除    
    }
    app.stage.removeChild(testCircle1);
    app.stage.removeChild(testCircle2);
    app.stage.removeChild(testCircle3);
}

function calcDistance() {
    const dis = touches.map((_touch, idx) => {
        var anotherIdx;
        if (idx === touches.length - 1) {
            anotherIdx = 0;
        } else {
            anotherIdx = idx + 1;
        }
        const { x, y } = touches[idx].pos;
        const _x = touches[anotherIdx].pos.x;
        const _y = touches[anotherIdx].pos.y;
        const distance = Math.sqrt(Math.pow(x - _x, 2) + Math.pow(y - _y, 2));
        return distance;
    });
    const maxDistance = Math.max(...dis);
    const maxIdx = dis.findIndex(_dis => _dis === maxDistance);
    calcPhotoCenter(maxIdx);
    calcPhotoAngle(maxIdx);
    renderStamp();
}
var stamp;
function renderStamp() {
    app.stage.removeChild(stamp); // 把印章刪掉
    var texture = PIXI.Texture.fromImage('assets/1.png');
    stamp = new PIXI.Sprite(texture);

    setTimeout(() => {
        stamp.x = centerX;
        stamp.y = centerY;

        stamp.pivot.x = texture.width / 2;
        stamp.pivot.y = texture.height / 2;
        stamp.rotation = angle * (Math.PI / 180);
        app.stage.addChild(stamp);

    }, 300);

}
var angle;
function calcPhotoAngle(maxIdx) {
    var anotherIdx;
    console.log('touches[0]: ', touches[0].x, touches[0].x);
    console.log('touches[1]: ', touches[1].x, touches[1].x);
    console.log('touches[2]: ', touches[2].x, touches[2].x);
    
    console.log('maxIdx: ', maxIdx);
    if (maxIdx === 0) {
        anotherIdx = touches.length - 1;
    } else {
        anotherIdx = maxIdx - 1;
    }
    const { x, y } = touches[anotherIdx].pos;
    const _x = touches[maxIdx].pos.x;
    const _y = touches[maxIdx].pos.y;
    var cX = _x - x;
    var cY = _y - y;
    var xrad = Math.atan2(cY, cX);
    angle = xrad / Math.PI * 180;
    angle = angle;
    console.log('xrad: ', xrad);
    
    console.log('angle: ', angle);
}
var centerX, centerY;
var centerCircle;
function calcPhotoCenter(maxIdx) {
    // console.log('touches', touches);
    // console.log('maxIdx: ', maxIdx);
    var anotherIdx;
    if (maxIdx === touches.length - 1) {
        anotherIdx = 0;
    } else {
        anotherIdx = maxIdx + 1;
    }
    const { x, y } = touches[maxIdx].pos;
    const _x = touches[anotherIdx].pos.x;
    const _y = touches[anotherIdx].pos.y;
    centerX = (x + _x) / 2;
    centerY = (y + _y) / 2;
    // console.log('centerX: ', centerX);
    // console.log('centerY: ', centerY);
    app.stage.removeChild(centerCircle); // 把中心點去除
    centerCircle = new PIXI.Graphics();
    if (isShowDot) {
        centerCircle.beginFill(0x00FF00);
    } else {
        centerCircle.beginFill(0x00FF00, 0);

    }

    centerCircle.drawCircle(centerX, centerY, 10);
    centerCircle.endFill();
    app.stage.addChild(centerCircle);
}
