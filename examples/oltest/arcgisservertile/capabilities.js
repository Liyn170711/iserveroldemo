fetch('https://map.geoq.cn/ArcGIS/rest/services/ChinaOnlineCommunity/MapServer').then((response) => { //
  return response.text();
}).then((text) => {
  // console.log('响应信息 ArcGIS REST Services Directory getcapabilities.xml：', text)
  // 地图坐标
  let projection = 'EPSG:102100'
  // var projection = ol.proj.get('EPSG:3857');

  // 基础地图服务切片地址
  var tileUrl = "https://map.geoq.cn/ArcGIS/rest/services/ChinaOnlineCommunity/MapServer/tile/{z}/{y}/{x}";
  // 坐标原点
  var origin = [-2.0037508342787E7, 2.0037508342787E7];
  // 分辨率
  var resolutions = [
    156543.03392800014,
    78271.51696399994,
    39135.75848200009,
    19567.87924099992,
    9783.93962049996,
    4891.96981024998,
    2445.98490512499,
    1222.992452562495,
    611.4962262813797,
    305.74811314055756,
    152.87405657041106,
    76.43702828507324,
    38.21851414253662,
    19.10925707126831,
    9.554628535634155,
    4.77731426794937,
    2.388657133974685,
    1.1943285668550503,
    0.5971642835598172,
    0.29858214164761665
  ];
  //地图范围
  var fullExtent = [2.0037507067161843E7,-3.0240971958386254E7, 2.0037507067161843E7,3.0240971958386205E7]; // 
  var tileGrid = new ol.tilegrid.TileGrid({
      tileSize: 256,
      origin: origin,
      extent: fullExtent,
      resolutions: resolutions
  });
  // 瓦片数据源
  var tileArcGISXYZ = new ol.source.XYZ({
      tileGrid: tileGrid,
      projection: projection,
      url: tileUrl,
      wrapX: false,
  });
  var map = new ol.Map({
      target: 'map',
      layers: [
        // 瓦片图层
        new ol.layer.Tile({
          source: tileArcGISXYZ
        }),
      ],
      view: new ol.View({
        //初始化中心点坐标
        center: [0, 0],
        resolutions: resolutions,
        zoom: 0,
        // 注意：此处指定缩放级别不能通过zoom来指定，指定了也无效，必须通过resolution来指定
        // resolution: 4891.96981024998,
        projection: projection,
        extent: fullExtent
    })
  });
})