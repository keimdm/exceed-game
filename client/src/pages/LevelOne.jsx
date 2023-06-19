import { Button, Grid } from '@chakra-ui/react';
import { Link } from "react-router-dom";
import Cell from '../components/Cell.jsx'
import { useState, useEffect } from 'react';

function LevelOne() {

    const [cells, setCells] = useState([]);
    const [current, setCurrent] = useState(0);
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
        const code = event.code;
        switch (code) {
            case "ArrowDown":
                if (max >= current + 1 && (current + 1) % 15 !== 0) {
                    editStatus(current, current + 1, "Selected")
                }
            break;
            case "ArrowUp":
                if (min <= current - 1 && current % 15 !== 0) {
                    editStatus(current, current - 1, "Selected")
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
        }
    }

    useEffect(() => {
        const newCells = [];

        for (let i = 0; i < 10; i++) {
            for (let j = 0; j < 15; j++) {
                newCells.push({
                    colStart: i + 1,
                    colEnd: i + 2,
                    rowStart: j + 1,
                    rowEnd: j + 2,
                    contents: "Test",
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