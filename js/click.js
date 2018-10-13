
var app = new PIXI.Application(window.innerWidth, window.innerHeight - 30, { backgroundColor: 0x1099bb });
// var app = new PIXI.Application(800, 600, { backgroundColor: 0x1099bb });

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

var isLineMode = false;
if (location.search === '?line') {
  isLineMode = true;
}

function showDot() {
    isShowDot = true;
}

var isPCMode = false;
if ('ontouchstart' in document.documentElement) {
    isPCMode = false;
    // alert('支援多點觸控');
} else {
    isPCMode = true;
    // alert('不支援多點觸控');
}
var ansNum;
function getRandomInt(min, max) {
  ansNum = Math.floor(Math.random() * (max - min + 1)) + min;
  console.log('ansNum: ', ansNum);
  return ansNum;
}

getRandomInt(1, 16);

var centerArr = [];
var xd = app.screen.width / 8;
var yd = app.screen.height / 8;
console.log('xd: ', xd);
console.log('yd: ', yd);

var startx = 0,
    starty = 0,
    endx = 4,
    endy = 4;
for (; startx < endx; startx++) {
  for (starty = 0; starty < endy; starty++) {
    var x = xd + starty * 2 * xd;
    var y = yd + startx * 2 * yd;
    console.log(x, y);
    centerArr.push({ x, y });
  }
}

console.log('centerArr: ', centerArr);

var ansPoint = centerArr[ansNum - 1];
console.log('ansPoint', ansPoint);
var toloranceD = xd > yd ? xd : yd;
console.log('toloranceD: ', toloranceD);
renderStamp(ansPoint);

var countingText = new PIXI.Text('倒數: 5', {
  fontWeight: 'bold',
  fontStyle: 'italic',
  fontSize: 60,
  fontFamily: 'Arvo',
  fill: '#3e1707',
  align: 'center',
  stroke: '#a4410e',
  strokeThickness: 7
});
countingText.x = app.screen.width / 2;
countingText.y = 0;
countingText.anchor.x = 0.5;
app.stage.addChild(countingText);
var count = 5;
var isCanPlay = false;
app.ticker.add(function() {
    count -= 0.02;
    // update the text with a new string
    countingText.text = '倒數: ' + Math.floor(count);
    if (Math.floor(count) === 0) {
      isCanPlay = true;
      app.stage.removeChild(countingText)
      $('#confirmBtn').prop('disabled', false);
    }
});
setTimeout(() => app.stage.removeChild(stamp), 5000);

// 建立容器
var objContainer = new PIXI.Container();
app.stage.addChild(objContainer);

if (isLineMode) {
  // 畫線
  var objLine1 = new PIXI.Graphics();
  objLine1.lineStyle(4, 0x000000, 1);
  objLine1.moveTo(0, 2*yd);
  objLine1.lineTo(app.screen.width, 2*yd);

  var objLine2 = new PIXI.Graphics();
  objLine2.lineStyle(4, 0x000000, 1);
  objLine2.moveTo(0, 4 * yd);
  objLine2.lineTo(app.screen.width, 4 * yd);

  var objLine3 = new PIXI.Graphics();
  objLine3.lineStyle(4, 0x000000, 1);
  objLine3.moveTo(0, 6 * yd);
  objLine3.lineTo(app.screen.width, 6 * yd);

  var objLine4 = new PIXI.Graphics();
  objLine4.lineStyle(4, 0x000000, 1);
  objLine4.moveTo(2 * xd, 0);
  objLine4.lineTo(2 * xd, app.screen.height);

  var objLine5 = new PIXI.Graphics();
  objLine5.lineStyle(4, 0x000000, 1);
  objLine5.moveTo(4 * xd, 0);
  objLine5.lineTo(4 * xd, app.screen.height);

  var objLine6 = new PIXI.Graphics();
  objLine6.lineStyle(4, 0x000000, 1);
  objLine6.moveTo(6 * xd, 0);
  objLine6.lineTo(6 * xd, app.screen.height);

  objContainer.addChild(objLine1);
  objContainer.addChild(objLine2);
  objContainer.addChild(objLine3);
  objContainer.addChild(objLine4);
  objContainer.addChild(objLine5);
  objContainer.addChild(objLine6);
}

