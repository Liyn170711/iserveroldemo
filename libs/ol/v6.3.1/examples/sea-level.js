(window.webpackJsonp=window.webpackJsonp||[]).push([[122],{359:function(e,n,t){"use strict";t.r(n);var o=t(3),a=t(2),r=t(5),i=t(68),s=t(4),c=t(159),m=t(54),u=t(27);var l="pk.eyJ1IjoidHNjaGF1YiIsImEiOiJjaW5zYW5lNHkxMTNmdWttM3JyOHZtMmNtIn0.CDIBD8H-G2Gf-cPkIuWtRg",p=new r.a({source:new u.a({url:"https://api.mapbox.com/v4/mapbox.terrain-rgb/{z}/{x}/{y}.pngraw?access_token="+l,crossOrigin:"anonymous"})});p.on("prerender",(function(e){e.context.imageSmoothingEnabled=!1,e.context.msImageSmoothingEnabled=!1}));var d=new c.a({sources:[p],operation:function(e,n){var t=e[0];return t[3]&&(.1*(256*t[0]*256+256*t[1]+t[2])-1e4<=n.level?(t[0]=145,t[1]=175,t[2]=186,t[3]=255):t[3]=0),t}}),g=new o.a({target:"map",layers:[new r.a({source:new m.a({url:"https://api.tiles.mapbox.com/v4/mapbox.world-light.json?secure&access_token="+l,crossOrigin:"anonymous"})}),new i.a({opacity:.6,source:d})],view:new a.a({center:Object(s.f)([-122.3267,37.8377]),zoom:11})}),w=document.getElementById("level"),v=document.getElementById("output");w.addEventListener("input",(function(){v.innerText=w.value,d.changed()})),v.innerText=w.value,d.on("beforeoperations",(function(e){e.data.level=w.value}));for(var b=document.getElementsByClassName("location"),f=0,x=b.length;f<x;++f)b[f].addEventListener("click",y);function y(e){var n=e.target.dataset,t=g.getView();t.setCenter(Object(s.f)(n.center.split(",").map(Number))),t.setZoom(Number(n.zoom))}}},[[359,0]]]);
//# sourceMappingURL=sea-level.js.map