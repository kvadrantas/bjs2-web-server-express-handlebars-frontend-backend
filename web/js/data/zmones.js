let nextId = 1;
let zmones = [
  // First empty record is template (do not delete)
  {
    id: '',
    vardas: '',
    pavarde: '',
    alga: '',
    gimimo_metai: '',
    telefonas: '',
    adresas: ''
  },
  {
    id: nextId++,
    vardas: "Jonas",
    pavarde: "Jonaitis",
    alga: 7234.56,
    gimimo_metai: '2000',
    telefonas: '865123654',
    adresas: 'Vilnius, Savanorių pr. 100'
  },
  {
    id: nextId++,
    vardas: "Petras",
    pavarde: "Petraitis",
    alga: 750,
    gimimo_metai: '1995',
    telefonas: '865123654',
    adresas: 'Vilnius, Salomėjos, 59'
  },
  {
    id: nextId++,
    vardas: "Antanas",
    pavarde: "Antanaitis",
    alga: 750,
    gimimo_metai: '1980',
    telefonas: '865123654',
    adresas: 'Klaipėda, Vidūno 4'
  },
];

export { zmones, nextId };