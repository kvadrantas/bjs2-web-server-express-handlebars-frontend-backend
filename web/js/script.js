const zmonesDOM = document.getElementById('zmones-list');   // čia dedamas pagrindinis turinys
let dataTemplate;   // neparuoštas duomenų tempatas (objektas)
let dataProperties = [];    // paruoštas duomenų templatas iš duomenų properčių (keys)
let zmones = [];    // duomenys (žmonių sąrayšas)
let id;     // žmogaus įrašo id

getZmones();

// Pakeičia paspausto mygtuko spalvą pridėdamas active klasę
// Papildomai keičia pagrindinį pavadinimą priklausomai nuo to, kur esame
function setButtonActive(buttonId, header) {
    const allNavButtons = document.querySelectorAll('.top-navigation button');
    let id = 1;
    for (const button of allNavButtons) {
        button.classList.remove('active');
    }

    if (buttonId != 'undefined') {// jei redaguojam įrašą mygtuko stiliaus keisti nereikia, bet reikia pakeisti pagrindinį pavadinimą
        document.getElementById(buttonId).classList.add('active');
    }
    document.querySelector('.main-title').innerHTML = header;

}

// ******************* DATA QUERY FROM JSON URL *******************
// Gets data from server url in json format
async function getZmones() {
    try {
        setButtonActive('topbtn2', 'Žmonių sąrašas');
        const dataJson = await fetch("/json/zmones");   //console.log('datajson: ', dataJson);
        if (dataJson.ok) {
            zmones = await dataJson.json();     //console.log('ZMONES: ', zmones);
            [dataTemplate, ...zmones] = zmones;     // pirmas elementas yra duomenų templatas, kiti- žmonių duomenys
            dataProperties = Object.keys(dataTemplate);    // atrenkam tik objekto raktus (keys)
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

    // Dinaminis lenteles headerio html formavimas
    for (const property of dataProperties) {
        if (property === 'id') continue;    // id įrašo lentelėje neatvaizduojam
        const th = document.createElement('th');
        const title = document.createTextNode(property.replace('_', ' '));  // Formuojam lentelės 1-os eilutės pavadinimus iš templato raktų pavadinimų
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
            const cell = document.createTextNode(zmogus[property]);     // atitikmuo zmogus.vardas, zmogus.pavarde ir t.t.
            tr.appendChild(td);
            td.appendChild(cell);
        }

        // Įrašų redagavimo ir trynimo mygtukai (ikonos)
        const tdEdit = document.createElement('td');
        const tdDelete = document.createElement('td');
        const aEdit = document.createElement('a');
        const aDelete = document.createElement('a');
        aEdit.onclick = newRecordForm;
        aDelete.onclick = deleteRecord;
        const cellEdit = document.createElement('i');
        const cellDelete = document.createElement('i');
        const index = zmones.findIndex(e => e.id === zmogus.id);    // nusistatau ant edit/pieštuko ikonėlės indeksą, kad redaguojant supildutų tinkamai input laukus
        cellEdit.setAttribute('zmogusId', index);   // naudojamas masyvo indeksas
        cellDelete.setAttribute('zmogusId', zmogus.id);     // naudojamas indeksas duomenų viduje
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

function newRecordForm(event) {
    
    let index;
    if (event) { //tinkrina ar buvo paspaustas edit mygtukas
        index = event.target.attributes.zmogusId.nodeValue;
        setButtonActive('undefined', 'Įrašo keitimas'); // jei spausta edit, mytuko stiliaus nekeičiam tik puslapio pavadinimą
    } else {
        setButtonActive('topbtn1', 'Naujas įrašas');    // jei buvo spausti top navigacijos mygtukai, keičiam ir mygtuko stilių, ir puslapio pavadinimą
    }
    
    zmonesDOM.innerHTML = '';
    for (const property of dataProperties) {    // iš templato raktų formuojami label
        const text = document.createTextNode(property);
        const label = document.createElement('label');
        label.setAttribute('for', property);
        let input = document.createElement('input');
        input.setAttribute('id', property);
        const br = document.createElement('br');
        if (property != 'id') label.appendChild(text);
        if (event) { // pasitikrina ar kuriam naują įrašą, ar redaguojam seną. Jei seną, tai į value sudeda duomenis
            input.setAttribute('value', zmones[index][property])    // pvz: zmogus[1].vardas, zmogus[2].pavarde. Ima konkretų žmogų ir konkrečia poerperty reikšmę
        };
        if (property === 'id') { // su id lauką sukuriam, bet nerodom
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
    try {// nurodom id, kurį įrašą trinti
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


