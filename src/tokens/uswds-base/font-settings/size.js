module.exports = {
    "base": {
        "value": "16px",
        "type": "fontSizes",
        "description": "Base font size"
    },

//TODO: I don't like that this is hardcoded into the base level of the tokens, but it also feels weird referencing a base level token to a dependent theme level token. I need to think about this more.

    // Adding all font-sizes in this file.

    "h1-font-size": {
        "value": "{size.2xl}",
        "type": "fontSizes",
        "description": "h2 font size"
    },
    "h2-font-size": {
        "value": "{size.xl}",
        "type": "fontSizes",
        "description": "h3 font size"
    },
    "h3-font-size": {
        "value": "{size.lg}",
        "type": "fontSizes",
        "description": "h4 font size"
    },
    "h4-font-size": {
        "value": "{size.sm}",
        "type": "fontSizes",
        "description": "h5 font size"
    },
    "h5-font-size": {
        "value": "{size.xs}",
        "type": "fontSizes",
        "description": "h6 font size"
    },
    "h6-font-size": {
        "value": "{size.3xs}",
        "type": "fontSizes",
        "description": "Heading line height"
    },
    "small-font-size": {
        "value": "{size.2xs}",
        "type": "fontSizes",
        "description": "Used for the smallest text on a site."
    },
    "display-font-size": {
        "value": "{size.3xl}",
        "type": "fontSizes",
        "description": "Used for the largest text on a site."
    }
}