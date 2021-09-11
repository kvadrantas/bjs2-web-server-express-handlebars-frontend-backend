const zmonesDOM = document.getElementById('zmones-list');
let dataProperties = [];
let dataTemplate;
let zmones = [];
let id;

getZmones();

// ******************* DATA QUERY FROM JSON URL *******************
async function getZmones() {
    try {
        const dataJson = await fetch("/json/zmones");   //console.log('datajson: ', dataJson);
        if (dataJson.ok) {
            zmones = await dataJson.json();     //console.log('ZMONES: ', zmones);
            [dataTemplate, ...zmones] = zmones;     // pirmas elementas yra duomenų templatas, kiti- žmonių duomenys
            dataProperties = Object.keys(dataTemplate);    //console.log(dataProperties);
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
    table.setAttribute('border', '1px solid red');
    const tr = document.createElement('tr');
    const th1 = document.createElement('th');
    const th2 = document.createElement('th');
    const th3 = document.createElement('th');
    const thEdit = document.createElement('th');
    const thDelete = document.createElement('th');
    const title1 = document.createTextNode('Vardas');
    const title2 = document.createTextNode('Pavardė');
    const title3 = document.createTextNode('Alga');

    table.appendChild(tr);
    tr.appendChild(th1);
    tr.appendChild(th2);
    tr.appendChild(th3);
    tr.appendChild(thEdit);
    tr.appendChild(thDelete);
    th1.appendChild(title1);
    th2.appendChild(title2);
    th3.appendChild(title3);
    

    for (const zmogus of zmones) {
        const tr = document.createElement('tr');
        const td1 = document.createElement('td');
        const td2 = document.createElement('td');
        const td3 = document.createElement('td');
        const tdEdit = document.createElement('td');
        const tdDelete = document.createElement('td');
        const cell1 = document.createTextNode(zmogus.vardas);
        const cell2 = document.createTextNode(zmogus.pavarde);
        const cell3 = document.createTextNode(zmogus.alga);
        const aEdit = document.createElement('a');
        const aDelete = document.createElement('a');
        aEdit.onclick = newRecordFrom;
        aDelete.onclick = deleteRecord;
        const cellEdit = document.createElement('i');
        const cellDelete = document.createElement('i');
        const index = zmones.findIndex(e => e.id === zmogus.id);    // nusistatau ant edit/pieštuko ikonėlės indeksą, kad redaguojant supildutų tinkamai input laukus
        cellEdit.setAttribute('zmogusId', index);
        cellDelete.setAttribute('zmogusId', zmogus.id);
        cellEdit.setAttribute('class', 'icon-pencil');
        cellDelete.setAttribute('class', 'icon-trash');

        table.appendChild(tr);
        tr.appendChild(td1);
        tr.appendChild(td2);
        tr.appendChild(td3);
        tr.appendChild(tdEdit);
        tr.appendChild(tdDelete);
        td1.appendChild(cell1);
        td2.appendChild(cell2);
        td3.appendChild(cell3);
        aEdit.appendChild(cellEdit)
        aDelete.appendChild(cellDelete)
        tdEdit.appendChild(aEdit);
        tdDelete.appendChild(aDelete);
    }

    zmonesDOM.appendChild(table);

}

// ******************* ADDING NEW RECORD BEGIN *******************
// FORM 
// Dinaminis formos kūrimas. Visi elementai sudedami automatiškai priklausomai nuo to, kokius properčius turi duomenys

function newRecordFrom(event) {
    let index;
    // console.log(event);
    if (event) {
        // console.log("/json/zmones/" + event.target.attributes.zmogusId.nodeValue);
        index = event.target.attributes.zmogusId.nodeValue;
        // console.log(zmones[index]);
    }
    
    zmonesDOM.innerHTML = '';
    for (const property of dataProperties) {
        // if (!event) {
            // if (property === 'id') continue;
        // }
        const text = document.createTextNode(property);
        const label = document.createElement('label');
        label.setAttribute('for', property);
        let input = document.createElement('input');
        input.setAttribute('id', property);
        const br = document.createElement('br');
        label.appendChild(text);
        if (event) {
            // console.log(zmones[index][property]);
            // input.appendChild(document.createTextNode(zmones[index][property]));
            // input.value = zmones[index][property];
            input.setAttribute('value', zmones[index][property])
        };
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
// 8888888888888888888
async function newRecord() {
    // let index = '';
    // if (document.getElementById('id').value) {
    //     index = document.getElementById('id').value;
    // } 
    const id = document.getElementById('id').value;  console.log('INDEKSAS: ', id);
    const vardas = document.getElementById('vardas').value;
    const pavarde = document.getElementById('pavarde').value;
    const alga = document.getElementById('alga').value;
    // console.log(vardas, pavarde, alga);
    if (vardas.trim() === '' || pavarde.trim() === '' || isNaN(alga)) {
        alert('Įvesti blogi duomenys');
        return
    };
    const zmogus = {
        id,
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
async function deleteRecord (event) {
    // console.log("/json/zmones/" + event.target.attributes.zmogusId.nodeValue);
    try {
        const dataJson = await fetch('/json/zmones/' + event.target.attributes.zmogusId.nodeValue,
        {method: 'DELETE'}
        );
        if (dataJson.ok) {
            getZmones();
        } else {
            console.log('Klaida: ', dataJson.status);
        }
    }
    catch (error) {
        console.log('Klaida: ', error.message);
    }
}


