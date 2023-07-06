import { Button, Grid, Text, Box, Input, Card, Heading } from '@chakra-ui/react';
import { Link } from "react-router-dom";
import CellMobile from '../components/CellMobile.jsx'
import { useState, useEffect, useRef } from 'react';
import Header from "../components/Header.jsx";
import { loggedIn, getUser } from '../utils/auth';

function LevelOneMobile() {

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
    const scoreIncrement = 50;
    const maxTime = 15;
    const min = 0;
    const max = 49;
    const noCols = 5;
    const noRows = 10;
    const permanentPotential = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49];

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
                    if (userScores.levelOneMobile) {
                        if (userScores.levelOneMobile < newScore) {
                            userScores.levelOneMobile = newScore;
                        }
                    }
                    else {
                        userScores.levelOneMobile = newScore;
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

    const handleDeleteButton = (event) => {
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
                if (q + noRows <= max && !newTempPotential.includes(q + noRows)) {
                    newTempPotential.push(q + noRows);
                }
                if (q - noRows >= min && !newTempPotential.includes(q - noRows)) {
                    newTempPotential.push(q - noRows);
                }
            }
        }
        setScore(newScore);
        setCells(newCells);
        setTempPotential(newTempPotential);
    }

    const handleClicks = (event) => {
        if (gameRunning === 0 && gameOver === 0) {
            console.log(event);
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
        window.location.assign('/level-one-m');

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
                if (i === 2 && i <=6 && j >= 2 && j <=7 ) {
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
            let rand = Math.round(Math.random() * 20);
            if (rand === 1) {
                let newSquare = permanentPotential[b];
                newCells[newSquare].contents = "#ERR";
                if (newSquare + 1 <= max && (newSquare + 1) % noRows !== 0 && !tempPotential.includes(newSquare + 1)) {
                    tempPotential.push(newSquare + 1);
                }
                if (newSquare - 1 >= min && (newSquare) % noRows !== 0 && !tempPotential.includes(newSquare - 1)) {
                    tempPotential.push(newSquare - 1);
                }
                if (newSquare + noRows <= max && !tempPotential.includes(newSquare + noRows)) {
                    tempPotential.push(newSquare + noRows);
                }
                if (newSquare - noRows >= min && !tempPotential.includes(newSquare - noRows)) {
                    tempPotential.push(newSquare - noRows);
                }
            }
        }
        for (let c = 0; c < tempPotential.length; c++) {
            let rand = Math.round(Math.random() * 20);
            if (rand === 1) {
                let newSquare = tempPotential[c];
                newCells[newSquare].contents = "#ERR";
                if (newSquare + 1 <= max && (newSquare + 1) % noRows !== 0 && !tempPotential.includes(newSquare + 1)) {
                    tempPotential.push(newSquare + 1);
                }
                if (newSquare - 1 >= min && (newSquare) % noRows !== 0 && !tempPotential.includes(newSquare - 1)) {
                    tempPotential.push(newSquare - 1);
                }
                if (newSquare + noRows <= max && !tempPotential.includes(newSquare + noRows)) {
                    tempPotential.push(newSquare + noRows);
                }
                if (newSquare - noRows >= min && !tempPotential.includes(newSquare - noRows)) {
                    tempPotential.push(newSquare - noRows);
                }
            }
        }
        setCells(newCells);
    };

    return (
        <Box
            minH={{base: window.innerHeight, md: '100vh'}}
            w={{base: "100%", md: '100%'}}
            bgColor="brand.gray"
            display="flex"
            flexDirection="column"
            alignItems="center"
        >
            <Header />
            {loggedIn() ? (
                <Box
                    onMouseDown={handleClicks}
                    display="flex"
                    flexDirection="column"
                    alignItems="center"
                >
                    {gameRunning === 1 ? (
                        <>
                            <Heading
                                variant="subheading"
                                textAlign="center"
                                mb={3}
                                mt={3}
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
                            >
                                <Grid
                                    w="300px"
                                    h="500px"
                                    bgColor="brand.gray"
                                    templateColumns={"repeat(" + noCols + ", 1fr)"}
                                    templateRows={"repeat(" + noRows + ", 1fr)"}
                                >
                                    {
                                        cells.map((cell, index) => (
                                            <CellMobile colStart={cell.colStart} colEnd={cell.colEnd} rowStart={cell.rowStart} rowEnd={cell.rowEnd} contents={cell.contents} key={index} index={index} status={cell.status} setCurrent={setCurrent} editStatus={editStatus} cells={cells} setCells={setCells}/>
                                        ))
                                    }
                                </Grid>
                                <Button
                                    variant="brand"
                                    onClick={handleDeleteButton}
                                    mt={3}
                                >
                                    Delete
                                </Button>
                            </Box>
                        </>
                    ) : (
                        gameOver === 1 ? (
                                <div
                                    tabIndex={-1}
                                    w="100%"
                                    display="flex"
                                    flexDirection="column"
                                    alignItems="center"
                                >
                                    <Card
                                        w={{base: "100%", md: "800px"}}
                                        h="500px"
                                        my={12}
                                        display="flex"
                                        flexDirection="column"
                                        justifyContent="space-around"
                                        alignItems="center"
                                        p={10}
                                    >
                                        <Heading variant="blue" textAlign="center">Game Over!</Heading>
                                        <Box>
                                            <Heading variant="subheading" mb={2} textAlign="center">{"Raw Score: " + score}</Heading>
                                            <Heading variant="subheading" mb={2} textAlign="center">{"Data Remaining: " + Math.round(dataLeft * 100 / maxData) + "%"}</Heading>
                                            <Heading variant="subheading" mb={2} textAlign="center">{"Final Score: " + Math.round(score * dataLeft / maxData)}</Heading>
                                        </Box>
                                        
                                        <Box
                                            w={{base: "60%", md: "30%"}}
                                        >
                                            <Button variant="brand" onClick={handlePlayAgain} mb={3}>Play Again</Button>
                                            <Link to={`/scores`}>
                                                <Button variant="brand">High Scores</Button>
                                            </Link>
                                        </Box>
                                    </Card>
                                </div>
                        ) : (
                                <div
                                    tabIndex={-1}
                                    w="100%"
                                    display="flex"
                                    flexDirection="column"
                                    alignItems="center"
                                >
                                    <Card
                                        w={{base: "100%", md: "800px"}}
                                        h="500px"
                                        my={12}
                                        display="flex"
                                        flexDirection="column"
                                        justifyContent="space-around"
                                        alignItems="center"
                                        p={10}
                                        alignSelf="center"
                                    >
                                        <Heading
                                            variant="blue"
                                            textAlign="center"
                                        >
                                            Level 1
                                        </Heading>
                                        <Heading
                                            variant="subheading"
                                        >
                                            Tap to start!
                                        </Heading>
                                    </Card>
                                </div>
                        )
                        
                    )}
                </Box>
            ) : (
                <>
                    <Card
                        w={{base: "90%", md: "60%"}}
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
                            textAlign="center"
                        >
                            Sorry - you are not authorized to view this page! Please log in and try again.
                        </Heading>
                    </Card>
                </>
            )}
        </Box>
       
    )
}
  
export default LevelOneMobile;