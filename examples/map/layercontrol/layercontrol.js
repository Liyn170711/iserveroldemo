// 地图服务的地址
var url_beijing = "http://192.168.22.51:8090/iserver/services/map-bjdemo/rest/maps/beijing";
var url_bj_except   = "http://192.168.22.51:8090/iserver/services/map-bjdemo/rest/maps/bj_except";
var url_bj_hospital   = "http://192.168.22.51:8090/iserver/services/map-bjdemo/rest/maps/bj_hospital";
var url_bj_building = "http://192.168.22.51:8090/iserver/services/map-bjdemo/rest/maps/bj_building";
var url_bj_hotel = "http://192.168.22.51:8090/iserver/services/map-bjdemo/rest/maps/bj_hotel";
// 地图
var map = null
// 图层
var layer_beijing = null
var layer_bj_except = null
var layer_bj_hospital = null
var layer_bj_building = null
var layer_bj_hotel = null

 /**
 * @description: 初始化地图
 * @date: 2020年4月8日16:06:50
 */
function initMap () {
    // 构造地图
    map = new ol.Map({
        target: 'map', // 渲染地图的目标dom
        // 控件
        controls: ol.control.defaults({attributionOptions: {collapsed: false}}) // 设置组件默认不折叠
            .extend([new ol.supermap.control.Logo()]), // 向控件集合中添加控件：supermap Logo
        view: new ol.View({ // 视图
            center: [116.384366045373,39.9111915327831], // 中心
            zoom: 15, // 默认缩放等级
            projection: 'EPSG:4326' // 坐标系
        })
    });
    // addTileLayer(url_beijing) // 添加背景区域图
    addTileLayer(url_bj_except) // 添加背景区域体图（除医院图层、楼宇图层、宾馆图层）
    addTileLayer(url_bj_hospital) // 添加医院图层
    addTileLayer(url_bj_building) // 添加楼宇图层
    addTileLayer(url_bj_hotel) // 添加宾馆图层
}

 /**
 * @description: 添加瓦片图层
 * @param mapUrl 地图服务地址
 * @date: 2020年4月8日16:07:31
 */
function addTileLayer (mapUrl) {
    let targetLayer = new ol.layer.Tile({ 
        // 构造瓦片图层数据源，SuperMap iServer TileImage图层源。
        source: new ol.source.TileSuperMapRest({ 
            url: mapUrl, // 服务地址
            wrapX: true // 设置图层瓦片图片在x轴方向平铺
        }),
        projection: 'EPSG:4326' // 坐标系
    });
    map.addLayer(targetLayer); 
    if (mapUrl.indexOf('_beijing') >= 0) {
        layer_beijing = targetLayer
    } else if (mapUrl.indexOf('bj_except') >= 0) {
        layer_bj_except = targetLayer
    } else if (mapUrl.indexOf('bj_hospital') >= 0) {
        layer_bj_hospital = targetLayer
    } else if (mapUrl.indexOf('bj_building') >= 0) {
        layer_bj_building = targetLayer
    } else if (mapUrl.indexOf('bj_hotel') >= 0) {
        layer_bj_hotel = targetLayer
    }
}

 /**
 * @description: 控制图层显隐
 * @param: event 事件
 * @date: 2020-4-8 16:19:09
 */
function controlLayerVisible (target) {
    let targetName = target.name
    let flag = target.checked // 显示或隐藏变量
    let targetLayer = null // 目标图层
    if (targetName.indexOf('_beijing') >= 0) {
        targetLayer = layer_beijing
    } else if (targetName.indexOf('bj_except') >= 0) {
        targetLayer = layer_bj_except
    } else if (targetName.indexOf('bj_hospital') >= 0) {
        targetLayer = layer_bj_hospital
    } else if (targetName.indexOf('bj_building') >= 0) {
        targetLayer = layer_bj_building
    } else if (targetName.indexOf('bj_hotel') >= 0) {
        targetLayer = layer_bj_hotel
    }
    debugger
    if (targetLayer) {
        targetLayer.setVisible(flag)
    }

}