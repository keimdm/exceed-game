import { Button, Grid } from '@chakra-ui/react';
import { Link } from "react-router-dom";
import Cell from '../components/Cell.jsx'
import { useState, useEffect, useRef } from 'react';

function LevelOne() {

    const [cells, setCells] = useState([]);
    const [current, setCurrent] = useState(0);
    const [edgeY, setEdgeY] = useState(0);
    const [edgeX, setEdgeX] = useState(0);
    const [lastYMove, setLastYMove] = useState(0);
    const [lastXMove, setLastXMove] = useState(0);
    const [commandPressed, setCommandPressed] = useState(0);
    const [selectMultipleX, setSelectMultipleX] = useState(0);
    const [selectMultipleY, setSelectMultipleY] = useState(0);
    const [counter, setCounter] = useState(0);
    const [startTime, setStartTime] = useState(0);
    const timeElapsed = useRef(0);
    const maxTime = 30;
    const min = 0;
    const max = 149;
    const noCols = 10;
    const noRows = 15;

    const editStatus = (current, target, newStatus) => {
        const prevCells = cells.slice(0);
        prevCells[current].status = "None";
        prevCells[target].status = newStatus;
        setCurrent(target);
 
        setCells(prevCells);
    };

    const handleKeyDown = (event) => {
        event.preventDefault();
        const code = event.code;
        switch (code) {
            case "ArrowDown":
                // clear  previous selected
                for (let l = 0; l < cells.length; l++) {
                    cells[l].status = "None";
                }
                if (commandPressed === 1) {
                    // set up variables for while loop - starting on the current cell to iterate through until the stopping cell is found
                    let proposedNewCell = current;
                    let canContinue = true;
                    let currentContent = cells[current].contents;
                    let nextContent = cells[(current + 1 > max ? current : current + 1)].contents;
                    // if the shift key is held and the user is moving in the same direction as the last move, use the edge Y instead of current
                    if (event.shiftKey && lastYMove === 1) {
                        proposedNewCell = edgeY;
                        currentContent = cells[edgeY].contents;
                        nextContent = cells[(edgeY + 1 > max ? edgeY : edgeY + 1)].contents;
                    }
                    // continue incrementing forward while not at end of column (modulus 14), and when content rules are met
                    while (proposedNewCell % noRows !== noRows - 1 && canContinue === true) {
                        proposedNewCell = proposedNewCell + 1;
                        if (currentContent === "") {
                            // accounts for case with top left/bottom right cell
                            try {
                                // if current cell is blank and the next proposed one isn't
                                if (cells[proposedNewCell + 1].contents !== "") {
                                    canContinue = false;
                                    // move on to the next cell (per excel's behavior)
                                    if (proposedNewCell % noRows !== noRows - 1 && cells[proposedNewCell].contents === "") {
                                        proposedNewCell = proposedNewCell + 1;
                                    }
                                }
                            }
                            catch {
                                canContinue = false;
                            }
                        }
                        else {
                            try {
                                // if current cell isn't blank and if it's the last row of the data before blanks
                                if (nextContent === "") {
                                    // behave as in the previous case - go to the next block of data (or the end)
                                    if (cells[proposedNewCell + 1].contents !== "") {
                                        canContinue = false;
                                        if (proposedNewCell % noRows !== noRows - 1) {
                                            proposedNewCell = proposedNewCell + 1;
                                        }
                                    }
                                }
                                // otherwise continue until it hits a blank, but stay in the block of data
                                else if (cells[proposedNewCell + 1].contents === "") {
                                    canContinue = false;
                                }
                            }
                            catch {
                                canContinue = false;
                            }
                        }
                    }
                    // if shift key is held, multiple cells need to be selected, corresponding to the newYValue and selectMultipleX as dimensions
                    if (event.shiftKey) {
                        let newValueY = proposedNewCell - current;
                        setSelectMultipleY(newValueY);
                        setEdgeY(proposedNewCell);
                        // if y width is not zero, loop through y then x
                        if (newValueY !== 0) {
                            for (let k = 0; (newValueY >= 0? k < newValueY: k > newValueY); (newValueY >= 0 ? k++ : k--)) {
                                // if x is zero, fill in the cell here since the inner loop won't be reached
                                if (selectMultipleX === 0) {
                                    cells[current + (newValueY >= 0 ? k + 1 : k - 1)].status = "Selected";
                                }
                                for (let m = 0; (selectMultipleX >= 0? m < selectMultipleX: m > selectMultipleX); (selectMultipleX >= 0 ? m++ : m--)) {
                                    cells[current + (newValueY >= 0 ? k + 1 : k - 1) + (selectMultipleX >= 0 ? m + 1 : m - 1) * noRows].status = "Selected";
                                    cells[current + (newValueY >= 0 ? k + 1 : k - 1)].status = "Selected";
                                    cells[current + (selectMultipleX >= 0 ? m + 1 : m - 1) * noRows].status = "Selected";
                                }
                            }
                        }
                        else {
                            // loop through x if y = 0 as the other loop won't be reached
                            for (let m = 0; (selectMultipleX >= 0? m < selectMultipleX: m > selectMultipleX); (selectMultipleX >= 0 ? m++ : m--)) {
                                cells[current + (selectMultipleX >= 0 ? m + 1 : m - 1) * noRows].status = "Selected";
                            }
                        }
                        editStatus(current, current, "Selected");
                    }
                    else {
                        editStatus(current, proposedNewCell, "Selected");
                        setEdgeY(proposedNewCell);
                        setEdgeX(proposedNewCell);
                        for (let l = 0; l < cells.length; l++) {
                            if (l !== proposedNewCell) {
                                cells[l].status = "None";
                            }
                        }
                        setSelectMultipleY(0);
                        setSelectMultipleX(0);
                    }
                }
                // if command is not pressed, just iterates by one cell
                else {
                    if (max >= current + 1 && (current + 1) % noRows !== 0) {
                        if (event.shiftKey) {
                            let newValueY = selectMultipleY + 1;
                            setSelectMultipleY(newValueY);
                            // if y width is not zero, loop through y then x
                            if (newValueY !== 0) {
                                for (let k = 0; (newValueY >= 0? k < newValueY: k > newValueY); (newValueY >= 0 ? k++ : k--)) {
                                    // if x is zero, fill in the cell here since the inner loop won't be reached
                                    if (selectMultipleX === 0) {
                                        cells[current + (newValueY >= 0 ? k + 1 : k - 1)].status = "Selected";
                                    }
                                    for (let m = 0; (selectMultipleX >= 0? m < selectMultipleX: m > selectMultipleX); (selectMultipleX >= 0 ? m++ : m--)) {
                                        cells[current + (newValueY >= 0 ? k + 1 : k - 1) + (selectMultipleX >= 0 ? m + 1 : m - 1) * noRows].status = "Selected";
                                        cells[current + (newValueY >= 0 ? k + 1 : k - 1)].status = "Selected";
                                        cells[current + (selectMultipleX >= 0 ? m + 1 : m - 1) * noRows].status = "Selected";
                                    }
                                }
                            }
                            else {
                                // loop through x if y = 0 as the other loop won't be reached
                                for (let m = 0; (selectMultipleX >= 0? m < selectMultipleX: m > selectMultipleX); (selectMultipleX >= 0 ? m++ : m--)) {
                                    cells[current + (selectMultipleX >= 0 ? m + 1 : m - 1) * noRows].status = "Selected";
                                }
                            }
                            editStatus(current, current, "Selected");
                            setEdgeY(current);
                            setEdgeX(current);
                        }
                        else {
                            let newCurrent = current + 1;
                            editStatus(current, newCurrent, "Selected")
                            setEdgeY(newCurrent);
                            setEdgeX(newCurrent);
                            for (let l = 0; l < cells.length; l++) {
                                if (l !== newCurrent) {
                                    cells[l].status = "None";
                                }
                            }
                            setSelectMultipleY(0);
                            setSelectMultipleX(0);

                        }
                    }
                }
                setLastYMove(1);
            break;
            case "ArrowUp":
                // clear  previous selected
                for (let l = 0; l < cells.length; l++) {
                    cells[l].status = "None";
                }
                if (commandPressed === 1) {
                    // set up variables for while loop - starting on the current cell to iterate through until the stopping cell is found
                    let proposedNewCell = current;
                    let canContinue = true;
                    let currentContent = cells[current].contents;
                    let nextContent = cells[(current - 1 < min ? current : current - 1)].contents;
                    // if the shift key is held and the user is moving in the same direction as the last move, use the edge Y instead of current
                    if (event.shiftKey && lastYMove === -1) {
                        proposedNewCell = edgeY;
                        currentContent = cells[edgeY].contents;
                        nextContent = cells[(edgeY - 1 < min ? edgeY : edgeY - 1)].contents;
                    }
                    // continue incrementing forward while not at end of column (modulus 14), and when content rules are met
                    while (proposedNewCell % noRows !== 0 && canContinue === true) {
                        proposedNewCell = proposedNewCell - 1;
                        if (currentContent === "") {
                            // accounts for case with top left/bottom right cell
                            try {
                                // if current cell is blank and the next proposed one isn't
                                if (cells[proposedNewCell - 1].contents !== "") {
                                    canContinue = false;
                                    // move on to the next cell (per excel's behavior)
                                    if (proposedNewCell % noRows !== 0 && cells[proposedNewCell].contents === "") {
                                        proposedNewCell = proposedNewCell - 1;
                                    }
                                }
                            }
                            catch {
                                canContinue = false;
                            }
                        }
                        else {
                            try {
                                // if current cell isn't blank and if it's the last row of the data before blanks
                                if (nextContent === "") {
                                    // behave as in the previous case - go to the next block of data (or the end)
                                    if (cells[proposedNewCell - 1].contents !== "") {
                                        canContinue = false;
                                        if (proposedNewCell % noRows !== 0) {
                                            proposedNewCell = proposedNewCell - 1;
                                        }
                                    }
                                }
                                // otherwise continue until it hits a blank, but stay in the block of data
                                else if (cells[proposedNewCell - 1].contents === "") {
                                    canContinue = false;
                                }
                            }
                            catch {
                                canContinue = false;
                            }
                        }
                    }
                    // if shift key is held, multiple cells need to be selected, corresponding to the newYValue and selectMultipleX as dimensions
                    if (event.shiftKey) {
                        let newValueY = proposedNewCell - current;
                        setSelectMultipleY(newValueY);
                        setEdgeY(proposedNewCell);
                        // if y width is not zero, loop through y then x
                        if (newValueY !== 0) {
                            for (let k = 0; (newValueY >= 0? k < newValueY: k > newValueY); (newValueY >= 0 ? k++ : k--)) {
                                // if x is zero, fill in the cell here since the inner loop won't be reached
                                if (selectMultipleX === 0) {
                                    cells[current + (newValueY >= 0 ? k + 1 : k - 1)].status = "Selected";
                                }
                                for (let m = 0; (selectMultipleX >= 0? m < selectMultipleX: m > selectMultipleX); (selectMultipleX >= 0 ? m++ : m--)) {
                                    cells[current + (newValueY >= 0 ? k + 1 : k - 1) + (selectMultipleX >= 0 ? m + 1 : m - 1) * noRows].status = "Selected";
                                    cells[current + (newValueY >= 0 ? k + 1 : k - 1)].status = "Selected";
                                    cells[current + (selectMultipleX >= 0 ? m + 1 : m - 1) * noRows].status = "Selected";
                                }
                            }
                        }
                        else {
                            // loop through x if y = 0 as the other loop won't be reached
                            for (let m = 0; (selectMultipleX >= 0? m < selectMultipleX: m > selectMultipleX); (selectMultipleX >= 0 ? m++ : m--)) {
                                cells[current + (selectMultipleX >= 0 ? m + 1 : m - 1) * noRows].status = "Selected";
                            }
                        }
                        editStatus(current, current, "Selected");
                    }
                    else {
                        editStatus(current, proposedNewCell, "Selected");
                        setEdgeY(proposedNewCell);
                        setEdgeX(proposedNewCell);
                        for (let l = 0; l < cells.length; l++) {
                            if (l !== proposedNewCell) {
                                cells[l].status = "None";
                            }
                        }
                        setSelectMultipleY(0);
                        setSelectMultipleX(0);
                    }
                }
                // if command is not pressed, just iterates by one cell
                else {
                    if (min <= current - 1 && current % noRows !== 0) {
                        if (event.shiftKey) {
                            let newValueY = selectMultipleY - 1;
                            setSelectMultipleY(newValueY);
                            // if y width is not zero, loop through y then x
                            if (newValueY !== 0) {
                                for (let k = 0; (newValueY >= 0? k < newValueY: k > newValueY); (newValueY >= 0 ? k++ : k--)) {
                                    // if x is zero, fill in the cell here since the inner loop won't be reached
                                    if (selectMultipleX === 0) {
                                        cells[current + (newValueY >= 0 ? k + 1 : k - 1)].status = "Selected";
                                    }
                                    for (let m = 0; (selectMultipleX >= 0? m < selectMultipleX: m > selectMultipleX); (selectMultipleX >= 0 ? m++ : m--)) {
                                        cells[current + (newValueY >= 0 ? k + 1 : k - 1) + (selectMultipleX >= 0 ? m + 1 : m - 1) * noRows].status = "Selected";
                                        cells[current + (newValueY >= 0 ? k + 1 : k - 1)].status = "Selected";
                                        cells[current + (selectMultipleX >= 0 ? m + 1 : m - 1) * noRows].status = "Selected";
                                    }
                                }
                            }
                            else {
                                // loop through x if y = 0 as the other loop won't be reached
                                for (let m = 0; (selectMultipleX >= 0? m < selectMultipleX: m > selectMultipleX); (selectMultipleX >= 0 ? m++ : m--)) {
                                    cells[current + (selectMultipleX >= 0 ? m + 1 : m - 1) * noRows].status = "Selected";
                                }
                            }
                            editStatus(current, current, "Selected");
                            setEdgeY(current);
                            setEdgeX(current);
                        }
                        else {
                            let newCurrent = current - 1;
                            editStatus(current, newCurrent, "Selected")
                            setEdgeY(newCurrent);
                            setEdgeX(newCurrent);
                            for (let l = 0; l < cells.length; l++) {
                                if (l !== newCurrent) {
                                    cells[l].status = "None";
                                }
                            }
                            setSelectMultipleY(0);
                            setSelectMultipleX(0);

                        }
                    }
                }
                setLastYMove(-1);
            break;
            case "ArrowRight":
                // clear  previous selected
                for (let l = 0; l < cells.length; l++) {
                    cells[l].status = "None";
                }
                if (commandPressed === 1) {
                    // set up variables for while loop - starting on the current cell to iterate through until the stopping cell is found
                    let proposedNewCell = current;
                    let canContinue = true;
                    let currentContent = cells[current].contents;
                    let nextContent = cells[(current + noRows > max ? current : current + noRows)].contents;
                    // if the shift key is held and the user is moving in the same direction as the last move, use the edge Y instead of current
                    if (event.shiftKey && lastXMove === 1) {
                        proposedNewCell = edgeX;
                        currentContent = cells[edgeX].contents;
                        nextContent = cells[(edgeX + noRows > max ? edgeX : edgeX + noRows)].contents;
                    }
                    // continue incrementing forward while not at end of column (modulus 14), and when content rules are met
                    while (proposedNewCell + noRows <= max && canContinue === true) {
                        proposedNewCell = proposedNewCell + noRows;
                        if (currentContent === "") {
                            // accounts for case with top left/bottom right cell
                            try {
                                // if current cell is blank and the next proposed one isn't
                                if (cells[proposedNewCell + noRows].contents !== "") {
                                    canContinue = false;
                                    // move on to the next cell (per excel's behavior)
                                    if (proposedNewCell + noRows <= max && cells[proposedNewCell].contents === "") {
                                        proposedNewCell = proposedNewCell + noRows;
                                    }
                                }
                            }
                            catch {
                                canContinue = false;
                            }
                        }
                        else {
                            try {
                                // if current cell isn't blank and if it's the last row of the data before blanks
                                if (nextContent === "") {
                                    // behave as in the previous case - go to the next block of data (or the end)
                                    if (cells[proposedNewCell + noRows].contents !== "") {
                                        canContinue = false;
                                        if (proposedNewCell + noRows <= max) {
                                            proposedNewCell = proposedNewCell + noRows;
                                        }
                                    }
                                }
                                // otherwise continue until it hits a blank, but stay in the block of data
                                else if (cells[proposedNewCell + noRows].contents === "") {
                                    canContinue = false;
                                }
                            }
                            catch {
                                canContinue = false;
                            }
                        }
                    }
                    // if shift key is held, multiple cells need to be selected, corresponding to the newYValue and selectMultipleX as dimensions
                    if (event.shiftKey) {
                        let newValueX = (proposedNewCell - current) / noRows;
                        setSelectMultipleX(newValueX);
                        setEdgeX(proposedNewCell);
                        // if x width is not zero, loop through x then y
                        if (newValueX !== 0) {
                            for (let k = 0; (newValueX >= 0? k < newValueX: k > newValueX); (newValueX >= 0 ? k++ : k--)) {
                                // if y is zero, fill in the cell here since the inner loop won't be reached
                                if (selectMultipleY === 0) {
                                    cells[current + (newValueX >= 0 ? k + 1 : k - 1) * noRows].status = "Selected";
                                }
                                for (let m = 0; (selectMultipleY >= 0? m < selectMultipleY: m > selectMultipleY); (selectMultipleY >= 0 ? m++ : m--)) {
                                    cells[current + (newValueX >= 0 ? k + 1 : k - 1) * noRows + (selectMultipleY >= 0 ? m + 1 : m - 1)].status = "Selected";
                                    cells[current + (newValueX >= 0 ? k + 1 : k - 1) * noRows].status = "Selected";
                                    cells[current + (selectMultipleY >= 0 ? m + 1 : m - 1)].status = "Selected";
                                }
                            }
                        }
                        else {
                            // loop through y if x = 0 as the other loop won't be reached
                            for (let m = 0; (selectMultipleY >= 0? m < selectMultipleY: m > selectMultipleY); (selectMultipleY >= 0 ? m++ : m--)) {
                                cells[current + (selectMultipleY >= 0 ? m + 1 : m - 1)].status = "Selected";
                            }
                        }
                        editStatus(current, current, "Selected");
                    }
                    else {
                        editStatus(current, proposedNewCell, "Selected");
                        setEdgeY(proposedNewCell);
                        setEdgeX(proposedNewCell);
                        for (let l = 0; l < cells.length; l++) {
                            if (l !== proposedNewCell) {
                                cells[l].status = "None";
                            }
                        }
                        setSelectMultipleY(0);
                        setSelectMultipleX(0);
                    }
                }
                // if command is not pressed, just iterates by one cell
                else {
                    if (max >= current + noRows) {
                        if (event.shiftKey) {
                            let newValueX = selectMultipleX + 1;
                            setSelectMultipleX(newValueX);
                            // if x width is not zero, loop through x then y
                            if (newValueX !== 0) {
                                for (let k = 0; (newValueX >= 0? k < newValueX: k > newValueX); (newValueX >= 0 ? k++ : k--)) {
                                    // if y is zero, fill in the cell here since the inner loop won't be reached
                                    if (selectMultipleY === 0) {
                                        cells[current + (newValueX >= 0 ? k + 1 : k - 1) * noRows].status = "Selected";
                                    }
                                    for (let m = 0; (selectMultipleY >= 0? m < selectMultipleY: m > selectMultipleY); (selectMultipleY >= 0 ? m++ : m--)) {
                                        cells[current + (newValueX >= 0 ? k + 1 : k - 1) * noRows + (selectMultipleY >= 0 ? m + 1 : m - 1)].status = "Selected";
                                        cells[current + (newValueX >= 0 ? k + 1 : k - 1) * noRows].status = "Selected";
                                        cells[current + (selectMultipleY >= 0 ? m + 1 : m - 1)].status = "Selected";
                                    }
                                }
                            }
                            else {
                                // loop through y if x = 0 as the other loop won't be reached
                                for (let m = 0; (selectMultipleY >= 0? m < selectMultipleY: m > selectMultipleY); (selectMultipleY >= 0 ? m++ : m--)) {
                                    cells[current + (selectMultipleY >= 0 ? m + 1 : m - 1)].status = "Selected";
                                }
                            }
                            editStatus(current, current, "Selected");
                            setEdgeY(current);
                            setEdgeX(current);
                        }
                        else {
                            let newCurrent = current + noRows;
                            editStatus(current, newCurrent, "Selected")
                            setEdgeY(newCurrent);
                            setEdgeX(newCurrent);
                            for (let l = 0; l < cells.length; l++) {
                                if (l !== newCurrent) {
                                    cells[l].status = "None";
                                }
                            }
                            setSelectMultipleY(0);
                            setSelectMultipleX(0);

                        }
                    }
                }
                setLastXMove(1);
            break;
            case "ArrowLeft":
                // clear  previous selected
                for (let l = 0; l < cells.length; l++) {
                    cells[l].status = "None";
                }
                if (commandPressed === 1) {
                    // set up variables for while loop - starting on the current cell to iterate through until the stopping cell is found
                    let proposedNewCell = current;
                    let canContinue = true;
                    let currentContent = cells[current].contents;
                    let nextContent = cells[(current - noRows < min ? current : current - noRows)].contents;
                    // if the shift key is held and the user is moving in the same direction as the last move, use the edge Y instead of current
                    if (event.shiftKey && lastXMove === -1) {
                        proposedNewCell = edgeX;
                        currentContent = cells[edgeX].contents;
                        nextContent = cells[(edgeX - noRows < min ? edgeX : edgeX - noRows)].contents;
                    }
                    // continue incrementing forward while not at end of column (modulus 14), and when content rules are met
                    while (proposedNewCell - noRows >= min && canContinue === true) {
                        proposedNewCell = proposedNewCell - noRows;
                        if (currentContent === "") {
                            // accounts for case with top left/bottom right cell
                            try {
                                // if current cell is blank and the next proposed one isn't
                                if (cells[proposedNewCell - noRows].contents !== "") {
                                    canContinue = false;
                                    // move on to the next cell (per excel's behavior)
                                    if (proposedNewCell - noRows >= min && cells[proposedNewCell].contents === "") {
                                        proposedNewCell = proposedNewCell - noRows;
                                    }
                                }
                            }
                            catch {
                                canContinue = false;
                            }
                        }
                        else {
                            try {
                                // if current cell isn't blank and if it's the last row of the data before blanks
                                if (nextContent === "") {
                                    // behave as in the previous case - go to the next block of data (or the end)
                                    if (cells[proposedNewCell - noRows].contents !== "") {
                                        canContinue = false;
                                        if (proposedNewCell - noRows >= min) {
                                            proposedNewCell = proposedNewCell - noRows;
                                        }
                                    }
                                }
                                // otherwise continue until it hits a blank, but stay in the block of data
                                else if (cells[proposedNewCell - noRows].contents === "") {
                                    canContinue = false;
                                }
                            }
                            catch {
                                canContinue = false;
                            }
                        }
                    }
                    // if shift key is held, multiple cells need to be selected, corresponding to the newYValue and selectMultipleX as dimensions
                    if (event.shiftKey) {
                        let newValueX = (proposedNewCell - current) / noRows;
                        setSelectMultipleX(newValueX);
                        setEdgeX(proposedNewCell);
                        // if x width is not zero, loop through x then y
                        if (newValueX !== 0) {
                            for (let k = 0; (newValueX >= 0? k < newValueX: k > newValueX); (newValueX >= 0 ? k++ : k--)) {
                                // if y is zero, fill in the cell here since the inner loop won't be reached
                                if (selectMultipleY === 0) {
                                    cells[current + (newValueX >= 0 ? k + 1 : k - 1) * noRows].status = "Selected";
                                }
                                for (let m = 0; (selectMultipleY >= 0? m < selectMultipleY: m > selectMultipleY); (selectMultipleY >= 0 ? m++ : m--)) {
                                    cells[current + (newValueX >= 0 ? k + 1 : k - 1) * noRows + (selectMultipleY >= 0 ? m + 1 : m - 1)].status = "Selected";
                                    cells[current + (newValueX >= 0 ? k + 1 : k - 1) * noRows].status = "Selected";
                                    cells[current + (selectMultipleY >= 0 ? m + 1 : m - 1)].status = "Selected";
                                }
                            }
                        }
                        else {
                            // loop through y if x = 0 as the other loop won't be reached
                            for (let m = 0; (selectMultipleY >= 0? m < selectMultipleY: m > selectMultipleY); (selectMultipleY >= 0 ? m++ : m--)) {
                                cells[current + (selectMultipleY >= 0 ? m + 1 : m - 1)].status = "Selected";
                            }
                        }
                        editStatus(current, current, "Selected");
                    }
                    else {
                        editStatus(current, proposedNewCell, "Selected");
                        setEdgeY(proposedNewCell);
                        setEdgeX(proposedNewCell);
                        for (let l = 0; l < cells.length; l++) {
                            if (l !== proposedNewCell) {
                                cells[l].status = "None";
                            }
                        }
                        setSelectMultipleY(0);
                        setSelectMultipleX(0);
                    }
                }
                // if command is not pressed, just iterates by one cell
                else {
                    if (min <= current - noRows) {
                        if (event.shiftKey) {
                            let newValueX = selectMultipleX - 1;
                            setSelectMultipleX(newValueX);
                            // if x width is not zero, loop through x then y
                            if (newValueX !== 0) {
                                for (let k = 0; (newValueX >= 0? k < newValueX: k > newValueX); (newValueX >= 0 ? k++ : k--)) {
                                    // if y is zero, fill in the cell here since the inner loop won't be reached
                                    if (selectMultipleY === 0) {
                                        cells[current + (newValueX >= 0 ? k + 1 : k - 1) * noRows].status = "Selected";
                                    }
                                    for (let m = 0; (selectMultipleY >= 0? m < selectMultipleY: m > selectMultipleY); (selectMultipleY >= 0 ? m++ : m--)) {
                                        cells[current + (newValueX >= 0 ? k + 1 : k - 1) * noRows + (selectMultipleY >= 0 ? m + 1 : m - 1)].status = "Selected";
                                        cells[current + (newValueX >= 0 ? k + 1 : k - 1) * noRows].status = "Selected";
                                        cells[current + (selectMultipleY >= 0 ? m + 1 : m - 1)].status = "Selected";
                                    }
                                }
                            }
                            else {
                                // loop through y if x = 0 as the other loop won't be reached
                                for (let m = 0; (selectMultipleY >= 0? m < selectMultipleY: m > selectMultipleY); (selectMultipleY >= 0 ? m++ : m--)) {
                                    cells[current + (selectMultipleY >= 0 ? m + 1 : m - 1)].status = "Selected";
                                }
                            }
                            editStatus(current, current, "Selected");
                            setEdgeY(current);
                            setEdgeX(current);
                        }
                        else {
                            let newCurrent = current - noRows;
                            editStatus(current, newCurrent, "Selected")
                            setEdgeY(newCurrent);
                            setEdgeX(newCurrent);
                            for (let l = 0; l < cells.length; l++) {
                                if (l !== newCurrent) {
                                    cells[l].status = "None";
                                }
                            }
                            setSelectMultipleY(0);
                            setSelectMultipleX(0);

                        }
                    }
                }
                setLastXMove(-1);
            break;
            case "MetaLeft":
                setCommandPressed(1);
            break;
            case "MetaRight":
                setCommandPressed(1);
            break;
        }
    }

    const handleKeyUp = (event) => {
        const code = event.code;
        switch (code) {
            case "MetaLeft":
                setCommandPressed(0);
            break;
            case "MetaRight":
                setCommandPressed(0);
            break;
        }
    }

    useEffect(() => {
        const newCells = [];

        for (let i = 0; i < noCols; i++) {
            for (let j = 0; j < noRows; j++) {
                let contents = "";
                if (i >= 2 && i <=6 && j >= 3 && j <=7 ) {
                    contents = "D";
                }
                else {
                    contents = "";
                }
                newCells.push({
                    colStart: i + 1,
                    colEnd: i + 2,
                    rowStart: j + 1,
                    rowEnd: j + 2,
                    contents: contents,
                    status: "None"
                });
            }
        }

        newCells[current].status = "Selected";

        setCells(newCells);

        setStartTime(Date.now());
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            setCounter(counter + 1);
        }, 100);
       
        return () => clearInterval(interval);
    });

    useEffect(() => {
        const currentTime = Date.now();
        const secondsElapsed = (currentTime - startTime) / 1000;
        timeElapsed.current = Math.round(secondsElapsed);
        console.log(timeElapsed.current);
    });

    return (
        <>
            <p>Level One</p>
            <p>{maxTime - timeElapsed.current}</p>
            <div
                tabIndex={-1}
                onKeyDown={handleKeyDown}  
                onKeyUp={handleKeyUp}  
            >
                <Grid
                    w="800px"
                    h="500px"
                    bgColor="red.500"
                    templateColumns={"repeat(" + noCols + ", 1fr)"}
                    templateRows={"repeat(" + noRows + ", 1fr)"}
                >
                    {
                        cells.map((cell, index) => (
                            <Cell colStart={cell.colStart} colEnd={cell.colEnd} rowStart={cell.rowStart} rowEnd={cell.rowEnd} contents={cell.contents} key={index} index={index} status={cell.status} />
                        ))
                    }
                </Grid>
            </div>
            <Link to={`/levels`}>
                <Button>
                    Level Select
                </Button>
            </Link>
        </>
    )
}
  
export default LevelOne;