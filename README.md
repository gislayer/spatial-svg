# Spatial-To-SVG
This library converts your open-source GeoJSON, KML, and GPX files into SVG format. With this module, you can define styling rules to create more visually appealing SVGs. Additionally, the resulting SVG files can be used across various platforms.

## Demo Website
This module is developed for GISLayer software. After logging into the system, you can find it under the **Data** menu.  
To use it, please make sure to **add your geometric data to the map**, then click the **SVG Export** button to proceed.

To learn how to use this tool, 
Training Article : [click here](https://editor.gislayer.com)
Training Video :  [click here](https://editor.gislayer.com)
DEMO PAGE :  [click here](https://editor.gislayer.com)
Note : The software offers **30 minutes of free usage**.

## Convert GeoJSON file to SVG file

    import * as  fs  from  "fs";
	const GeoJSONString = fs.readFileSync("...path/data.geojson", "utf8");
	 
	const  svgConverter = new SpatialSVG({
		fileType: "geojson",
		data:GeoJSONString,
		size: 1000,
		styleType: "general",
		styles: {
			stroke: "#FF0000",
			strokeWidth: 2,
			fill: "#00FF00",
			fillOpacity: 0.5,
			radius: 10,
			}
		});
		
	const  svg = svgConverter.getSVG();
	fs.writeFileSync("...path/sample.svg", svg);
	
## Install

```bash
npm install spatial-to-svg
```



## Convert KML File To SVG
The code example above can be used in a similar way. All you need to do is change the `fileType` value.

    import * as  fs  from  "fs";
	const KMLString = fs.readFileSync("...path/data.kml", "utf8");
	 
	const  svgConverter = new SpatialSVG({
		fileType: "kml",
		data:KMLString,
		size: 1000,
		styleType: "general",
		styles: {
			stroke: "#FF0000",
			strokeWidth: 2,
			fill: "#00FF00",
			fillOpacity: 0.5,
			radius: 10,
			}
		});
		
	const  svg = svgConverter.getSVG();
	fs.writeFileSync("...path/sample.svg", svg);
	
## Convert GPX File To SVG
The code example above can be used in a similar way. All you need to do is change the `fileType` value. 

    import * as  fs  from  "fs";
	const GPXString = fs.readFileSync("...path/data.gpx", "utf8");
	 
	const  svgConverter = new SpatialSVG({
		fileType: "gpx",
		data:GPXString,
		size: 1000,
		styleType: "general",
		styles: {
			stroke: "#FF0000",
			strokeWidth: 2,
			fill: "#00FF00",
			fillOpacity: 0.5,
			radius: 10,
			}
		});
		
	const  svg = svgConverter.getSVG();
	fs.writeFileSync("...path/sample.svg", svg);

## Configuration Options

 - **fileType**: base data types. It can be GeoJSON, KML, or GPX
 - **data**: string of geojson, kml or gpx data
 - **size**: This explains the purpose of the object parameter. If the BBOX of your geometries is vertically oriented, you define the `height` value in pixels for the SVG output, and the `width` will be automatically calculated based on the BBOX ratio. Conversely, if the BBOX is horizontally oriented, you provide the `width` in pixels, and the `height` will be automatically calculated.
 - **styleType** : string (general, geotype, property, filter)
	 - ***general*** : Applies the same color and style to all geometries. All SVG objects will appear in the same color.
	 - ***geotype*** : Allows you to assign different colors for Polygons, LineStrings, and Points.
	 - ***property***: Colors SVG objects based on the properties within your data
	 - ***filter***: Creates SVG objects only for geometries that match logical or numerical conditions defined on the properties in your data. 
 - **style** : It's depend to defined *styleType* Please read below title.

## Style Types Meaning
Elbette! İşte bu parametreleri bir README dosyasında yer alabilecek şekilde, maddeler halinde ve açıklamalarıyla birlikte hazırladım:

----------

### Styling Options
You can use the following style options to customize the appearance of your SVG output:

-   **`stroke?: string`**  
    The color of the stroke (outline) for geometries (e.g., `"#000000"` or `"red"`).
    
-   **`strokeWidth?: number`**  
    The width of the stroke in pixels.
    
-   **`strokeLinecap?: StrokeLinecap`**  
    Defines the shape of the ends of lines. Possible values: `"butt"`, `"round"`, `"square"`.
    
-   **`strokeLinejoin?: StrokeLinejoin`**  
    Defines the shape of the corners where lines meet. Possible values: `"miter"`, `"round"`, `"bevel"`.
    
-   **`strokeOpacity?: number`**  
    Sets the opacity of the stroke. Value ranges from `0` (fully transparent) to `1` (fully opaque).
    
-   **`strokeDasharray?: string`**  
    A string defining the pattern of dashes and gaps used to stroke paths (e.g., `"5,5"` for dashed lines).
    
-   **`strokeDashoffset?: number`**  
    Specifies the distance into the dash pattern to start the stroke.
    
-   **`fill?: string`**  
    The fill color for shapes like polygons and circles (e.g., `"blue"` or `"#FF0000"`).
    
-   **`fillOpacity?: number`**  
    The opacity of the fill. Value ranges from `0` (transparent) to `1` (opaque).
    
-   **`fillRule?: string`**  
    Determines how to fill the shape. Common values are `"nonzero"` and `"evenodd"`.
    
-   **`LineString?: LineStringStyles`**  
    Style definitions specifically for `LineString` geometries. Overrides global styles.
    
-   **`Polygon?: PolygonStyles`**  
    Style definitions specifically for `Polygon` geometries. Overrides global styles.
    
-   **`Point?: PointStyles`**  
    Style definitions specifically for `Point` geometries. Overrides global styles.
    
-   **`props?: Record<string, string>`**  
    Assigns styles based on matching property values from your data. Useful for `property`-based styling.
    
-   **`filters?: FilterStyles[]`**  
    An array of filter objects. Each filter defines style rules for geometries that match specified property-based conditions.
    
-   **`radius?: number`**  
    Sets the radius of points when rendering as circles.

## Styling Usage
The style definitions I’ve illustrated below are important for making your SVG output look more visually appealing.
### Base Style Properties
You can use these properties in any options
| Property | Data Type | Values
|--|--|--|
| strokeOpacity | double | Range : 0 to 1 |
| fillOpacity | double | Range : 0 to 1 |
| stroke | string | #RRGGBB |
| fill | string | #RRGGBB |
|strokeLinecap|string|butt, round, square|
|strokeLinejoin|string|miter, round, bevel|
|strokeDasharray|string| "int int int"|
|strokeWidth|int|0 to n|
|strokeDashoffset|int|0 to n|
|radius|int|0 to n|


#### If StyleType is '*general*'
    const defaultStyleOptions = {
	    stroke: "#FF0000",
	    strokeWidth: 2,
	    strokeOpacity: 0.5,
	    strokeLinecap: "round",
	    strokeLinejoin: "round",
	    strokeDasharray: "10 5",
	    strokeDashoffset: 5,
	    fill: "#00FF00",
	    fillOpacity: 0.5,
	    radius: 10,
    };

#### If StyleType is '*geotype*'
    const polygonStyle = {
	    stroke: "#FF0000",
	    strokeWidth: 2,
	    strokeOpacity: 0.5,
	    strokeLinecap: "round",
	    strokeLinejoin: "round",
	    strokeDasharray: "10 5",
	    strokeDashoffset: 5,
	    fill: "#00FF00",
	    fillOpacity: 0.5,
    };
    
    const lineStyle = {
	    stroke: "#FF0000",
	    strokeWidth: 2,
	    strokeOpacity: 0.5,
	    strokeLinecap: "round",
	    strokeLinejoin: "round",
	    strokeDasharray: "10 5",
	    strokeDashoffset: 5,
    };
    
    const polygonStyle = {
	    stroke: "#FF0000",
	    strokeWidth: 2,
	    strokeOpacity: 0.5,
	    strokeLinecap: "round",
	    strokeLinejoin: "round",
	    strokeDasharray: "10 5",
	    strokeDashoffset: 5,
	    fill: "#00FF00",
	    fillOpacity: 0.5,
	    radius: 10
    };
    
    const geotypeStyle = {
	    Point: polygonStyle,
	    LineString: lineStyle,
	    Polygon: polygonStyle,
    };
    
    const svgConverter = new SpatialSVG({
		fileType: "geojson",
		data:GeoJSONString,
		size: 1000,
		styleType: "geotype",
		styles: geotypeStyle
	});
    

#### If StyleType is '*property*'
    const geojsonData = {...features:[
	    {...,
	    properties:{
		    "color_stroke":"#00FF00",
		    "line_width":3,
		    "polygon_color":"#FF0000",
		    "opacity":1
	    },geometry:...}
	    ....
    ]};
    
    const svgConverter = new SpatialSVG({
		fileType: "geojson",
		data:geojsonData,
		size: 1000,
		styleType: "geotype",
		styles: {
			props:{
				stroke:"color_stroke",
				strokeWidth:"line_width",
				fill:"polygon_color",
				fillOpacity:"opacity",
			}
		}
	});
	
#### If StyleType is '*filter*'
If you are using filter-based styling, remember that `filters` should be defined as an array inside the style object. For example, let's say you have a GeoJSON containing polygon buildings, and there is a property key named `building_height`. Assume the values for this property range between 10 and 200 (in meters). If you want to style buildings between 10 and 30 meters in green, between 30 and 100 meters in orange, and between 100 and 200 meters in red, the example below would be appropriate for this scenario.

    const building10To30 = {
		conditions:[
			{
				property:"building_height",
				operator:">=",
				value:10
			},
			{
				property:"building_height",
				operator:"<",
				value:30
			}
		],
		style:{
			fill:"#00FF00",
			fillOpacity:1
		}
	};
	
	const building30To100 = {
		conditions:[
			{
				property:"building_height",
				operator:">=",
				value:30
			},
			{
				property:"building_height",
				operator:"<",
				value:100
			}
		],
		style:{
			fill:"#FFA500",
			fillOpacity:1
		}
	};
	
	const building100To200 = {
		conditions:[
			{
				property:"building_height",
				operator:">=",
				value:100
			},
			{
				property:"building_height",
				operator:"<",
				value:200
			}
		],
		style:{
			fill:"#FF0000",
			fillOpacity:1
		}
	};
	
	const svgConverter = new SpatialSVG({
		fileType: "geojson",
		data:geojsonData,
		size: 1000,
		styleType: "filter",
		styles: {
			filters:[
				building10To30,
				building30To100,
				building100To200
			]
		}
	});
	
### Condition Types

The table below lists all supported operators that can be used in filter-based styling.

| Operator       | Description                                                                 | Value                          |
|----------------|-----------------------------------------------------------------------------|-------------------------------|
| `>`            | Property value is greater than the given value                              | `number`                      |
| `<`            | Property value is less than the given value                                 | `number`                      |
| `>=`           | Property value is greater than or equal to the given value                  | `number`                      |
| `<=`           | Property value is less than or equal to the given value                     | `number`                      |
| `==`           | Property value is equal to the given value                                  | `string` or `number`          |
| `!=`           | Property value is not equal to the given value                              | `string` or `number`          |
| `in`           | Property value is one of the listed values                                  | `string[]` or `number[]`      |
| `not in`       | Property value is none of the listed values                                 | `string[]` or `number[]`      |
| `like`         | Property value contains the given substring                                 | `string`                      |
| `not like`     | Property value does not contain the given substring                         | `string`                      |
| `is null`      | Property is not present or is null                                          | `null`                        |
| `is not null`  | Property is present and not null                                            | `null`                        |

If you encounter any issues or have questions regarding this project, please feel free to reach out.

**Developer:** [Ali Kilic](https://akilic.com)  
**LinkedIn:** [Connect to me](https://www.linkedin.com/in/alikilicharita/)  
**Company:** [GISLayer](https://gislayer.com)
