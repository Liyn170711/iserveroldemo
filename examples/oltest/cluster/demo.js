/** 
 * 聚合效果不能给的单个feature设置样式，样式会覆盖，智能给图层设置样式
 */
var ccbcPoints = [{"id":"1002","name":"省分行大楼","type":2,"subType":"4","coordinate":"118.31060834749084,32.10844675458149","towards":50,"resourceId":"0","floorId":"0","keyPartId":"6","shapeType":1,"orgId":"1","deviceId":"0","place":1,"envImageData":{"id":"0"},"status":1},{"id":"1003","name":"合肥天鹅湖支行","type":2,"subType":"1","coordinate":"117.2217669912229,31.530237788257043","resourceId":"0","floorId":"0","keyPartId":"7","shapeType":1,"orgId":"1","deviceId":"0","place":1,"envImageData":{"id":"0"},"status":4},{"id":"1004","name":"公交总公司离行式自助银行","type":2,"subType":"5","coordinate":"119.32996944238855,32.0180270039907","resourceId":"0","floorId":"0","keyPartId":"5","shapeType":1,"orgId":"1","deviceId":"0","place":1,"envImageData":{"id":"0"},"status":4},{"id":"1005","name":"合肥监控指挥中心","type":2,"subType":"1","coordinate":"117.68814134836563,31.29705060968567","resourceId":"0","floorId":"0","keyPartId":"3","shapeType":1,"orgId":"1","deviceId":"0","place":1,"envImageData":{"id":"0"},"status":4},{"id":"1006","name":"合肥包河金库","type":2,"subType":"2","coordinate":"116.93147274851161,31.063863431114303","resourceId":"0","floorId":"0","keyPartId":"4","shapeType":1,"orgId":"1","deviceId":"0","place":1,"envImageData":{"id":"0"},"status":1},{"id":"1007","name":"包河区档案库","type":2,"subType":"10","coordinate":"117.50730231192256,30.883024394671207","resourceId":"0","floorId":"0","keyPartId":"8","shapeType":1,"orgId":"1","deviceId":"0","place":1,"envImageData":{"id":"0"},"status":4},{"id":"1047","name":"测试导入机构","type":2,"subType":"1","coordinate":"118.1402389394734,33.41715036588046","towards":50,"resourceId":"0","floorId":"0","keyPartId":"11","shapeType":1,"orgId":"1","deviceId":"0","place":1,"envImageData":{"id":"0"},"status":1},{"id":"1048","name":"营业网点-测试12","type":2,"subType":"1","coordinate":"117.23794732606255,32.74043165582232","resourceId":"0","floorId":"0","keyPartId":"10","shapeType":1,"orgId":"1","deviceId":"0","place":1,"envId":70,"envImageData":{"id":"70","name":"人大_藏书馆_1层.png","image":"/image/1_anhui/pic/map/2021/05/21/人大_藏书馆_1层16215868965556nbO2FfX.png","imageWidth":1915,"imageHeight":935,"orgId":"1","keyPartId":"10"},"status":3},{"id":"1049","name":"测试lh1","type":2,"subType":"1","coordinate":"119.50129063480834,33.05547229299425","resourceId":"0","floorId":"0","keyPartId":"92","shapeType":1,"orgId":"1","deviceId":"0","place":1,"envImageData":{"id":"0"},"status":1},{"id":"1050","name":"肥东支行网点监控中心","type":2,"subType":"1","coordinate":"116.52934707408541,31.64974026239012","resourceId":"0","floorId":"0","keyPartId":"50","shapeType":1,"orgId":"1","deviceId":"0","place":1,"envImageData":{"id":"0"},"status":1},{"id":"1052","type":3,"subType":"40","level":9,"coordinate":"116.17404748005771,32.24115411189096","viewshed":45,"radiation":20,"resourceId":"10467","floorId":"0","keyPartId":"6","shapeType":1,"orgId":"1","deviceId":"0","place":1,"envImageData":{"id":"0"},"channelType":4,"status":1},{"id":"1053","type":3,"subType":"999","level":9,"coordinate":"116.20052612213063,32.297161865046206","viewshed":45,"viewshedAngle":110,"radiation":500,"towards":110,"resourceId":"10466","floorId":"0","keyPartId":"6","shapeType":1,"orgId":"1","deviceId":"0","place":1,"envImageData":{"id":"0"},"channelType":3,"status":1},{"id":"1054","name":"建行肥东支行（汇总）","type":1,"subType":"3","coordinate":"115.41813554880358,32.66999961004974","resourceId":"0","floorId":"0","keyPartId":"0","shapeType":1,"orgId":"1919","deviceId":"0","place":1,"envImageData":{"id":"0"},"status":2},{"id":"1055","name":"建行合肥城东支行（汇总）","type":1,"subType":"3","coordinate":"114.47111006848311,33.09354366908753","resourceId":"0","floorId":"0","keyPartId":"0","shapeType":1,"orgId":"1999","deviceId":"0","place":1,"envImageData":{"id":"0"},"status":2},{"id":"1056","name":"建行铜陵市分行（汇总）","type":1,"subType":"3","coordinate":"116.42226809326395,33.11257935713417","resourceId":"0","floorId":"0","keyPartId":"0","shapeType":1,"orgId":"1969","deviceId":"0","place":1,"envImageData":{"id":"0"},"status":2},{"id":"1057","name":"建行合肥庐阳支行（汇总）","type":1,"subType":"3","coordinate":"116.6221428177537,30.090663879729718","resourceId":"0","floorId":"0","keyPartId":"0","shapeType":1,"orgId":"2132","deviceId":"0","place":1,"envImageData":{"id":"0"},"status":2},{"id":"1058","name":"建行亳州市分行（汇总）","type":1,"subType":"3","coordinate":"115.1611537601739,31.57068862535615","resourceId":"0","floorId":"0","keyPartId":"0","shapeType":1,"orgId":"2002","deviceId":"0","place":1,"envImageData":{"id":"0"},"status":2},{"id":"1059","name":"4","type":5,"subType":"5","level":1,"coordinate":"116.26204641383399,31.536581739115007","resourceId":"1572","floorId":"0","keyPartId":"6","shapeType":1,"orgId":"1","deviceId":"0","place":1,"envImageData":{"id":"0"},"status":1},{"id":"1060","name":"4.1测试","type":5,"subType":"1","level":1,"coordinate":"116.12681373185228,31.652382200103343","resourceId":"0","floorId":"0","keyPartId":"0","shapeType":1,"orgId":"1","deviceId":"1279","place":1,"envImageData":{"id":"0"},"channelType":1,"status":1}]
var map

 /**
 * @description: 初始化地图
 * @date: 2021-7-1 15:24:14
 */
