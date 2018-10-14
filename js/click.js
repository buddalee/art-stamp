var app;
var stampType = 1;
var images = ['assets/1.jpg', 'assets/2.jpeg'];
var level = 0;
app = new PIXI.Application(window.innerWidth, window.innerHeight - 30, { backgroundColor: 0x1099bb });
// app = new PIXI.Application(800, 600, { backgroundColor: 0x1099bb });
document.body.appendChild(app.view);
function init() {
    // create a background...
    var background = PIXI.Sprite.fromImage(images[level]);
    background.width = app.screen.width;
    background.height = app.screen.height;
    // add background to stage...
    app.stage.addChild(background);

    // Scale mode for all textures, will retain pixelation
    PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;

    app.stage.interactive = true;
    app.stage.buttonMode = true;


    app.stage
        .on('pointerdown', onDragStart)
        .on('pointerup', onDragEnd)
        .on('pointerupoutside', onDragEnd);
    $('canvas').addClass('stamp1');
    $('#stamp-btn1').addClass('choose');
    $('#stamp-btn2').removeClass('choose');
    stampType = 1;
    
}
init();
var touches = [];

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
var ansNum1, ansNum2;
function getRandomInt(min, max) {
    ansNum1 = Math.floor(Math.random() * (max - min + 1)) + min;
    ansNum2 = Math.floor(Math.random() * (max - min + 1)) + min;
    while(ansNum1 === ansNum2) {
        ansNum2 = Math.floor(Math.random() * (max - min + 1)) + min;
    } 
}

getRandomInt(1, 16);
var centerArr;

var xd = app.screen.width / 8;
var yd = app.screen.height / 8;

var ansPointArray;
var toloranceD;
var countingText;
var isCanPlay = false;

