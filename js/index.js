var app = new PIXI.Application(800, 600, { backgroundColor: 0x1099bb });
document.body.appendChild(app.view);

// create a texture from an image path
var texture = PIXI.Texture.fromImage('http://pixijs.io/examples/required/assets/basics/bunny.png');

// Scale mode for pixelation
texture.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;

for (var i = 0; i < 10; i++) {
    createBunny(
        Math.floor(Math.random() * app.renderer.width),
        Math.floor(Math.random() * app.renderer.height)
    );
}

function createBunny(x, y) {

    // create our little bunny friend..
    var bunny = new PIXI.Sprite(texture);

    // enable the bunny to be interactive... this will allow it to respond to mouse and touch events
    bunny.interactive = true;

    // this button mode will mean the hand cursor appears when you roll over the bunny with your mouse
    bunny.buttonMode = true;

    // center the bunny's anchor point
    bunny.anchor.set(0.5);

    // make it a bit bigger, so it's easier to grab
    bunny.scale.set(3);

    // setup events for mouse + touch using
    // the pointer events
    bunny
        .on('pointerdown', onDragStart)
        .on('pointerup', onDragEnd)
        .on('pointerupoutside', onDragEnd)
        .on('pointermove', onDragMove);

    // For mouse-only events
    // .on('mousedown', onDragStart)
    // .on('mouseup', onDragEnd)
    // .on('mouseupoutside', onDragEnd)
    // .on('mousemove', onDragMove);

    // For touch-only events
    // .on('touchstart', onDragStart)
    // .on('touchend', onDragEnd)
    // .on('touchendoutside', onDragEnd)
    // .on('touchmove', onDragMove);

    // move the sprite to its designated position
    bunny.x = x;
    bunny.y = y;

    // add it to the stage
    app.stage.addChild(bunny);
}

// function onDragStart(event) {
//     // store a reference to the data
//     // the reason for this is because of multitouch
//     // we want to track the movement of this particular touch
//     this.data = event.data;
//     this.alpha = 0.5;
//     this.dragging = true;
// }

// function onDragEnd() {
//     this.alpha = 1;
//     this.dragging = false;
//     // set the interaction data to null
//     this.data = null;
// }

function onDragMove() {
    if (this.dragging) {
        var newPosition = this.data.getLocalPosition(this.parent);
        this.x = newPosition.x;
        this.y = newPosition.y;
        // console.log('x: ', this.x);
    }
}
var touches = [];

// app.stage
//         .on('pointerdown', onDragStart)
//         .on('pointerup', onDragEnd)
//         .on('pointerupoutside', onDragEnd);

function onDragStart(e) {
    this.dragging = true;
    this.data = e.data;
    console.log('!!!!');
    var touchPos = {
        x: Math.floor(this.data.global.x),
        y: Math.floor(this.data.global.y)
    }
    var touch = {
        // 主要依據 id 來判斷當下有幾隻手指在手機上
        id: this.data.identifier,
        pos: touchPos
    };
    console.log('touch: ', touch);

    touches.push(touch);
    touchHandler();
}

function onDragEnd(e) {
    this.data = e.data;
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
    console.log('印出目前有幾隻手指按在螢幕上: ', touches.length);
}