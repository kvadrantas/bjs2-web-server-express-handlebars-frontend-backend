const zmonesDOM = document.getElementById('zmones-list');
let dataProperties = [];
let zmones = [];
let id;

getZmones();
// setTimeout(() => {
//     newRecordFrom();
// }, 100);

// ******************* DATA QUERY FROM JSON URL *******************
async function getZmones() {
    try {
        const dataJson = await fetch("/json/zmones");   //console.log('datajson: ', dataJson);
        if (dataJson.ok) {
            zmones = await dataJson.json();     //console.log('ZMONES: ', zmones);
            dataProperties = Object.keys(zmones[0]) ;    //console.log(dataProperties);
            renderZmones();
        } else {
            alert('Įvyko klaida:', + dataJson.status);
        }
    }
    catch (error) {
        console.log('Įvyko klaida:', + error);
    }
};

// ******************* DATA RENDERING *******************
function renderZmones() {
    zmonesDOM.innerHTML =  '';
    const table = document.createElement('table');
    const tr = document.createElement('tr');
    const th1 = document.createElement('th');
    const th2 = document.createElement('th');
    const th3 = document.createElement('th');
    const title1 = document.createTextNode('Vardas');
    const title2 = document.createTextNode('Pavardė');
    const title3 = document.createTextNode('Alga');

    table.appendChild(tr);
    tr.appendChild(th1);
    tr.appendChild(th2);
    tr.appendChild(th3);
    th1.appendChild(title1);
    th2.appendChild(title2);
    th3.appendChild(title3);

    for (const zmogus of zmones) {
        const tr = document.createElement('tr');
        const td1 = document.createElement('td');
        const td2 = document.createElement('td');
        const td3 = document.createElement('td');
        const cell1 = document.createTextNode(zmogus.vardas);
        const cell2 = document.createTextNode(zmogus.pavarde);
        const cell3 = document.createTextNode(zmogus.alga);

        table.appendChild(tr);
        tr.appendChild(td1);
        tr.appendChild(td2);
        tr.appendChild(td3);
        td1.appendChild(cell1);
        td2.appendChild(cell2);
        td3.appendChild(cell3);
    }

    zmonesDOM.appendChild(table);

}

// ******************* ADDING NEW RECORD BEGIN *******************
// FORM 
// Dinaminis formos kūrimas. Visi elementai sudedami automatiškai priklausomai nuo to, kokius properčius turi duomenys

function newRecordFrom() {
    zmonesDOM.innerHTML = '';
    for (const property of dataProperties) {
        if (property === 'id') continue;
        const text = document.createTextNode(property);
        const label = document.createElement('label');
        label.setAttribute('for', property);
        const input = document.createElement('input');
        input.setAttribute('id', property);
        const br = document.createElement('br');
        label.appendChild(text);
        zmonesDOM.appendChild(label);
        zmonesDOM.appendChild(input);
        zmonesDOM.appendChild(br);
    }
    zmonesDOM.innerHTML += `
    <div class = "form-navigation">
        <button class = "form-button" onclick = "newRecord()">Išsaugoti</button>
        <button class = "form-button" onclick = "getZmones()">Atšaukti</button>
    </div>
    `

}

// ACTION 
async function newRecord() {
    const vardas = document.getElementById('vardas').value;
    const pavarde = document.getElementById('pavarde').value;
    const alga = document.getElementById('alga').value;
    // console.log(vardas, pavarde, alga);
    if (vardas.trim() === '' || pavarde.trim() === '' || isNaN(alga)) {
        alert('Įvesti blogi duomenys');
        return
    };
    const zmogus = {
        vardas,
        pavarde,
        alga
    };
    try {
        const dataJson = await fetch('/json/zmones/', {
            method: "POST",
            headers: {"Content-Type" : "application/json"},
            body: JSON.stringify(zmogus)
        });
        if (dataJson.ok) {
            getZmones();
        } else {
            alert('Klaida: ', dataJson.status)
        }
    }
    catch (error) {
        console.log('Klaida: ', error.message);
    }

}

// ******************* ADDING NEW RECORD END *******************



// ******************* DELETING RECORD *******************



