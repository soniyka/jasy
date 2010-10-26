var Zepto=function(){var a=[].slice,b=document,c={append:"beforeEnd",prepend:"afterBegin",before:"beforeBegin",after:"afterEnd"},d,e,f;String.prototype.trim===void 0&&(String.prototype.trim=function(){return this.replace(/^\s+/,"").replace(/\s+$/,"")});function g(b,c){return a.call(b.querySelectorAll(c))}function h(a){return new RegExp("(^|\\s)"+a+"(\\s|$)")}function i(a){return a.filter(function(a){return a!==void 0&&a!==null})}function j(a,c){if(c!==void 0)return j(c).find(a);function d(a){return d.dom.forEach(a),d}d.dom=i(typeof a=="function"&&"dom"in a?a.dom:a instanceof Array?a:a instanceof Element?[a]:g(b,d.selector=a)),j.extend(d,j.fn);return d}j.extend=function(a,b){for(e in b)a[e]=b[e]},camelize=function(a){return a.replace(/-+(.)?/g,function(a,b){return b?b.toUpperCase():""})},j.fn={compact:function(){this.dom=i(this.dom);return this},get:function(a){return a===void 0?this.dom:this.dom[a]},remove:function(){return this(function(a){a.parentNode.removeChild(a)})},each:function(a){return this(a)},filter:function(a){return j(this.dom.filter(function(b){return g(b.parentNode,a).indexOf(b)>=0}))},is:function(a){return this.dom.length>0&&j(this.dom[0]).filter(a).dom.length>0},first:function(a){this.dom=i([this.dom[0]]);return this},find:function(a){return j(this.dom.map(function(b){return g(b,a)}).reduce(function(a,b){return a.concat(b)},[]))},closest:function(a){var c=this.dom[0].parentNode,d=g(b,a);while(c&&d.indexOf(c)<0)c=c.parentNode;return j(c&&!(c===b)?c:[])},pluck:function(a){return this.dom.map(function(b){return b[a]})},show:function(){return this.css("display","block")},hide:function(){return this.css("display","none")},prev:function(){return j(this.pluck("previousElementSibling"))},next:function(){return j(this.pluck("nextElementSibling"))},html:function(a){return a===void 0?this.dom.length>0?this.dom[0].innerHTML:null:this(function(b){b.innerHTML=a})},attr:function(a,b){return typeof a=="string"&&b===void 0?this.dom.length>0?this.dom[0].getAttribute(a)||undefined:null:this(function(c){if(typeof a=="object")for(e in a)c.setAttribute(e,a[e]);else c.setAttribute(a,b)})},offset:function(){var a=this.dom[0].getBoundingClientRect();return{left:a.left+b.body.scrollLeft,top:a.top+b.body.scrollTop,width:a.width,height:a.height}},css:function(a,b){if(b===void 0&&typeof a=="string")return this.dom[0].style[camelize(a)];f="";for(e in a)f+=e+":"+a[e]+";";typeof a=="string"&&(f=a+":"+b);return this(function(a){a.style.cssText+=";"+f})},index:function(a){return this.dom.indexOf(j(a).get(0))},bind:function(a,b){return this(function(c){a.split(/\s/).forEach(function(a){c.addEventListener(a,b,false)})})},delegate:function(a,c,d){return this(function(e){e.addEventListener(c,function(c){var f=c.target,h=g(e,a);while(f&&h.indexOf(f)<0)f=f.parentNode;f&&!(f===e)&&!(f===b)&&d(f,c)},false)})},live:function(a,c){j(b.body).delegate(this.selector,a,c);return this},hasClass:function(a){return h(a).test(this.dom[0].className)},addClass:function(a){return this(function(b){!j(b).hasClass(a)&&(b.className+=(b.className?" ":"")+a)})},removeClass:function(a){return this(function(b){b.className=b.className.replace(h(a)," ").trim()})},trigger:function(a){return this(function(c){var d;c.dispatchEvent(d=b.createEvent("Events"),d.initEvent(a,true,false))})}},["width","height"].forEach(function(a){j.fn[a]=function(){return this.offset()[a]}});for(e in c)j.fn[e]=function(a){return function(b){return this(function(c){c["insertAdjacent"+(b instanceof Element?"Element":"HTML")](a,b)})}}(c[e]);return j}();"$"in window||(window.$=Zepto)