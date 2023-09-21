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
    "font": {
        "value":{
            "fontSize": "{theme.font.body.font-size}",
            "lineHeight": "{theme.font.body.line-height}",
            "fontFamily": "{theme.font.body.font-family}",
        },
        "type": "typography", 
    }
}