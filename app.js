const gameBoard = document.querySelector('#gameboard')
const playerDisplay = document.querySelector('#player')
const infoDisplay = document.querySelector('#info')
const width = 8
let playerGo = 'black'
playerDisplay.textContent = 'white'
let opponentGo = playerGo === 'white' ? 'black' : 'white'
let whiteking = true
let blackking = true
let whiteele1 = true
let whiteele2 = true
let blackele1 = true
let blackele2 = true


const startPieces = [
    rook, knight, bishop, king, queen, bishop, knight, rook,
    pawn, pawn, pawn, pawn, pawn, pawn, pawn, pawn,
    '', '', '', '', '', '', '', '',
    '', '', '', '', '', '', '', '',
    '', '', '', '', '', '', '', '',
    '', '', '', '', '', '', '', '',
    pawn, pawn, pawn, pawn, pawn, pawn, pawn, pawn,
    rook, knight, bishop, king, queen, bishop, knight, rook   
]

function createBoard() {
    // Iterate over each element in the startPieces array
    startPieces.forEach((startPiece,i) => {
        // Create a new <div> element to represent a square on the board
        const square = document.createElement('div');
        
        // Add the CSS classes 'square' and 'beige' to the square element
        square.classList.add('square');
        square.innerHTML = startPiece;
        square.firstChild?.setAttribute('draggable', true)
        square.setAttribute('id', i);
        // square.classList.add('beige');
        const row = Math.floor((63- i )/ 8) + 1;
        if (row % 2 === 0) {
            square.classList.add(i % 2 === 0 ? 'beige' : 'green')
        }
        else {
            square.classList.add(i % 2 === 0 ? 'green' : 'beige')
        }

        if ( i<= 15) {
            square.firstChild.firstChild.classList.add('black');
        }
        if (i >= 48) {
            square.firstChild.firstChild.classList.add('white');
        }
        // Append the square element to the gameBoard element in the HTML document
        gameBoard.append(square);
    })
}

createBoard()

let startPositionId
let draggedElement
const allSquares = document.querySelectorAll("#gameboard .square")

// console.log(allSquares)
allSquares.forEach(square => {
    square.addEventListener('dragstart', dragStart);
    square.addEventListener('dragover',dragOver);
    square.addEventListener('drop', dragDrop);
})


function dragStart(e) {
    startPositionId = e.target.parentNode.getAttribute('id')
    draggedElement = e.target
}

function dragOver(e) {
    // console.log(e.target)
    e.preventDefault()
}
console.log(allSquares)

function changePlayer() {
    if (playerGo === 'black') {
        playerGo = 'white'
        playerDisplay.textContent = 'black'
        opponentGo = 'black'
    }
    else {
        playerGo = 'black'
        playerDisplay.textContent = 'white'
        opponentGo = 'white'
    }
}

function dragDrop(e) {
    e.stopPropagation();
    const correctGo = draggedElement.firstChild.classList.contains(playerGo)
    const taken = e.target.classList.contains('piece')
    const valid = checkIfValid(e.target)
    const takenByOpponent = e.target.firstChild?.classList.contains(opponentGo)
    if (correctGo) {
        if (takenByOpponent && valid) {
            e.target.parentNode.append(draggedElement);
            e.target.remove();
            changePlayer();
            console.log('CorrectGo, valid and Taken by opponent')
            console.log('playerGo', playerGo)
            if (playerGo === 'black') {
                revertIds()
            }
            else {
                reverseIds()
            }
            checkForWin()
            return
        }
        if (taken && !takenByOpponent) {
            // infoDisplay.textContent = 'Invalid move'
            setTimeout(() => infoDisplay.text = '', 2000)
            console.log('Taken  and not takenbyopponent')
            return
        }
        if (valid) {
            e.target.append(draggedElement)
            changePlayer()
            console.log('Valid')
            console.log('playerGo', playerGo)
            if (playerGo === 'black') {
                revertIds()
            }
            else {
                reverseIds()
            }
            checkForWin()
            return
        }
    }
}

