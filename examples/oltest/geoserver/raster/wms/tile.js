var map
var extent = [73.1330490112305,17.9828186035156,135.395172119141,53.7387809753418]
var center = [(extent[0] + extent[2])/2.0, (extent[1] + extent[3])/2.0]

 /**
 * @description: 初始化方法
 * @date: 2021-5-10 14:27:44
 */
function init(){
  map = new ol.Map({
    layers: [
      new ol.layer.Tile({
        source: new ol.source.OSM(),
        // opacity: 0.7
      })
    ],
    target: 'map',
    view: new ol.View({
      center,
      zoom: 5,
      extent,
      projection: 'EPSG:4326' // 坐标系
    })
  });
  // addWMSTileLayer('china:chinaback') // 添加 wms 瓦片图层
  addWMSCTileLayer('china:chinaback') // 添加 wmsc 瓦片图层
}

 /**
 * @description: 添加 wms 瓦片图层
 * @date: 2021年5月10日13:50:21
 */
function addWMSTileLayer (layer) {
  let wmsTileLayer = new ol.layer.Tile({
    // 这是瓦片图层源，即使用发布好的服务就行
    source: new ol.source.TileWMS({
        // 这里url的格式就是  http://ip:port/geoserver/{workspaceName}/wms
        url: 'http://127.0.0.1:8032/geoserver/china/wms',
        // 这里参数layers的是  工作空间:图层名称
        params: {'LAYERS': layer},
        // 服务类型: geoserver
        serverType: 'geoserver'
    })
  })
  map.addLayer(wmsTileLayer)
  map.getView().fit(extent, map.getSize());
}

 /**
 * @description: 添加 wmsc 瓦片图层
 * @date: 2021-5-10 14:32:56
 */
function addWMSCTileLayer(layer) {
  let wmscTileLayer = new ol.layer.Tile({
    source: new ol.source.TileWMS({
        url: 'http://127.0.0.1:8032/geoserver/gwc/service/wms', // 地图地址
        params: {
          'LAYERS': layer, // 图层 工作空间:图层名称
          'VERSION': '1.1.1', // wms版本，必须与发布的版本一致
          'TILED': true,
          'FORMAT': 'image/png8', // 格式必须是启用的格式

        },
        serverType: 'geoserver'
    })
  })
  map.addLayer(wmscTileLayer)
  map.getView().fit(extent, map.getSize());
}