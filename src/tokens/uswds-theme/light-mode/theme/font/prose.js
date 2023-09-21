module.exports = {
    "font-family": {
        "value": "{theme.font.settings.role.body}",
        "type": "string",
        "description": "Font family"
    },
    "font-size": {
        "value": "{theme.font.settings.size.sm}",
        "type": "size",
        "description": "Font size"
    },
    "line-height": {
        "value": "{font.line-height.5}",
        "type": "size",
        "description": "Line height"
    },
    "font-weight": {
        "value": "{theme.font.settings.weight.light}",
        "type": "string",
        "description": "Font weight"
    },
    "measure" : {
        "value": "{font.measure.4}",
        "type": "size",
        "description": "Max width"
    },
    "font": {
        "value":{
            "fontSize": "{theme.font.prose.font-size}",
            "lineHeight": "{theme.font.prose.line-height}",
            "fontFamily": "{theme.font.prose.font-family}",
            "fontWeight": "{theme.font.prose.font-weight}"
        },
        "type": "typography", 
    }
}