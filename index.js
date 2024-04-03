const floorOne = document.getElementById('floor-one');
const floorTwo = document.getElementById('floor-two');
const buttonfloor = document.getElementById('buttom-floor');
const contanerseatsOne = document.getElementById('container-seatings-one');  
const contanerseatsTwo = document.getElementById('container-seatings-two');
let normalSeatSvg = document.querySelector('.normal');
let bedSeatSvg = document.querySelector('.cama');
const btnBuySeats = document.getElementById('buy-seats');

normalSeatSvg=  normalSeatSvg.cloneNode(true)
bedSeatSvg = bedSeatSvg.cloneNode(true)

let seatsWindow = [1,3,5,7,9,11,13,15,18,20,22,24,26,28,30,32,35,37,39,41,43,45,47,49,51,53,36,73,74,72,70,68,66,64,62,60,58,56]

const seatObj = {
    id: null ,
    precio: 800,
    destino: 'Muy muy lejano',
    disponible: 'si',
    ventana: 'nel'
}

function addSeatInformation (seatObj, seatType) {
    Object.entries(seatObj).forEach(([key,value]) => {
        seatType.dataset[key] = value
    })
}

addSeatInformation(seatObj, normalSeatSvg)
addSeatInformation(seatObj, bedSeatSvg)

function createSeats(container, start, end, seatType) {
    for (let i = start; i < end; i++) {
        const seat = document.createElement('div');
        seatType.dataset.id = `${i}`
        seat.className = `div${i} seat`;
        
        assignPrice(seatType, end);
        
        seat.appendChild(seatType.cloneNode(true));
        container.appendChild(seat);
    }
    check(container)
    assignWindowProperty(container.querySelectorAll('.normal, .cama'));
}

function assignPrice(seatType) {
    if(seatType.dataset.id >= 35) {
        seatType.dataset.precio = 1200;
    }
}

function assignWindowProperty (seats) {
    seats.forEach((seat) => {
        const id = Number(seat.dataset.id);
        if (seatsWindow.includes(id)) {
            seat.dataset.ventana = 'obvio';
        }
    });
    occupiedRandom(seats);
}

let selectedSeatsIds = [];
let selectedSeatsPrice = [];
function check (container) {
    container.addEventListener('click', (e) => {
        // traer el asiento selecionado
        const seat = e.target.closest('svg');
        if (!seat) {
            return;
        }
        // cerificar si el aasiento esta disponible
        if (seat.dataset.disponible == 'no'){
            alert('asiento ocupado amigo');
            // showError('asiento ocupado amigo');
            return;

        } else {
            // traer el path de el asiento para estatus seleccion 
            const paths = seat.querySelectorAll('path')
            // color de seleccion de asientos
            paths[0].classList.toggle('selectLine');
            paths[1].classList.toggle('selectFill');
            // verificar si el asiento ya habia sido escogido 
            if (selectedSeatsIds.includes(seat.dataset.id)) {
                return;
            } else {
                // mardar a un array los elementos seleccionados 
                selectedSeatsIds.push(seat.dataset.id);
                selectedSeatsPrice.push(seat.dataset.precio);
            }
        }
        console.log('id-num-asiento ' + seat.dataset.id);
        console.log('precio ' + seat.dataset.precio);
        console.log('destino ' + seat.dataset.destino);
        console.log('disponible ' + seat.dataset.disponible);
        console.log('ventana ' + seat.dataset.ventana);
        console.log('♥ ♥ ♥ ♥ ♥ ♥ ♥ ♥ ♥ ');
    });
};

// function occupied (seatsSold) {
//     seatsSold.forEach((id)=> {
//     })
// }

function occupiedRandom (seats) {
    // creando lista falsa de asientos compardos
    const seatsOccupied = []
    for (let i = 0; i < 40; i++) {
        seatsOccupied.push(Math.floor(Math.random(i) * 77));
    }
    // recorer los aientos uno por uno 
    seats.forEach((seat)=> {
        // obetener los paths de casa asiento
        const path = seat.querySelectorAll('path');
        // extraigo el id de cada asiento y lo convierto en typo numero 
        const seatId = Number(seat.dataset.id);
        // comprobar si los ids de los elementos estan dentro de la lista de asientos ocupados radoms
        if (seatsOccupied.includes(seatId)){
            // si lo estan cambiar el color a ocupado
            path[0].classList.add('ocupadoLine');
            path[1].classList.add('ocupadoFill');
            seat.dataset.disponible = 'no'
        }
    });
};

function buySeats (selectedSeatsIds, selectedSeatsPrice) {
    if (selectedSeatsIds.length == 0 ) {
        return alert('No haz seleccionado ningun asiento');
    }

    selectedSeatsIds.forEach((seatId)=> {
        const seat = document.querySelector(`[data-id="${seatId}"]`);
        const path = seat.querySelectorAll('path');
        path[0].classList.remove('selectLine');
        path[1].classList.remove('selectFill');
        path[0].classList.add('buyLine');
        path[1].classList.add('buyFill');
        setTimeout(()=> {
            path[0].classList.remove('buyLine');
            path[1].classList.remove('buyFill');
            path[0].classList.add('soldLine');
            path[1].classList.add('soldFill');
            path[0].classList.add('ocupadoLine');
            path[1].classList.add('ocupadoFill');
            seat.dataset.disponible = 'no'
        },2000)
    });
    const suma = selectedSeatsPrice.reduce((acc,crr) => acc + Number(crr),0);
    console.log('total ', suma);
    console.log(selectedSeatsIds);
    console.log(selectedSeatsPrice);
    // occupied(selectedSeatsIds)
}

btnBuySeats.addEventListener('click', () => {
    buySeats(selectedSeatsIds,selectedSeatsPrice)
})

let isFloorOneVisible = false;
function toggleFloors() {
    floorOne.classList.toggle('hidden');
    floorTwo.classList.toggle('show');
    isFloorOneVisible = !isFloorOneVisible;
    buttonfloor.innerHTML = `ir a piso ${isFloorOneVisible ? 1 : 2}`;
}

buttonfloor.innerHTML = 'ir a piso 2';
buttonfloor.addEventListener('click', toggleFloors);

createSeats(contanerseatsOne, 1, 35, normalSeatSvg);
createSeats(contanerseatsTwo, 35, 78, bedSeatSvg);