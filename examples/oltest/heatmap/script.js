/** 
 * 加载发布的 wms 服务 
*/
var map = null // 地图实例

 /**
 * @description: 初始化地图
 * @date: 2019-8-13 15:16:16
 */
function initMap() {
  loadWMSFromGeoserver() // 从 geoserver 加载 WMS 图层（现有的切片网格 gridSet(EPSG:4326、EPSG:900913、EPSG:3857)可适用）
}

 /**
 * @description: 从 geoserver 加载 WMS 图层（现有的切片网格 gridSet(EPSG:4326、EPSG:900913、EPSG:3857)可适用）
 * @date: 2019-8-13 19:00:43
 */
function loadWMSFromGeoserver() {
   // 地图视图
   let view = new ol.View({
    center: [117.12, 39.0610000000001],
    extent: [117.11, 39.0500000000001, 117.13, 39.0720000000001],
    zoom: 15,
    projection: 'EPSG:4326' // 坐标系
  })
  map = new ol.Map({
    layers: [],
    target: 'map',
    view: view
  });
  addBackWMSC() // 添加geoserver 发布的 WMSC 图层-back
}

 /**
 * @description: 添加geoserver 发布的 WMS 图层-back
 * @date: 2019-8-13 15:16:16
 */
function addBackWMS() {
  // 瓦片图层
  let wmsFromGeoserver = new ol.layer.Tile({
    // 这是瓦片图层源，即使用发布好的服务就行
    source: new ol.source.TileWMS({
        // 这里url的格式就是  http://ip:port/geoserver/{workspaceName}/wms
        url: 'http://127.0.0.1:8016/geoserver/tjnu/wms',
        // 这里参数layers的是  工作空间:图层名称
        params: {'LAYERS': 'tjnu:back'},
        // 服务类型: geoserver
        serverType: 'geoserver'
    })
  })
  map.addLayer(wmsFromGeoserver)
}

 /**
 * @description: 添加 geoserver 发布的 WMSC 图层（背景图层、建筑物阴影、建筑物轮廓、建筑物名称）
 * @date: 2019-8-13 17:52:50
 */
function addBackWMSC() {
  addLayerWMSC('tjnu:back') // 背景图层
  addLayerWMSC('tjnu:buildingblockshadow') // 建筑物阴影
  addLayerWMSC('tjnu:buildingblock') // 建筑物轮廓
  addLayerWMSC('tjnu:building') // 建筑物名称
  addLayerWMSC('tjnu:emergency_heatmap') // 建筑物名称
  // addHeatmapLayer() // 添加热力图图层
}

 /**
 * @description: 添加 geoserver 发布的 WMSC 图层
 * @param 图层 工作空间:图层名称
 * @date: 2019-8-13 17:52:50
 */
function addLayerWMSC(layer) {
  let wmscLayer = new ol.layer.Tile({
    source: new ol.source.TileWMS({
        url: 'http://127.0.0.1:8016/geoserver/gwc/service/wms', // 地图地址
        params: {
          'LAYERS': layer, // 图层 工作空间:图层名称
          'VERSION': '1.1.1', // wms版本，必须与发布的版本一致
          'TILED': true,
          'FORMAT': 'image/png8', // 格式必须是启用的格式

        },
        serverType: 'geoserver'
    })
  })
  map.addLayer(wmscLayer)
}

 /**
 * @description: 添加geoserver 发布的 wms 图层-rs
 * @date: 2019-8-13 15:16:16
 */
function addRSWms() {
  let wmsFromGeoserver = new ol.layer.Tile({
    source: new ol.source.TileWMS({
        url: 'http://127.0.0.1:8016/geoserver/gwc/service/wms',
        params: {
          'LAYERS': 'tjnu:rs',
          'VERSION': '1.1.1',  // wms版本，必须与发布的版本一致
          'TILED': true

        },
        serverType: 'geoserver'
    })
  })
  map.addLayer(wmsFromGeoserver)
}

 /**
 * @description: 添加热力图图层
 * @date: 2021-7-9 16:55:38
 */
function addHeatmapLayer() {
  let source = new ol.source.Vector({
    features: (new ol.format.GeoJSON()).readFeatures(geojsonObject),
    wrapX: false
  });
  let heatmapLayer = new ol.layer.Heatmap({
    name: 'heatLayer',
    source,
    gradient: ['#00f', '#0ff', '#0f0', '#ff0', '#f00'], //颜色
    blur: 10, // 模糊半径
    radius: 5 //半径
  })
  map.addLayer(heatmapLayer)
}