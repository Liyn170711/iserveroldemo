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
  // loadWMSFromGeoserverUDG() // 从 geoserver 加载 WMS 图层（自定义网格切片方案可适用）
  // loadWMSFromGeoWebCacheUDG() // 从 geowebcache 加载 WMS 图层（自定义网格切片方案可适用）
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
    layers: [
      // new ol.layer.Tile({
      //   source: new ol.source.OSM(),
      //   opacity: 0.7
      // })
    ],
    target: 'map',
    view: view
  });
  // addBackWMS() // 添加geoserver 发布的 WMS 图层-back
  addBackWMSC() // 添加geoserver 发布的 WMSC 图层-back
  // addRSWms() // 添加geoserver 发布的 WMS 图层-rs
}

 /**
 * @description: 添加geoserver 发布的 WMS 图层-back
 * @date: 2019-8-13 15:16:16
 */
function addBackWMS() {
  // 瓦片图层
  let tiled = new ol.layer.Tile({
    // 这是瓦片图层源，即使用发布好的服务就行
    source: new ol.source.TileWMS({
        // 这里url的格式就是  http://ip:port/geoserver/{workspaceName}/wms
        url: 'http://127.0.0.1:8016/geoserver/tjnu/wms',
        // 这里参数layers的是  工作空间:图层名称
        params: {
          'LAYERS': 'tjnu:back,tjnu:buildingblockshadow,tjnu:buildingblock',
        },
        // 服务类型: geoserver
        // serverType: 'geoserver'
    })
  })
  var untiled = new ol.layer.Image({
    source: new ol.source.ImageWMS({
      ratio: 1,
      url: 'http://127.0.0.1:8016/geoserver/tjnu/wms',
      params: {'FORMAT': 'image/png',
               'VERSION': '1.1.1',  
            STYLES: '',
            LAYERS: 'tjnu:back,tjnu:buildingblockshadow,tjnu:buildingblock,tjnu:building',
      }
    })
  });
  // 瓦片图层
  // let tiled = new ol.layer.Tile({
  //   // 这是瓦片图层源，即使用发布好的服务就行
  //   source: new ol.source.TileWMS({
  //       // 这里url的格式就是  http://ip:port/geoserver/{workspaceName}/wms
  //       url: 'http://127.0.0.1:8016/geoserver/tjnu/wms',
  //       // 这里参数layers的是  工作空间:图层名称
  //       params: {
  //         'LAYERS': 'tjnu:back,tjnu:buildingblockshadow,tjnu:buildingblock,tjnu:building',
          
  //       },
  //       // 服务类型: geoserver
  //       serverType: 'geoserver'
  //   })
  // })
  map.addLayer(tiled)
}

 /**
 * @description: 添加 geoserver 发布的 WMSC 图层（背景图层、建筑物阴影、建筑物轮廓、建筑物名称）
 * @date: 2019-8-13 17:52:50
 */
