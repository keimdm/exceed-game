import { GridItem, Text } from '@chakra-ui/react';

function Cell({colStart, colEnd, rowStart, rowEnd, contents, index, status}) {

    let color = "white";
    if (contents === "#ERR") {
        color = "red.300";
    }

    if (status === "Selected") {
        color = "blue.300";
    }

    return (
        <GridItem
            colStart={colStart}
            colEnd={colEnd}
            rowStart={rowStart}
            rowEnd={rowEnd}
            bgColor={color}
            color="black"
            borderColor="gray.400"
            borderWidth="1px"
            display="flex"
            alignItems="center"
            pl={2}
        >
            <Text>{contents}</Text>
        </GridItem>
    )
}
  
export default Cell;