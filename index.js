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
        seat.className = `div${i} seat`;

        seatType.dataset.id = `${i}`;
        
        assignPrice(seatType);
        
        assignStairs(seat, seatType)
        // if (seatType.dataset.id == '33' ){
        //     seat.appendChild(seatType.cloneNode(false));
        //     seat.innerHTML = 'Escaleras'
        // } else {
        //     seat.appendChild(seatType.cloneNode(true));
        // }
        container.appendChild(seat);
    }
    select(container)
    assignWindowProperty(container.querySelectorAll('.normal, .cama'));
}

function assignPrice(seatType) {
    if(seatType.dataset.id >= 35) {
        seatType.dataset.precio = 1200;
    }
}

function assignStairs (seat,seatType) {
    if (seatType.dataset.id == '33' ||  seatType.dataset.id == '34' || seatType.dataset.id == '76' || seatType.dataset.id == '75'){
            seat.appendChild(seatType.cloneNode(false));
            seat.innerHTML = 'Escaleras'
        } else {
            seat.appendChild(seatType.cloneNode(true));
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

function select (container) {
    container.addEventListener('click', handleSeatSelection)
}

function handleSeatSelection (e) {
    const seat = e.target.closest('svg');
    if (!seat) {
        return;
    }
    
    if (seat.dataset.disponible == 'no'){
        showError(seat,'ocupado');
        return;
    }

    if (isSelected(seat)) {
        deselectSeat(seat);
    } else {
        selectSeat(seat);
    }
}

function showError (seat,message) {
    const errorMessage =  document.createElement('div');
    const contanerSeat = seat.parentElement;

    errorMessage.innerHTML = message
    errorMessage.classList.add('errorMessage','error-animation')
    contanerSeat.appendChild(errorMessage);
    setTimeout(() => {
        contanerSeat.removeChild(errorMessage);
    },1000)
}

function isSelected(seat) {
    return selectedSeatsIds.includes(seat.dataset.id);
}

function selectSeat(seat) {
    
    markSelectedSeat(seat)

    selectedSeatsIds.push(seat.dataset.id);
    selectedSeatsPrice.push(seat.dataset.precio);
    // console.log(selectedSeatsIds);
    // console.log(selectedSeatsPrice);

    console.log('Asiento:', seat.dataset.id);
    console.log('Precio:', seat.dataset.precio);
    console.log('Destino:', seat.dataset.destino);
    console.log('Disponible:', seat.dataset.disponible);
    console.log('Ventana:', seat.dataset.ventana);
    console.log('♥ ♥ ♥ ♥ ♥ ♥ ♥ ♥ ♥ ♥ ♥ ♥ ♥');
}

function deselectSeat(seat) {

    unmarkSelectedSeat(seat);
    
    const index = selectedSeatsIds.indexOf(seat.dataset.id)
    if (index !== -1) {
        selectedSeatsIds.splice(index,1)
        selectedSeatsPrice.splice(index,1)
    }
}

function markSelectedSeat (seat) {
    const paths = seat.querySelectorAll('path');
    paths[0].classList.add('selectLine');
    paths[1].classList.add('selectFill');
}

function unmarkSelectedSeat(seat) {
    const paths = seat.querySelectorAll('path');
    paths[0].classList.remove('selectLine');
    paths[1].classList.remove('selectFill');
}

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
            // path[0].classList.add('ocupadoLine');
            // path[1].classList.add('ocupadoFill');
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