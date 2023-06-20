import { Button, Grid } from '@chakra-ui/react';
import { Link } from "react-router-dom";
import Cell from '../components/Cell.jsx'
import { useState, useEffect } from 'react';

function LevelOne() {

    const [cells, setCells] = useState([]);
    const [current, setCurrent] = useState(0);
    const [commandPressed, setCommandPressed] = useState(0);
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
                if (commandPressed === 1) {
                    let proposedNewCell = current;
                    let canContinue = true;
                    let currentContent = cells[current].contents;
                    // continue incrementing forward while not at end of column (modulus 14), and when content rules are met
                    while (proposedNewCell % 15 !== 14 && canContinue === true) {
                        proposedNewCell = proposedNewCell + 1;
                        if (currentContent === "") {
                            // if current cell is blank and the next proposed one isn't
                            if (cells[proposedNewCell + 1].contents !== "") {
                                canContinue = false;
                                // move on to the next cell (per excel's behavior)
                                if (proposedNewCell % 15 !== 14) {
                                    proposedNewCell = proposedNewCell + 1;
                                }
                            }
                        }
                        else {
                            // if current cell isn't blank and if it's the last row of the data before blanks
                            if (cells[current + 1].contents === "") {
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
                    }
                    editStatus(current, proposedNewCell, "Selected");
                }
                else {
                    if (max >= current + 1 && (current + 1) % 15 !== 0) {
                        editStatus(current, current + 1, "Selected")
                    }
                }
            break;
            case "ArrowUp":
                if (commandPressed === 1) {
                    let proposedNewCell = current;
                    let canContinue = true;
                    let currentContent = cells[current].contents;
                    while (proposedNewCell % 15 !== 0 && canContinue === true) {
                        proposedNewCell = proposedNewCell - 1;
                        if (currentContent === "") {
                            if (cells[proposedNewCell - 1].contents !== "") {
                                canContinue = false;
                                if (proposedNewCell % 15 !== 0) {
                                    proposedNewCell = proposedNewCell - 1;
                                }
                            }
                        }
                        else {
                            if (cells[current - 1].contents === "") {
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
                    }
                    editStatus(current, proposedNewCell, "Selected");
                }
                else {
                    if (min <= current - 1 && current % 15 !== 0) {
                        editStatus(current, current - 1, "Selected")
                    }
                }
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