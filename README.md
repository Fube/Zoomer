# *Zoomer*
## Because remembering is hard
#### Example of expected JSON format:
```javascript
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
				"pwd": "xxx"
			}
		},
		{
			"name": "Qux",
			"teacher": "Quux Corge",
			"when": [
				["Tuesday", ["9:30", "11:00"]],
				["Friday", ["11:00", "12:30"]]
			],
			"zoom": {
				"id": "789 1011 1213",
				"pwd": "xxx"
			}
		}
    ]
}
```
