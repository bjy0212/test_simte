let testData = {};

const testContainer = document.querySelector('div.test');

let currentQ = 0;
let scores = null;

/**
 * image preloader
 * @param {String[]} src 
 */
 function preload(src) {
    let img = new Image();
    let index = 0;

    img.src = src[0];
    img.onload = function () {
        index++;
        if (index < src.length) {
            img.src = src[index];
        }
    }
}

//#region 체크 박스
let check = '';

function Check(ev) {
    let box = ev.target;
    let id = box.id;

    if (check != id) {
        if (document.getElementById(check)) {
            let checked = document.getElementById(check);

            checked.style.background = '';
            checked.style.borderColor = 'black';
            checked.style.color = 'black';
        }
        box.style.background = 'rgb(255, 179, 217)';
        box.style.borderColor = 'rgb(255, 179, 217)';
        box.style.color = 'white';
        check = id;
    }
}

function CheckInit() {
    document.querySelectorAll('div.question > div.a').forEach(e => {
        e.addEventListener('click', Check);
    });
}

setTimeout(CheckInit(), 0);
//#endregion

//#region 테스트
function testBox(params) {
    let html = `<div class="${params.type}" ${params.type === 'scene' && params.img ? `style="background-image:url(${params.img})"` : ``} ${params.type === 'scene' ? `onclick="next()"` : ``}>`;

    if(params.type !== 'scene' && params.img) {
        html += `<div style="width:100%;"><img src=${params.img}></img></div>`;
    }

    switch (params.type) {
        case 'question':
            html += `<div class="title">Q.${params.q}</div>`;
            html += Object.keys(params.a).map((e, i) => `<div class="a" id="check-${i}" onclick="Check(event)">${e}</div>`).join('');
            html += `<div class="next" onclick="next()">다음</div>`;
            break;

        case 'scene':
            html += `<div class="text">${params.text}</div>`;
            break;
    }

    return html + `</div>`;
}

function resultBox(params) {
    return `<div class="result">
        <div class="title">${params.title}</div>
        <div class="image">
            <img width="100%" height="auto" src="${params.img}"></img>
        </div>
        <div class="subtitle">${params.subtitle}</div>
        <div class="description">
            ${params.description}
        </div>
    </div>`;
}

function DrawResult() {
    let mytype = scores.map(e => {
        return Object.keys(e).sort((a, b) => e[b] - e[a])[0];
    }).join('');

    let myresult = testData.results[mytype];

    console.log(mytype);
    testContainer.innerHTML = resultBox(myresult);
}

function DrawQ() {
    if (!testData.questions[currentQ]) {
        DrawResult();
        return;
    }

    let Q = testData.questions[currentQ];

    testContainer.innerHTML = testBox(Q);
}

function next() {
    let Q = testData.questions[currentQ];

    if(!Q) return;

    if(Q.type !== 'question') {
        currentQ += 1;

        DrawQ();
    }

    if(check !== '') {
        let add = Q.a[Object.keys(Q.a)[check.split('-')[1]]];

        add.forEach((e, i) => {
            scores[i][e]++;
        });
        check = '';

        currentQ += 1;

        DrawQ();
    }
}

function Init() {
    DrawQ();
    scores = testData.variables.map(e => {
        let ret = {};
        e.forEach(v => {
            ret[v] = 0;
        });
    
        return ret;
    });
}
//#endregion