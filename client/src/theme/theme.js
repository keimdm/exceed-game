import { extendTheme } from "@chakra-ui/react";

const theme = extendTheme({
	fonts: {
		heading: "Sans-Serif",
	},
	colors: {
		brand: {
			"black": "#000000",
			"white": "#FFFFFF",
			"orange": "#F34213",
            "gray": "#E2E8F0",
            "dark-blue": "#2C365E"
		}
	},
    components: {
        Button: {
            variants: {
                "brand": {
                    bgColor: "brand.orange",
                    color: "brand.white",
                    _hover: {
                        bgColor: "brand.white",
                        color: "brand.orange",
                        borderColor: "brand.orange",
                        borderWidth: "2px"
                    }
                }
            }
        },
        Heading: {
            variants: {
                "orange": {
                    color: "brand.orange",
                    fontSize: "5xl",
                },
                "blue": {
                    color: "brand.dark-blue"
                },
                "subheading": {
                    color: "brand.black",
                    fontSize: "2xl"
        
                },
            }
        }
    }
});

export default theme;