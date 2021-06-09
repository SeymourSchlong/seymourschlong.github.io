'use strict';

const gaps = ["0","478","479","481","482","485","486","489","490","493","494","497","498","502","503","506","507","510","511","515","516","519","520","524","525","528","529","533","534","538","539","542","543","547","548","552","553","558","559","563","564","568","569","574","575","579","580","585","586","591","592","597","598","603","604","609","610","615","616","621","622","628","629","634","635","641","642","648","649","655","656","662","663","670","671","677","678","685","686","693","694","701","702","710","711","718","719","727","728","736","737","745","746","754","755","764","765","774","775","784","785","794","795","805","806","816","817","827","828","839","840","851","852","863","864","875","876","888","889","902","903","916","917","930","931","944","945","960","961","975","976","991","992","1008","1009","1025","1026","1043","1044","1061","1062","1081","1082","1100","1101","1121","1122","1142","1143","1165","1166","1188","1189","1212","1213","1237","1238","1263","1264","1290","1291","1318","1319","1348","1349","1379","1380","1411","1412","1445","1446","1481","1482","1518","1519","1558","1559","1600","1601","1643","1644","1690","1691","1739","1740","1791","1792","1846","1847","1904","1905","1967","1968","2033","2034","2105","2106","2181","2182","2264","2265","2352","2353","2448","2449","2553","2554","2666","2667","2790","2791","2926","2927","3076","3077","3243","3244","3428","3429","3636","3637","3870","3871","4137","4138","4444","4445","4800","4801","5217","5218","5714","5715","6315","6316","7058","7059","8000","8001","9230","9231","10909","10910","13333","13334","17142","17143","24000","24001","40000","40001","60000000000","60000000001","60000000001"];

const submit = () => {
    let tempo = document.querySelector('#tempo').value;

    console.log(Number(tempo));

    if (typeof Number(tempo) == NaN) {
        alert('Invalid tempo given.\nPlease remove any non-numerical characters.');
        return;
    } else if (Number(tempo) > gaps[gaps.length - 1]) {
        alert('Your tempo is too high! Please pick a lower number.');
        return;
    }

    for (let i = 0; i < gaps.length; i += 2) {
        if (tempo >= Number(gaps[i]) && tempo <= Number(gaps[i+1])) {
            document.querySelector('#tempo-text').textContent = `Your tempo: ${tempo} is between the gap of ${gaps[i]}-${gaps[i+1]}`;
            break;
        }
    }
}

const bpmsubmit = () => {
    let bpm = document.querySelector('#bpm').value;

    if (typeof Number(bpm) == NaN) {
        alert('Please input a real number.');
    } else {
        let select = document.querySelector('#mult');
        let multiplier = select.options[select.selectedIndex].value;

        document.querySelector('#bpm-text').textContent = `Your new BPM is ${bpm*multiplier}`;
    }
}

const createListeners = () => {
    document.querySelector('#tempo').addEventListener('keydown', evt => {
        if (evt.keyCode == 13) {
            evt.preventDefault();
            submit();
        }
    });
  document.querySelector('#bpm').addEventListener('keydown', evt => {
      if (evt.keyCode == 13) {
          evt.preventDefault();
          bpmsubmit();
      }
  });
}

const init = () => {
    createListeners();
}