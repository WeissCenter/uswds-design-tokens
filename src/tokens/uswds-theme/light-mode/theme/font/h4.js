module.exports = {
    "font-family": {
        "value": "{theme.font.settings.role.heading}",
        "type": "string",
        "description": "Font family"
    },
    "font-size": {
        "value": "{theme.font.settings.size.sm}",
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
            "fontSize": "{theme.font.h4.font-size}",
            "lineHeight": "{theme.font.h4.line-height}",
            "fontFamily": "{theme.font.h4.font-family}",
            "fontWeight": "{theme.font.h4.font-weight}"
        },
        "type": "typography", 
    }
}