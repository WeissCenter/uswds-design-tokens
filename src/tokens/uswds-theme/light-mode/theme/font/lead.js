module.exports = {
    "font-family": {
        "value": "{theme.font.settings.role.heading}",
        "type": "string",
        "description": "Font family"
    },
    "font-size": {
        "value": "{theme.font.settings.size.lg}",
        "type": "size",
        "description": "Font size"
    },
    "line-height": {
        "value": "{font.line-height.6}",
        "type": "size",
        "description": "Line height"
    },
    "font-weight": {
        "value": "{theme.font.settings.weight.bold}",
        "type": "string",
        "description": "Font weight"
    },
    "measure" : {
        "value": "{font.measure.6}",
        "type": "size",
        "description": "Max width"
    },
    "font": {
        "value":{
            "fontSize": "{theme.font.lead.font-size}",
            "lineHeight": "{theme.font.lead.line-height}",
            "fontFamily": "{theme.font.lead.font-family}",
            "fontWeight": "{theme.font.lead.font-weight}"
        },
        "type": "typography", 
    }
}