class Command {
    constructor(symbolToWrite, move, nextState) {
        this.symbolToWrite = symbolToWrite;
        this.move = move; // MoveType
        this.nextState = nextState;
    }
}

const MoveType = {
    L: 'LEFT',
    R: 'RIGHT',
    S: 'STAY',
    LEFT: 'LEFT',
    RIGHT: 'RIGHT',
    STAY: 'STAY',
};

class ResultTuring {
    constructor(tape, steps, headPosition, history) {
        this.tape = tape;
        this.steps = steps;
        this.headPosition = headPosition;
        this.history = history; // Assuming history is an array
    }
}

class TuringProgram {
    constructor(initialState, tape, emptySymbol) {
        this.initialState = initialState;
        this.tape = tape;
        this.emptySymbol = emptySymbol;
        this.transitionTable = new Map();
    }

    addTransition(state, symbol, command) {
        if (!this.transitionTable.has(state)) {
            this.transitionTable.set(state, new Map());
        }
        this.transitionTable.get(state).set(symbol, command);
    }
}


class TuringMachine {
    constructor(program) {
        this.transitionTable = new Map(program.transitionTable);
        this.currentState = program.initialState;
        this.tape = program.tape;
        this.headPosition = 0;
        this.emptySymbol = program.emptySymbol;
        this.history = [];
    }

    moveCaret(type) {
        switch (type) {
            case MoveType.LEFT:
                this.headPosition -= 1;
                if (this.headPosition < 0) {
                    this.tape = this.emptySymbol + this.tape; // Add symbol to the left
                    this.headPosition = 0;
                }
                break;
            case MoveType.RIGHT:
                this.headPosition += 1;
                if (this.headPosition >= this.tape.length) {
                    this.tape += this.emptySymbol; // Add symbol to the right
                }
                break;
            case MoveType.STAY:
                // Do nothing
                break;
        }
    }

    commandExecute(command) {
        this.history.push(`${this.currentState} | ${this.tape.charAt(this.headPosition)}`);
        // Write the symbol
        this.tape = this.tape.substring(0, this.headPosition) + command.symbolToWrite + this.tape.substring(this.headPosition + 1);
        // Move the caret
        this.moveCaret(command.move);
        // Transition to the new state
        this.currentState = command.nextState;
    }

    getCurrentCommand(currentSymbol) {
        const commands = this.transitionTable.get(this.currentState) || new Map();
        return commands.get(currentSymbol);
    }

    run(maxSteps) {
        for (let step = 0; step < maxSteps; step++) {
            if (!this.transitionTable.has(this.currentState)) {
                break;
            }
            const currentSymbol = this.tape.charAt(this.headPosition);
            const command = this.getCurrentCommand(currentSymbol);

            if (command) {
                this.commandExecute(command);
            } else {
                break; // No suitable command
            }
        }
        return new ResultTuring(this.tape, this.history.length, this.headPosition, this.history);
    }

    step() {
        if (!this.transitionTable.has(this.currentState)) {
            return;
        }
        const currentSymbol = this.tape.charAt(this.headPosition);
        const command = this.getCurrentCommand(currentSymbol);

        if (command) {
            this.commandExecute(command);
        }
    }
}