function addBackWMSC() {
  addLayerWMSC('tjnu:back') // 背景图层
  addLayerWMSC('tjnu:buildingblockshadow') // 建筑物阴影
  addLayerWMSC('tjnu:buildingblock') // 建筑物轮廓
  // addLayerWMSC('tjnu:building') // 建筑物名称
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
        // serverType: 'geoserver'
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
 * @description: 从 geoserver 加载 WMS 图层（自定义网格切片方案可适用）
 * @date: 2019-8-13 19:03:16
 * @notice： （自定义网格切片方案）这里的 resolutions 分辨率数组为必传项
 * @info：1. 图层中心点 center，范围 extent，参考投影坐标系 projection， resolutions 分辨率数组，缩放级别范围（可通过分辨率数组可知），默认切片起点是左上点（可根据图层范围 extent计算可知）， 均可从 wms-getcapabilities.xml
 * （可通过接口（http://192.168.22.51:8089/geoserver/gwc/service/wms?SERVICE=WMS&VERSION=1.1.1&REQUEST=getcapabilities&TILED=true）获取到 xml 配置文件解析得到） 
 *       2.可通过两种方式加载 ①通过geoserver直接加载 ② 通过geoserver的gwc（geowebcache）加载；示例如下；
 * 
 */
function loadWMSFromGeoserverUDG() {
  // 地图视图
  let view = new ol.View({
   center: [119.1851020283366, 34.12173216399429],
   extent: [119.17222378042347, 34.11529304003772, 119.19253206568646, 34.12738221141187],
   zoom: 2,
   projection: 'EPSG:4326', // 坐标系
   resolutions: [
    // 0.0000251528279553,
    // 0.0000188646209665,
    // 0.0000125764139777,
    // 0.0000062882069888,
    // 0.0000031441034944,
    // 0.0000015720517472
    2.5152827955346596E-5, 1.8864620966509947E-5, 1.2576413977673298E-5, 6.288206988836649E-6, 3.1441034944183244E-6, 1.5720517472091622E-6
  ]
 })
 map = new ol.Map({
   target: 'map',
   view: view
 });
  // addBackWMSUDG() // 添加geoserver 发布的 WMS 图层
  addBackWMSCUDG() // 添加geoserver 发布的 WMSC 图层
}

 /**
 * @description: 添加geoserver 发布的自定义瓦片网格切片方案 WMS 图层
 * @date: 2019-8-13 19:15:00
 * @notice： 这里的 tileGrid 瓦片切片方案可不传
 */
function addBackWMSUDG() {
  let layer = new ol.layer.Tile({
    // 这是瓦片图层源，即使用发布好的服务就行
    source: new ol.source.TileWMS({
        // 这里url的格式就是  http://ip:port/geoserver/{workspaceName}/wms
        url: 'http://192.168.22.51:8089/geoserver/bstar/wms',
        // 这里参数layers的是  工作空间:图层名称
        params: {
          'LAYERS': 'bstar:bxq1', 
          'VERSION': '1.1.1' // wms版本，必须与发布的版本一致
          // 'TILED': true // 瓦片请求是否缓存
        },
        serverType: 'geoserver'
        // tileGrid: new ol.tilegrid.TileGrid({
        //   tileSize: [256, 256],
        //   extent: [119.17222378042347, 34.11529304003772, 119.19253206568646, 34.12738221141187],
        //   origin: [
        //     119.17222378042347,
        //     34.128171287950856
        //   ],
        //   resolutions: [
        //     0.0000251528279553,
        //     0.0000188646209665,
        //     0.0000125764139777,
        //     0.0000062882069888,
        //     0.0000031441034944,
        //     0.0000015720517472
        //   ]
        // })
    })
  })
  map.addLayer(layer)
}

/**
 * @description: 添加 geoserver 发布的自定义瓦片网格切片方案 WMSC 图层（工商大学北校区）
 * WMSC 将切片缓存到
 * @date: 2019年8月13日19:20:06
 */
function addBackWMSCUDG() {
  addLayerWMSCUDG('bstar:bxq1') // 工商大学北校区
}

 /**
 * @description: 添加geoserver 发布的自定义瓦片网格切片方案 WMSC 图层
 * @param 图层 工作空间:图层名称
 * @date: 2019年8月13日19:22:14
 * @notice： 这里的 tileGrid 瓦片切片方案 必传
 */
function addLayerWMSCUDG(layer) {
  let wmscLayer = new ol.layer.Tile({
    source: new ol.source.TileWMS({
        url: 'http://192.168.22.51:8089/geoserver/gwc/service/wms', // 地图地址
        params: {
          'LAYERS': layer, // 图层 工作空间:图层名称
          'VERSION': '1.1.1', // wms版本，必须与发布的版本一致
          'TILED': true // 瓦片请求是否缓存
        },
        serverType: 'geoserver',
        projection: 'EPSG:4326', // 坐标系
        tileGrid: new ol.tilegrid.TileGrid({
          tileSize: [256, 256],
          extent: [119.17222378042347, 34.11529304003772, 119.19253206568646, 34.12738221141187],
          origin: [
            119.17222378042347,
            34.128171287950856
          ],
          resolutions: [
            // --- 从 geoserver 的 gridset 中拷贝的 --- 可用
            // 0.0000251528279553,
            // 0.0000188646209665,
            // 0.0000125764139777,
            // 0.0000062882069888,
            // 0.0000031441034944,
            // 0.0000015720517472
            // 从 wms-getcapabilities.xml（可通过接口获取到 xml 配置文件解析得到） 中获取的 --- 可用
            2.5152827955346596E-5, 1.8864620966509947E-5, 1.2576413977673298E-5, 6.288206988836649E-6, 3.1441034944183244E-6, 1.5720517472091622E-6
          ]
        })
    })
  })
  map.addLayer(wmscLayer)
}

/**
 * @description: 从 geowebcache 加载 WMS 图层（自定义网格切片方案可适用）
 * @date: 2019年8月14日11:03:54
 * @notice： （自定义网格切片方案）这里的 resolutions 分辨率数组为必传项
 * @info：1. 图层中心点 center，范围 extent，参考投影坐标系 projection， resolutions 分辨率数组，缩放级别范围（可通过分辨率数组可知），默认切片起点是左上点（可根据图层范围 extent计算可知）， 均可从 wms-getcapabilities.xml
 * （可通过接口（http://192.168.22.51:8068/geowebcache/service/wms?SERVICE=WMS&VERSION=1.1.1&REQUEST=getcapabilities&TILED=true）获取到 xml 配置文件解析得到） 
 *        2. 切片起点 origin 可通过接口（http://192.168.22.51:8068/geowebcache/shwgy/conf.xml）获取到 xml 配置文件解析得到
 * 
 */
function loadWMSFromGeoWebCacheUDG() {
  let extent = [121.4742983350236, 31.27415397140868, 121.49379087958334, 31.28390024368855]  // 可从 wms-getcapabilities.xml解析得到
  let resolutions = [1.9035688046642237E-5, 9.517844023321119E-6, 4.758922011660559E-6, 2.3794610058302796E-6, 1.1897305029151398E-6] // 可从 wms-getcapabilities.xml解析得到
  let center = [(extent[0] + extent[2]) / 2.0, (extent[1] + extent[3]) / 2.0]
  let tileSize = [256, 256]  // 可从 wms-getcapabilities.xml解析得到
  let origin = [-400, 400] // 可通过接口（http://192.168.22.51:8068/geowebcache/shwgy/conf.xml）获取到 xml 配置文件解析得到
  let projection = 'EPSG:4326' // 可从 wms-getcapabilities.xml解析得到
  let shwgyLayer = new ol.layer.Tile({
    source: new ol.source.TileWMS({
        url: 'http://192.168.22.51:8068/geowebcache/service/wms', // 地图地址
        params: {
          'LAYERS': 'shwgy', // 图层 工作空间:图层名称
          'VERSION': '1.1.1', // wms版本，必须与发布的版本一致
          'TILED': true // 瓦片请求是否缓存
        },
        serverType: 'geoserver',
        projection: projection, // 坐标系
        tileGrid: new ol.tilegrid.TileGrid({
          tileSize: tileSize,
          extent: extent,
          origin: origin,
          resolutions: resolutions
        })
    })
  })
  // 地图视图
  let view = new ol.View({
   center: center,
   extent: extent,
   zoom: 2,
   projection: projection, // 坐标系
   resolutions:resolutions
 })
 new ol.Map({
   layers: [ shwgyLayer ],
   target: 'map',
   view: view
 });
}

/**
 * @description: 添加 geowebcache 发布的自定义瓦片网格切片方案 WMS 图层
 * @date: 2019-8-14 11:11:15
 * @notice： 这里的 tileGrid 瓦片切片方案 必传
 */
function addSHWGYLayer() {
  map.addLayer(shwgyLayer)
}
