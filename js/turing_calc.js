const tapeElement = document.getElementById('tape');
const caretElement = document.getElementById('caret');
const emptySymbol = '□'; // Символ пустоты
let tape = '11000000000000000000000000000000000000000000000000001'; // Пример содержимого ленты
let headPosition = 0; // Начальная позиция каретки
let renderTapeString = '';

const tapeWidth = 600;
const cellWidth = 40;
const countCells = 600 / cellWidth;
const midCells = countCells / 2;
const countTempCells = 2;
console.log(midCells);

function renderTape(emptySymbol, tape) {
    tapeElement.innerHTML = '';
    for (let i = 0; i < midCells - 1; i++) {
        const cell = document.createElement('div');
        cell.className = 'cell';
        cell.textContent = emptySymbol;
        tapeElement.appendChild(cell);
    }
    for (let i = 0; i < tape.length; i++) {
        const cell = document.createElement('div');
        cell.className = 'cell';
        cell.textContent = tape[i] || emptySymbol;
        tapeElement.appendChild(cell);
    }
    for (let i = 0; i < midCells - 1; i++) {
        const cell = document.createElement('div');
        cell.className = 'cell';
        cell.textContent = emptySymbol;
        tapeElement.appendChild(cell);
    }
    updateCaretPosition();
}

function updateCaretPosition() {
    const offset = headPosition * cellWidth;
    tapeElement.style.transform = `translateX(-${offset}px)`;
}

function moveLeft() {
    if (headPosition > 0) {
        headPosition--;
        renderTape();
    }
}

function moveRight() {
    if (headPosition < tape.length) {
        headPosition++;
        renderTape();
    } else {
        tape += ''; // Добавляем пустой символ, если нужно
        renderTape();
    }
}


renderTape(emptySymbol, tape);

function parseTuringMachineProgram(program) {
    const states = {};
    
    for (const [stateName, transitions] of Object.entries(program)) {
        states[stateName] = {};
        
        for (const [symbol, action] of Object.entries(transitions)) {
            if (typeof action === 'string') {
                states[stateName][symbol] = new Command(symbol, MoveType[action], stateName);
            } else {
                const { write, move, nextState } = action;
                states[stateName][symbol] = new Command(write, MoveType[move], nextState);
            }
        }
    }
    
    return states;
}

const program = {
    q1: {
        1: 'L',
        e: { write: 1, move: 'L', nextState: 'q2' }
    },
    q2: {
        1: { write: 'e', move: 'R', nextState: 'q3' },
        e: { write: 1, move: 'L', nextState: 'q3' }
    },
    q3: {
        1: { write: 'e', move: 'R', nextState: 'q4' },
        e: { write: 1, move: 'L', nextState: 'q4' }
    },
    q4: {
        e: { write: 1, move: 'R', nextState: 'q5' }
    },
    q5: {
        e: { move: 'R', nextState: 'q2' }
    }
};

const parsedProgram = parseTuringMachineProgram(program);
console.log(parsedProgram);

function run() {
    const initialState = document.getElementById('initialState').value;
    const tape = document.getElementById('tape').value;
    const emptySymbol = document.getElementById('emptySymbol').value;
    const alphabet = document.getElementById('alphabet').value;

    const transitions = [];
    const rows = document.querySelectorAll('#transitionsTable tbody tr');
    rows.forEach(row => {
        const state = row.querySelector('input[name="state"]').value;
        const symbol = row.querySelector('input[name="symbol"]').value;
        const writeSymbol = row.querySelector('input[name="writeSymbol"]').value;
        const move = row.querySelector('select[name="move"]').value;
        const nextState = row.querySelector('input[name="nextState"]').value;
        transitions.push({ state, symbol, writeSymbol, move, nextState });
    });

    console.log({ initialState, tape, emptySymbol, alphabet, transitions });
};