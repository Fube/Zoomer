# *Zoomer*
## Because remembering is hard
#### Example of expected JSON format:
```javascript
/**
* Notes:
*  
*	-To use different links for different classes, you MUST omit the zoom field.
*	-To use autojoin, you MUST add autojoin: true. Omiting it will assume autojoin is false.
*/
{
    "courses" : [
        {
			"name": "Foo",
			"teacher": "Bar Baz",
			"when": [
				["Tuesday", ["8:00", "9:30"]],
				["Thursday", ["9:30", "11:00"]]
			],
			"zoom": {
				"id": "123456",
				"pwd": "xxx",
				"link": "https://www.zoom.us/j/123456767?pwd=oogaboogahereismypassword"
			}
		},
		{
			"name": "Qux",
			"teacher": "Quux Corge",
			"when": [
				["Tuesday", ["9:30", "11:00"], ["idHere", "passWordHere", "linkHere. Yes order matters."]],
				["Friday", ["11:00", "12:30"], ["12345", "foobarbaz", "https://www.zoom.us/j/123456"]]
			],
			"autojoin": true
		}
    ]
}
```
For the autojoin function to work correctly, you need to setup "Always open these types of link in the associated app" on your default browser. From what I know, Chrome removed this option in v76. If you use Chrome, sucks to be you. Use a good browser like Firefox.
