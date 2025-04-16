"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bbox_1 = require("@turf/bbox");
const togeojson = __importStar(require("togeojson"));
const geojsonValidation = __importStar(require("geojson-validation"));
const xmldom_1 = __importDefault(require("xmldom"));
class SpatialSVG {
    constructor({ data, fileType, styles, size, styleType, bgColor }) {
        this.geojson = { type: "FeatureCollection", features: [] };
        this.lineStringStyleProps = {
            stroke: "stroke",
            strokeWidth: "stroke-width",
            strokeLinecap: "stroke-linecap",
            strokeLinejoin: "stroke-linejoin",
            strokeOpacity: "stroke-opacity",
            strokeDasharray: "stroke-dasharray",
            strokeDashoffset: "stroke-dashoffset"
        };
        this.polygonStyleProps = {
            stroke: "stroke",
            strokeWidth: "stroke-width",
            strokeLinecap: "stroke-linecap",
            strokeLinejoin: "stroke-linejoin",
            strokeOpacity: "stroke-opacity",
            strokeDasharray: "stroke-dasharray",
            strokeDashoffset: "stroke-dashoffset",
            fill: "fill",
            fillOpacity: "fill-opacity",
            fillRule: "fill-rule"
        };
        this.pointStyleProps = {
            stroke: "stroke",
            strokeWidth: "stroke-width",
            strokeLinecap: "stroke-linecap",
            strokeLinejoin: "stroke-linejoin",
            strokeOpacity: "stroke-opacity",
            strokeDasharray: "stroke-dasharray",
            strokeDashoffset: "stroke-dashoffset",
            fill: "fill",
            fillOpacity: "fill-opacity",
            fillRule: "fill-rule",
            radius: "r"
        };
        this.defaultStyles = {
            stroke: "#000000",
            "stroke-width": 1,
            "stroke-opacity": 1,
            "stroke-linecap": "round",
            "stroke-linejoin": "round",
            fill: "#000000",
            "fill-opacity": 1,
            r: 5,
        };
        if (fileType === "geojson") {
            if (data.type === "FeatureCollection") {
                this.geojson = data;
            }
            else {
                this.geojson = { type: "FeatureCollection", features: [data] };
            }
        }
        else if (fileType === "kml") {
            this.geojson = togeojson.kml(new xmldom_1.default.DOMParser().parseFromString(data, "text/xml"));
        }
        else if (fileType === "gpx") {
            this.geojson = togeojson.gpx(new xmldom_1.default.DOMParser().parseFromString(data, "text/xml"));
        }
        if (fileType == 'gpx' && (styleType == 'filter' || styleType == 'property')) {
            throw new Error("GPX file type does not support filter or property style type");
        }
        this.styleType = styleType.toLocaleLowerCase();
        this.fileType = fileType.toLocaleLowerCase();
        this.styles = styles;
        this.size = size || 1000;
        this.width = 0;
        this.height = 0;
        this.minLng = 0;
        this.minLat = 0;
        this.scale = 0;
        this.bgColor = bgColor || "none";
        this.validations();
    }
    validations() {
        if (this.fileType == 'gpx' && (this.styleType == 'filter' || this.styleType == 'property')) {
            throw new Error("GPX file type does not support filter or property style type");
        }
        if (geojsonValidation.isFeatureCollection(this.geojson) == false) {
            throw new Error("Invalid Spatial data");
        }
        if (["kml", "gpx", "geojson"].indexOf(this.fileType) == -1) {
            throw new Error("Invalid file type");
        }
        if (["global", "geotype", "property", "filter"].indexOf(this.styleType) == -1) {
            throw new Error("Invalid style type");
        }
        if (this.geojson.features.length == 0) {
            throw new Error("Spatial data is empty");
        }
    }
    getTopLeftCoordinate(bbox) {
        const lngs = [bbox[0], bbox[2]];
        const lats = [bbox[1], bbox[3]];
        const minLng = Math.min(...lngs);
        const maxLat = Math.max(...lats);
        return [minLng, maxLat];
    }
    getWidthHeightFromSize(bbox) {
        const langFark = Math.abs(bbox[2] - bbox[0]);
        const boyFark = Math.abs(bbox[3] - bbox[1]);
        const size = this.size;
        if (langFark > boyFark) {
            this.width = size;
            this.height = size * boyFark / langFark;
            this.scale = langFark;
        }
        else {
            this.width = size * langFark / boyFark;
            this.height = size;
            this.scale = boyFark;
        }
    }
    getFilterStyleString(feature, filter) {
        var properties = feature.properties || {};
        var s = [];
        var conditionCount = filter.conditions.length;
        if (conditionCount === 0) {
            return [];
        }
        var passCount = 0;
        for (var condition of filter.conditions) {
            var status = false;
            if (properties[condition.property] !== undefined) {
                switch (condition.operator) {
                    case ">":
                        status = Number(properties[condition.property]) > Number(condition.value);
                        break;
                    case "<":
                        status = Number(properties[condition.property]) < Number(condition.value);
                        break;
                    case ">=":
                        status = Number(properties[condition.property]) >= Number(condition.value);
                        break;
                    case "<=":
                        status = Number(properties[condition.property]) <= Number(condition.value);
                        break;
                    case "==":
                        status = properties[condition.property] == condition.value;
                        break;
                    case "!=":
                        status = properties[condition.property] != condition.value;
                        break;
                    case "in":
                        status = condition.value.includes(properties[condition.property]);
                        break;
                    case "not in":
                        status = !condition.value.includes(properties[condition.property]);
                        break;
                    case "like":
                        status = properties[condition.property].includes(condition.value);
                        break;
                    case "not like":
                        status = !properties[condition.property].includes(condition.value);
                        break;
                    case "is null":
                        status = properties[condition.property] === null;
                        break;
                    case "is not null":
                        status = properties[condition.property] !== null;
                        break;
                }
            }
            if (status) {
                passCount++;
            }
            else {
                break;
            }
        }
        if (passCount === conditionCount) {
            for (var key in filter.style) {
                switch (feature.geometry.type) {
                    case "MultiLineString":
                    case "LineString": {
                        var styleProp = this.lineStringStyleProps[key];
                        if (styleProp) {
                            s.push(`${styleProp}="${filter.style[key]}"`);
                        }
                        break;
                    }
                    case "MultiPolygon":
                    case "Polygon": {
                        var styleProp = this.polygonStyleProps[key];
                        if (styleProp) {
                            s.push(`${styleProp}="${filter.style[key]}"`);
                        }
                        break;
                    }
                    case "MultiPoint":
                    case "Point": {
                        var styleProp = this.pointStyleProps[key];
                        if (styleProp) {
                            s.push(`${styleProp}="${filter.style[key]}"`);
                        }
                        break;
                    }
                }
            }
        }
        return s;
    }
    getStyleString(feature) {
        var _a;
        var s = [];
        var sp = JSON.parse(JSON.stringify(this.styles));
        var styleObj = {};
        switch (feature.geometry.type) {
            case "MultiPolygon":
            case "Polygon": {
                styleObj = this.polygonStyleProps;
                break;
            }
            case "MultiLineString":
            case "LineString": {
                styleObj = this.lineStringStyleProps;
                break;
            }
            case "MultiPoint":
            case "Point": {
                styleObj = this.pointStyleProps;
                break;
            }
        }
        if (this.styleType === "global") {
            for (var key in sp) {
                if (styleObj[key]) {
                    s.push(`${styleObj[key]}="${sp[key]}"`);
                }
            }
        }
        if (this.styleType === "geotype") {
            if (sp.Polygon && ["Polygon", "MultiPolygon"].includes(feature.geometry.type)) {
                for (var key in sp.Polygon) {
                    if (this.polygonStyleProps[key]) {
                        s.push(`${this.polygonStyleProps[key]}="${sp.Polygon[key]}"`);
                    }
                }
            }
            if (sp.LineString && ["LineString", "MultiLineString"].includes(feature.geometry.type)) {
                for (var key in sp.LineString) {
                    if (this.lineStringStyleProps[key]) {
                        s.push(`${this.lineStringStyleProps[key]}="${sp.LineString[key]}"`);
                    }
                }
            }
            if (sp.Point && ["Point", "MultiPoint"].includes(feature.geometry.type)) {
                for (var key in sp.Point) {
                    if (this.pointStyleProps[key]) {
                        s.push(`${this.pointStyleProps[key]}="${sp.Point[key]}"`);
                    }
                }
            }
        }
        if (this.styleType === "property") {
            for (var key in sp.props) {
                var prop = styleObj[`${key}`];
                if (prop) {
                    s.push(`${prop}="${(_a = feature === null || feature === void 0 ? void 0 : feature.properties) === null || _a === void 0 ? void 0 : _a[sp.props[key]]}"`);
                }
            }
        }
        if (this.styleType === "filter") {
            for (var filter of sp.filters) {
                var filterStyles = this.getFilterStyleString(feature, filter);
                if (filterStyles.length > 0) {
                    s = filterStyles;
                    break;
                }
            }
        }
        if (['LineString', 'MultiLineString'].includes(feature.geometry.type)) {
            var filtereds = s.filter(item => !item.includes('fill'));
            filtereds = filtereds.filter(item => !item.includes('r="'));
            s = filtereds;
            s.push('fill="none"');
            return s;
        }
        if (['Point', 'MultiPoint'].includes(feature.geometry.type)) {
            var filtereds = s.filter(item => item.includes('r="'));
            if (filtereds.length === 0) {
                s.push('r="5"');
            }
            return s;
        }
        return s;
    }
    compareStyles(geoType, styles) {
        var mustHaveStyles = [];
        switch (geoType) {
            case "LineString":
            case "MultiLineString": {
                mustHaveStyles = ["stroke=", "stroke-width="];
                break;
            }
            case "Polygon":
            case "MultiPolygon": {
                mustHaveStyles = ["fill="];
                break;
            }
            case "Point":
            case "MultiPoint": {
                mustHaveStyles = ["r=", "fill="];
                break;
            }
        }
        for (var i = 0; i < mustHaveStyles.length; i++) {
            var hint = mustHaveStyles[i];
            var hintIndex = styles.findIndex(item => item.includes(hint));
            if (hintIndex == -1) {
                var hintPart = hint.split("=")[0];
                styles.push(`${hintPart}="${this.defaultStyles[hintPart]}"`);
            }
        }
        return styles;
    }
    getLineString(feature) {
        var styles = this.getStyleString(feature);
        if (styles.length === 0) {
            return false;
        }
        const coordinates = feature.geometry.coordinates;
        const newCoordinates = [];
        for (let i = 0; i < coordinates.length; i++) {
            const coordinate = coordinates[i];
            const newCoordinate = [coordinate[0] - this.minLng, this.minLat - coordinate[1]];
            newCoordinates.push(newCoordinate);
        }
        const d = newCoordinates.map(coordinate => `${(coordinate[0] * this.size) / this.scale},${(coordinate[1] * this.size) / this.scale}`).join("L");
        return `<g type="LineString" ${styles.join(" ")}><path d="M${d}"/></g>`;
    }
    getPoint(feature) {
        const coordinates = feature.geometry.coordinates;
        var styles = this.getStyleString(feature);
        if (styles.length === 0) {
            return false;
        }
        var r = styles.filter(item => item.includes('r="'));
        var style_without_r = styles.filter(item => !item.includes('r="'));
        if (style_without_r.length > 0) {
            var updatedCoordinates = [coordinates[0] - this.minLng, this.minLat - coordinates[1]];
            var pixelCoordinates = [(updatedCoordinates[0] * this.size) / this.scale, (updatedCoordinates[1] * this.size) / this.scale];
            return `<g type="Point" ${style_without_r.join(" ")}><circle cx="${pixelCoordinates[0]}" cy="${pixelCoordinates[1]}" ${r.join(" ")}/></g>`;
        }
        else {
            return false;
        }
    }
    getMultiPoint(feature) {
        const coordinates = feature.geometry.coordinates;
        var styles = this.getStyleString(feature);
        if (styles.length === 0) {
            return false;
        }
        var r = styles.filter(item => item.includes('r="'));
        var style_without_r = styles.filter(item => !item.includes('r="'));
        if (style_without_r.length > 0) {
            var dArray = [];
            for (let i = 0; i < coordinates.length; i++) {
                const coordinate = coordinates[i];
                var updatedCoordinates = [coordinate[0] - this.minLng, this.minLat - coordinate[1]];
                var pixelCoordinates = [(updatedCoordinates[0] * this.size) / this.scale, (updatedCoordinates[1] * this.size) / this.scale];
                dArray.push(`<circle cx="${pixelCoordinates[0]}" cy="${pixelCoordinates[1]}" ${r.join(" ")}/>`);
            }
            return `<g type="MultiPoint" ${style_without_r.join(" ")}>${dArray.join(" ")}</g>`;
        }
        else {
            return false;
        }
    }
    getMultiPolygon(feature) {
        const coordinates = feature.geometry.coordinates;
        var styles = this.getStyleString(feature);
        if (styles.length === 0) {
            return false;
        }
        var dArray = [];
        for (let i = 0; i < coordinates.length; i++) {
            const polygonCoords = coordinates[i];
            for (let j = 0; j < polygonCoords.length; j++) {
                const ringCoords = polygonCoords[j];
                var inNewCoordinates = [];
                for (let k = 0; k < ringCoords.length; k++) {
                    const newCoordinate = [ringCoords[k][0] - this.minLng, this.minLat - ringCoords[k][1]];
                    inNewCoordinates.push(newCoordinate);
                }
                var d = `${inNewCoordinates.map(coordinate => `${(coordinate[0] * this.size) / this.scale},${(coordinate[1] * this.size) / this.scale}`).join("L")}Z`;
                dArray.push(`<path d="M${d}"/>`);
            }
        }
        return `<g type="MultiPolygon" ${styles.join(" ")}>${dArray.join(" ")}</g>`;
    }
    getPolygon(feature) {
        const coordinates = feature.geometry.coordinates;
        var styles = this.getStyleString(feature);
        if (styles.length === 0) {
            return false;
        }
        var dArray = [];
        for (let i = 0; i < coordinates.length; i++) {
            const coordinate = coordinates[i];
            var inNewCoordinates = [];
            for (let j = 0; j < coordinate.length; j++) {
                const newCoordinate = [coordinate[j][0] - this.minLng, this.minLat - coordinate[j][1]];
                inNewCoordinates.push(newCoordinate);
            }
            var d = `${inNewCoordinates.map(coordinate => `${(coordinate[0] * this.size) / this.scale},${(coordinate[1] * this.size) / this.scale}`).join("L")}`;
            dArray.push(`<path d="M${d}"/>`);
        }
        return `<g type="Polygon" ${styles.join(" ")}>${dArray.join(" ")}</g>`;
    }
    getMultiLineString(feature) {
        var styles = this.getStyleString(feature);
        if (styles.length === 0) {
            return false;
        }
        const coordinates = feature.geometry.coordinates;
        var dArray = [];
        for (let i = 0; i < coordinates.length; i++) {
            const coordinate = coordinates[i];
            var inNewCoordinates = [];
            for (let j = 0; j < coordinate.length; j++) {
                const newCoordinate = [coordinate[j][0] - this.minLng, this.minLat - coordinate[j][1]];
                inNewCoordinates.push(newCoordinate);
            }
            var d = `${inNewCoordinates.map(coordinate => `${(coordinate[0] * this.size) / this.scale},${(coordinate[1] * this.size) / this.scale}`).join("L")}`;
            dArray.push(`<path d="M${d}"/>`);
        }
        return `<g type="MultiLineString" ${styles.join(" ")}>${dArray.join(" ")}</g>`;
    }
    runSettings() {
        const bounds = (0, bbox_1.bbox)(this.geojson);
        const topLeft = this.getTopLeftCoordinate(bounds);
        this.minLng = topLeft[0];
        this.minLat = topLeft[1];
        this.getWidthHeightFromSize(bounds);
    }
    getSVG() {
        this.runSettings();
        const svg = [];
        svg.push(`<!-- This SVG Generated By spatial-svg npm package : contact : ali.kilic@gislayer.com --> <svg xmlns="http://www.w3.org/2000/svg" version="1.1" baseProfile="tiny"  viewBox="0 0 ${this.width} ${this.height}">`);
        if (this.bgColor !== "none") {
            svg.push(`<rect x="0" y="0" width="${this.width}" height="${this.height}" fill="${this.bgColor}" />`);
        }
        svg.push(`<g>`);
        for (let i = 0; i < this.geojson.features.length; i++) {
            const feature = this.geojson.features[i];
            switch (feature.geometry.type) {
                case "LineString": {
                    var lineString = this.getLineString(feature);
                    if (lineString) {
                        svg.push(`${lineString}`);
                    }
                    break;
                }
                case "MultiLineString": {
                    var multiLineString = this.getMultiLineString(feature);
                    if (multiLineString) {
                        svg.push(`${multiLineString}`);
                    }
                    break;
                }
                case "Polygon": {
                    var polygon = this.getPolygon(feature);
                    if (polygon) {
                        svg.push(`${polygon}`);
                    }
                    break;
                }
                case "MultiPolygon": {
                    var polygon = this.getMultiPolygon(feature);
                    if (polygon) {
                        svg.push(`${polygon}`);
                    }
                    break;
                }
                case "Point": {
                    var point = this.getPoint(feature);
                    if (point) {
                        svg.push(`${point}`);
                    }
                    break;
                }
                case "MultiPoint": {
                    var points = this.getMultiPoint(feature);
                    if (points) {
                        svg.push(`${points}`);
                    }
                    break;
                }
            }
        }
        svg.push(`</g>`);
        svg.push(`</svg>`);
        return svg.join("\n");
    }
}
exports.default = SpatialSVG;
//testx
//# sourceMappingURL=index.js.map