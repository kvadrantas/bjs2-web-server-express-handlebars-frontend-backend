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
    // table.setAttribute('border', '1px solid red');
    const tr = document.createElement('tr');

    // Dinaminis lenteles headerio html formavimas
    for (const property of dataProperties) {
        if (property === 'id') continue;
        const th = document.createElement('th');
        const title = document.createTextNode(property);
        tr.appendChild(th);
        th.appendChild(title);
    }

    const thEdit = document.createElement('th');
    const thDelete = document.createElement('th');
    table.appendChild(tr);
    tr.appendChild(thEdit);
    tr.appendChild(thDelete);

    // Dinaminis lenteles turinio html formavimas
    for (const zmogus of zmones) {
        const tr = document.createElement('tr');
        for (const property of dataProperties) {
            if (property === 'id') continue;
            const td = document.createElement('td');
            const cell = document.createTextNode(zmogus[property]);
            tr.appendChild(td);
            td.appendChild(cell);
        }

        // Navigation icons (pencil and recyclebin) for record edit and delete
        const tdEdit = document.createElement('td');
        const tdDelete = document.createElement('td');
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
        tr.appendChild(tdEdit);
        tr.appendChild(tdDelete);
        aEdit.appendChild(cellEdit)
        aDelete.appendChild(cellDelete)
        tdEdit.appendChild(aEdit);
        tdDelete.appendChild(aDelete);
    }
    zmonesDOM.appendChild(table);
}

// ******************* ADDING-EDITING NEW RECORD BEGIN *******************
// FORM 
// Dinaminis formos kūrimas. Visi elementai sudedami automatiškai priklausomai nuo to, kokius properčius turi duomenys

function newRecordFrom(event) {
    let index;
    if (event) {
        index = event.target.attributes.zmogusId.nodeValue;
    }
    
    zmonesDOM.innerHTML = '';
    for (const property of dataProperties) {
        const text = document.createTextNode(property);
        const label = document.createElement('label');
        label.setAttribute('for', property);
        let input = document.createElement('input');
        input.setAttribute('id', property);
        const br = document.createElement('br');
        if (property != 'id') label.appendChild(text);
        if (event) {
            input.setAttribute('value', zmones[index][property])
        };
        if (property === 'id') {
            label.setAttribute('hidden', true);
            input.setAttribute('hidden', true);
        }
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
    const id = document.getElementById('id').value;  //console.log('INDEKSAS: ', id);
    const vardas = document.getElementById('vardas').value;
    const pavarde = document.getElementById('pavarde').value;
    const alga = document.getElementById('alga').value;

    const gimimo_metai = document.getElementById('gimimo_metai').value;
    const telefonas = document.getElementById('telefonas').value;
    const adresas = document.getElementById('adresas').value;
    if (vardas.trim() === '' || pavarde.trim() === '' || isNaN(alga) || isNaN(gimimo_metai) || isNaN(telefonas) || adresas.trim() === '') {
        alert('Įvesti blogi duomenys');
        return
    };
    const zmogus = {
        id,
        vardas,
        pavarde,
        alga,
        gimimo_metai,
        telefonas,
        adresas
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

// ******************* ADDING-EDITING NEW RECORD END *******************



// ******************* DELETING RECORD *******************
async function deleteRecord (event) {
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


