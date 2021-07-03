const root = document.querySelector('#root');
const listOfTypes = ['Normal', 'Fire', 'Water', 'Grass', 'Electric', 'Ice', 'Fighting', 'Poison', 'Ground',
    'Flying', 'Psychic', 'Bug', 'Rock', 'Ghost', 'Dragon', 'Dark', 'Steel', 'Fairy'];
const listOfColors = [
    'green',
    'orangered',
    'aqua',
    'teal',
    'yellow',
    'lightgray',
    'brown',
    'purple',
    'sandybrown',
    'lightskyblue',
    'pink',
    'orange',
    'darkgreen',
    'darkpink',
    'powderblue',
    'darkred',
    'lightsteelblue',
    'lightpink'
]
const typeRow = document.querySelector('.poketipo-row');
const typeCol = document.querySelector('.poketipo-col');
listOfTypes.forEach((type, idx) => {
    const div = document.createElement('div');
    const div2 = document.createElement('div');
    div.style.backgroundColor = listOfColors[idx];
    div2.style.backgroundColor = listOfColors[idx];
    div.textContent = type;
    div2.textContent = type;
    div.dataset.pos = idx;
    typeRow.appendChild(div);
    typeCol.appendChild(div2);
});
function appendCells() {
    for (let row = 0; row < 18; row++) {
        for (let col = 0; col < 18; col++) {
            const div = document.createElement('div');
            div.classList.add(`row-${row}`, `col-${col}`);
            root.appendChild(div);
        }
    }
}
function highlightOnHover(event) {
    let [row, col] = event.target.classList.values();
    [row, col] = [row.split('-')[1], col.split('-')[1]];
    let eleRow = document.querySelectorAll(`.row-${row}`);
    let eleCol = document.querySelectorAll(`.col-${col}`);
    eleRow = Array.from(eleRow).filter(ele => +ele.classList.item(1).split('-')[1] <= col ).forEach(ele => ele.classList.add('hover'));
    eleCol = Array.from(eleCol).filter(ele => +ele.classList.item(0).split('-')[1] <= row ).forEach(ele => ele.classList.add('hover'));
/*     eleRow.forEach(ele => {
        const pos = [...ele.classList.values()];
        if (+pos[1].split('-')[1] <= +col) ele.classList.add('hover');
    });
    eleCol.forEach(ele => {
        const pos = [...ele.classList.values()];
        if (+pos[0].split('-')[1] <= +row) ele.classList.add('hover');
    }); */
/*     Array.from(divs).forEach(ele => {
        [...ele.classList].some(val => event.target.classList.contains(val)) && ele.classList.add('hover');
        //[...event.target.classList.values()].forEach(val => { if (ele.classList.contains(val)) ele.classList.add('hover') });
        //if ([...event.target.classList.values()].some(value => [...ele.classList.values()].includes(value))) ele.classList.add('hover');
    }); */
}
function removeHighlight() {
    const ele = document.querySelectorAll('.hover');
    ele.forEach(i => i.classList.remove('hover'));
}
appendCells();
root.addEventListener('mousemove', (event) => {
    removeHighlight(event);
    highlightOnHover(event);
});

async function getDamageRelations(listOfTypes) {
    const listOfRelations = [];
    await Promise.all(
        listOfTypes.map(async (type) => {
            const url = `https://pokeapi.co/api/v2/type/${type.toLowerCase()}/`;
            const response = await fetch(url);
            const json = await response.json();
            listOfRelations.push(json);
        })
    );
    return listOfRelations;
}
list = getDamageRelations(listOfTypes).then(value => {
    value.forEach(obj => {
        let objName = `${obj.name[0].toUpperCase()}${obj.name.slice(1)}`;
        let rel = obj.damage_relations;
        let strong = rel.double_damage_to;
        let weak = rel.half_damage_to;
        let none = rel.no_damage_to;
        const power = [2, 0.5, 0];
        const color = ['lightgreen','red', 'gray'];
        [strong, weak, none].forEach((list, idx) => {
            list.forEach(ele => {
                const name = `${ele.name[0].toUpperCase()}${ele.name.slice(1)}`;
                const div = document.querySelector(`.row-${listOfTypes.indexOf(objName)}.col-${listOfTypes.indexOf(name)}`);
                div.textContent = power[idx];
                div.style.backgroundColor = color[idx];
            });
        });
    })
});