execCount();
function execCount() {
    centerArr = [];
    var startx = 0,
        starty = 0,
        endx = 4,
        endy = 4;
    for (; startx < endx; startx++) {
        for (starty = 0; starty < endy; starty++) {
            var x = xd + starty * 2 * xd;
            var y = yd + startx * 2 * yd;
            centerArr.push({ x, y });
        }
    }
    ansPointArray = [];
    ansPointArray[0] = centerArr[ansNum1 - 1];
    ansPointArray[1] = centerArr[ansNum2 - 1];

    ansPointArray[0].type = 1;
    ansPointArray[1].type = 2;
    toloranceD = xd > yd ? xd : yd;
    renderStamp(ansPointArray[0]);
    renderStamp(ansPointArray[1]);
    isCanPlay = false;
    countingText = new PIXI.Text('倒數: 5', {
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
    app.ticker.add(function () {
        count -= 0.02;
        // update the text with a new string
        countingText.text = '倒數: ' + Math.floor(count);
        if (Math.floor(count) === 0) {
            isCanPlay = true;
            app.stage.removeChild(countingText)
            $('#confirmBtn').prop('disabled', false);
        }
    });
    setTimeout(() => {
        app.stage.removeChild(stamp1);
        app.stage.removeChild(stamp2);
    }, 5000);
}

// 建立容器
var objContainer = new PIXI.Container();
app.stage.addChild(objContainer);

if (isLineMode) {
    // 畫線
    var objLine1 = new PIXI.Graphics();
    objLine1.lineStyle(4, 0x000000, 1);
    objLine1.moveTo(0, 2 * yd);
    objLine1.lineTo(app.screen.width, 2 * yd);

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
var centerPointArr = [{x: 0, y: 0},{x: 0, y: 0}];
var touchPos;
function onDragStart(e) {
    this.data = e.data;
    this.dragging = true;
    dotNum = app.stage.children.length - 1;

    touchPos = {
        x: Math.floor(this.data.global.x),
        y: Math.floor(this.data.global.y),
        type: stampType
    }
    if (!isPCMode) {
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
    $('#success-text').removeClass('show');
    $("#confirmBtn").show();
    if (level === 1) {
        level = 0;
    } else {
        level++;
    }
    init();
    getRandomInt(1, 16);
    execCount();

    $("canvas").show();
    $("#final").removeClass('show');
    $('#stamp-btn1').show();
    $('#stamp-btn2').show();

}
function hideCanvas() {
    handleApiText();

    $("canvas").hide();
    $("#confirmBtn").hide();
    $("#confirmBtn").hide();
    $('#stamp-btn1').hide();
    $('#stamp-btn2').hide();
    $("#errorDialog").modal("hide");
    $("#final").addClass('show');

}
function onDragEnd(e) {

    this.data = e.data;
    if (!isPCMode) {
        for (var i = 0; i < touches.length; i++) {
            // 當離開的手指存在在 touches 陣列裡時，移除該筆資料
            if (touches[i].id === this.data.identifier) {
                touches.splice(i, 1);
            }
        };
        this.dragging = false;
    } else {
        if (isCanPlay) {
            renderStamp(touchPos);
        }

    }

}

function touchHandler() {
    // 印出目前有幾隻手指按在螢幕上
    if (touches.length === 3 && isCanPlay) {
        calcDistance();
    } else {
        // app.stage.removeChild(stamp1); // 把印章刪掉
        // app.stage.removeChild(stamp2); // 把印章刪掉
        
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
    if (stampType === 1) {
        renderStamp(centerPointArr[0]);
    } else {
        renderStamp(centerPointArr[1]);
    }
}

function checkAns() {
    if (isCanPlay && !isPCMode) {
        validateAns(centerPointArr);
    }
    if (isCanPlay && isPCMode) {
        validateAns(choosePosArr);
    }
}
var dialog;
var warningText;
function validateAns(posArr) {
    var startIdx1 = 0,
    startIdx2 = 0;
    var count = 0;
    for (; startIdx1 < 2; startIdx1++) {
        for (startIdx2 = 0; startIdx2 < 2; startIdx2++) {
            if (!posArr[startIdx1]) {
              return $("#errorDialog").modal("show");
            }                      
            const distance = Math.sqrt(Math.pow(posArr[startIdx1].x - ansPointArray[startIdx2].x, 2) + Math.pow(posArr[startIdx1].y - ansPointArray[startIdx2].y, 2));
            if (toloranceD >= distance) {
                count++;
            }
        }
    }
    if (count >= 2) {
        hideCanvas();
        $('#success-text').addClass('show');
    } else {
        $("#errorDialog").modal("show");
    }
}
var stamp1, stamp2;
var choosePosArr = [];
function renderStamp(target) {
    if (stampType === 1) {
      var texture = PIXI.Texture.fromImage('assets/char1.png');
    } else {
      var texture = PIXI.Texture.fromImage('assets/char2.png');
    }
    if (target.type) {
        if (target.type === 1) {            
            var texture = PIXI.Texture.fromImage('assets/char1.png');
            app.stage.removeChild(stamp1); // 把印章刪掉

            stamp1 = new PIXI.Sprite(texture);
            const stampWidth = xd > yd ? yd : xd;
            stamp1.width = stampWidth;
            stamp1.height = stampWidth;
            setTimeout(() => {
                stamp1.x = target.x;
                stamp1.y = target.y;
        
                stamp1.pivot.x = texture.width / 2;
                stamp1.pivot.y = texture.height / 2;
                stamp1.rotation = angle * (Math.PI / 180);
                app.stage.addChild(stamp1);
                if (isCanPlay) {
                    choosePosArr[0] = target;
                }
            }, 300);            
        } else {
            var texture = PIXI.Texture.fromImage('assets/char2.png');
            app.stage.removeChild(stamp2); // 把印章刪掉

            stamp2 = new PIXI.Sprite(texture);
            const stampWidth = xd > yd ? yd : xd;
            stamp2.width = stampWidth;
            stamp2.height = stampWidth;
            setTimeout(() => {
                stamp2.x = target.x;
                stamp2.y = target.y;
                stamp2.pivot.x = texture.width / 2;
                stamp2.pivot.y = texture.height / 2;
                stamp2.rotation = angle * (Math.PI / 180);
                app.stage.addChild(stamp2);
                if (isCanPlay) {
                    choosePosArr[1] = target;
                }
            }, 300);                    
        }
    }

}
var angle = 0;
function calcPhotoAngle(maxIdx) {
    var anotherIdx;
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
}
var centerCircle;
function calcPhotoCenter(maxIdx) {
    var anotherIdx;
    if (maxIdx === touches.length - 1) {
        anotherIdx = 0;
    } else {
        anotherIdx = maxIdx + 1;
    }
    const { x, y } = touches[maxIdx].pos;
    const _x = touches[anotherIdx].pos.x;
    const _y = touches[anotherIdx].pos.y;
    app.stage.removeChild(centerCircle); // 把中心點去除
    centerCircle = new PIXI.Graphics();
    if (isShowDot) {
        centerCircle.beginFill(0x00FF00);
    } else {
        centerCircle.beginFill(0x00FF00, 0);

    }
    if (stampType === 1) {
        centerPointArr[0].x = (x + _x) / 2;
        centerPointArr[0].y = (y + _y) / 2;
        centerPointArr[0].type = stampType;
        centerCircle.drawCircle(centerPointArr[0].x, centerPointArr[0].y, 10);

        
    } else {
        centerPointArr[1].x = (x + _x) / 2;
        centerPointArr[1].y = (y + _y) / 2;
        centerPointArr[1].type = stampType;
        centerCircle.drawCircle(centerPointArr[1].x, centerPointArr[1].y, 10);

    }
    centerCircle.endFill();
    app.stage.addChild(centerCircle);
}

function chooseStamp(type) {
    $('canvas').removeClass('stamp1');
    $('canvas').removeClass('stamp2');
    $('#stamp-btn1').removeClass('choose');
    $('#stamp-btn2').removeClass('choose');

    if (type === 1) {
        stampType = 1;
        $('canvas').addClass('stamp1');
        $('#stamp-btn1').addClass('choose');
    } else {
        stampType = 2;
        $('canvas').addClass('stamp2');
        $('#stamp-btn2').addClass('choose');
    }
}

function handleApiText() {
    const articleSubject1 = `元趙孟頫鵲華秋色　卷`; 
    const articleSubject2 = `元黃公望富春山居圖　卷`;
    const articleMaker1 = '趙孟頫';
    const articleMaker2 = '黃公望,Huang Gongwang';
    const cateGory1 = '繪畫';
    const cateGory2 = '繪畫';
    const articleRemarks1 = '紙 寫意 披麻皴 減筆線條 28.4x93.2公分';
    const articleRemarks2 = '卷　紙本　水墨畫　縱：33公分　橫：636.9公分';
    const description1 = `
    趙孟頫（一二五四－一三二二），浙江吳興人。字子昂，號松雪道人。本宋宗室，宋亡仕元，至翰林學士承旨，封魏國公，諡文敏。詩文清遠，工書善畫，山水、人馬、木石、花竹，樣樣精通。所倡書法入畫，影響後世甚鉅。

    此幅向是畫史上認定為文人畫風式的青綠設色山水。兩座主峰以花青雜以石青，呈深藍色。這與洲渚的淺淡、樹葉的各種深淺不一的青色，成同色調的變化；斜坡、近水邊處，染赭；屋頂、樹幹、樹葉又以紅、黃、赭。這些暖色系的顏色，與花青正形成彩學上補色作用法。運用得非常恰當，青色系顯現透明的清秋涼，足以沁人心脾，但在補色作用下，使人感到一片雅逸恬和，是中和寧靜而不是孤寂蕭索，這該是文人畫所推重的意境。畫主山用「披麻皴」，洲渚的線條也是同一種筆調畫法。整卷筆墨色彩交融，對秋思中的名山，該是帶給觀賞者周密一幅遙遠的故鄉夢境。（王耀庭）    
    `;
    const description2 = `
    黃公望（1269－1354），江蘇常熟人。本姓陸，名堅，字子久，號大癡，又號一峰道人，晚號井西道人。父母早逝，繼永嘉黃氏，其父九十始得之曰：「黃公望子久矣。」因而名字焉。與吳鎮（1280－1354）、倪瓚（1301－1374）、王蒙（1308－1385）合稱為「元四大家」。\r\n \r\n至正七年，年歲漸老的黃公望回歸浙江省富陽縣富春鄉，同門師弟無用師同往，黃氏為無用師描繪富春山景色，到至正十年（1350），歷三四年方完成，時黃氏八十二歲，是其傳世最重要的作品。\r\n \r\n<富春山居圖>（無用師卷）由六紙接成，長逾六公尺，第一紙前有殘補痕跡。明末曾經火厄，裁裂前段部份現由浙江省博物館。畫卷筆墨堆疊層出，山石勾勒皴染變化多樣。全卷山體從渾圓迫近、層疊後偃，平緩坡岸乃至聳峙山峰，具豐富的山水型態。此畫卷不僅是富春的隱居景致，更是黃公望探索自然造化後的理想山水形象。\r\n `;
    const media1 = '設色';
    const media2 = '水墨';
    const slogan1 = '元';
    const slogan2 = '元順宗至元四年（1338）';
    if (level === 0) {
        $('#first-side').attr("src", "http://painting.npm.gov.tw/getCollectionImage.aspx?ImageId=563659&r=76444636820");
        $('#second-side').attr("src", "http://painting.npm.gov.tw/getCollectionImage.aspx?ImageId=563660&r=53685105549");
        $('#third-side').attr("src", "http://painting.npm.gov.tw/getCollectionImage.aspx?ImageId=563661&r=27156401078");
      $('#articleSubject').text(articleSubject1);
      $('#articleMaker').text(articleMaker1);
      $('#articleMaker').text(articleMaker1);
      $('#cateGory').text(cateGory1);
      $('#articleRemarks').text(articleRemarks1);
        
      $('#description').text(description1);
      $('#media').text(media1);
      $('#slogan').text(slogan1);
    } else {
        $('#first-side').attr("src", "http://painting.npm.gov.tw/getCollectionImage.aspx?ImageId=563899&r=46846323715");
        $('#second-side').attr("src", "http://painting.npm.gov.tw/getCollectionImage.aspx?ImageId=563898&r=45803529818");
        $('#third-side').attr("src", "http://painting.npm.gov.tw/getCollectionImage.aspx?ImageId=563897&r=74336372668");        
        $('#articleSubject').text(articleSubject2);
        $('#articleMaker').text(articleMaker2);
        $('#articleMaker').text(articleMaker2);
        $('#cateGory').text(cateGory2);
        $('#articleRemarks').text(articleRemarks2);
          
        $('#description').text(description2);
        $('#media').text(media2);
        $('#slogan').text(slogan2);
        
    }
}