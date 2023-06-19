import { GridItem, Text } from '@chakra-ui/react';

function Cell({colStart, colEnd, rowStart, rowEnd, contents, index, status}) {

    return (
        <GridItem
            colStart={colStart}
            colEnd={colEnd}
            rowStart={rowStart}
            rowEnd={rowEnd}
            bgColor="white"
            color="black"
            borderColor="gray.400"
            borderWidth="1px"
            display="flex"
            alignItems="center"
            pl={2}
        >
            <Text>{index} {status}</Text>
        </GridItem>
    )
}
  
export default Cell;