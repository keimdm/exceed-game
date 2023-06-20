import { Button, Grid } from '@chakra-ui/react';
import { Link } from "react-router-dom";
import Cell from '../components/Cell.jsx'
import { useState, useEffect } from 'react';

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
    const min = 0;
    const max = 149;

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
                    let proposedNewCell = current;
                    let canContinue = true;
                    let currentContent = cells[current].contents;
                    let nextContent = cells[(current + 1 > max ? current : current + 1)].contents;
                    if (event.shiftKey && lastYMove === 1) {
                        proposedNewCell = edgeY;
                        currentContent = cells[edgeY].contents;
                        nextContent = cells[(edgeY + 1 > max ? edgeY : edgeY + 1)].contents;
                    }
                    // continue incrementing forward while not at end of column (modulus 14), and when content rules are met
                    while (proposedNewCell % 15 !== 14 && canContinue === true) {
                        proposedNewCell = proposedNewCell + 1;
                        if (currentContent === "") {
                            // accounts for case with top left/bottom right cell
                            try {
                                // if current cell is blank and the next proposed one isn't
                                if (cells[proposedNewCell + 1].contents !== "") {
                                    canContinue = false;
                                    // move on to the next cell (per excel's behavior)
                                    if (proposedNewCell % 15 !== 14) {
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
                                        if (proposedNewCell % 15 !== 14) {
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
                                    cells[current + (newValueY >= 0 ? k + 1 : k - 1) + (selectMultipleX >= 0 ? m + 1 : m - 1)*15].status = "Selected";
                                }
                            }
                        }
                        else {
                            // loop through x if y = 0 as the other loop won't be reached
                            for (let m = 0; (selectMultipleX >= 0? m < selectMultipleX: m > selectMultipleX); (selectMultipleX >= 0 ? m++ : m--)) {
                                cells[current + (selectMultipleX >= 0 ? m + 1 : m - 1)*15].status = "Selected";
                            }
                        }
                        editStatus(current, current, "Selected");
                    }
                    else {
                        editStatus(current, proposedNewCell, "Selected");
                        setEdgeY(current);
                        setEdgeX(current);
                        for (let l = 0; l < cells.length; l++) {
                            if (l !== proposedNewCell) {
                                cells[l].status = "None";
                            }
                        }
                        setSelectMultipleY(0);
                        setSelectMultipleX(0);
                    }
                }
                else {
                    if (max >= current + 1 && (current + 1) % 15 !== 0) {
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
                                        cells[current + (newValueY >= 0 ? k + 1 : k - 1) + (selectMultipleX >= 0 ? m + 1 : m - 1)*15].status = "Selected";
                                    }
                                }
                            }
                            else {
                                // loop through x if y = 0 as the other loop won't be reached
                                for (let m = 0; (selectMultipleX >= 0? m < selectMultipleX: m > selectMultipleX); (selectMultipleX >= 0 ? m++ : m--)) {
                                    cells[current + (selectMultipleX >= 0 ? m + 1 : m - 1)*15].status = "Selected";
                                }
                            }
                            editStatus(current, current, "Selected");
                            setEdgeY(current);
                            setEdgeX(current);
                        }
                        else {
                            let newCurrent = current + 1;
                            editStatus(current, newCurrent, "Selected")
                            setEdgeY(current);
                            setEdgeX(current);
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
                for (let l = 0; l < cells.length; l++) {
                    cells[l].status = "None";
                }
                if (commandPressed === 1) {
                    let proposedNewCell = current;
                    let canContinue = true;
                    let currentContent = cells[current].contents;
                    let nextContent = cells[(current - 1 < min ? current : current - 1)].contents;
                    if (event.shiftKey && lastYMove === -1) {
                        proposedNewCell = edgeY;
                        currentContent = cells[edgeY].contents;
                        nextContent = cells[(edgeY - 1 > max ? edgeY : edgeY - 1)].contents;
                    }
                    while (proposedNewCell % 15 !== 0 && canContinue === true) {
                        proposedNewCell = proposedNewCell - 1;
                        if (currentContent === "") {
                            try {
                                if (cells[proposedNewCell - 1].contents !== "") {
                                    canContinue = false;
                                    if (proposedNewCell % 15 !== 0) {
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
                                if (nextContent === "") {
                                    if (cells[proposedNewCell - 1].contents !== "") {
                                        canContinue = false;
                                        if (proposedNewCell % 15 !== 0) {
                                            proposedNewCell = proposedNewCell - 1;
                                        }
                                    }
                                }
                                else if (cells[proposedNewCell - 1].contents === "") {
                                    canContinue = false;
                                }
                            }
                            catch {
                                canContinue = false;
                            }
                        }
                    }
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
                                    cells[current + (newValueY >= 0 ? k + 1 : k - 1) + (selectMultipleX >= 0 ? m + 1 : m - 1)*15].status = "Selected";
                                }
                            }
                        }
                        else {
                            // loop through x if y = 0 as the other loop won't be reached
                            for (let m = 0; (selectMultipleX >= 0? m < selectMultipleX: m > selectMultipleX); (selectMultipleX >= 0 ? m++ : m--)) {
                                cells[current + (selectMultipleX >= 0 ? m + 1 : m - 1)*15].status = "Selected";
                            }
                        }
                        editStatus(current, current, "Selected");
                    }
                    else {
                        editStatus(current, proposedNewCell, "Selected");
                        setEdgeY(current);
                        setEdgeX(current);
                        for (let l = 0; l < cells.length; l++) {
                            if (l !== proposedNewCell) {
                                cells[l].status = "None";
                            }
                        }
                        setSelectMultipleY(0);
                        setSelectMultipleX(0);
                    }
                }
                else {
                    if (min <= current - 1 && current % 15 !== 0) {
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
                                        cells[current + (newValueY >= 0 ? k + 1 : k - 1) + (selectMultipleX >= 0 ? m + 1 : m - 1)*15].status = "Selected";
                                    }
                                }
                            }
                            else {
                                // loop through x if y = 0 as the other loop won't be reached
                                for (let m = 0; (selectMultipleX >= 0? m < selectMultipleX: m > selectMultipleX); (selectMultipleX >= 0 ? m++ : m--)) {
                                    cells[current + (selectMultipleX >= 0 ? m + 1 : m - 1)*15].status = "Selected";
                                }
                            }
                            editStatus(current, current, "Selected");
                            setEdgeY(current);
                            setEdgeX(current);
                        }
                        else {
                            let newCurrent = current - 1;
                            editStatus(current, newCurrent, "Selected")
                            setEdgeY(current);
                            setEdgeX(current);
                            setSelectMultipleY(0);
                            setSelectMultipleX(0);

                        }
                    } 
                }
                setLastYMove(-1);
            break;
            case "ArrowRight":
                if (max >= current + 15) {
                    editStatus(current, current + 15, "Selected")
                }
            break;
            case "ArrowLeft":
                if (min <= current - 15) {
                    editStatus(current, current - 15, "Selected")
                }
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

        for (let i = 0; i < 10; i++) {
            for (let j = 0; j < 15; j++) {
                let contents = "";
                if (i >= 1 && i <=6 && j >= 3 && j <=7 ) {
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

        newCells[current].status = "Selected";

        setCells(newCells);
    }, []);

    return (
        <>
            <p>Level One</p>
            <div
                tabIndex={-1}
                onKeyDown={handleKeyDown}  
                onKeyUp={handleKeyUp}  
            >
                <Grid
                    w="800px"
                    h="500px"
                    bgColor="red.500"
                    templateColumns="repeat(10, 1fr)"
                    templateRows="repeat(15, 1fr)"
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