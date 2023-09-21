module.exports = {
    "font-family": {
        "value": "{theme.font.settings.role.heading}",
        "type": "string",
        "description": "Font family"
    },
    "font-size": {
        "value": "{theme.font.settings.size.2xl}",
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
            "fontSize": "{theme.font.h1.font-size}",
            "lineHeight": "{theme.font.h1.line-height}",
            "fontFamily": "{theme.font.h1.font-family}",
            "fontWeight": "{theme.font.h1.font-weight}"
        },
        "type": "typography", 
    }
}