function initMap () {
  //高德地图
  var gaodeLayer = new ol.layer.Tile({
    source: new ol.source.XYZ({
      url:'http://webrd01.is.autonavi.com/appmaptile?x={x}&y={y}&z={z}&lang=zh_cn&size=1&scale=1&style=8'
    })
  });
  map = new ol.Map({
    layers: [gaodeLayer],
    target: 'map',
    view:new ol.View({
      projection: 'EPSG:4326',
      zoom: 4,
      center: [117.2217669912229, 31.530237788257043]
    })
  })
  addFeatureLayer();
}

 /**
 * @description: 添加要素图层
 * @date: 2021-7-1 17:04:28
 */
function addFeatureLayer () {
  let features = []
  for (const point of ccbcPoints) {
    let {coordinate, id, name, type, subType} = point
    let coordinates = coordinate.split(',').map(item => Number(item))
    let attr = {
      id,
      name,
      type,
      subType,
      coordinates
    }
    let feature = new ol.Feature({
      geometry: new ol.geom.Point(coordinates),
      attribute: attr
    })
    features.push(feature)
  }
   let source = new ol.source.Vector({
     features
   })
   let clusterSource = new ol.source.Cluster({
    distance: 20,
    source: source,
  });
   let vectorLayer = new ol.layer.Vector({
     source: clusterSource,
     style: (feature, resolution) => {
       let features = feature.get('features')
       let textLabel = features.length === 1 ? features[0].get('attribute').name : '聚合'
       return new ol.style.Style({
          image: new ol.style.Icon( /** @type {olx.style.IconOptions} */ ({
            offsetX: -16,
            offsetY: -16,
            scale: 0.32, //图标缩放比例
            opacity: 1, //透明度
            src: '../../../img/directlyBranch_3.png' //图标的url
          })),
          text: new ol.style.Text({
            offsetX: 0,
            offsetY: 20,
            font: '12px Calibri,sans-serif',
            text: textLabel,
            fill: new ol.style.Fill({
                color: '#000',
                border: 5,
                width: 3
            })
          })
       })
     }
   })
   map.addLayer(vectorLayer)
}

