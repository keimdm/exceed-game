import { Button, Grid, Text, Box, Input, Card, Heading } from '@chakra-ui/react';
import { Link } from "react-router-dom";
import Cell from '../components/Cell.jsx'
import { useState, useEffect, useRef } from 'react';
import Header from "../components/Header.jsx";
import { loggedIn, getUser } from '../utils/auth';

function LevelOneWindows() {

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
    const [gameRunning, setGameRunning] = useState(0);
    const [gameOver, setGameOver] = useState(0);
    const [timesToSpawn, setTimesToSpawn] = useState([]);
    const [tempPotential, setTempPotential] = useState([]);
    const [score, setScore] = useState(0);
    const [maxData, setMaxData] = useState(0);
    const [dataLeft, setDataLeft] = useState(0);
    const timeElapsed = useRef(0);
    const incrementForSpawn = 2;
    const scoreIncrement = 10;
    const maxTime = 15;
    const min = 0;
    const max = 149;
    const noCols = 10;
    const noRows = 15;
    const permanentPotential = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 135, 136, 137, 138, 139, 140, 141, 142, 143, 144, 145, 146, 147, 148, 149];

    const editStatus = (current, target, newStatus) => {
        const prevCells = cells.slice(0);
        prevCells[current].status = "None";
        prevCells[target].status = newStatus;
        setCurrent(target);
        setCells(prevCells);
    };

    const updateHighScore = (dataRemaining) => {
        console.log("ran high score");
        const user = getUser();
        const userId = user.data._id;
        fetch("/api/users/" + userId, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        }).then((response) => {
            if (response.status === 400) {
                console.log("Try again!");
            }
            else if (response.status === 500) {
                console.log("Server error - please try again later!");
            }
            else  {
                response.json().then((data) => {
                    let userScores = data.scores;
                    let newScore = Math.round(score * dataRemaining / maxData);
                    if (userScores.levelOne) {
                        if (userScores.levelOne < newScore) {
                            userScores.levelOne = newScore;
                        }
                    }
                    else {
                        userScores.levelOne = newScore;
                    }
                    fetch("/api/users/scores/" + userId, {
                        method: "PUT",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            "scores": userScores,
                        }),
                    }).then((response) => {
                        if (response.status === 400) {
                            console.log("Try again!");
                        }
                        else if (response.status === 500) {
                            console.log("Server error - please try again later!");
                        }
                        else  {
                            console.log("Success!");
                        }  
                    });  
                })
            }  
        });  
    }

    const handleKeyDown = (event) => {
        event.preventDefault();
        console.log(event);
        if (gameRunning === 0 && gameOver === 0) {
            setStartTime(Date.now());
            setGameRunning(1);
            const newCells = cells.slice(0);
            let dataCount = 0;
            for (let e = 0; e < newCells.length; e++) {
                newCells[e].status = "None";
                if (newCells[e].contents === "DATA") {
                    dataCount = dataCount + 1;
                }
            }
            setMaxData(dataCount);
            editStatus(0, 0, "Selected");

        }
        else {
            const code = event.code;
            switch (code) {
                case "ArrowDown":
                    // clear  previous selected
                    for (let l = 0; l < cells.length; l++) {
                        cells[l].status = "None";
                    }
                    if (commandPressed === 1) {
                        // set up variables for while loop - starting on the current cell to iterate through until the stopping cell is found
                        let proposedNewCell = edgeY;
                        let canContinue = true;
                        let currentContent = cells[current].contents;
                        let nextContent = cells[(current + 1 > max ? current : current + 1)].contents;
                        // if the shift key is held and the user is moving in the same direction as the last move, use the edge Y instead of current
                        if (event.shiftKey && lastYMove === 1) {
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
                        else {
                            editStatus(current, current, "Selected");
                            setEdgeY(current);
                            setEdgeX(current);
                            for (let l = 0; l < cells.length; l++) {
                                    if (l !== current) {
                                        cells[l].status = "None";
                                    }
                                }
                            setSelectMultipleY(0);
                            setSelectMultipleX(0);
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
                        let proposedNewCell = edgeY;
                        let canContinue = true;
                        let currentContent = cells[current].contents;
                        let nextContent = cells[(current - 1 < min ? current : current - 1)].contents;
                        // if the shift key is held and the user is moving in the same direction as the last move, use the edge Y instead of current
                        if (event.shiftKey && lastYMove === -1) {
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
                        else {
                            editStatus(current, current, "Selected");
                            setEdgeY(current);
                            setEdgeX(current);
                            for (let l = 0; l < cells.length; l++) {
                                    if (l !== current) {
                                        cells[l].status = "None";
                                    }
                                }
                            setSelectMultipleY(0);
                            setSelectMultipleX(0);
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
                        let proposedNewCell = edgeX;
                        let canContinue = true;
                        let currentContent = cells[current].contents;
                        let nextContent = cells[(current + noRows > max ? current : current + noRows)].contents;
                        // if the shift key is held and the user is moving in the same direction as the last move, use the edge Y instead of current
                        if (event.shiftKey && lastXMove === 1) {
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
                        else {
                            editStatus(current, current, "Selected");
                            setEdgeY(current);
                            setEdgeX(current);
                            for (let l = 0; l < cells.length; l++) {
                                    if (l !== current) {
                                        cells[l].status = "None";
                                    }
                                }
                            setSelectMultipleY(0);
                            setSelectMultipleX(0);
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
                        let proposedNewCell = edgeX;
                        let canContinue = true;
                        let currentContent = cells[current].contents;
                        let nextContent = cells[(current - noRows < min ? current : current - noRows)].contents;
                        // if the shift key is held and the user is moving in the same direction as the last move, use the edge Y instead of current
                        if (event.shiftKey && lastXMove === -1) {
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
                        else {
                            editStatus(current, current, "Selected");
                            setEdgeY(current);
                            setEdgeX(current);
                            for (let l = 0; l < cells.length; l++) {
                                    if (l !== current) {
                                        cells[l].status = "None";
                                    }
                                }
                            setSelectMultipleY(0);
                            setSelectMultipleX(0);
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
                case "Backspace":
                    let newCells = cells.slice(0);
                    let newTempPotential = [];
                    let newScore = score;
                    for (let q = 0; q < newCells.length; q++) {
                        if (newCells[q].status === "Selected") {
                            if (newCells[q].contents === "#ERR") {
                                newScore = newScore + scoreIncrement;
                            }
                            newCells[q].contents = "";
                        }
                        if (newCells[q].contents === "#ERR") {
                            if (q + 1 <= max && (q + 1) % noRows !== 0 && !newTempPotential.includes(q + 1)) {
                                newTempPotential.push(q + 1);
                            }
                            if (q - 1 >= min && (q) % noRows !== 0 && !newTempPotential.includes(q - 1)) {
                                newTempPotential.push(q - 1);
                            }
                            if (q + 15 <= max && !newTempPotential.includes(q + 15)) {
                                newTempPotential.push(q + 15);
                            }
                            if (q - 15 >= min && !newTempPotential.includes(q - 15)) {
                                newTempPotential.push(q - 15);
                            }
                        }
                    }
                    setScore(newScore);
                    setCells(newCells);
                    setTempPotential(newTempPotential);
                break;
            }
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

    const handleClicks = (event) => {
        if (gameRunning === 1) {
            event.preventDefault();
        }
        else if (gameRunning === 0 && gameOver === 0) {
            event.preventDefault();
        }
    }

    const handlePlayAgain = (event) => {
        setGameRunning(0);
        setGameOver(0);
        timeElapsed.current = 0;
        setCurrent(0);
        setEdgeY(0);
        setEdgeX(0);
        setLastYMove(0);
        setLastXMove(0);
        setCommandPressed(0);
        setSelectMultipleX(0);
        setSelectMultipleY(0);
        setCounter(0);
        setStartTime(0);
        setTimesToSpawn([]);
        setTempPotential([])
        setScore(0);
        const newCells = [];
        setMaxData(0);
        setDataLeft(0);
        window.location.assign('/level-one');

        for (let i = 0; i < noCols; i++) {
            for (let j = 0; j < noRows; j++) {
                let contents = "";
                if (i >= 3 && i <=6 && j >= 3 && j <=7 ) {
                    contents = "DATA";
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

        let newSpawnTimes = [];
        for (let k = 0; k < maxTime; k++) {
            if (k % incrementForSpawn === 0) {
                newSpawnTimes.push(k);
            }
        }
        setTimesToSpawn(newSpawnTimes);

        newCells[current].status = "Selected";

        setCells(newCells);
    }

    useEffect(() => {
        const newCells = [];

        for (let i = 0; i < noCols; i++) {
            for (let j = 0; j < noRows; j++) {
                let contents = "";
                if (i >= 3 && i <=6 && j >= 3 && j <=7 ) {
                    contents = "DATA";
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

        let newSpawnTimes = [];
        for (let k = 0; k < maxTime; k++) {
            if (k % incrementForSpawn === 0) {
                newSpawnTimes.push(k);
            }
        }
        setTimesToSpawn(newSpawnTimes);

        newCells[current].status = "Selected";

        setCells(newCells);

        
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
        if (secondsElapsed > maxTime + 1 && gameRunning === 1) {
            let dataRemaining = 0;
            for (let p = 0; p < cells.length; p++) {
                if (cells[p].contents === "DATA") {
                    dataRemaining = dataRemaining + 1;
                }
            }
            setDataLeft(dataRemaining);
            console.log(maxData);
            console.log(dataRemaining);
            setGameRunning(0);
            setGameOver(1);
            updateHighScore(dataRemaining);
            
        }
        timeElapsed.current = Math.round(secondsElapsed);
        if (timesToSpawn.includes(timeElapsed.current)) {
            let newTimes = timesToSpawn.slice(0);
            newTimes.splice(newTimes.indexOf(timeElapsed.current), 1);
            setTimesToSpawn(newTimes);
            spawn();
        }
        if (timeElapsed.current < -1000 || timeElapsed.current > 1000) {
            timeElapsed.current = 0;
        }
    });

    const spawn = () => {
        let newCells = cells.slice(0);
        for (let b = 0; b < permanentPotential.length; b++) {
            let rand = Math.round(Math.random() * 10);
            if (rand === 1) {
                let newSquare = permanentPotential[b];
                newCells[newSquare].contents = "#ERR";
                if (newSquare + 1 <= max && (newSquare + 1) % noRows !== 0 && !tempPotential.includes(newSquare + 1)) {
                    tempPotential.push(newSquare + 1);
                }
                if (newSquare - 1 >= min && (newSquare) % noRows !== 0 && !tempPotential.includes(newSquare - 1)) {
                    tempPotential.push(newSquare - 1);
                }
                if (newSquare + 15 <= max && !tempPotential.includes(newSquare + 15)) {
                    tempPotential.push(newSquare + 15);
                }
                if (newSquare - 15 >= min && !tempPotential.includes(newSquare - 15)) {
                    tempPotential.push(newSquare - 15);
                }
            }
        }
        for (let c = 0; c < tempPotential.length; c++) {
            let rand = Math.round(Math.random() * 10);
            if (rand === 1) {
                let newSquare = tempPotential[c];
                newCells[newSquare].contents = "#ERR";
                if (newSquare + 1 <= max && (newSquare + 1) % noRows !== 0 && !tempPotential.includes(newSquare + 1)) {
                    tempPotential.push(newSquare + 1);
                }
                if (newSquare - 1 >= min && (newSquare) % noRows !== 0 && !tempPotential.includes(newSquare - 1)) {
                    tempPotential.push(newSquare - 1);
                }
                if (newSquare + 15 <= max && !tempPotential.includes(newSquare + 15)) {
                    tempPotential.push(newSquare + 15);
                }
                if (newSquare - 15 >= min && !tempPotential.includes(newSquare - 15)) {
                    tempPotential.push(newSquare - 15);
                }
            }
        }
        setCells(newCells);
    };

    return (
        <Box
            w="100%"
            h="100vh"
            bgColor="brand.gray"
            display="flex"
            flexDirection="column"
            alignItems="center"
            onMouseDown={handleClicks}
        >
            <Header />
            {loggedIn() ? (
                <Box
                    onMouseDown={handleClicks}
                >
                    <Input
                        autoFocus
                        onKeyDown={handleKeyDown}
                        onKeyUp={handleKeyUp}
                        opacity={0}
                    />
                    {gameRunning === 1 ? (
                        <>
                            <Heading
                                variant="subheading"
                                textAlign="center"
                                mb={3}
                            >
                                {"Time: " + (maxTime - timeElapsed.current < 0 ? 0 : maxTime - timeElapsed.current)}
                            </Heading>
                            <Heading
                                variant="subheading"
                                textAlign="center"
                                mb={3}
                            >
                                {"Score: " + score}
                            </Heading>
                            <Box
                                tabIndex={-1}
                                onKeyDown={handleKeyDown}
                                onKeyUp={handleKeyUp}
                            >
                                <Grid
                                    w="800px"
                                    h="500px"
                                    bgColor="brand.gray"
                                    templateColumns={"repeat(" + noCols + ", 1fr)"}
                                    templateRows={"repeat(" + noRows + ", 1fr)"}
                                >
                                    {
                                        cells.map((cell, index) => (
                                            <Cell colStart={cell.colStart} colEnd={cell.colEnd} rowStart={cell.rowStart} rowEnd={cell.rowEnd} contents={cell.contents} key={index} index={index} status={cell.status} />
                                        ))
                                    }
                                </Grid>
                            </Box>
                        </>
                    ) : (
                        gameOver === 1 ? (
                            <>
                                <div
                                    tabIndex={-1}
                                >
                                    <Card
                                        w="800px"
                                        h="500px"
                                        my={12}
                                        display="flex"
                                        flexDirection="column"
                                        justifyContent="space-around"
                                        alignItems="center"
                                        p={10}
                                    >
                                        <Heading variant="blue">Game Over!</Heading>
                                        <Box>
                                            <Heading variant="subheading" mb={2}>{"Raw Score: " + score}</Heading>
                                            <Heading variant="subheading" mb={2}>{"Data Remaining: " + Math.round(dataLeft * 100 / maxData) + "%"}</Heading>
                                            <Heading variant="subheading" mb={2}>{"Final Score: " + Math.round(score * dataLeft / maxData)}</Heading>
                                        </Box>
                                        
                                        <Box
                                            w="30%"
                                        >
                                            <Button variant="brand" onClick={handlePlayAgain} mb={3}>Play Again</Button>
                                            <Link to={`/scores`}>
                                                <Button variant="brand">High Scores</Button>
                                            </Link>
                                        </Box>
                                    </Card>
                                </div>
                            </>
                        ) : (
                            <>
                                <div
                                    tabIndex={-1}
                                    onKeyDown={handleKeyDown} 
                                    onMouseDown={handleClicks}
                                >
                                    <Card
                                        w="800px"
                                        h="500px"
                                        my={12}
                                        display="flex"
                                        flexDirection="column"
                                        justifyContent="space-around"
                                        alignItems="center"
                                        p={10}
                                    >
                                        <Heading
                                            variant="blue"
                                        >
                                            Level 1
                                        </Heading>
                                        <Heading
                                            variant="subheading"
                                        >
                                            Press any key to start!
                                        </Heading>
                                    </Card>
                                </div>
                            </>
                        )
                        
                    )}
                </Box>
            ) : (
                <>
                    <Card
                        w="60%"
                        h="50%"
                        my={12}
                        display="flex"
                        flexDirection="column"
                        justifyContent="space-around"
                        alignItems="center"
                        p={10}
                        textAlign="center"
                    >
                        <Heading
                            variant="subheading"
                        >
                            Sorry - you are not authorized to view this page! Please log in and try again.
                        </Heading>
                    </Card>
                </>
            )}
        </Box>
       
    )
}
  
export default LevelOneWindows;