
var app = new PIXI.Application(1920, 1080, { backgroundColor: 0x1099bb });
document.body.appendChild(app.view);

// create a background...
var background = PIXI.Sprite.fromImage('/assets/2.jpg');
background.width = app.screen.width;
background.height = app.screen.height;
// add background to stage...
app.stage.addChild(background);
// var texture = PIXI.Texture.fromImage('assets/1.png');
// var bunny = new PIXI.Sprite(texture);
// bunny.x = app.screen.width / 2;
// bunny.y = app.screen.height / 2;
// setTimeout(() => {
//     console.log('texture.orig.width', texture.width)

//     bunny.pivot.x = texture.width / 2;
//     bunny.pivot.y = texture.height / 2;
//     bunny.rotation = 180 * (Math.PI / 180);
//     app.stage.addChild(bunny);
// }, 1000);


// Scale mode for all textures, will retain pixelation
PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;

// var sprite = PIXI.Sprite.fromImage('http://pixijs.io/examples/required/assets/basics/bunny.png');

// Set the initial position
// sprite.anchor.set(0.5);
// sprite.x = app.screen.width / 2;
// sprite.y = app.screen.height / 2;

// Opt-in to interactivity
// sprite.interactive = true;

// Shows hand cursor
// sprite.buttonMode = true;

// Pointers normalize touch and mouse
// sprite.on('pointerdown', onClick);
app.stage.interactive = true;
app.stage.buttonMode = true;
app.renderer.plugins.interaction.autoPreventDefault = false;
console.log('renderer', app.renderer.plugins.interaction.autoPreventDefault);
// console.log('app.stage', app.stage);
// app.stage.click = function(e){
//     console.log('!!!!', e.data.global);
//     var testCircle = new PIXI.Graphics();
//     testCircle.beginFill(0xff0000);
//     testCircle.drawCircle(e.data.global.x, e.data.global.y, 10);
//     testCircle.endFill();
//     app.stage.addChild(testCircle);
// 	// alert('click stage');
// }
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
function onDragStart(e) {
    this.data = e.data;

    // if (this.data.identifier !== 'MOUSE') {

    // alert('!!!!!');
    // console.log('e: ', e.data);
    this.dragging = true;
    var dotNum = app.stage.children.length - 1;
    // console.log('dotNum', dotNum);
    console.log('this.data.identifier: ', this.data.identifier);
    if (this.data.identifier === 0 && dotNum > 0) { // debug pc
        // if ((touches.findIndex(_touch => _touch.id === this.data.identifier)) > -1 && dotNum > 0) {

        console.log('~~~');
        if (dotNum > 2) {
            // app.stage.removeChild(bunny);

            app.stage.removeChild(app.stage.children[dotNum]); // 把印章刪掉
            app.stage.removeChild(app.stage.children[dotNum - 1]); // 把中心點去除

        }

        touches.forEach(_num => {
            app.stage.removeChildAt(1);
        });
        touches = [];

    }
    var touchPos = {
        x: Math.floor(this.data.global.x),
        y: Math.floor(this.data.global.y)
    }
    var touch = {
        // 主要依據 id 來判斷當下有幾隻手指在手機上
        id: this.data.identifier,
        pos: touchPos
    };
    // console.log('touch: ', touch);
    var testCircle = new PIXI.Graphics();
    if (isShowDot) {
        testCircle.beginFill(0xff0000); 
     } else {
        testCircle.beginFill(0xff0000, 0); 
     }
    testCircle.drawCircle(touch.pos.x, touch.pos.y, 10);
    testCircle.endFill();
    app.stage.addChild(testCircle);
    // console.log('touch: ', touch);
    touches.push(touch);
    touchHandler();
    // }
    // console.log('touches: ', touches);

}

function onDragEnd(e) {
    const dotNum = app.stage.children.length - 1;
    // console.log('app.stage.children', app.stage.children);
    // console.log('紅點數: ', dotNum);
    // console.log('touches: ', touches);
    this.data = e.data;
    // if (dotNum >=3 ) {
    //     console.log('cal~');
    // }
    // console.log('this.data.identifier: ', this.data.identifier);
    // for (var i = 0; i < touches.length; i++) {
    //     // 當離開的手指存在在 touches 陣列裡時，移除該筆資料
    //     if (touches[i].id === this.data.identifier) {
    //         touches.splice(i, 1);
    //     }
    // };
    this.dragging = false;
}

function touchHandler() {
    // 印出目前有幾隻手指按在螢幕上
    // console.log('印出目前有幾隻手指按在螢幕上: ', touches.length);
    if (touches.length === 3) {
        calcDistance();
    }
    // app.stage.removeChild(centerCircle);
}
// 畫一個方塊
var testGraphics = new PIXI.Graphics();
testGraphics.beginFill(0xff0000, 0);
testGraphics.drawRect(0, 0, 1920, 1080);
testGraphics.endFill();
app.stage.addChild(testGraphics);

function calcDistance() {
    // console.log('嘿嘿');
    // console.log('touches', touches);
    const dis = touches.map((_touch, idx) => {
        var anotherIdx;
        if (idx === touches.length - 1) {
            anotherIdx = 0;
        } else {
            anotherIdx = idx + 1;
        }
        // console.log('idx', idx);
        const { x, y } = touches[idx].pos;
        const _x = touches[anotherIdx].pos.x;
        const _y = touches[anotherIdx].pos.y;
        const distance = Math.sqrt(Math.pow(x - _x, 2) + Math.pow(y - _y, 2));
        // console.log('distance: ', distance);
        return distance;
    });
    console.log('dis: ', dis);
    const maxDistance = Math.max(...dis);
    console.log('max distance: ', maxDistance);
    const maxIdx = dis.findIndex(_dis => _dis === maxDistance);
    calcPhotoCenter(maxIdx);
    calcPhotoAngle(maxIdx);
    renderStamp();

}
var stamp;
function renderStamp() {
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
    if (maxIdx === 0) {
        anotherIdx = touches.length - 1;
    } else {
        anotherIdx = maxIdx - 1;
    }
    const { x, y } = touches[maxIdx].pos;
    const _x = touches[anotherIdx].pos.x;
    const _y = touches[anotherIdx].pos.y;
    var cX = _x - x;
    var cY = _y - y;
    var xrad = Math.atan2(cY, cX);
    angle = xrad / Math.PI * 180;
    angle = angle;
    console.log('angle: ', angle);
}
var centerX, centerY;
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
    console.log('centerX: ', centerX);
    console.log('centerY: ', centerY);
    var centerCircle = new PIXI.Graphics();
    if (isShowDot) {
       centerCircle.beginFill(0x00FF00); 
    } else {
       centerCircle.beginFill(0x00FF00, 0); 
        
    }
    
    centerCircle.drawCircle(centerX, centerY, 10);
    centerCircle.endFill();
    app.stage.addChild(centerCircle);
}


function onClick() {
    console.log('!!!');
    // sprite.scale.x *= 1.25;
    // sprite.scale.y *= 1.25;
}
