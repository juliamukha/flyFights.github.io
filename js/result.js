
function showResult() {
    let level = window.localStorage.getItem('level');
    document.getElementById('btnRepeat').addEventListener('click',btnRepeat);
    let fieldResult = document.getElementById('fieldResult');
    let currentText = document.createElement('div');
    currentText.appendChild(document.createTextNode('Вы затратили:'));
    fieldResult.appendChild(currentText);
    let currentResult = document.createElement('div');
    currentResult.style.fontSize = '50pt';
    let keyCurrent = window.localStorage.getItem('keyCurrent'+level.toString());
    if (keyCurrent) {
        let time = keyCurrent.split(':');
        currentResult.appendChild(document.createTextNode(parseInt(time[1]) + ' мин ' + parseInt(time[2]) + ' сек'));
    }
    fieldResult.appendChild(currentResult);

    let bestText = document.createElement('div');
    bestText.style.paddingTop = '20px';
    bestText.appendChild(document.createTextNode('Лучший результат:'));
    fieldResult.appendChild(bestText);
    let bestResult = document.createElement('div');
    bestResult.style.fontSize = '50pt';
    let keyBest = window.localStorage.getItem('keyBest'+level.toString());
    if (keyBest) {
        let time = keyBest.split(':');
        bestResult.appendChild(document.createTextNode(parseInt(time[1]) + ' мин ' + parseInt(time[2]) + ' сек'));
    }
    fieldResult.appendChild(bestResult);
}

function clearElement(_element) {
    let element = _element;
    while(element.firstChild){
        element.removeChild(element.firstChild);
    }
}

function btnRepeat() {
    let fieldResult = document.getElementById('fieldResult');
    clearElement(fieldResult);
    let game = new documentReady();
    //setContainer();
}