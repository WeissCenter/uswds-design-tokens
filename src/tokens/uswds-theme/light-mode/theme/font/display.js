module.exports = {
    "font-family": {
        "value": "{theme.font.settings.role.heading}",
        "type": "string",
        "description": "Font family"
    },
    "font-size": {
        "value": "{theme.font.settings.size.3xl}",
        "type": "size",
        "description": "Font size"
    },
    "line-height": {
        "value": "{font.line-height.2}",
        "type": "size",
        "description": "Line height"
    },
    "font-weight": {
        "value": "{theme.font.settings.weight.bold}",
        "type": "string",
        "description": "Font weight"
    },
    "font": {
        "value":{
            "fontSize": "{theme.font.display.font-size}",
            "lineHeight": "{theme.font.display.line-height}",
            "fontFamily": "{theme.font.display.font-family}",
            "fontWeight": "{theme.font.display.font-weight}"
        },
        "type": "typography", 
    }
}