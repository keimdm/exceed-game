import { GridItem, Text } from '@chakra-ui/react';

function CellMobile({colStart, colEnd, rowStart, rowEnd, contents, index, status, setCurrent, editStatus, cells, setCells}) {

    let color = "white";
    if (contents === "#ERR") {
        color = "red.300";
    }

    if (status === "Selected") {
        color = "blue.300";
    }

    const handleClick = (event) => {
        console.log("cell click");
        console.log(index);
        let newCells = cells.slice(0);
        for (let t = 0; t < newCells.length; t++) {
            newCells[t].status = "None";
        }
        newCells[index].status = "Selected";
        setCurrent(index);
    }

    return (
        <GridItem
            colStart={colStart}
            colEnd={colEnd}
            rowStart={rowStart}
            rowEnd={rowEnd}
            bgColor={color}
            color="black"
            borderColor="brand.gray"
            borderWidth="1px"
            display="flex"
            alignItems="center"
            pl={2}
            borderRadius="5px"
            onClick={handleClick}
        >
            <Text>{contents}</Text>
        </GridItem>
    )
}
  
export default CellMobile;