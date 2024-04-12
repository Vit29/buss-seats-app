const floorOne = document.getElementById('floor-one');
const floorTwo = document.getElementById('floor-two');
const buttonfloor = document.getElementById('buttom-floor');
const contanerseatsOne = document.getElementById('container-seatings-one');  
const contanerseatsTwo = document.getElementById('container-seatings-two');
let normalSeatSvg = document.querySelector('.normal');
let bedSeatSvg = document.querySelector('.cama');
let stairs = document.getElementById('stairs')
const btnBuySeats = document.getElementById('buy-seats');
const seatingsStatus = document.getElementById('seatings-satatus');
const tiketSeats = document.getElementById('tiket-seats');


normalSeatSvg=  normalSeatSvg.cloneNode(true);
bedSeatSvg = bedSeatSvg.cloneNode(true);
stairs = stairs.cloneNode(true);

let seatsWindow = [1,3,5,7,9,11,13,15,18,20,22,24,26,28,30,32,35,37,39,41,43,45,47,49,51,53,36,73,74,72,70,68,66,64,62,60,58,56]

const seatObj = {
    id: null ,
    precio: 800,
    destino: 'Muy muy lejano',
    disponible: 'Si',
    ventana: 'No'
}

function addSeatInformation (seatObj, seatType) {
    Object.entries(seatObj).forEach(([key,value]) => {
        seatType.dataset[key] = value
    })
}

addSeatInformation(seatObj, normalSeatSvg)
addSeatInformation(seatObj, bedSeatSvg)

function createSeats(container, start, end, seatType, stairs) {
    for (let i = start; i < end; i++) {
        const seat = document.createElement('div');
        seat.className = `div${i} seat`;
        seatType.style.cursor = 'pointer'
        seatType.dataset.id = `${i}`;
        
        assignPrice(seatType);
        assignStairsAndSeaats(seat, seatType, stairs);
        
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

function assignStairsAndSeaats (seat,seatType,stairs) {
    if (seatType.dataset.id == '33' ||  
        seatType.dataset.id == '34' || 
        seatType.dataset.id == '75' || 
        seatType.dataset.id == '76') {
            stairs.style.width = '120px';
            stairs.setAttribute('viewBox', "2.000 10.000 25.374 5.424" );
            stairs.style.transform = 'rotate(85deg)';
            seat.appendChild(stairs.cloneNode(true));
        } else {
            seat.appendChild(seatType.cloneNode(true));
        }
}

function assignWindowProperty (seats) {
    seats.forEach((seat) => {
        const id = Number(seat.dataset.id);
        if (seatsWindow.includes(id)) {
            seat.dataset.ventana = 'Si';
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
    if (!seat ) {
        return;
    }

    if (seat.id == 'stairs') {
        e.preventDefault();
        return;
    }
    
    if (seat.dataset.disponible == 'No'){
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
    // console.log(selectedSeatsIds.includes(seat.dataset.id));
    return selectedSeatsIds.includes(seat.dataset.id);
}

function selectSeat(seat) {
    console.log(selectedSeatsIds.length > 5)
    if (selectedSeatsIds.length > 5){
        alert('No pudes comprar mas de 6 aseintos por tiket')
        return;
    }
    markSelectedSeat(seat)
    selectedSeatsIds.push(seat.dataset.id);
    selectedSeatsPrice.push(seat.dataset.precio);

    
    const cloneSeat = seat.cloneNode(true);
    const paths = cloneSeat.querySelectorAll('path')
    paths[0].classList.remove('selectLine');
    paths[1].classList.remove('selectFill');
    cloneSeat.style.cursor = 'initial';

    const container = document.createElement('div');
    const ul = document.createElement('ul');
    const span = document.createElement('span');
    container.id = seat.dataset.id;
    span.appendChild(cloneSeat)
    container.appendChild(span);
    container.appendChild(ul)

    ul.innerHTML = `<li>Asiento: ${seat.dataset.id}</li>
                    <li>Precio: $ ${seat.dataset.precio}</li>
                    <li>Ventana: $ ${seat.dataset.ventana}</li>
                    `
    const firstChild = seatingsStatus.firstChild;
    
    seatingsStatus.insertBefore(container, firstChild);

    // <li>Destino: ${seat.dataset.destino}</li>
    // <li>Disponible: ${seat.dataset.disponible}</li>
    // <li>Ventana: ${seat.dataset.ventana}</li>
}

function deselectSeat(seat) {

    unmarkSelectedSeat(seat);

    const divs = seatingsStatus.querySelectorAll('div');
    divs.forEach((div) => {
       
        if (div.id == seat.dataset.id) {
            div.classList.add('remove-div')
            setTimeout(()=> {
                div.remove()
            },500)
        }
    })
    
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
    const seatsOccupied = []
    for (let i = 0; i < 40; i++) {
        seatsOccupied.push(Math.floor(Math.random(i) * 77));
    }
    seats.forEach((seat)=> {
        const path = seat.querySelectorAll('path');
        const seatId = Number(seat.dataset.id);
        if (seatsOccupied.includes(seatId)){
            // si lo estan cambiar el color a ocupado
            path[0].classList.add('ocupadoLine');
            path[1].classList.add('ocupadoFill');
            seat.dataset.disponible = 'No'
        }
    });
};


function buySeats (selectedSeatsIds, selectedSeatsPrice) {
    if (selectedSeatsIds.length == 0 ) {
        return alert('No haz seleccionado ningun asiento');
    }
    let seat
    selectedSeatsIds.forEach((seatId)=> {
        seat = document.querySelector(`[data-id="${seatId}"]`);
        seat.setAttribute('data-disponible', 'No');
        const path = seat.querySelectorAll('path');
        path[0].classList.remove('selectLine');
        path[1].classList.remove('selectFill');
        path[0].classList.add('buyLine');
        path[1].classList.add('buyFill');
        seat.dataset.disponible = 'No';
        setTimeout(()=> {
            path[0].classList.remove('buyLine');
            path[1].classList.remove('buyFill');
            path[0].classList.add('soldLine');
            path[1].classList.add('soldFill');
        },2000)
    });

    const suma = selectedSeatsPrice.reduce((acc,crr) => acc + Number(crr),0);
    console.log('total ', suma);
    console.log(selectedSeatsIds);
    console.log(selectedSeatsPrice);
    
    tiketSeats.innerHTML = `<ul>
                            <li>Total asientos: <span>${selectedSeatsIds.length}</span></li>
                            <li>Asientos: <span>${selectedSeatsIds}</span></li>
                            <li>Destino: <span>${seat.dataset.destino}</span></li>
                            <li>Total: <span>${suma}</span></li>
                            <ul>
                            `
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

createSeats(contanerseatsOne, 1, 35, normalSeatSvg, stairs);
createSeats(contanerseatsTwo, 35, 78, bedSeatSvg, stairs);