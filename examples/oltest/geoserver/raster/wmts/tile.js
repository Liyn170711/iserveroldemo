function init(){
    /** 
   * 现有的切片网格 gridSet(EPSG:4326、EPSG:900913、EPSG:3857)可适用
  */
  fetch('http://127.0.0.1:8032/geoserver/gwc/service/wmts?REQUEST=getcapabilities').then((response) => { // 加载成功--geoserver自带
    return response.text();
  }).then((text) => {
    // console.log('响应信息 wmts-getcapabilities.xml：', text)
    var parser = new ol.format.WMTSCapabilities()
    var result = parser.read(text)
    // console.log('解析响应后的xml信息：', result)
    var options = ol.source.WMTS.optionsFromCapabilities(result, {
      layer: 'china:chinaback',
      matrixSet: 'EPSG:3857',
      format: 'image/png'
    });
    // console.log('解析后的参数信息', options)
    var centerX = (options.tileGrid.o[0] + options.tileGrid.o[2]) / 2
    var centerY = (options.tileGrid.o[1] + options.tileGrid.o[3]) / 2
    // console.log('解析到的中心点信息', [centerX, centerY])
    var map = new ol.Map({
      layers: [
        new ol.layer.Tile({
          source: new ol.source.OSM(),
          // opacity: 0.7
        }),
        new ol.layer.Tile({
          opacity: 1,
          source: new ol.source.WMTS(options)
        })
      ],
      target: 'map',
      view: new ol.View({
        center: [centerX, centerY],
        zoom: 5,
        projection: 'EPSG:3857' // 坐标系
      })
    });
  })
}