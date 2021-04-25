/********************************************************************
 * 测试openlayers 加载geojson数据 渲染矢量图层 初始化数据脚本
 *********************************************************************/
var image = new ol.style.Circle({
  radius: 5,
  fill: null,
  stroke: new ol.style.Stroke({
    color: 'red',
    width: 10
  })
});

var styles = {
  'Point': new ol.style.Style({
    image: image
  }),
  'LineString': new ol.style.Style({
    stroke: new ol.style.Stroke({
      color: 'green',
      width: 1
    })
  }),
  'MultiLineString': new ol.style.Style({
    stroke: new ol.style.Stroke({
      color: 'green',
      width: 1
    })
  }),
  'MultiPoint': new ol.style.Style({
    image: image
  }),
  'MultiPolygon': new ol.style.Style({
    stroke: new ol.style.Stroke({
      color: 'yellow',
      width: 1
    }),
    fill: new ol.style.Fill({
      color: 'rgba(255, 255, 0, 0.1)'
    })
  }),
  'Polygon': new ol.style.Style({
    stroke: new ol.style.Stroke({
      color: 'blue',
      lineDash: [4],
      width: 3
    }),
    fill: new ol.style.Fill({
      color: 'rgba(0, 0, 255, 0.1)'
    })
  }),
  'GeometryCollection': new ol.style.Style({
    stroke: new ol.style.Stroke({
      color: 'magenta',
      width: 2
    }),
    fill: new ol.style.Fill({
      color: 'magenta'
    }),
    image: new ol.style.Circle({
      radius: 10,
      fill: null,
      stroke: new ol.style.Stroke({
        color: 'magenta'
      })
    })
  }),
  'Circle': new ol.style.Style({
    stroke: new ol.style.Stroke({
      color: 'red',
      width: 2
    }),
    fill: new ol.style.Fill({
      color: 'rgba(255,0,0,0.2)'
    })
  })
};
/*****************
  geojson数据坐标系数据， 不管是否设置此属性，openlayer默认读取geojson数据的坐标系以地图view的坐标系
********************/
var styleFunction = function (feature) {
  return styles[feature.getGeometry().getType()];
};
// var geojsonObject = {
//   "type": "FeatureCollection",
//   'crs': { // 坐标系数据， 不管是否设置此属性，openlayer默认读取geojson数据的坐标系以地图view的坐标系
//     'type': 'name',
//     'properties': {
//       'name': 'EPSG:4326'
//     }
//   },
//   "features": [
//     {
//       "type": "Feature",
//       "properties": {
//         "marker-color": "#ff8080",
//         "marker-size": "medium",
//         "marker-symbol": "star"
//       },
//       "geometry": {
//         "type": "Point",
//         "coordinates": [
//           103.35937499999999,
//           34.88593094075317
//         ]
//       }
//     }
//   ]
// }
var geojsonObject = {
  'type': 'FeatureCollection',
  'crs': {
    'type': 'name',
    'properties': {
      'name': 'EPSG:3857'
    }
  },
  'features': [{
    'type': 'Feature',
    'geometry': {
      'type': 'Point',
      'coordinates': [0, 0]
    }
  }, {
    'type': 'Feature',
    'geometry': {
      'type': 'LineString',
      'coordinates': [[4e6, -2e6], [8e6, 2e6]]
    }
  }, {
    'type': 'Feature',
    'geometry': {
      'type': 'LineString',
      'coordinates': [[4e6, 2e6], [8e6, -2e6]]
    }
  }, {
    'type': 'Feature',
    'geometry': {
      'type': 'Polygon',
      'coordinates': [[[-5e6, -1e6], [-4e6, 1e6], [-3e6, -1e6]]]
    }
  }, {
    'type': 'Feature',
    'geometry': {
      'type': 'MultiLineString',
      'coordinates': [
        [[-1e6, -7.5e5], [-1e6, 7.5e5]],
        [[1e6, -7.5e5], [1e6, 7.5e5]],
        [[-7.5e5, -1e6], [7.5e5, -1e6]],
        [[-7.5e5, 1e6], [7.5e5, 1e6]]
      ]
    }
  }, {
    'type': 'Feature',
    'geometry': {
      'type': 'MultiPolygon',
      'coordinates': [
        [[[-5e6, 6e6], [-5e6, 8e6], [-3e6, 8e6], [-3e6, 6e6]]],
        [[[-2e6, 6e6], [-2e6, 8e6], [0, 8e6], [0, 6e6]]],
        [[[1e6, 6e6], [1e6, 8e6], [3e6, 8e6], [3e6, 6e6]]]
      ]
    }
  }, {
    'type': 'Feature',
    'geometry': {
      'type': 'GeometryCollection',
      'geometries': [{
        'type': 'LineString',
        'coordinates': [[-5e6, -5e6], [0, -5e6]]
      }, {
        'type': 'Point',
        'coordinates': [4e6, -5e6]
      }, {
        'type': 'Polygon',
        'coordinates': [[[1e6, -6e6], [2e6, -4e6], [3e6, -6e6]]]
      }]
    }
  }]
};