var testCircle1 = new PIXI.Graphics();
var testCircle2 = new PIXI.Graphics();
var testCircle3 = new PIXI.Graphics();
var dotNum;
var centerPoint;
var touchPos;
function onDragStart(e) {
    this.data = e.data;
    this.dragging = true;
    dotNum = app.stage.children.length - 1;

    touchPos = {
        x: Math.floor(this.data.global.x),
        y: Math.floor(this.data.global.y)
    }
    if (!isPCMode) {
        console.log('~~~~');

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

}
function showCanvas() {
    $("canvas").show();
    $("#final").removeClass('show');
}
function hideCanvas() {
    $("canvas").hide();
    $("#confirmBtn").hide();
    
    $( "#errorDialog" ).modal( "hide" );
    $("#final").addClass('show');
}
function onDragEnd(e) {

    this.data = e.data;
    if (!isPCMode) {
        console.log('this.data.identifier: ', this.data.identifier);
        for (var i = 0; i < touches.length; i++) {
            // 當離開的手指存在在 touches 陣列裡時，移除該筆資料
            if (touches[i].id === this.data.identifier) {
                touches.splice(i, 1);
            }
        };
        this.dragging = false;
    } else {
        console.log('!!!!!!!');
        if (isCanPlay) {
            renderStamp(touchPos);
        }
        
    }

}

function touchHandler() {
    // 印出目前有幾隻手指按在螢幕上
    console.log('印出目前有幾隻手指按在螢幕上: ', touches.length);
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

var confirmBtn;
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
    renderStamp(centerPoint);
}

function checkAns() {
    console.log('確定按鈕被點擊囉');
    if (isCanPlay && !isPCMode) {
        validateAns(centerPoint);
    }
    if (isCanPlay && isPCMode) {
        validateAns(touchPos);
    }
}
var dialog;
var warningText;
// var dialogContainer;
function validateAns(pos) {
    console.log('pos: ', pos);
    const distance = Math.sqrt(Math.pow(pos.x - ansPoint.x, 2) + Math.pow(pos.y - ansPoint.y, 2));
    console.log('distance: ', distance);
    if (toloranceD >= distance) {
      console.log(true);
      hideCanvas();
      $('#success-text').addClass('show');

    } else {
      console.log(false);
      $( "#errorDialog" ).modal( "show" );
    }
  }
var stamp;
function renderStamp(target) {
    console.log('target: ', target);
    app.stage.removeChild(stamp); // 把印章刪掉
    var texture = PIXI.Texture.fromImage('assets/1.png');
    stamp = new PIXI.Sprite(texture);
    const stampWidth = xd > yd ? yd : xd;
    console.log('stampWidth: ', stampWidth);
    stamp.width = stampWidth;
    stamp.height = stampWidth;
    setTimeout(() => {
        stamp.x = target.x;
        stamp.y = target.y;

        stamp.pivot.x = texture.width / 2;
        stamp.pivot.y = texture.height / 2;
        stamp.rotation = angle * (Math.PI / 180);
        app.stage.addChild(stamp);

    }, 300);

}
var angle = 0;
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
// var centerPoint = {x: 0, y: 0};
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
    console.log('x: ', x);
    console.log('_x: ', _x);
    centerPoint = {x: 0, y: 0};
    console.log('centerPointX: ', centerPoint.x);

    centerPoint.x = (x + _x) / 2;
    centerPoint.y = (y + _y) / 2;
    // console.log('centerX: ', centerX);
    // console.log('centerY: ', centerY);
    app.stage.removeChild(centerCircle); // 把中心點去除
    centerCircle = new PIXI.Graphics();
    if (isShowDot) {
        centerCircle.beginFill(0x00FF00);
    } else {
        centerCircle.beginFill(0x00FF00, 0);

    }

    centerCircle.drawCircle(centerPoint.x, centerPoint.y, 10);
    centerCircle.endFill();
    app.stage.addChild(centerCircle);
}
