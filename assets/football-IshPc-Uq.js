var Me=Object.defineProperty;var qe=(e,t,n)=>t in e?Me(e,t,{enumerable:!0,configurable:!0,writable:!0,value:n}):e[t]=n;var B=(e,t,n)=>(qe(e,typeof t!="symbol"?t+"":t,n),n);import{Q as H}from"./vant-KixZ-tes.js";function we(e,t){return function(){return e.apply(t,arguments)}}const{toString:ze}=Object.prototype,{getPrototypeOf:te}=Object,M=(e=>t=>{const n=ze.call(t);return e[n]||(e[n]=n.slice(8,-1).toLowerCase())})(Object.create(null)),g=e=>(e=e.toLowerCase(),t=>M(t)===e),q=e=>t=>typeof t===e,{isArray:C}=Array,_=q("undefined");function Je(e){return e!==null&&!_(e)&&e.constructor!==null&&!_(e.constructor)&&R(e.constructor.isBuffer)&&e.constructor.isBuffer(e)}const Ee=g("ArrayBuffer");function $e(e){let t;return typeof ArrayBuffer<"u"&&ArrayBuffer.isView?t=ArrayBuffer.isView(e):t=e&&e.buffer&&Ee(e.buffer),t}const Ve=q("string"),R=q("function"),Se=q("number"),z=e=>e!==null&&typeof e=="object",We=e=>e===!0||e===!1,D=e=>{if(M(e)!=="object")return!1;const t=te(e);return(t===null||t===Object.prototype||Object.getPrototypeOf(t)===null)&&!(Symbol.toStringTag in e)&&!(Symbol.iterator in e)},Ke=g("Date"),Ge=g("File"),Xe=g("Blob"),ve=g("FileList"),Qe=e=>z(e)&&R(e.pipe),Ze=e=>{let t;return e&&(typeof FormData=="function"&&e instanceof FormData||R(e.append)&&((t=M(e))==="formdata"||t==="object"&&R(e.toString)&&e.toString()==="[object FormData]"))},Ye=g("URLSearchParams"),et=e=>e.trim?e.trim():e.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,"");function L(e,t,{allOwnKeys:n=!1}={}){if(e===null||typeof e>"u")return;let r,o;if(typeof e!="object"&&(e=[e]),C(e))for(r=0,o=e.length;r<o;r++)t.call(null,e[r],r,e);else{const i=n?Object.getOwnPropertyNames(e):Object.keys(e),s=i.length;let c;for(r=0;r<s;r++)c=i[r],t.call(null,e[c],c,e)}}function Re(e,t){t=t.toLowerCase();const n=Object.keys(e);let r=n.length,o;for(;r-- >0;)if(o=n[r],t===o.toLowerCase())return o;return null}const Oe=typeof globalThis<"u"?globalThis:typeof self<"u"?self:typeof window<"u"?window:global,ge=e=>!_(e)&&e!==Oe;function v(){const{caseless:e}=ge(this)&&this||{},t={},n=(r,o)=>{const i=e&&Re(t,o)||o;D(t[i])&&D(r)?t[i]=v(t[i],r):D(r)?t[i]=v({},r):C(r)?t[i]=r.slice():t[i]=r};for(let r=0,o=arguments.length;r<o;r++)arguments[r]&&L(arguments[r],n);return t}const tt=(e,t,n,{allOwnKeys:r}={})=>(L(t,(o,i)=>{n&&R(o)?e[i]=we(o,n):e[i]=o},{allOwnKeys:r}),e),nt=e=>(e.charCodeAt(0)===65279&&(e=e.slice(1)),e),rt=(e,t,n,r)=>{e.prototype=Object.create(t.prototype,r),e.prototype.constructor=e,Object.defineProperty(e,"super",{value:t.prototype}),n&&Object.assign(e.prototype,n)},st=(e,t,n,r)=>{let o,i,s;const c={};if(t=t||{},e==null)return t;do{for(o=Object.getOwnPropertyNames(e),i=o.length;i-- >0;)s=o[i],(!r||r(s,e,t))&&!c[s]&&(t[s]=e[s],c[s]=!0);e=n!==!1&&te(e)}while(e&&(!n||n(e,t))&&e!==Object.prototype);return t},ot=(e,t,n)=>{e=String(e),(n===void 0||n>e.length)&&(n=e.length),n-=t.length;const r=e.indexOf(t,n);return r!==-1&&r===n},it=e=>{if(!e)return null;if(C(e))return e;let t=e.length;if(!Se(t))return null;const n=new Array(t);for(;t-- >0;)n[t]=e[t];return n},at=(e=>t=>e&&t instanceof e)(typeof Uint8Array<"u"&&te(Uint8Array)),ct=(e,t)=>{const r=(e&&e[Symbol.iterator]).call(e);let o;for(;(o=r.next())&&!o.done;){const i=o.value;t.call(e,i[0],i[1])}},ut=(e,t)=>{let n;const r=[];for(;(n=e.exec(t))!==null;)r.push(n);return r},lt=g("HTMLFormElement"),ft=e=>e.toLowerCase().replace(/[-_\s]([a-z\d])(\w*)/g,function(n,r,o){return r.toUpperCase()+o}),ae=(({hasOwnProperty:e})=>(t,n)=>e.call(t,n))(Object.prototype),dt=g("RegExp"),Ae=(e,t)=>{const n=Object.getOwnPropertyDescriptors(e),r={};L(n,(o,i)=>{let s;(s=t(o,i,e))!==!1&&(r[i]=s||o)}),Object.defineProperties(e,r)},pt=e=>{Ae(e,(t,n)=>{if(R(e)&&["arguments","caller","callee"].indexOf(n)!==-1)return!1;const r=e[n];if(R(r)){if(t.enumerable=!1,"writable"in t){t.writable=!1;return}t.set||(t.set=()=>{throw Error("Can not rewrite read-only method '"+n+"'")})}})},ht=(e,t)=>{const n={},r=o=>{o.forEach(i=>{n[i]=!0})};return C(e)?r(e):r(String(e).split(t)),n},mt=()=>{},yt=(e,t)=>(e=+e,Number.isFinite(e)?e:t),W="abcdefghijklmnopqrstuvwxyz",ce="0123456789",Te={DIGIT:ce,ALPHA:W,ALPHA_DIGIT:W+W.toUpperCase()+ce},bt=(e=16,t=Te.ALPHA_DIGIT)=>{let n="";const{length:r}=t;for(;e--;)n+=t[Math.random()*r|0];return n};function wt(e){return!!(e&&R(e.append)&&e[Symbol.toStringTag]==="FormData"&&e[Symbol.iterator])}const Et=e=>{const t=new Array(10),n=(r,o)=>{if(z(r)){if(t.indexOf(r)>=0)return;if(!("toJSON"in r)){t[o]=r;const i=C(r)?[]:{};return L(r,(s,c)=>{const p=n(s,o+1);!_(p)&&(i[c]=p)}),t[o]=void 0,i}}return r};return n(e,0)},St=g("AsyncFunction"),Rt=e=>e&&(z(e)||R(e))&&R(e.then)&&R(e.catch),a={isArray:C,isArrayBuffer:Ee,isBuffer:Je,isFormData:Ze,isArrayBufferView:$e,isString:Ve,isNumber:Se,isBoolean:We,isObject:z,isPlainObject:D,isUndefined:_,isDate:Ke,isFile:Ge,isBlob:Xe,isRegExp:dt,isFunction:R,isStream:Qe,isURLSearchParams:Ye,isTypedArray:at,isFileList:ve,forEach:L,merge:v,extend:tt,trim:et,stripBOM:nt,inherits:rt,toFlatObject:st,kindOf:M,kindOfTest:g,endsWith:ot,toArray:it,forEachEntry:ct,matchAll:ut,isHTMLForm:lt,hasOwnProperty:ae,hasOwnProp:ae,reduceDescriptors:Ae,freezeMethods:pt,toObjectSet:ht,toCamelCase:ft,noop:mt,toFiniteNumber:yt,findKey:Re,global:Oe,isContextDefined:ge,ALPHABET:Te,generateString:bt,isSpecCompliantForm:wt,toJSONObject:Et,isAsyncFn:St,isThenable:Rt};function m(e,t,n,r,o){Error.call(this),Error.captureStackTrace?Error.captureStackTrace(this,this.constructor):this.stack=new Error().stack,this.message=e,this.name="AxiosError",t&&(this.code=t),n&&(this.config=n),r&&(this.request=r),o&&(this.response=o)}a.inherits(m,Error,{toJSON:function(){return{message:this.message,name:this.name,description:this.description,number:this.number,fileName:this.fileName,lineNumber:this.lineNumber,columnNumber:this.columnNumber,stack:this.stack,config:a.toJSONObject(this.config),code:this.code,status:this.response&&this.response.status?this.response.status:null}}});const Ne=m.prototype,xe={};["ERR_BAD_OPTION_VALUE","ERR_BAD_OPTION","ECONNABORTED","ETIMEDOUT","ERR_NETWORK","ERR_FR_TOO_MANY_REDIRECTS","ERR_DEPRECATED","ERR_BAD_RESPONSE","ERR_BAD_REQUEST","ERR_CANCELED","ERR_NOT_SUPPORT","ERR_INVALID_URL"].forEach(e=>{xe[e]={value:e}});Object.defineProperties(m,xe);Object.defineProperty(Ne,"isAxiosError",{value:!0});m.from=(e,t,n,r,o,i)=>{const s=Object.create(Ne);return a.toFlatObject(e,s,function(p){return p!==Error.prototype},c=>c!=="isAxiosError"),m.call(s,e.message,t,n,r,o),s.cause=e,s.name=e.name,i&&Object.assign(s,i),s};const Ot=null;function Q(e){return a.isPlainObject(e)||a.isArray(e)}function Pe(e){return a.endsWith(e,"[]")?e.slice(0,-2):e}function ue(e,t,n){return e?e.concat(t).map(function(o,i){return o=Pe(o),!n&&i?"["+o+"]":o}).join(n?".":""):t}function gt(e){return a.isArray(e)&&!e.some(Q)}const At=a.toFlatObject(a,{},null,function(t){return/^is[A-Z]/.test(t)});function J(e,t,n){if(!a.isObject(e))throw new TypeError("target must be an object");t=t||new FormData,n=a.toFlatObject(n,{metaTokens:!0,dots:!1,indexes:!1},!1,function(d,w){return!a.isUndefined(w[d])});const r=n.metaTokens,o=n.visitor||l,i=n.dots,s=n.indexes,p=(n.Blob||typeof Blob<"u"&&Blob)&&a.isSpecCompliantForm(t);if(!a.isFunction(o))throw new TypeError("visitor must be a function");function h(f){if(f===null)return"";if(a.isDate(f))return f.toISOString();if(!p&&a.isBlob(f))throw new m("Blob is not supported. Use a Buffer instead.");return a.isArrayBuffer(f)||a.isTypedArray(f)?p&&typeof Blob=="function"?new Blob([f]):Buffer.from(f):f}function l(f,d,w){let E=f;if(f&&!w&&typeof f=="object"){if(a.endsWith(d,"{}"))d=r?d:d.slice(0,-2),f=JSON.stringify(f);else if(a.isArray(f)&&gt(f)||(a.isFileList(f)||a.endsWith(d,"[]"))&&(E=a.toArray(f)))return d=Pe(d),E.forEach(function(N,Ie){!(a.isUndefined(N)||N===null)&&t.append(s===!0?ue([d],Ie,i):s===null?d:d+"[]",h(N))}),!1}return Q(f)?!0:(t.append(ue(w,d,i),h(f)),!1)}const u=[],b=Object.assign(At,{defaultVisitor:l,convertValue:h,isVisitable:Q});function S(f,d){if(!a.isUndefined(f)){if(u.indexOf(f)!==-1)throw Error("Circular reference detected in "+d.join("."));u.push(f),a.forEach(f,function(E,T){(!(a.isUndefined(E)||E===null)&&o.call(t,E,a.isString(T)?T.trim():T,d,b))===!0&&S(E,d?d.concat(T):[T])}),u.pop()}}if(!a.isObject(e))throw new TypeError("data must be an object");return S(e),t}function le(e){const t={"!":"%21","'":"%27","(":"%28",")":"%29","~":"%7E","%20":"+","%00":"\0"};return encodeURIComponent(e).replace(/[!'()~]|%20|%00/g,function(r){return t[r]})}function ne(e,t){this._pairs=[],e&&J(e,this,t)}const Ce=ne.prototype;Ce.append=function(t,n){this._pairs.push([t,n])};Ce.toString=function(t){const n=t?function(r){return t.call(this,r,le)}:le;return this._pairs.map(function(o){return n(o[0])+"="+n(o[1])},"").join("&")};function Tt(e){return encodeURIComponent(e).replace(/%3A/gi,":").replace(/%24/g,"$").replace(/%2C/gi,",").replace(/%20/g,"+").replace(/%5B/gi,"[").replace(/%5D/gi,"]")}function Fe(e,t,n){if(!t)return e;const r=n&&n.encode||Tt,o=n&&n.serialize;let i;if(o?i=o(t,n):i=a.isURLSearchParams(t)?t.toString():new ne(t,n).toString(r),i){const s=e.indexOf("#");s!==-1&&(e=e.slice(0,s)),e+=(e.indexOf("?")===-1?"?":"&")+i}return e}class Nt{constructor(){this.handlers=[]}use(t,n,r){return this.handlers.push({fulfilled:t,rejected:n,synchronous:r?r.synchronous:!1,runWhen:r?r.runWhen:null}),this.handlers.length-1}eject(t){this.handlers[t]&&(this.handlers[t]=null)}clear(){this.handlers&&(this.handlers=[])}forEach(t){a.forEach(this.handlers,function(r){r!==null&&t(r)})}}const fe=Nt,_e={silentJSONParsing:!0,forcedJSONParsing:!0,clarifyTimeoutError:!1},xt=typeof URLSearchParams<"u"?URLSearchParams:ne,Pt=typeof FormData<"u"?FormData:null,Ct=typeof Blob<"u"?Blob:null,Ft={isBrowser:!0,classes:{URLSearchParams:xt,FormData:Pt,Blob:Ct},protocols:["http","https","file","blob","url","data"]},Le=typeof window<"u"&&typeof document<"u",_t=(e=>Le&&["ReactNative","NativeScript","NS"].indexOf(e)<0)(typeof navigator<"u"&&navigator.product),Lt=typeof WorkerGlobalScope<"u"&&self instanceof WorkerGlobalScope&&typeof self.importScripts=="function",Ut=Object.freeze(Object.defineProperty({__proto__:null,hasBrowserEnv:Le,hasStandardBrowserEnv:_t,hasStandardBrowserWebWorkerEnv:Lt},Symbol.toStringTag,{value:"Module"})),O={...Ut,...Ft};function Bt(e,t){return J(e,new O.classes.URLSearchParams,Object.assign({visitor:function(n,r,o,i){return O.isNode&&a.isBuffer(n)?(this.append(r,n.toString("base64")),!1):i.defaultVisitor.apply(this,arguments)}},t))}function Dt(e){return a.matchAll(/\w+|\[(\w*)]/g,e).map(t=>t[0]==="[]"?"":t[1]||t[0])}function jt(e){const t={},n=Object.keys(e);let r;const o=n.length;let i;for(r=0;r<o;r++)i=n[r],t[i]=e[i];return t}function Ue(e){function t(n,r,o,i){let s=n[i++];const c=Number.isFinite(+s),p=i>=n.length;return s=!s&&a.isArray(o)?o.length:s,p?(a.hasOwnProp(o,s)?o[s]=[o[s],r]:o[s]=r,!c):((!o[s]||!a.isObject(o[s]))&&(o[s]=[]),t(n,r,o[s],i)&&a.isArray(o[s])&&(o[s]=jt(o[s])),!c)}if(a.isFormData(e)&&a.isFunction(e.entries)){const n={};return a.forEachEntry(e,(r,o)=>{t(Dt(r),o,n,0)}),n}return null}function kt(e,t,n){if(a.isString(e))try{return(t||JSON.parse)(e),a.trim(e)}catch(r){if(r.name!=="SyntaxError")throw r}return(n||JSON.stringify)(e)}const re={transitional:_e,adapter:["xhr","http"],transformRequest:[function(t,n){const r=n.getContentType()||"",o=r.indexOf("application/json")>-1,i=a.isObject(t);if(i&&a.isHTMLForm(t)&&(t=new FormData(t)),a.isFormData(t))return o&&o?JSON.stringify(Ue(t)):t;if(a.isArrayBuffer(t)||a.isBuffer(t)||a.isStream(t)||a.isFile(t)||a.isBlob(t))return t;if(a.isArrayBufferView(t))return t.buffer;if(a.isURLSearchParams(t))return n.setContentType("application/x-www-form-urlencoded;charset=utf-8",!1),t.toString();let c;if(i){if(r.indexOf("application/x-www-form-urlencoded")>-1)return Bt(t,this.formSerializer).toString();if((c=a.isFileList(t))||r.indexOf("multipart/form-data")>-1){const p=this.env&&this.env.FormData;return J(c?{"files[]":t}:t,p&&new p,this.formSerializer)}}return i||o?(n.setContentType("application/json",!1),kt(t)):t}],transformResponse:[function(t){const n=this.transitional||re.transitional,r=n&&n.forcedJSONParsing,o=this.responseType==="json";if(t&&a.isString(t)&&(r&&!this.responseType||o)){const s=!(n&&n.silentJSONParsing)&&o;try{return JSON.parse(t)}catch(c){if(s)throw c.name==="SyntaxError"?m.from(c,m.ERR_BAD_RESPONSE,this,null,this.response):c}}return t}],timeout:0,xsrfCookieName:"XSRF-TOKEN",xsrfHeaderName:"X-XSRF-TOKEN",maxContentLength:-1,maxBodyLength:-1,env:{FormData:O.classes.FormData,Blob:O.classes.Blob},validateStatus:function(t){return t>=200&&t<300},headers:{common:{Accept:"application/json, text/plain, */*","Content-Type":void 0}}};a.forEach(["delete","get","head","post","put","patch"],e=>{re.headers[e]={}});const se=re,Ht=a.toObjectSet(["age","authorization","content-length","content-type","etag","expires","from","host","if-modified-since","if-unmodified-since","last-modified","location","max-forwards","proxy-authorization","referer","retry-after","user-agent"]),It=e=>{const t={};let n,r,o;return e&&e.split(`
`).forEach(function(s){o=s.indexOf(":"),n=s.substring(0,o).trim().toLowerCase(),r=s.substring(o+1).trim(),!(!n||t[n]&&Ht[n])&&(n==="set-cookie"?t[n]?t[n].push(r):t[n]=[r]:t[n]=t[n]?t[n]+", "+r:r)}),t},de=Symbol("internals");function F(e){return e&&String(e).trim().toLowerCase()}function j(e){return e===!1||e==null?e:a.isArray(e)?e.map(j):String(e)}function Mt(e){const t=Object.create(null),n=/([^\s,;=]+)\s*(?:=\s*([^,;]+))?/g;let r;for(;r=n.exec(e);)t[r[1]]=r[2];return t}const qt=e=>/^[-_a-zA-Z0-9^`|~,!#$%&'*+.]+$/.test(e.trim());function K(e,t,n,r,o){if(a.isFunction(r))return r.call(this,t,n);if(o&&(t=n),!!a.isString(t)){if(a.isString(r))return t.indexOf(r)!==-1;if(a.isRegExp(r))return r.test(t)}}function zt(e){return e.trim().toLowerCase().replace(/([a-z\d])(\w*)/g,(t,n,r)=>n.toUpperCase()+r)}function Jt(e,t){const n=a.toCamelCase(" "+t);["get","set","has"].forEach(r=>{Object.defineProperty(e,r+n,{value:function(o,i,s){return this[r].call(this,t,o,i,s)},configurable:!0})})}class ${constructor(t){t&&this.set(t)}set(t,n,r){const o=this;function i(c,p,h){const l=F(p);if(!l)throw new Error("header name must be a non-empty string");const u=a.findKey(o,l);(!u||o[u]===void 0||h===!0||h===void 0&&o[u]!==!1)&&(o[u||p]=j(c))}const s=(c,p)=>a.forEach(c,(h,l)=>i(h,l,p));return a.isPlainObject(t)||t instanceof this.constructor?s(t,n):a.isString(t)&&(t=t.trim())&&!qt(t)?s(It(t),n):t!=null&&i(n,t,r),this}get(t,n){if(t=F(t),t){const r=a.findKey(this,t);if(r){const o=this[r];if(!n)return o;if(n===!0)return Mt(o);if(a.isFunction(n))return n.call(this,o,r);if(a.isRegExp(n))return n.exec(o);throw new TypeError("parser must be boolean|regexp|function")}}}has(t,n){if(t=F(t),t){const r=a.findKey(this,t);return!!(r&&this[r]!==void 0&&(!n||K(this,this[r],r,n)))}return!1}delete(t,n){const r=this;let o=!1;function i(s){if(s=F(s),s){const c=a.findKey(r,s);c&&(!n||K(r,r[c],c,n))&&(delete r[c],o=!0)}}return a.isArray(t)?t.forEach(i):i(t),o}clear(t){const n=Object.keys(this);let r=n.length,o=!1;for(;r--;){const i=n[r];(!t||K(this,this[i],i,t,!0))&&(delete this[i],o=!0)}return o}normalize(t){const n=this,r={};return a.forEach(this,(o,i)=>{const s=a.findKey(r,i);if(s){n[s]=j(o),delete n[i];return}const c=t?zt(i):String(i).trim();c!==i&&delete n[i],n[c]=j(o),r[c]=!0}),this}concat(...t){return this.constructor.concat(this,...t)}toJSON(t){const n=Object.create(null);return a.forEach(this,(r,o)=>{r!=null&&r!==!1&&(n[o]=t&&a.isArray(r)?r.join(", "):r)}),n}[Symbol.iterator](){return Object.entries(this.toJSON())[Symbol.iterator]()}toString(){return Object.entries(this.toJSON()).map(([t,n])=>t+": "+n).join(`
`)}get[Symbol.toStringTag](){return"AxiosHeaders"}static from(t){return t instanceof this?t:new this(t)}static concat(t,...n){const r=new this(t);return n.forEach(o=>r.set(o)),r}static accessor(t){const r=(this[de]=this[de]={accessors:{}}).accessors,o=this.prototype;function i(s){const c=F(s);r[c]||(Jt(o,s),r[c]=!0)}return a.isArray(t)?t.forEach(i):i(t),this}}$.accessor(["Content-Type","Content-Length","Accept","Accept-Encoding","User-Agent","Authorization"]);a.reduceDescriptors($.prototype,({value:e},t)=>{let n=t[0].toUpperCase()+t.slice(1);return{get:()=>e,set(r){this[n]=r}}});a.freezeMethods($);const A=$;function G(e,t){const n=this||se,r=t||n,o=A.from(r.headers);let i=r.data;return a.forEach(e,function(c){i=c.call(n,i,o.normalize(),t?t.status:void 0)}),o.normalize(),i}function Be(e){return!!(e&&e.__CANCEL__)}function U(e,t,n){m.call(this,e??"canceled",m.ERR_CANCELED,t,n),this.name="CanceledError"}a.inherits(U,m,{__CANCEL__:!0});function $t(e,t,n){const r=n.config.validateStatus;!n.status||!r||r(n.status)?e(n):t(new m("Request failed with status code "+n.status,[m.ERR_BAD_REQUEST,m.ERR_BAD_RESPONSE][Math.floor(n.status/100)-4],n.config,n.request,n))}const Vt=O.hasStandardBrowserEnv?{write(e,t,n,r,o,i){const s=[e+"="+encodeURIComponent(t)];a.isNumber(n)&&s.push("expires="+new Date(n).toGMTString()),a.isString(r)&&s.push("path="+r),a.isString(o)&&s.push("domain="+o),i===!0&&s.push("secure"),document.cookie=s.join("; ")},read(e){const t=document.cookie.match(new RegExp("(^|;\\s*)("+e+")=([^;]*)"));return t?decodeURIComponent(t[3]):null},remove(e){this.write(e,"",Date.now()-864e5)}}:{write(){},read(){return null},remove(){}};function Wt(e){return/^([a-z][a-z\d+\-.]*:)?\/\//i.test(e)}function Kt(e,t){return t?e.replace(/\/+$/,"")+"/"+t.replace(/^\/+/,""):e}function De(e,t){return e&&!Wt(t)?Kt(e,t):t}const Gt=O.hasStandardBrowserEnv?function(){const t=/(msie|trident)/i.test(navigator.userAgent),n=document.createElement("a");let r;function o(i){let s=i;return t&&(n.setAttribute("href",s),s=n.href),n.setAttribute("href",s),{href:n.href,protocol:n.protocol?n.protocol.replace(/:$/,""):"",host:n.host,search:n.search?n.search.replace(/^\?/,""):"",hash:n.hash?n.hash.replace(/^#/,""):"",hostname:n.hostname,port:n.port,pathname:n.pathname.charAt(0)==="/"?n.pathname:"/"+n.pathname}}return r=o(window.location.href),function(s){const c=a.isString(s)?o(s):s;return c.protocol===r.protocol&&c.host===r.host}}():function(){return function(){return!0}}();function Xt(e){const t=/^([-+\w]{1,25})(:?\/\/|:)/.exec(e);return t&&t[1]||""}function vt(e,t){e=e||10;const n=new Array(e),r=new Array(e);let o=0,i=0,s;return t=t!==void 0?t:1e3,function(p){const h=Date.now(),l=r[i];s||(s=h),n[o]=p,r[o]=h;let u=i,b=0;for(;u!==o;)b+=n[u++],u=u%e;if(o=(o+1)%e,o===i&&(i=(i+1)%e),h-s<t)return;const S=l&&h-l;return S?Math.round(b*1e3/S):void 0}}function pe(e,t){let n=0;const r=vt(50,250);return o=>{const i=o.loaded,s=o.lengthComputable?o.total:void 0,c=i-n,p=r(c),h=i<=s;n=i;const l={loaded:i,total:s,progress:s?i/s:void 0,bytes:c,rate:p||void 0,estimated:p&&s&&h?(s-i)/p:void 0,event:o};l[t?"download":"upload"]=!0,e(l)}}const Qt=typeof XMLHttpRequest<"u",Zt=Qt&&function(e){return new Promise(function(n,r){let o=e.data;const i=A.from(e.headers).normalize();let{responseType:s,withXSRFToken:c}=e,p;function h(){e.cancelToken&&e.cancelToken.unsubscribe(p),e.signal&&e.signal.removeEventListener("abort",p)}let l;if(a.isFormData(o)){if(O.hasStandardBrowserEnv||O.hasStandardBrowserWebWorkerEnv)i.setContentType(!1);else if((l=i.getContentType())!==!1){const[d,...w]=l?l.split(";").map(E=>E.trim()).filter(Boolean):[];i.setContentType([d||"multipart/form-data",...w].join("; "))}}let u=new XMLHttpRequest;if(e.auth){const d=e.auth.username||"",w=e.auth.password?unescape(encodeURIComponent(e.auth.password)):"";i.set("Authorization","Basic "+btoa(d+":"+w))}const b=De(e.baseURL,e.url);u.open(e.method.toUpperCase(),Fe(b,e.params,e.paramsSerializer),!0),u.timeout=e.timeout;function S(){if(!u)return;const d=A.from("getAllResponseHeaders"in u&&u.getAllResponseHeaders()),E={data:!s||s==="text"||s==="json"?u.responseText:u.response,status:u.status,statusText:u.statusText,headers:d,config:e,request:u};$t(function(N){n(N),h()},function(N){r(N),h()},E),u=null}if("onloadend"in u?u.onloadend=S:u.onreadystatechange=function(){!u||u.readyState!==4||u.status===0&&!(u.responseURL&&u.responseURL.indexOf("file:")===0)||setTimeout(S)},u.onabort=function(){u&&(r(new m("Request aborted",m.ECONNABORTED,e,u)),u=null)},u.onerror=function(){r(new m("Network Error",m.ERR_NETWORK,e,u)),u=null},u.ontimeout=function(){let w=e.timeout?"timeout of "+e.timeout+"ms exceeded":"timeout exceeded";const E=e.transitional||_e;e.timeoutErrorMessage&&(w=e.timeoutErrorMessage),r(new m(w,E.clarifyTimeoutError?m.ETIMEDOUT:m.ECONNABORTED,e,u)),u=null},O.hasStandardBrowserEnv&&(c&&a.isFunction(c)&&(c=c(e)),c||c!==!1&&Gt(b))){const d=e.xsrfHeaderName&&e.xsrfCookieName&&Vt.read(e.xsrfCookieName);d&&i.set(e.xsrfHeaderName,d)}o===void 0&&i.setContentType(null),"setRequestHeader"in u&&a.forEach(i.toJSON(),function(w,E){u.setRequestHeader(E,w)}),a.isUndefined(e.withCredentials)||(u.withCredentials=!!e.withCredentials),s&&s!=="json"&&(u.responseType=e.responseType),typeof e.onDownloadProgress=="function"&&u.addEventListener("progress",pe(e.onDownloadProgress,!0)),typeof e.onUploadProgress=="function"&&u.upload&&u.upload.addEventListener("progress",pe(e.onUploadProgress)),(e.cancelToken||e.signal)&&(p=d=>{u&&(r(!d||d.type?new U(null,e,u):d),u.abort(),u=null)},e.cancelToken&&e.cancelToken.subscribe(p),e.signal&&(e.signal.aborted?p():e.signal.addEventListener("abort",p)));const f=Xt(b);if(f&&O.protocols.indexOf(f)===-1){r(new m("Unsupported protocol "+f+":",m.ERR_BAD_REQUEST,e));return}u.send(o||null)})},Z={http:Ot,xhr:Zt};a.forEach(Z,(e,t)=>{if(e){try{Object.defineProperty(e,"name",{value:t})}catch{}Object.defineProperty(e,"adapterName",{value:t})}});const he=e=>`- ${e}`,Yt=e=>a.isFunction(e)||e===null||e===!1,je={getAdapter:e=>{e=a.isArray(e)?e:[e];const{length:t}=e;let n,r;const o={};for(let i=0;i<t;i++){n=e[i];let s;if(r=n,!Yt(n)&&(r=Z[(s=String(n)).toLowerCase()],r===void 0))throw new m(`Unknown adapter '${s}'`);if(r)break;o[s||"#"+i]=r}if(!r){const i=Object.entries(o).map(([c,p])=>`adapter ${c} `+(p===!1?"is not supported by the environment":"is not available in the build"));let s=t?i.length>1?`since :
`+i.map(he).join(`
`):" "+he(i[0]):"as no adapter specified";throw new m("There is no suitable adapter to dispatch the request "+s,"ERR_NOT_SUPPORT")}return r},adapters:Z};function X(e){if(e.cancelToken&&e.cancelToken.throwIfRequested(),e.signal&&e.signal.aborted)throw new U(null,e)}function me(e){return X(e),e.headers=A.from(e.headers),e.data=G.call(e,e.transformRequest),["post","put","patch"].indexOf(e.method)!==-1&&e.headers.setContentType("application/x-www-form-urlencoded",!1),je.getAdapter(e.adapter||se.adapter)(e).then(function(r){return X(e),r.data=G.call(e,e.transformResponse,r),r.headers=A.from(r.headers),r},function(r){return Be(r)||(X(e),r&&r.response&&(r.response.data=G.call(e,e.transformResponse,r.response),r.response.headers=A.from(r.response.headers))),Promise.reject(r)})}const ye=e=>e instanceof A?e.toJSON():e;function P(e,t){t=t||{};const n={};function r(h,l,u){return a.isPlainObject(h)&&a.isPlainObject(l)?a.merge.call({caseless:u},h,l):a.isPlainObject(l)?a.merge({},l):a.isArray(l)?l.slice():l}function o(h,l,u){if(a.isUndefined(l)){if(!a.isUndefined(h))return r(void 0,h,u)}else return r(h,l,u)}function i(h,l){if(!a.isUndefined(l))return r(void 0,l)}function s(h,l){if(a.isUndefined(l)){if(!a.isUndefined(h))return r(void 0,h)}else return r(void 0,l)}function c(h,l,u){if(u in t)return r(h,l);if(u in e)return r(void 0,h)}const p={url:i,method:i,data:i,baseURL:s,transformRequest:s,transformResponse:s,paramsSerializer:s,timeout:s,timeoutMessage:s,withCredentials:s,withXSRFToken:s,adapter:s,responseType:s,xsrfCookieName:s,xsrfHeaderName:s,onUploadProgress:s,onDownloadProgress:s,decompress:s,maxContentLength:s,maxBodyLength:s,beforeRedirect:s,transport:s,httpAgent:s,httpsAgent:s,cancelToken:s,socketPath:s,responseEncoding:s,validateStatus:c,headers:(h,l)=>o(ye(h),ye(l),!0)};return a.forEach(Object.keys(Object.assign({},e,t)),function(l){const u=p[l]||o,b=u(e[l],t[l],l);a.isUndefined(b)&&u!==c||(n[l]=b)}),n}const ke="1.6.2",oe={};["object","boolean","number","function","string","symbol"].forEach((e,t)=>{oe[e]=function(r){return typeof r===e||"a"+(t<1?"n ":" ")+e}});const be={};oe.transitional=function(t,n,r){function o(i,s){return"[Axios v"+ke+"] Transitional option '"+i+"'"+s+(r?". "+r:"")}return(i,s,c)=>{if(t===!1)throw new m(o(s," has been removed"+(n?" in "+n:"")),m.ERR_DEPRECATED);return n&&!be[s]&&(be[s]=!0,console.warn(o(s," has been deprecated since v"+n+" and will be removed in the near future"))),t?t(i,s,c):!0}};function en(e,t,n){if(typeof e!="object")throw new m("options must be an object",m.ERR_BAD_OPTION_VALUE);const r=Object.keys(e);let o=r.length;for(;o-- >0;){const i=r[o],s=t[i];if(s){const c=e[i],p=c===void 0||s(c,i,e);if(p!==!0)throw new m("option "+i+" must be "+p,m.ERR_BAD_OPTION_VALUE);continue}if(n!==!0)throw new m("Unknown option "+i,m.ERR_BAD_OPTION)}}const Y={assertOptions:en,validators:oe},x=Y.validators;class I{constructor(t){this.defaults=t,this.interceptors={request:new fe,response:new fe}}request(t,n){typeof t=="string"?(n=n||{},n.url=t):n=t||{},n=P(this.defaults,n);const{transitional:r,paramsSerializer:o,headers:i}=n;r!==void 0&&Y.assertOptions(r,{silentJSONParsing:x.transitional(x.boolean),forcedJSONParsing:x.transitional(x.boolean),clarifyTimeoutError:x.transitional(x.boolean)},!1),o!=null&&(a.isFunction(o)?n.paramsSerializer={serialize:o}:Y.assertOptions(o,{encode:x.function,serialize:x.function},!0)),n.method=(n.method||this.defaults.method||"get").toLowerCase();let s=i&&a.merge(i.common,i[n.method]);i&&a.forEach(["delete","get","head","post","put","patch","common"],f=>{delete i[f]}),n.headers=A.concat(s,i);const c=[];let p=!0;this.interceptors.request.forEach(function(d){typeof d.runWhen=="function"&&d.runWhen(n)===!1||(p=p&&d.synchronous,c.unshift(d.fulfilled,d.rejected))});const h=[];this.interceptors.response.forEach(function(d){h.push(d.fulfilled,d.rejected)});let l,u=0,b;if(!p){const f=[me.bind(this),void 0];for(f.unshift.apply(f,c),f.push.apply(f,h),b=f.length,l=Promise.resolve(n);u<b;)l=l.then(f[u++],f[u++]);return l}b=c.length;let S=n;for(u=0;u<b;){const f=c[u++],d=c[u++];try{S=f(S)}catch(w){d.call(this,w);break}}try{l=me.call(this,S)}catch(f){return Promise.reject(f)}for(u=0,b=h.length;u<b;)l=l.then(h[u++],h[u++]);return l}getUri(t){t=P(this.defaults,t);const n=De(t.baseURL,t.url);return Fe(n,t.params,t.paramsSerializer)}}a.forEach(["delete","get","head","options"],function(t){I.prototype[t]=function(n,r){return this.request(P(r||{},{method:t,url:n,data:(r||{}).data}))}});a.forEach(["post","put","patch"],function(t){function n(r){return function(i,s,c){return this.request(P(c||{},{method:t,headers:r?{"Content-Type":"multipart/form-data"}:{},url:i,data:s}))}}I.prototype[t]=n(),I.prototype[t+"Form"]=n(!0)});const k=I;class ie{constructor(t){if(typeof t!="function")throw new TypeError("executor must be a function.");let n;this.promise=new Promise(function(i){n=i});const r=this;this.promise.then(o=>{if(!r._listeners)return;let i=r._listeners.length;for(;i-- >0;)r._listeners[i](o);r._listeners=null}),this.promise.then=o=>{let i;const s=new Promise(c=>{r.subscribe(c),i=c}).then(o);return s.cancel=function(){r.unsubscribe(i)},s},t(function(i,s,c){r.reason||(r.reason=new U(i,s,c),n(r.reason))})}throwIfRequested(){if(this.reason)throw this.reason}subscribe(t){if(this.reason){t(this.reason);return}this._listeners?this._listeners.push(t):this._listeners=[t]}unsubscribe(t){if(!this._listeners)return;const n=this._listeners.indexOf(t);n!==-1&&this._listeners.splice(n,1)}static source(){let t;return{token:new ie(function(o){t=o}),cancel:t}}}const tn=ie;function nn(e){return function(n){return e.apply(null,n)}}function rn(e){return a.isObject(e)&&e.isAxiosError===!0}const ee={Continue:100,SwitchingProtocols:101,Processing:102,EarlyHints:103,Ok:200,Created:201,Accepted:202,NonAuthoritativeInformation:203,NoContent:204,ResetContent:205,PartialContent:206,MultiStatus:207,AlreadyReported:208,ImUsed:226,MultipleChoices:300,MovedPermanently:301,Found:302,SeeOther:303,NotModified:304,UseProxy:305,Unused:306,TemporaryRedirect:307,PermanentRedirect:308,BadRequest:400,Unauthorized:401,PaymentRequired:402,Forbidden:403,NotFound:404,MethodNotAllowed:405,NotAcceptable:406,ProxyAuthenticationRequired:407,RequestTimeout:408,Conflict:409,Gone:410,LengthRequired:411,PreconditionFailed:412,PayloadTooLarge:413,UriTooLong:414,UnsupportedMediaType:415,RangeNotSatisfiable:416,ExpectationFailed:417,ImATeapot:418,MisdirectedRequest:421,UnprocessableEntity:422,Locked:423,FailedDependency:424,TooEarly:425,UpgradeRequired:426,PreconditionRequired:428,TooManyRequests:429,RequestHeaderFieldsTooLarge:431,UnavailableForLegalReasons:451,InternalServerError:500,NotImplemented:501,BadGateway:502,ServiceUnavailable:503,GatewayTimeout:504,HttpVersionNotSupported:505,VariantAlsoNegotiates:506,InsufficientStorage:507,LoopDetected:508,NotExtended:510,NetworkAuthenticationRequired:511};Object.entries(ee).forEach(([e,t])=>{ee[t]=e});const sn=ee;function He(e){const t=new k(e),n=we(k.prototype.request,t);return a.extend(n,k.prototype,t,{allOwnKeys:!0}),a.extend(n,t,null,{allOwnKeys:!0}),n.create=function(o){return He(P(e,o))},n}const y=He(se);y.Axios=k;y.CanceledError=U;y.CancelToken=tn;y.isCancel=Be;y.VERSION=ke;y.toFormData=J;y.AxiosError=m;y.Cancel=y.CanceledError;y.all=function(t){return Promise.all(t)};y.spread=nn;y.isAxiosError=rn;y.mergeConfig=P;y.AxiosHeaders=A;y.formToJSON=e=>Ue(a.isHTMLForm(e)?new FormData(e):e);y.getAdapter=je.getAdapter;y.HttpStatusCode=sn;y.default=y;const on=y;class an{constructor(t){B(this,"instance");this.instance=on.create({baseURL:t||"",timeout:12e4}),this.init()}getInterceptors(){return this.instance}init(){this.instance.interceptors.request.use(t=>t,t=>{console.error(t)}),this.instance.interceptors.response.use(t=>t.status===200?Promise.resolve(t.data):Promise.reject(t),t=>{const{response:n}=t;if(n)return H({message:`错误：${n.status}`,position:"bottom"}),Promise.reject(t);H({message:"网络连接异常,请稍后再试!",position:"bottom"})})}}const cn="http://47.99.134.39:10008",un=cn,ln={refreshing:!1,loading:!1,finished:!1,pageNum:1,total:0,pageSize:10};class fn{constructor(){B(this,"myAxios");B(this,"baseUrl",un);this.myAxios=new an(this.baseUrl).getInterceptors()}get(t,n={},r=!0){return new Promise((o,i)=>{this.myAxios.get(t,{params:n}).then(s=>{s.code===200?o(s.data):(r&&H({message:s.msg,position:"bottom"}),i(s))}).catch(s=>{i(s.message||"请求失败")})})}postWithConfig(t,n={},r){return new Promise((o,i)=>{this.myAxios.post(t,n,r).then(s=>{s.code===200?o(s.data):(H({message:s.msg,position:"bottom"}),i(s))}).catch(s=>{i(s.message||"请求失败")})})}post(t,n={}){return this.postWithConfig(t,n,{})}getList(t,n={},r=ln){return new Promise((o,i)=>{r.pageNum===1?(r.refreshing=!0,r.loading=!1):(r.refreshing=!1,r.loading=!0),n.pageNum=r.pageNum,n.pageSize=r.pageSize,this.get(t,n).then(s=>{s.pageNum&&(r.pageNum=s.pageNum),s.pageSize&&(r.pageSize=s.pageSize),r.total=s.total,r.finished=s.pageNum*s.pageSize>=s.total,o(s)}).catch(s=>{r.loading&&r.pageNum--,i(s)}).finally(()=>{r.refreshing=!1,r.loading=!1})})}}const V=new fn,hn=()=>V.get("/football/matches"),mn=e=>V.get("/analysis/info",{fid:e}),yn=e=>V.post("/analysis/all",e),bn=(e,t)=>V.getList(`/football/daily/${e}`,{},t);export{mn as a,yn as b,bn as c,ln as d,hn as g};