function checkIfValid(target) {
    console.log(target)
    const targetId = Number(target.getAttribute('id')) || Number(target.parentNode.getAttribute('id'))
    const startId = Number(startPositionId)
    const piece = draggedElement.id 
    console.log('targetId', targetId)
    console.log('startId', startId)
    console.log('piece', piece)
    // console.log(targetId)
    // if (playerGo === 'white') {
    //     return true}
    switch(piece) {
        case 'pawn':
            const starterRow = [8,9,10,11,12,13,14,15]
            if (starterRow.includes(startId)) {
                if (targetId === startId + 16 && !target.firstChild) {
                    // console.log('valid1')
                    return true
                }
            }
            if (targetId === startId + 8 && !target.firstChild) {
                // console.log('valid2')
                return true
            }
            if (targetId === startId + 7 && target.firstChild?.classList.contains(opponentGo)) {
                console.log('valid3')
                return true
            }
            
            if (targetId === startId + 9 && target.firstChild?.classList.contains(opponentGo)) {
                console.log('valid4')
                return true
            }
            else {
                return false
            }
            case 'knight':
                if (targetId === startId + 17 || targetId === startId + 15 || targetId === startId + 10 || targetId === startId + 6 || targetId === startId - 17 || targetId === startId - 15 || targetId === startId - 10 || targetId === startId - 6) {
                    return true
                }
                else {
                    return false
                }
            case 'king':
                if (targetId === startId + 8 || targetId === startId + 1 || targetId === startId - 1 || targetId === startId - 8 || targetId === startId + 7 || targetId === startId + 9 || targetId === startId - 7 || targetId === startId - 9) {
                    return true
                }
                if (whiteking && whiteele1 && document.querySelector(`[id='${startId-1}']`).firstChild && document.querySelector(`[id='${startId-2}']`).firstChild && targetId === startId - 2) {

                    return true
                }
                else {
                    return false
                }
            case 'rook':
                if (startId + width*1 === targetId || 
                    startId + width*2 === targetId && !document.querySelector(`[id='${startId + width*1}']`).firstChild ||
                    startId + width*3 === targetId && !document.querySelector(`[id='${startId + width*1}']`).firstChild && !document.querySelector(`[id='${startId + width*2}']`).firstChild || 
                    startId + width*4 === targetId && !document.querySelector(`[id='${startId + width*1}']`).firstChild && !document.querySelector(`[id='${startId + width*2}']`).firstChild && !document.querySelector(`[id='${startId + width*3}']`).firstChild ||
                    startId + width*5 === targetId && !document.querySelector(`[id='${startId + width*1}']`).firstChild && !document.querySelector(`[id='${startId + width*2}']`).firstChild && !document.querySelector(`[id='${startId + width*3}']`).firstChild && !document.querySelector(`[id='${startId + width*4}']`).firstChild ||
                    startId + width*6 === targetId && !document.querySelector(`[id='${startId + width*1}']`).firstChild && !document.querySelector(`[id='${startId + width*2}']`).firstChild && !document.querySelector(`[id='${startId + width*3}']`).firstChild && !document.querySelector(`[id='${startId + width*4}']`).firstChild && !document.querySelector(`[id='${startId + width*5}']`).firstChild ||
                    startId + width*7 === targetId && !document.querySelector(`[id='${startId + width*1}']`).firstChild && !document.querySelector(`[id='${startId + width*2}']`).firstChild && !document.querySelector(`[id='${startId + width*3}']`).firstChild && !document.querySelector(`[id='${startId + width*4}']`).firstChild && !document.querySelector(`[id='${startId + width*5}']`).firstChild && !document.querySelector(`[id='${startId + width*6}']`).firstChild ||
                    startId - width*1 === targetId || 
                    startId - width*2 === targetId && !document.querySelector(`[id='${startId - width*1}']`).firstChild ||
                    startId - width*3 === targetId && !document.querySelector(`[id='${startId - width*1}']`).firstChild && !document.querySelector(`[id='${startId - width*2}']`).firstChild || 
                    startId - width*4 === targetId && !document.querySelector(`[id='${startId - width*1}']`).firstChild && !document.querySelector(`[id='${startId - width*2}']`).firstChild && !document.querySelector(`[id='${startId - width*3}']`).firstChild ||
                    startId - width*5 === targetId && !document.querySelector(`[id='${startId - width*1}']`).firstChild && !document.querySelector(`[id='${startId - width*2}']`).firstChild && !document.querySelector(`[id='${startId - width*3}']`).firstChild && !document.querySelector(`[id='${startId - width*4}']`).firstChild ||
                    startId - width*6 === targetId && !document.querySelector(`[id='${startId - width*1}']`).firstChild && !document.querySelector(`[id='${startId - width*2}']`).firstChild && !document.querySelector(`[id='${startId - width*3}']`).firstChild && !document.querySelector(`[id='${startId - width*4}']`).firstChild && !document.querySelector(`[id='${startId - width*5}']`).firstChild ||
                    startId - width*7 === targetId && !document.querySelector(`[id='${startId - width*1}']`).firstChild && !document.querySelector(`[id='${startId - width*2}']`).firstChild && !document.querySelector(`[id='${startId - width*3}']`).firstChild && !document.querySelector(`[id='${startId - width*4}']`).firstChild && !document.querySelector(`[id='${startId - width*5}']`).firstChild && !document.querySelector(`[id='${startId - width*6}']`).firstChild ||
                    startId + 1 === targetId || 
                    startId + 2 === targetId && !document.querySelector(`[id='${startId + 1}']`).firstChild ||
                    startId + 3 === targetId && !document.querySelector(`[id='${startId + 1}']`).firstChild && !document.querySelector(`[id='${startId + 2}']`).firstChild || 
                    startId + 4 === targetId && !document.querySelector(`[id='${startId + 1}']`).firstChild && !document.querySelector(`[id='${startId + 2}']`).firstChild && !document.querySelector(`[id='${startId + 3}']`).firstChild ||
                    startId + 5 === targetId && !document.querySelector(`[id='${startId + 1}']`).firstChild && !document.querySelector(`[id='${startId + 2}']`).firstChild && !document.querySelector(`[id='${startId + 3}']`).firstChild && !document.querySelector(`[id='${startId + 4}']`).firstChild ||
                    startId + 6 === targetId && !document.querySelector(`[id='${startId + 1}']`).firstChild && !document.querySelector(`[id='${startId + 2}']`).firstChild && !document.querySelector(`[id='${startId + 3}']`).firstChild && !document.querySelector(`[id='${startId + 4}']`).firstChild && !document.querySelector(`[id='${startId + 5}']`).firstChild ||
                    startId + 7 === targetId && !document.querySelector(`[id='${startId + 1}']`).firstChild && !document.querySelector(`[id='${startId + 2}']`).firstChild && !document.querySelector(`[id='${startId + 3}']`).firstChild && !document.querySelector(`[id='${startId + 4}']`).firstChild && !document.querySelector(`[id='${startId + 5}']`).firstChild && !document.querySelector(`[id='${startId + 6}']`).firstChild ||
                    startId - 1 === targetId || 
                    startId - 2 === targetId && !document.querySelector(`[id='${startId - 1}']`).firstChild ||
                    startId - 3 === targetId && !document.querySelector(`[id='${startId - 1}']`).firstChild && !document.querySelector(`[id='${startId - 2}']`).firstChild || 
                    startId - 4 === targetId && !document.querySelector(`[id='${startId - 1}']`).firstChild && !document.querySelector(`[id='${startId - 2}']`).firstChild && !document.querySelector(`[id='${startId - 3}']`).firstChild ||
                    startId - 5 === targetId && !document.querySelector(`[id='${startId - 1}']`).firstChild && !document.querySelector(`[id='${startId - 2}']`).firstChild && !document.querySelector(`[id='${startId - 3}']`).firstChild && !document.querySelector(`[id='${startId - 4}']`).firstChild ||
                    startId - 6 === targetId && !document.querySelector(`[id='${startId - 1}']`).firstChild && !document.querySelector(`[id='${startId - 2}']`).firstChild && !document.querySelector(`[id='${startId - 3}']`).firstChild && !document.querySelector(`[id='${startId - 4}']`).firstChild && !document.querySelector(`[id='${startId - 5}']`).firstChild ||
                    startId - 7 === targetId && !document.querySelector(`[id='${startId - 1}']`).firstChild && !document.querySelector(`[id='${startId - 2}']`).firstChild && !document.querySelector(`[id='${startId - 3}']`).firstChild && !document.querySelector(`[id='${startId - 4}']`).firstChild && !document.querySelector(`[id='${startId - 5}']`).firstChild && !document.querySelector(`[id='${startId - 6}']`).firstChild
                    ) {
                        return true}
                    else {
                        return false
                    }
            case 'bishop':
                if (startId + width+1 === targetId || 
                    startId + width*2+2 === targetId && !document.querySelector(`[id='${startId + width+1}']`).firstChild ||
                    startId + width*3+3 === targetId && !document.querySelector(`[id='${startId + width+1}']`).firstChild && !document.querySelector(`[id='${startId + width*2+2}']`).firstChild || 
                    startId + width*4+4 === targetId && !document.querySelector(`[id='${startId + width+1}']`).firstChild && !document.querySelector(`[id='${startId + width*2+2}']`).firstChild && !document.querySelector(`[id='${startId + width*3+3}']`).firstChild ||
                    startId + width*5+5 === targetId && !document.querySelector(`[id='${startId + width+1}']`).firstChild && !document.querySelector(`[id='${startId + width*2+2}']`).firstChild && !document.querySelector(`[id='${startId + width*3+3}']`).firstChild && !document.querySelector(`[id='${startId + width*4+4}']`).firstChild ||
                    startId + width*6+6 === targetId && !document.querySelector(`[id='${startId + width+1}']`).firstChild && !document.querySelector(`[id='${startId + width*2+2}']`).firstChild && !document.querySelector(`[id='${startId + width*3+3}']`).firstChild && !document.querySelector(`[id='${startId + width*4+4}']`).firstChild && !document.querySelector(`[id='${startId + width*5+5}']`).firstChild ||
                    startId + width*7+7 === targetId && !document.querySelector(`[id='${startId + width+1}']`).firstChild && !document.querySelector(`[id='${startId + width*2+2}']`).firstChild && !document.querySelector(`[id='${startId + width*3+3}']`).firstChild && !document.querySelector(`[id='${startId + width*4+4}']`).firstChild && !document.querySelector(`[id='${startId + width*5+5}']`).firstChild && !document.querySelector(`[id='${startId + width*6+6}']`).firstChild ||
                    startId - width-1 === targetId || 
                    startId - width*2-2 === targetId && !document.querySelector(`[id='${startId - width-1}']`).firstChild ||
                    startId - width*3-3 === targetId && !document.querySelector(`[id='${startId - width-1}']`).firstChild && !document.querySelector(`[id='${startId - width*2-2}']`).firstChild || 
                    startId - width*4-4 === targetId && !document.querySelector(`[id='${startId - width-1}']`).firstChild && !document.querySelector(`[id='${startId - width*2-2}']`).firstChild && !document.querySelector(`[id='${startId - width*3-3}']`).firstChild ||
                    startId - width*5-5 === targetId && !document.querySelector(`[id='${startId - width-1}']`).firstChild && !document.querySelector(`[id='${startId - width*2-2}']`).firstChild && !document.querySelector(`[id='${startId - width*3-3}']`).firstChild && !document.querySelector(`[id='${startId - width*4-4}']`).firstChild ||
                    startId - width*6-6 === targetId && !document.querySelector(`[id='${startId - width-1}']`).firstChild && !document.querySelector(`[id='${startId - width*2-2}']`).firstChild && !document.querySelector(`[id='${startId - width*3-3}']`).firstChild && !document.querySelector(`[id='${startId - width*4-4}']`).firstChild && !document.querySelector(`[id='${startId - width*5-5}']`).firstChild ||
                    startId - width*7-7 === targetId && !document.querySelector(`[id='${startId - width-1}']`).firstChild && !document.querySelector(`[id='${startId - width*2-2}']`).firstChild && !document.querySelector(`[id='${startId - width*3-3}']`).firstChild && !document.querySelector(`[id='${startId - width*4-4}']`).firstChild && !document.querySelector(`[id='${startId - width*5-5}']`).firstChild && !document.querySelector(`[id='${startId - width*6-6}']`).firstChild ||
                    startId + width-1 === targetId || 
                    startId + width*2-2 === targetId && !document.querySelector(`[id='${startId + width-1}']`).firstChild ||
                    startId + width*3-3 === targetId && !document.querySelector(`[id='${startId + width-1}']`).firstChild && !document.querySelector(`[id='${startId + width*2-2}']`).firstChild || 
                    startId + width*4-4 === targetId && !document.querySelector(`[id='${startId + width-1}']`).firstChild && !document.querySelector(`[id='${startId + width*2-2}']`).firstChild && !document.querySelector(`[id='${startId + width*3-3}']`).firstChild ||
                    startId + width*5-5 === targetId && !document.querySelector(`[id='${startId + width-1}']`).firstChild && !document.querySelector(`[id='${startId + width*2-2}']`).firstChild && !document.querySelector(`[id='${startId + width*3-3}']`).firstChild && !document.querySelector(`[id='${startId + width*4-4}']`).firstChild ||
                    startId + width*6-6 === targetId && !document.querySelector(`[id='${startId + width-1}']`).firstChild && !document.querySelector(`[id='${startId + width*2-2}']`).firstChild && !document.querySelector(`[id='${startId + width*3-3}']`).firstChild && !document.querySelector(`[id='${startId + width*4-4}']`).firstChild && !document.querySelector(`[id='${startId + width*5-5}']`).firstChild ||
                    startId + width*7-7 === targetId && !document.querySelector(`[id='${startId + width-1}']`).firstChild && !document.querySelector(`[id='${startId + width*2-2}']`).firstChild && !document.querySelector(`[id='${startId + width*3-3}']`).firstChild && !document.querySelector(`[id='${startId + width*4-4}']`).firstChild && !document.querySelector(`[id='${startId + width*5-5}']`).firstChild && !document.querySelector(`[id='${startId + width*6-6}']`).firstChild ||
                    startId - width+1 === targetId || 
                    startId - width*2+2 === targetId && !document.querySelector(`[id='${startId - width+1}']`).firstChild ||
                    startId - width*3+3 === targetId && !document.querySelector(`[id='${startId - width+1}']`).firstChild && !document.querySelector(`[id='${startId - width*2+2}']`).firstChild || 
                    startId - width*4+4 === targetId && !document.querySelector(`[id='${startId - width+1}']`).firstChild && !document.querySelector(`[id='${startId - width*2+2}']`).firstChild && !document.querySelector(`[id='${startId - width*3+3}']`).firstChild ||
                    startId - width*5+5 === targetId && !document.querySelector(`[id='${startId - width+1}']`).firstChild && !document.querySelector(`[id='${startId - width*2+2}']`).firstChild && !document.querySelector(`[id='${startId - width*3+3}']`).firstChild && !document.querySelector(`[id='${startId - width*4+4}']`).firstChild ||
                    startId - width*6+6 === targetId && !document.querySelector(`[id='${startId - width+1}']`).firstChild && !document.querySelector(`[id='${startId - width*2+2}']`).firstChild && !document.querySelector(`[id='${startId - width*3+3}']`).firstChild && !document.querySelector(`[id='${startId - width*4+4}']`).firstChild && !document.querySelector(`[id='${startId - width*5+5}']`).firstChild ||
                    startId - width*7+7 === targetId && !document.querySelector(`[id='${startId - width+1}']`).firstChild && !document.querySelector(`[id='${startId - width*2+2}']`).firstChild && !document.querySelector(`[id='${startId - width*3+3}']`).firstChild && !document.querySelector(`[id='${startId - width*4+4}']`).firstChild && !document.querySelector(`[id='${startId - width*5+5}']`).firstChild && !document.querySelector(`[id='${startId - width*6+6}']`).firstChild
                    ) {
                        return true}
                    else {
                        return false
                    }
                case 'queen' :
                    if (startId + width+1 === targetId || 
                        startId + width*2+2 === targetId && !document.querySelector(`[id='${startId + width+1}']`).firstChild ||
                        startId + width*3+3 === targetId && !document.querySelector(`[id='${startId + width+1}']`).firstChild && !document.querySelector(`[id='${startId + width*2+2}']`).firstChild || 
                        startId + width*4+4 === targetId && !document.querySelector(`[id='${startId + width+1}']`).firstChild && !document.querySelector(`[id='${startId + width*2+2}']`).firstChild && !document.querySelector(`[id='${startId + width*3+3}']`).firstChild ||
                        startId + width*5+5 === targetId && !document.querySelector(`[id='${startId + width+1}']`).firstChild && !document.querySelector(`[id='${startId + width*2+2}']`).firstChild && !document.querySelector(`[id='${startId + width*3+3}']`).firstChild && !document.querySelector(`[id='${startId + width*4+4}']`).firstChild ||
                        startId + width*6+6 === targetId && !document.querySelector(`[id='${startId + width+1}']`).firstChild && !document.querySelector(`[id='${startId + width*2+2}']`).firstChild && !document.querySelector(`[id='${startId + width*3+3}']`).firstChild && !document.querySelector(`[id='${startId + width*4+4}']`).firstChild && !document.querySelector(`[id='${startId + width*5+5}']`).firstChild ||
                        startId + width*7+7 === targetId && !document.querySelector(`[id='${startId + width+1}']`).firstChild && !document.querySelector(`[id='${startId + width*2+2}']`).firstChild && !document.querySelector(`[id='${startId + width*3+3}']`).firstChild && !document.querySelector(`[id='${startId + width*4+4}']`).firstChild && !document.querySelector(`[id='${startId + width*5+5}']`).firstChild && !document.querySelector(`[id='${startId + width*6+6}']`).firstChild ||
                        startId - width-1 === targetId || 
                        startId - width*2-2 === targetId && !document.querySelector(`[id='${startId - width-1}']`).firstChild ||
                        startId - width*3-3 === targetId && !document.querySelector(`[id='${startId - width-1}']`).firstChild && !document.querySelector(`[id='${startId - width*2-2}']`).firstChild || 
                        startId - width*4-4 === targetId && !document.querySelector(`[id='${startId - width-1}']`).firstChild && !document.querySelector(`[id='${startId - width*2-2}']`).firstChild && !document.querySelector(`[id='${startId - width*3-3}']`).firstChild ||
                        startId - width*5-5 === targetId && !document.querySelector(`[id='${startId - width-1}']`).firstChild && !document.querySelector(`[id='${startId - width*2-2}']`).firstChild && !document.querySelector(`[id='${startId - width*3-3}']`).firstChild && !document.querySelector(`[id='${startId - width*4-4}']`).firstChild ||
                        startId - width*6-6 === targetId && !document.querySelector(`[id='${startId - width-1}']`).firstChild && !document.querySelector(`[id='${startId - width*2-2}']`).firstChild && !document.querySelector(`[id='${startId - width*3-3}']`).firstChild && !document.querySelector(`[id='${startId - width*4-4}']`).firstChild && !document.querySelector(`[id='${startId - width*5-5}']`).firstChild ||
                        startId - width*7-7 === targetId && !document.querySelector(`[id='${startId - width-1}']`).firstChild && !document.querySelector(`[id='${startId - width*2-2}']`).firstChild && !document.querySelector(`[id='${startId - width*3-3}']`).firstChild && !document.querySelector(`[id='${startId - width*4-4}']`).firstChild && !document.querySelector(`[id='${startId - width*5-5}']`).firstChild && !document.querySelector(`[id='${startId - width*6-6}']`).firstChild ||
                        startId + width-1 === targetId || 
                        startId + width*2-2 === targetId && !document.querySelector(`[id='${startId + width-1}']`).firstChild ||
                        startId + width*3-3 === targetId && !document.querySelector(`[id='${startId + width-1}']`).firstChild && !document.querySelector(`[id='${startId + width*2-2}']`).firstChild || 
                        startId + width*4-4 === targetId && !document.querySelector(`[id='${startId + width-1}']`).firstChild && !document.querySelector(`[id='${startId + width*2-2}']`).firstChild && !document.querySelector(`[id='${startId + width*3-3}']`).firstChild ||
                        startId + width*5-5 === targetId && !document.querySelector(`[id='${startId + width-1}']`).firstChild && !document.querySelector(`[id='${startId + width*2-2}']`).firstChild && !document.querySelector(`[id='${startId + width*3-3}']`).firstChild && !document.querySelector(`[id='${startId + width*4-4}']`).firstChild ||
                        startId + width*6-6 === targetId && !document.querySelector(`[id='${startId + width-1}']`).firstChild && !document.querySelector(`[id='${startId + width*2-2}']`).firstChild && !document.querySelector(`[id='${startId + width*3-3}']`).firstChild && !document.querySelector(`[id='${startId + width*4-4}']`).firstChild && !document.querySelector(`[id='${startId + width*5-5}']`).firstChild ||
                        startId + width*7-7 === targetId && !document.querySelector(`[id='${startId + width-1}']`).firstChild && !document.querySelector(`[id='${startId + width*2-2}']`).firstChild && !document.querySelector(`[id='${startId + width*3-3}']`).firstChild && !document.querySelector(`[id='${startId + width*4-4}']`).firstChild && !document.querySelector(`[id='${startId + width*5-5}']`).firstChild && !document.querySelector(`[id='${startId + width*6-6}']`).firstChild ||
                        startId - width+1 === targetId || 
                        startId - width*2+2 === targetId && !document.querySelector(`[id='${startId - width+1}']`).firstChild ||
                        startId - width*3+3 === targetId && !document.querySelector(`[id='${startId - width+1}']`).firstChild && !document.querySelector(`[id='${startId - width*2+2}']`).firstChild || 
                        startId - width*4+4 === targetId && !document.querySelector(`[id='${startId - width+1}']`).firstChild && !document.querySelector(`[id='${startId - width*2+2}']`).firstChild && !document.querySelector(`[id='${startId - width*3+3}']`).firstChild ||
                        startId - width*5+5 === targetId && !document.querySelector(`[id='${startId - width+1}']`).firstChild && !document.querySelector(`[id='${startId - width*2+2}']`).firstChild && !document.querySelector(`[id='${startId - width*3+3}']`).firstChild && !document.querySelector(`[id='${startId - width*4+4}']`).firstChild ||
                        startId - width*6+6 === targetId && !document.querySelector(`[id='${startId - width+1}']`).firstChild && !document.querySelector(`[id='${startId - width*2+2}']`).firstChild && !document.querySelector(`[id='${startId - width*3+3}']`).firstChild && !document.querySelector(`[id='${startId - width*4+4}']`).firstChild && !document.querySelector(`[id='${startId - width*5+5}']`).firstChild ||
                        startId - width*7+7 === targetId && !document.querySelector(`[id='${startId - width+1}']`).firstChild && !document.querySelector(`[id='${startId - width*2+2}']`).firstChild && !document.querySelector(`[id='${startId - width*3+3}']`).firstChild && !document.querySelector(`[id='${startId - width*4+4}']`).firstChild && !document.querySelector(`[id='${startId - width*5+5}']`).firstChild && !document.querySelector(`[id='${startId - width*6+6}']`).firstChild ||
                        startId + width*1 === targetId || 
                        startId + width*2 === targetId && !document.querySelector(`[id='${startId + width*1}']`).firstChild ||
                        startId + width*3 === targetId && !document.querySelector(`[id='${startId + width*1}']`).firstChild && !document.querySelector(`[id='${startId + width*2}']`).firstChild || 
                        startId + width*4 === targetId && !document.querySelector(`[id='${startId + width*1}']`).firstChild && !document.querySelector(`[id='${startId + width*2}']`).firstChild && !document.querySelector(`[id='${startId + width*3}']`).firstChild ||
                        startId + width*5 === targetId && !document.querySelector(`[id='${startId + width*1}']`).firstChild && !document.querySelector(`[id='${startId + width*2}']`).firstChild && !document.querySelector(`[id='${startId + width*3}']`).firstChild && !document.querySelector(`[id='${startId + width*4}']`).firstChild ||
                        startId + width*6 === targetId && !document.querySelector(`[id='${startId + width*1}']`).firstChild && !document.querySelector(`[id='${startId + width*2}']`).firstChild && !document.querySelector(`[id='${startId + width*3}']`).firstChild && !document.querySelector(`[id='${startId + width*4}']`).firstChild && !document.querySelector(`[id='${startId + width*5}']`).firstChild ||
                        startId + width*7 === targetId && !document.querySelector(`[id='${startId + width*1}']`).firstChild && !document.querySelector(`[id='${startId + width*2}']`).firstChild && !document.querySelector(`[id='${startId + width*3}']`).firstChild && !document.querySelector(`[id='${startId + width*4}']`).firstChild && !document.querySelector(`[id='${startId + width*5}']`).firstChild && !document.querySelector(`[id='${startId + width*6}']`).firstChild ||
                        startId - width*1 === targetId || 
                        startId - width*2 === targetId && !document.querySelector(`[id='${startId - width*1}']`).firstChild ||
                        startId - width*3 === targetId && !document.querySelector(`[id='${startId - width*1}']`).firstChild && !document.querySelector(`[id='${startId - width*2}']`).firstChild || 
                        startId - width*4 === targetId && !document.querySelector(`[id='${startId - width*1}']`).firstChild && !document.querySelector(`[id='${startId - width*2}']`).firstChild && !document.querySelector(`[id='${startId - width*3}']`).firstChild ||
                        startId - width*5 === targetId && !document.querySelector(`[id='${startId - width*1}']`).firstChild && !document.querySelector(`[id='${startId - width*2}']`).firstChild && !document.querySelector(`[id='${startId - width*3}']`).firstChild && !document.querySelector(`[id='${startId - width*4}']`).firstChild ||
                        startId - width*6 === targetId && !document.querySelector(`[id='${startId - width*1}']`).firstChild && !document.querySelector(`[id='${startId - width*2}']`).firstChild && !document.querySelector(`[id='${startId - width*3}']`).firstChild && !document.querySelector(`[id='${startId - width*4}']`).firstChild && !document.querySelector(`[id='${startId - width*5}']`).firstChild ||
                        startId - width*7 === targetId && !document.querySelector(`[id='${startId - width*1}']`).firstChild && !document.querySelector(`[id='${startId - width*2}']`).firstChild && !document.querySelector(`[id='${startId - width*3}']`).firstChild && !document.querySelector(`[id='${startId - width*4}']`).firstChild && !document.querySelector(`[id='${startId - width*5}']`).firstChild && !document.querySelector(`[id='${startId - width*6}']`).firstChild ||
                        startId + 1 === targetId || 
                        startId + 2 === targetId && !document.querySelector(`[id='${startId + 1}']`).firstChild ||
                        startId + 3 === targetId && !document.querySelector(`[id='${startId + 1}']`).firstChild && !document.querySelector(`[id='${startId + 2}']`).firstChild || 
                        startId + 4 === targetId && !document.querySelector(`[id='${startId + 1}']`).firstChild && !document.querySelector(`[id='${startId + 2}']`).firstChild && !document.querySelector(`[id='${startId + 3}']`).firstChild ||
                        startId + 5 === targetId && !document.querySelector(`[id='${startId + 1}']`).firstChild && !document.querySelector(`[id='${startId + 2}']`).firstChild && !document.querySelector(`[id='${startId + 3}']`).firstChild && !document.querySelector(`[id='${startId + 4}']`).firstChild ||
                        startId + 6 === targetId && !document.querySelector(`[id='${startId + 1}']`).firstChild && !document.querySelector(`[id='${startId + 2}']`).firstChild && !document.querySelector(`[id='${startId + 3}']`).firstChild && !document.querySelector(`[id='${startId + 4}']`).firstChild && !document.querySelector(`[id='${startId + 5}']`).firstChild ||
                        startId + 7 === targetId && !document.querySelector(`[id='${startId + 1}']`).firstChild && !document.querySelector(`[id='${startId + 2}']`).firstChild && !document.querySelector(`[id='${startId + 3}']`).firstChild && !document.querySelector(`[id='${startId + 4}']`).firstChild && !document.querySelector(`[id='${startId + 5}']`).firstChild && !document.querySelector(`[id='${startId + 6}']`).firstChild ||
                        startId - 1 === targetId || 
                        startId - 2 === targetId && !document.querySelector(`[id='${startId - 1}']`).firstChild ||
                        startId - 3 === targetId && !document.querySelector(`[id='${startId - 1}']`).firstChild && !document.querySelector(`[id='${startId - 2}']`).firstChild || 
                        startId - 4 === targetId && !document.querySelector(`[id='${startId - 1}']`).firstChild && !document.querySelector(`[id='${startId - 2}']`).firstChild && !document.querySelector(`[id='${startId - 3}']`).firstChild ||
                        startId - 5 === targetId && !document.querySelector(`[id='${startId - 1}']`).firstChild && !document.querySelector(`[id='${startId - 2}']`).firstChild && !document.querySelector(`[id='${startId - 3}']`).firstChild && !document.querySelector(`[id='${startId - 4}']`).firstChild ||
                        startId - 6 === targetId && !document.querySelector(`[id='${startId - 1}']`).firstChild && !document.querySelector(`[id='${startId - 2}']`).firstChild && !document.querySelector(`[id='${startId - 3}']`).firstChild && !document.querySelector(`[id='${startId - 4}']`).firstChild && !document.querySelector(`[id='${startId - 5}']`).firstChild ||
                        startId - 7 === targetId && !document.querySelector(`[id='${startId - 1}']`).firstChild && !document.querySelector(`[id='${startId - 2}']`).firstChild && !document.querySelector(`[id='${startId - 3}']`).firstChild && !document.querySelector(`[id='${startId - 4}']`).firstChild && !document.querySelector(`[id='${startId - 5}']`).firstChild && !document.querySelector(`[id='${startId - 6}']`).firstChild
                        ) {
                            return true}
                        else {
                            return false
                        }

        default : return true
        

    }
}

function reverseIds(){
    const allSquares = document.querySelectorAll('.square')
    allSquares.forEach((square, i) => square.setAttribute('id', (width * width -1)- i))
    console.log('Reversed')
}
function revertIds(){
    const allSquares = document.querySelectorAll('.square')
    allSquares.forEach((square,i) => square.setAttribute('id',i))
    console.log('Reverted')
}

function checkForWin() {
    const kings = Array.from(document.querySelectorAll('#king'));
    console.log(kings);
    if (!kings.some(king => king.firstElementChild.classList.contains('white'))) {
        console.log('You win');
        infoDisplay.innerHTML = 'White player wins!';
        const allSquares = document.querySelectorAll('.square');
        allSquares.forEach(square => square.firstElementChild?.setAttribute('draggable', false));
    }
    if (!kings.some(king => king.firstElementChild.classList.contains('black'))) {
        console.log('You win');
        infoDisplay.innerHTML = 'Black player wins!';
        const allSquares = document.querySelectorAll('.square');
        allSquares.forEach(square => square.firstElementChild?.setAttribute('draggable', false));
    }
}
