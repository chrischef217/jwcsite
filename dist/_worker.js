var Et=Object.defineProperty;var Ve=t=>{throw TypeError(t)};var Rt=(t,e,r)=>e in t?Et(t,e,{enumerable:!0,configurable:!0,writable:!0,value:r}):t[e]=r;var p=(t,e,r)=>Rt(t,typeof e!="symbol"?e+"":e,r),Te=(t,e,r)=>e.has(t)||Ve("Cannot "+r);var o=(t,e,r)=>(Te(t,e,"read from private field"),r?r.call(t):e.get(t)),v=(t,e,r)=>e.has(t)?Ve("Cannot add the same private member more than once"):e instanceof WeakSet?e.add(t):e.set(t,r),f=(t,e,r,n)=>(Te(t,e,"write to private field"),n?n.call(t,r):e.set(t,r),r),m=(t,e,r)=>(Te(t,e,"access private method"),r);var Je=(t,e,r,n)=>({set _(s){f(t,e,s,r)},get _(){return o(t,e,n)}});var Ge=(t,e,r)=>(n,s)=>{let i=-1;return a(0);async function a(d){if(d<=i)throw new Error("next() called multiple times");i=d;let c,l=!1,h;if(t[d]?(h=t[d][0][0],n.req.routeIndex=d):h=d===t.length&&s||void 0,h)try{c=await h(n,()=>a(d+1))}catch(u){if(u instanceof Error&&e)n.error=u,c=await e(u,n),l=!0;else throw u}else n.finalized===!1&&r&&(c=await r(n));return c&&(n.finalized===!1||l)&&(n.res=c),n}},Ct=Symbol(),Ot=async(t,e=Object.create(null))=>{const{all:r=!1,dot:n=!1}=e,i=(t instanceof dt?t.raw.headers:t.headers).get("Content-Type");return i!=null&&i.startsWith("multipart/form-data")||i!=null&&i.startsWith("application/x-www-form-urlencoded")?jt(t,{all:r,dot:n}):{}};async function jt(t,e){const r=await t.formData();return r?Pt(r,e):{}}function Pt(t,e){const r=Object.create(null);return t.forEach((n,s)=>{e.all||s.endsWith("[]")?St(r,s,n):r[s]=n}),e.dot&&Object.entries(r).forEach(([n,s])=>{n.includes(".")&&($t(r,n,s),delete r[n])}),r}var St=(t,e,r)=>{t[e]!==void 0?Array.isArray(t[e])?t[e].push(r):t[e]=[t[e],r]:e.endsWith("[]")?t[e]=[r]:t[e]=r},$t=(t,e,r)=>{let n=t;const s=e.split(".");s.forEach((i,a)=>{a===s.length-1?n[i]=r:((!n[i]||typeof n[i]!="object"||Array.isArray(n[i])||n[i]instanceof File)&&(n[i]=Object.create(null)),n=n[i])})},it=t=>{const e=t.split("/");return e[0]===""&&e.shift(),e},Ht=t=>{const{groups:e,path:r}=kt(t),n=it(r);return Mt(n,e)},kt=t=>{const e=[];return t=t.replace(/\{[^}]+\}/g,(r,n)=>{const s=`@${n}`;return e.push([s,r]),s}),{groups:e,path:t}},Mt=(t,e)=>{for(let r=e.length-1;r>=0;r--){const[n]=e[r];for(let s=t.length-1;s>=0;s--)if(t[s].includes(n)){t[s]=t[s].replace(n,e[r][1]);break}}return t},Pe={},It=(t,e)=>{if(t==="*")return"*";const r=t.match(/^\:([^\{\}]+)(?:\{(.+)\})?$/);if(r){const n=`${t}#${e}`;return Pe[n]||(r[2]?Pe[n]=e&&e[0]!==":"&&e[0]!=="*"?[n,r[1],new RegExp(`^${r[2]}(?=/${e})`)]:[t,r[1],new RegExp(`^${r[2]}$`)]:Pe[n]=[t,r[1],!0]),Pe[n]}return null},Be=(t,e)=>{try{return e(t)}catch{return t.replace(/(?:%[0-9A-Fa-f]{2})+/g,r=>{try{return e(r)}catch{return r}})}},Lt=t=>Be(t,decodeURI),ot=t=>{const e=t.url,r=e.indexOf("/",e.indexOf(":")+4);let n=r;for(;n<e.length;n++){const s=e.charCodeAt(n);if(s===37){const i=e.indexOf("?",n),a=e.indexOf("#",n),d=i===-1?a===-1?void 0:a:a===-1?i:Math.min(i,a),c=e.slice(r,d);return Lt(c.includes("%25")?c.replace(/%25/g,"%2525"):c)}else if(s===63||s===35)break}return e.slice(r,n)},Dt=t=>{const e=ot(t);return e.length>1&&e.at(-1)==="/"?e.slice(0,-1):e},ie=(t,e,...r)=>(r.length&&(e=ie(e,...r)),`${(t==null?void 0:t[0])==="/"?"":"/"}${t}${e==="/"?"":`${(t==null?void 0:t.at(-1))==="/"?"":"/"}${(e==null?void 0:e[0])==="/"?e.slice(1):e}`}`),at=t=>{if(t.charCodeAt(t.length-1)!==63||!t.includes(":"))return null;const e=t.split("/"),r=[];let n="";return e.forEach(s=>{if(s!==""&&!/\:/.test(s))n+="/"+s;else if(/\:/.test(s))if(/\?/.test(s)){r.length===0&&n===""?r.push("/"):r.push(n);const i=s.replace("?","");n+="/"+i,r.push(n)}else n+="/"+s}),r.filter((s,i,a)=>a.indexOf(s)===i)},Ne=t=>/[%+]/.test(t)?(t.indexOf("+")!==-1&&(t=t.replace(/\+/g," ")),t.indexOf("%")!==-1?Be(t,lt):t):t,ct=(t,e,r)=>{let n;if(!r&&e&&!/[%+]/.test(e)){let a=t.indexOf("?",8);if(a===-1)return;for(t.startsWith(e,a+1)||(a=t.indexOf(`&${e}`,a+1));a!==-1;){const d=t.charCodeAt(a+e.length+1);if(d===61){const c=a+e.length+2,l=t.indexOf("&",c);return Ne(t.slice(c,l===-1?void 0:l))}else if(d==38||isNaN(d))return"";a=t.indexOf(`&${e}`,a+1)}if(n=/[%+]/.test(t),!n)return}const s={};n??(n=/[%+]/.test(t));let i=t.indexOf("?",8);for(;i!==-1;){const a=t.indexOf("&",i+1);let d=t.indexOf("=",i);d>a&&a!==-1&&(d=-1);let c=t.slice(i+1,d===-1?a===-1?void 0:a:d);if(n&&(c=Ne(c)),i=a,c==="")continue;let l;d===-1?l="":(l=t.slice(d+1,a===-1?void 0:a),n&&(l=Ne(l))),r?(s[c]&&Array.isArray(s[c])||(s[c]=[]),s[c].push(l)):s[c]??(s[c]=l)}return e?s[e]:s},_t=ct,Tt=(t,e)=>ct(t,e,!0),lt=decodeURIComponent,Ye=t=>Be(t,lt),ce,O,N,ht,ut,We,W,Ze,dt=(Ze=class{constructor(t,e="/",r=[[]]){v(this,N);p(this,"raw");v(this,ce);v(this,O);p(this,"routeIndex",0);p(this,"path");p(this,"bodyCache",{});v(this,W,t=>{const{bodyCache:e,raw:r}=this,n=e[t];if(n)return n;const s=Object.keys(e)[0];return s?e[s].then(i=>(s==="json"&&(i=JSON.stringify(i)),new Response(i)[t]())):e[t]=r[t]()});this.raw=t,this.path=e,f(this,O,r),f(this,ce,{})}param(t){return t?m(this,N,ht).call(this,t):m(this,N,ut).call(this)}query(t){return _t(this.url,t)}queries(t){return Tt(this.url,t)}header(t){if(t)return this.raw.headers.get(t)??void 0;const e={};return this.raw.headers.forEach((r,n)=>{e[n]=r}),e}async parseBody(t){var e;return(e=this.bodyCache).parsedBody??(e.parsedBody=await Ot(this,t))}json(){return o(this,W).call(this,"text").then(t=>JSON.parse(t))}text(){return o(this,W).call(this,"text")}arrayBuffer(){return o(this,W).call(this,"arrayBuffer")}blob(){return o(this,W).call(this,"blob")}formData(){return o(this,W).call(this,"formData")}addValidatedData(t,e){o(this,ce)[t]=e}valid(t){return o(this,ce)[t]}get url(){return this.raw.url}get method(){return this.raw.method}get[Ct](){return o(this,O)}get matchedRoutes(){return o(this,O)[0].map(([[,t]])=>t)}get routePath(){return o(this,O)[0].map(([[,t]])=>t)[this.routeIndex].path}},ce=new WeakMap,O=new WeakMap,N=new WeakSet,ht=function(t){const e=o(this,O)[0][this.routeIndex][1][t],r=m(this,N,We).call(this,e);return r&&/\%/.test(r)?Ye(r):r},ut=function(){const t={},e=Object.keys(o(this,O)[0][this.routeIndex][1]);for(const r of e){const n=m(this,N,We).call(this,o(this,O)[0][this.routeIndex][1][r]);n!==void 0&&(t[r]=/\%/.test(n)?Ye(n):n)}return t},We=function(t){return o(this,O)[1]?o(this,O)[1][t]:t},W=new WeakMap,Ze),Nt={Stringify:1},ft=async(t,e,r,n,s)=>{typeof t=="object"&&!(t instanceof String)&&(t instanceof Promise||(t=t.toString()),t instanceof Promise&&(t=await t));const i=t.callbacks;return i!=null&&i.length?(s?s[0]+=t:s=[t],Promise.all(i.map(d=>d({phase:e,buffer:s,context:n}))).then(d=>Promise.all(d.filter(Boolean).map(c=>ft(c,e,!1,n,s))).then(()=>s[0]))):Promise.resolve(t)},zt="text/plain; charset=UTF-8",ze=(t,e)=>({"Content-Type":t,...e}),Ae=(t,e)=>new Response(t,e),we,Ee,L,le,D,C,Re,de,he,G,Ce,Oe,B,oe,et,Wt=(et=class{constructor(t,e){v(this,B);v(this,we);v(this,Ee);p(this,"env",{});v(this,L);p(this,"finalized",!1);p(this,"error");v(this,le);v(this,D);v(this,C);v(this,Re);v(this,de);v(this,he);v(this,G);v(this,Ce);v(this,Oe);p(this,"render",(...t)=>(o(this,de)??f(this,de,e=>this.html(e)),o(this,de).call(this,...t)));p(this,"setLayout",t=>f(this,Re,t));p(this,"getLayout",()=>o(this,Re));p(this,"setRenderer",t=>{f(this,de,t)});p(this,"header",(t,e,r)=>{this.finalized&&f(this,C,Ae(o(this,C).body,o(this,C)));const n=o(this,C)?o(this,C).headers:o(this,G)??f(this,G,new Headers);e===void 0?n.delete(t):r!=null&&r.append?n.append(t,e):n.set(t,e)});p(this,"status",t=>{f(this,le,t)});p(this,"set",(t,e)=>{o(this,L)??f(this,L,new Map),o(this,L).set(t,e)});p(this,"get",t=>o(this,L)?o(this,L).get(t):void 0);p(this,"newResponse",(...t)=>m(this,B,oe).call(this,...t));p(this,"body",(t,e,r)=>m(this,B,oe).call(this,t,e,r));p(this,"text",(t,e,r)=>!o(this,G)&&!o(this,le)&&!e&&!r&&!this.finalized?new Response(t):m(this,B,oe).call(this,t,e,ze(zt,r)));p(this,"json",(t,e,r)=>m(this,B,oe).call(this,JSON.stringify(t),e,ze("application/json",r)));p(this,"html",(t,e,r)=>{const n=s=>m(this,B,oe).call(this,s,e,ze("text/html; charset=UTF-8",r));return typeof t=="object"?ft(t,Nt.Stringify,!1,{}).then(n):n(t)});p(this,"redirect",(t,e)=>{const r=String(t);return this.header("Location",/[^\x00-\xFF]/.test(r)?encodeURI(r):r),this.newResponse(null,e??302)});p(this,"notFound",()=>(o(this,he)??f(this,he,()=>Ae()),o(this,he).call(this,this)));f(this,we,t),e&&(f(this,D,e.executionCtx),this.env=e.env,f(this,he,e.notFoundHandler),f(this,Oe,e.path),f(this,Ce,e.matchResult))}get req(){return o(this,Ee)??f(this,Ee,new dt(o(this,we),o(this,Oe),o(this,Ce))),o(this,Ee)}get event(){if(o(this,D)&&"respondWith"in o(this,D))return o(this,D);throw Error("This context has no FetchEvent")}get executionCtx(){if(o(this,D))return o(this,D);throw Error("This context has no ExecutionContext")}get res(){return o(this,C)||f(this,C,Ae(null,{headers:o(this,G)??f(this,G,new Headers)}))}set res(t){if(o(this,C)&&t){t=Ae(t.body,t);for(const[e,r]of o(this,C).headers.entries())if(e!=="content-type")if(e==="set-cookie"){const n=o(this,C).headers.getSetCookie();t.headers.delete("set-cookie");for(const s of n)t.headers.append("set-cookie",s)}else t.headers.set(e,r)}f(this,C,t),this.finalized=!0}get var(){return o(this,L)?Object.fromEntries(o(this,L)):{}}},we=new WeakMap,Ee=new WeakMap,L=new WeakMap,le=new WeakMap,D=new WeakMap,C=new WeakMap,Re=new WeakMap,de=new WeakMap,he=new WeakMap,G=new WeakMap,Ce=new WeakMap,Oe=new WeakMap,B=new WeakSet,oe=function(t,e,r){const n=o(this,C)?new Headers(o(this,C).headers):o(this,G)??new Headers;if(typeof e=="object"&&"headers"in e){const i=e.headers instanceof Headers?e.headers:new Headers(e.headers);for(const[a,d]of i)a.toLowerCase()==="set-cookie"?n.append(a,d):n.set(a,d)}if(r)for(const[i,a]of Object.entries(r))if(typeof a=="string")n.set(i,a);else{n.delete(i);for(const d of a)n.append(i,d)}const s=typeof e=="number"?e:(e==null?void 0:e.status)??o(this,le);return Ae(t,{status:s,headers:n})},et),b="ALL",Bt="all",Ft=["get","post","put","delete","options","patch"],pt="Can not add a route since the matcher is already built.",gt=class extends Error{},qt="__COMPOSED_HANDLER",Ut=t=>t.text("404 Not Found",404),Xe=(t,e)=>{if("getResponse"in t){const r=t.getResponse();return e.newResponse(r.body,r)}return console.error(t),e.text("Internal Server Error",500)},P,y,vt,S,V,Se,$e,ue,Kt=(ue=class{constructor(e={}){v(this,y);p(this,"get");p(this,"post");p(this,"put");p(this,"delete");p(this,"options");p(this,"patch");p(this,"all");p(this,"on");p(this,"use");p(this,"router");p(this,"getPath");p(this,"_basePath","/");v(this,P,"/");p(this,"routes",[]);v(this,S,Ut);p(this,"errorHandler",Xe);p(this,"onError",e=>(this.errorHandler=e,this));p(this,"notFound",e=>(f(this,S,e),this));p(this,"fetch",(e,...r)=>m(this,y,$e).call(this,e,r[1],r[0],e.method));p(this,"request",(e,r,n,s)=>e instanceof Request?this.fetch(r?new Request(e,r):e,n,s):(e=e.toString(),this.fetch(new Request(/^https?:\/\//.test(e)?e:`http://localhost${ie("/",e)}`,r),n,s)));p(this,"fire",()=>{addEventListener("fetch",e=>{e.respondWith(m(this,y,$e).call(this,e.request,e,void 0,e.request.method))})});[...Ft,Bt].forEach(i=>{this[i]=(a,...d)=>(typeof a=="string"?f(this,P,a):m(this,y,V).call(this,i,o(this,P),a),d.forEach(c=>{m(this,y,V).call(this,i,o(this,P),c)}),this)}),this.on=(i,a,...d)=>{for(const c of[a].flat()){f(this,P,c);for(const l of[i].flat())d.map(h=>{m(this,y,V).call(this,l.toUpperCase(),o(this,P),h)})}return this},this.use=(i,...a)=>(typeof i=="string"?f(this,P,i):(f(this,P,"*"),a.unshift(i)),a.forEach(d=>{m(this,y,V).call(this,b,o(this,P),d)}),this);const{strict:n,...s}=e;Object.assign(this,s),this.getPath=n??!0?e.getPath??ot:Dt}route(e,r){const n=this.basePath(e);return r.routes.map(s=>{var a;let i;r.errorHandler===Xe?i=s.handler:(i=async(d,c)=>(await Ge([],r.errorHandler)(d,()=>s.handler(d,c))).res,i[qt]=s.handler),m(a=n,y,V).call(a,s.method,s.path,i)}),this}basePath(e){const r=m(this,y,vt).call(this);return r._basePath=ie(this._basePath,e),r}mount(e,r,n){let s,i;n&&(typeof n=="function"?i=n:(i=n.optionHandler,n.replaceRequest===!1?s=c=>c:s=n.replaceRequest));const a=i?c=>{const l=i(c);return Array.isArray(l)?l:[l]}:c=>{let l;try{l=c.executionCtx}catch{}return[c.env,l]};s||(s=(()=>{const c=ie(this._basePath,e),l=c==="/"?0:c.length;return h=>{const u=new URL(h.url);return u.pathname=u.pathname.slice(l)||"/",new Request(u,h)}})());const d=async(c,l)=>{const h=await r(s(c.req.raw),...a(c));if(h)return h;await l()};return m(this,y,V).call(this,b,ie(e,"*"),d),this}},P=new WeakMap,y=new WeakSet,vt=function(){const e=new ue({router:this.router,getPath:this.getPath});return e.errorHandler=this.errorHandler,f(e,S,o(this,S)),e.routes=this.routes,e},S=new WeakMap,V=function(e,r,n){e=e.toUpperCase(),r=ie(this._basePath,r);const s={basePath:this._basePath,path:r,method:e,handler:n};this.router.add(e,r,[n,s]),this.routes.push(s)},Se=function(e,r){if(e instanceof Error)return this.errorHandler(e,r);throw e},$e=function(e,r,n,s){if(s==="HEAD")return(async()=>new Response(null,await m(this,y,$e).call(this,e,r,n,"GET")))();const i=this.getPath(e,{env:n}),a=this.router.match(s,i),d=new Wt(e,{path:i,matchResult:a,env:n,executionCtx:r,notFoundHandler:o(this,S)});if(a[0].length===1){let l;try{l=a[0][0][0][0](d,async()=>{d.res=await o(this,S).call(this,d)})}catch(h){return m(this,y,Se).call(this,h,d)}return l instanceof Promise?l.then(h=>h||(d.finalized?d.res:o(this,S).call(this,d))).catch(h=>m(this,y,Se).call(this,h,d)):l??o(this,S).call(this,d)}const c=Ge(a[0],this.errorHandler,o(this,S));return(async()=>{try{const l=await c(d);if(!l.finalized)throw new Error("Context is not finalized. Did you forget to return a Response object or `await next()`?");return l.res}catch(l){return m(this,y,Se).call(this,l,d)}})()},ue),mt=[];function Vt(t,e){const r=this.buildAllMatchers(),n=(s,i)=>{const a=r[s]||r[b],d=a[2][i];if(d)return d;const c=i.match(a[0]);if(!c)return[[],mt];const l=c.indexOf("",1);return[a[1][l],c]};return this.match=n,n(t,e)}var ke="[^/]+",be=".*",ye="(?:|/.*)",ae=Symbol(),Jt=new Set(".\\+*[^]$()");function Gt(t,e){return t.length===1?e.length===1?t<e?-1:1:-1:e.length===1||t===be||t===ye?1:e===be||e===ye?-1:t===ke?1:e===ke?-1:t.length===e.length?t<e?-1:1:e.length-t.length}var Y,X,$,ee,Yt=(ee=class{constructor(){v(this,Y);v(this,X);v(this,$,Object.create(null))}insert(e,r,n,s,i){if(e.length===0){if(o(this,Y)!==void 0)throw ae;if(i)return;f(this,Y,r);return}const[a,...d]=e,c=a==="*"?d.length===0?["","",be]:["","",ke]:a==="/*"?["","",ye]:a.match(/^\:([^\{\}]+)(?:\{(.+)\})?$/);let l;if(c){const h=c[1];let u=c[2]||ke;if(h&&c[2]&&(u===".*"||(u=u.replace(/^\((?!\?:)(?=[^)]+\)$)/,"(?:"),/\((?!\?:)/.test(u))))throw ae;if(l=o(this,$)[u],!l){if(Object.keys(o(this,$)).some(g=>g!==be&&g!==ye))throw ae;if(i)return;l=o(this,$)[u]=new ee,h!==""&&f(l,X,s.varIndex++)}!i&&h!==""&&n.push([h,o(l,X)])}else if(l=o(this,$)[a],!l){if(Object.keys(o(this,$)).some(h=>h.length>1&&h!==be&&h!==ye))throw ae;if(i)return;l=o(this,$)[a]=new ee}l.insert(d,r,n,s,i)}buildRegExpStr(){const r=Object.keys(o(this,$)).sort(Gt).map(n=>{const s=o(this,$)[n];return(typeof o(s,X)=="number"?`(${n})@${o(s,X)}`:Jt.has(n)?`\\${n}`:n)+s.buildRegExpStr()});return typeof o(this,Y)=="number"&&r.unshift(`#${o(this,Y)}`),r.length===0?"":r.length===1?r[0]:"(?:"+r.join("|")+")"}},Y=new WeakMap,X=new WeakMap,$=new WeakMap,ee),Me,je,tt,Xt=(tt=class{constructor(){v(this,Me,{varIndex:0});v(this,je,new Yt)}insert(t,e,r){const n=[],s=[];for(let a=0;;){let d=!1;if(t=t.replace(/\{[^}]+\}/g,c=>{const l=`@\\${a}`;return s[a]=[l,c],a++,d=!0,l}),!d)break}const i=t.match(/(?::[^\/]+)|(?:\/\*$)|./g)||[];for(let a=s.length-1;a>=0;a--){const[d]=s[a];for(let c=i.length-1;c>=0;c--)if(i[c].indexOf(d)!==-1){i[c]=i[c].replace(d,s[a][1]);break}}return o(this,je).insert(i,e,n,o(this,Me),r),n}buildRegExp(){let t=o(this,je).buildRegExpStr();if(t==="")return[/^$/,[],[]];let e=0;const r=[],n=[];return t=t.replace(/#(\d+)|@(\d+)|\.\*\$/g,(s,i,a)=>i!==void 0?(r[++e]=Number(i),"$()"):(a!==void 0&&(n[Number(a)]=++e),"")),[new RegExp(`^${t}`),r,n]}},Me=new WeakMap,je=new WeakMap,tt),Qt=[/^$/,[],Object.create(null)],He=Object.create(null);function At(t){return He[t]??(He[t]=new RegExp(t==="*"?"":`^${t.replace(/\/\*$|([.\\+*[^\]$()])/g,(e,r)=>r?`\\${r}`:"(?:|/.*)")}$`))}function Zt(){He=Object.create(null)}function er(t){var l;const e=new Xt,r=[];if(t.length===0)return Qt;const n=t.map(h=>[!/\*|\/:/.test(h[0]),...h]).sort(([h,u],[g,A])=>h?1:g?-1:u.length-A.length),s=Object.create(null);for(let h=0,u=-1,g=n.length;h<g;h++){const[A,E,k]=n[h];A?s[E]=[k.map(([H])=>[H,Object.create(null)]),mt]:u++;let j;try{j=e.insert(E,u,A)}catch(H){throw H===ae?new gt(E):H}A||(r[u]=k.map(([H,x])=>{const M=Object.create(null);for(x-=1;x>=0;x--){const[ge,De]=j[x];M[ge]=De}return[H,M]}))}const[i,a,d]=e.buildRegExp();for(let h=0,u=r.length;h<u;h++)for(let g=0,A=r[h].length;g<A;g++){const E=(l=r[h][g])==null?void 0:l[1];if(!E)continue;const k=Object.keys(E);for(let j=0,H=k.length;j<H;j++)E[k[j]]=d[E[k[j]]]}const c=[];for(const h in a)c[h]=r[a[h]];return[i,c,s]}function se(t,e){if(t){for(const r of Object.keys(t).sort((n,s)=>s.length-n.length))if(At(r).test(e))return[...t[r]]}}var F,q,Ie,xt,rt,tr=(rt=class{constructor(){v(this,Ie);p(this,"name","RegExpRouter");v(this,F);v(this,q);p(this,"match",Vt);f(this,F,{[b]:Object.create(null)}),f(this,q,{[b]:Object.create(null)})}add(t,e,r){var d;const n=o(this,F),s=o(this,q);if(!n||!s)throw new Error(pt);n[t]||[n,s].forEach(c=>{c[t]=Object.create(null),Object.keys(c[b]).forEach(l=>{c[t][l]=[...c[b][l]]})}),e==="/*"&&(e="*");const i=(e.match(/\/:/g)||[]).length;if(/\*$/.test(e)){const c=At(e);t===b?Object.keys(n).forEach(l=>{var h;(h=n[l])[e]||(h[e]=se(n[l],e)||se(n[b],e)||[])}):(d=n[t])[e]||(d[e]=se(n[t],e)||se(n[b],e)||[]),Object.keys(n).forEach(l=>{(t===b||t===l)&&Object.keys(n[l]).forEach(h=>{c.test(h)&&n[l][h].push([r,i])})}),Object.keys(s).forEach(l=>{(t===b||t===l)&&Object.keys(s[l]).forEach(h=>c.test(h)&&s[l][h].push([r,i]))});return}const a=at(e)||[e];for(let c=0,l=a.length;c<l;c++){const h=a[c];Object.keys(s).forEach(u=>{var g;(t===b||t===u)&&((g=s[u])[h]||(g[h]=[...se(n[u],h)||se(n[b],h)||[]]),s[u][h].push([r,i-l+c+1]))})}}buildAllMatchers(){const t=Object.create(null);return Object.keys(o(this,q)).concat(Object.keys(o(this,F))).forEach(e=>{t[e]||(t[e]=m(this,Ie,xt).call(this,e))}),f(this,F,f(this,q,void 0)),Zt(),t}},F=new WeakMap,q=new WeakMap,Ie=new WeakSet,xt=function(t){const e=[];let r=t===b;return[o(this,F),o(this,q)].forEach(n=>{const s=n[t]?Object.keys(n[t]).map(i=>[i,n[t][i]]):[];s.length!==0?(r||(r=!0),e.push(...s)):t!==b&&e.push(...Object.keys(n[b]).map(i=>[i,n[b][i]]))}),r?er(e):null},rt),U,_,nt,rr=(nt=class{constructor(t){p(this,"name","SmartRouter");v(this,U,[]);v(this,_,[]);f(this,U,t.routers)}add(t,e,r){if(!o(this,_))throw new Error(pt);o(this,_).push([t,e,r])}match(t,e){if(!o(this,_))throw new Error("Fatal error");const r=o(this,U),n=o(this,_),s=r.length;let i=0,a;for(;i<s;i++){const d=r[i];try{for(let c=0,l=n.length;c<l;c++)d.add(...n[c]);a=d.match(t,e)}catch(c){if(c instanceof gt)continue;throw c}this.match=d.match.bind(d),f(this,U,[d]),f(this,_,void 0);break}if(i===s)throw new Error("Fatal error");return this.name=`SmartRouter + ${this.activeRouter.name}`,a}get activeRouter(){if(o(this,_)||o(this,U).length!==1)throw new Error("No active router has been determined yet.");return o(this,U)[0]}},U=new WeakMap,_=new WeakMap,nt),xe=Object.create(null),nr=t=>{for(const e in t)return!0;return!1},K,R,Q,fe,w,T,J,pe,sr=(pe=class{constructor(e,r,n){v(this,T);v(this,K);v(this,R);v(this,Q);v(this,fe,0);v(this,w,xe);if(f(this,R,n||Object.create(null)),f(this,K,[]),e&&r){const s=Object.create(null);s[e]={handler:r,possibleKeys:[],score:0},f(this,K,[s])}f(this,Q,[])}insert(e,r,n){f(this,fe,++Je(this,fe)._);let s=this;const i=Ht(r),a=[];for(let d=0,c=i.length;d<c;d++){const l=i[d],h=i[d+1],u=It(l,h),g=Array.isArray(u)?u[0]:l;if(g in o(s,R)){s=o(s,R)[g],u&&a.push(u[1]);continue}o(s,R)[g]=new pe,u&&(o(s,Q).push(u),a.push(u[1])),s=o(s,R)[g]}return o(s,K).push({[e]:{handler:n,possibleKeys:a.filter((d,c,l)=>l.indexOf(d)===c),score:o(this,fe)}}),s}search(e,r){var h;const n=[];f(this,w,xe);let i=[this];const a=it(r),d=[],c=a.length;let l=null;for(let u=0;u<c;u++){const g=a[u],A=u===c-1,E=[];for(let j=0,H=i.length;j<H;j++){const x=i[j],M=o(x,R)[g];M&&(f(M,w,o(x,w)),A?(o(M,R)["*"]&&m(this,T,J).call(this,n,o(M,R)["*"],e,o(x,w)),m(this,T,J).call(this,n,M,e,o(x,w))):E.push(M));for(let ge=0,De=o(x,Q).length;ge<De;ge++){const Ue=o(x,Q)[ge],z=o(x,w)===xe?{}:{...o(x,w)};if(Ue==="*"){const re=o(x,R)["*"];re&&(m(this,T,J).call(this,n,re,e,o(x,w)),f(re,w,z),E.push(re));continue}const[wt,Ke,ve]=Ue;if(!g&&!(ve instanceof RegExp))continue;const I=o(x,R)[wt];if(ve instanceof RegExp){if(l===null){l=new Array(c);let ne=r[0]==="/"?1:0;for(let me=0;me<c;me++)l[me]=ne,ne+=a[me].length+1}const re=r.substring(l[u]),_e=ve.exec(re);if(_e){if(z[Ke]=_e[0],m(this,T,J).call(this,n,I,e,o(x,w),z),nr(o(I,R))){f(I,w,z);const ne=((h=_e[0].match(/\//))==null?void 0:h.length)??0;(d[ne]||(d[ne]=[])).push(I)}continue}}(ve===!0||ve.test(g))&&(z[Ke]=g,A?(m(this,T,J).call(this,n,I,e,z,o(x,w)),o(I,R)["*"]&&m(this,T,J).call(this,n,o(I,R)["*"],e,z,o(x,w))):(f(I,w,z),E.push(I)))}}const k=d.shift();i=k?E.concat(k):E}return n.length>1&&n.sort((u,g)=>u.score-g.score),[n.map(({handler:u,params:g})=>[u,g])]}},K=new WeakMap,R=new WeakMap,Q=new WeakMap,fe=new WeakMap,w=new WeakMap,T=new WeakSet,J=function(e,r,n,s,i){for(let a=0,d=o(r,K).length;a<d;a++){const c=o(r,K)[a],l=c[n]||c[b],h={};if(l!==void 0&&(l.params=Object.create(null),e.push(l),s!==xe||i&&i!==xe))for(let u=0,g=l.possibleKeys.length;u<g;u++){const A=l.possibleKeys[u],E=h[l.score];l.params[A]=i!=null&&i[A]&&!E?i[A]:s[A]??(i==null?void 0:i[A]),h[l.score]=!0}}},pe),Z,st,ir=(st=class{constructor(){p(this,"name","TrieRouter");v(this,Z);f(this,Z,new sr)}add(t,e,r){const n=at(e);if(n){for(let s=0,i=n.length;s<i;s++)o(this,Z).insert(t,n[s],r);return}o(this,Z).insert(t,e,r)}match(t,e){return o(this,Z).search(t,e)}},Z=new WeakMap,st),bt=class extends Kt{constructor(t={}){super(t),this.router=t.router??new rr({routers:[new tr,new ir]})}},or=t=>{const r={...{origin:"*",allowMethods:["GET","HEAD","PUT","POST","DELETE","PATCH"],allowHeaders:[],exposeHeaders:[]},...t},n=(i=>typeof i=="string"?i==="*"?()=>i:a=>i===a?a:null:typeof i=="function"?i:a=>i.includes(a)?a:null)(r.origin),s=(i=>typeof i=="function"?i:Array.isArray(i)?()=>i:()=>[])(r.allowMethods);return async function(a,d){var h;function c(u,g){a.res.headers.set(u,g)}const l=await n(a.req.header("origin")||"",a);if(l&&c("Access-Control-Allow-Origin",l),r.credentials&&c("Access-Control-Allow-Credentials","true"),(h=r.exposeHeaders)!=null&&h.length&&c("Access-Control-Expose-Headers",r.exposeHeaders.join(",")),a.req.method==="OPTIONS"){r.origin!=="*"&&c("Vary","Origin"),r.maxAge!=null&&c("Access-Control-Max-Age",r.maxAge.toString());const u=await s(a.req.header("origin")||"",a);u.length&&c("Access-Control-Allow-Methods",u.join(","));let g=r.allowHeaders;if(!(g!=null&&g.length)){const A=a.req.header("Access-Control-Request-Headers");A&&(g=A.split(/\s*,\s*/))}return g!=null&&g.length&&(c("Access-Control-Allow-Headers",g.join(",")),a.res.headers.append("Vary","Access-Control-Request-Headers")),a.res.headers.delete("Content-Length"),a.res.headers.delete("Content-Type"),new Response(null,{headers:a.res.headers,status:204,statusText:"No Content"})}await d(),r.origin!=="*"&&a.header("Vary","Origin",{append:!0})}};function Le(t,e="JWC",r=""){return`<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${e}</title>
    <link rel="stylesheet" href="/css/common.css">
    <style>
        /* 히어로 슬라이더 스타일 */
        .hero {
            position: relative;
            width: 100%;
            height: 600px;
            overflow: hidden;
            background: #000;
        }
        
        .hero-slider {
            position: relative;
            width: 100%;
            height: 100%;
        }
        
        .hero-slide {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            opacity: 0;
            transition: opacity 1s ease-in-out;
        }
        
        .hero-slide.active {
            opacity: 1;
        }
        
        .hero-slide img {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }
        
        .hero-text-overlay {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            text-align: center;
            color: white;
            z-index: 10;
            width: 90%;
            max-width: 800px;
        }
        
        .hero-text-overlay h1 {
            font-size: 3rem;
            margin-bottom: 1rem;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.7);
        }
        
        .hero-text-overlay p {
            font-size: 1.5rem;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.7);
        }
        
        .slider-nav {
            position: absolute;
            bottom: 30px;
            left: 50%;
            transform: translateX(-50%);
            display: flex;
            gap: 10px;
            z-index: 20;
        }
        
        .slider-dot {
            width: 12px;
            height: 12px;
            border-radius: 50%;
            background: rgba(255,255,255,0.5);
            cursor: pointer;
            transition: background 0.3s;
        }
        
        .slider-dot.active {
            background: white;
        }
        
        /* 페이지 히어로 스타일 */
        .page-hero {
            width: 100%;
            height: 400px;
            background-size: cover;
            background-position: center;
            background-color: #333;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        
        .page-hero h1 {
            color: white;
            font-size: 3rem;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.7);
        }
    </style>
</head>
<body>
    ${ar(r)}
    ${t}
    ${cr()}
    <script>
        // 히어로 슬라이더 자동 재생
        let currentSlide = 0;
        const slides = document.querySelectorAll('.hero-slide');
        const dots = document.querySelectorAll('.slider-dot');
        
        if (slides.length > 0) {
            function showSlide(index) {
                slides.forEach((slide, i) => {
                    slide.classList.toggle('active', i === index);
                });
                dots.forEach((dot, i) => {
                    dot.classList.toggle('active', i === index);
                });
            }
            
            function nextSlide() {
                currentSlide = (currentSlide + 1) % slides.length;
                showSlide(currentSlide);
            }
            
            // 초기 슬라이드 표시
            showSlide(0);
            
            // 자동 재생 (5초마다)
            setInterval(nextSlide, 5000);
            
            // 점 클릭 이벤트
            dots.forEach((dot, index) => {
                dot.addEventListener('click', () => {
                    currentSlide = index;
                    showSlide(currentSlide);
                });
            });
        }
        
        // 모바일 메뉴
        const mobileMenuBtn = document.getElementById('mobileMenuBtn');
        const navMenu = document.getElementById('navMenu');
        
        if (mobileMenuBtn && navMenu) {
            mobileMenuBtn.addEventListener('click', () => {
                navMenu.classList.toggle('active');
            });
        }
    <\/script>
</body>
</html>`}function ar(t){const e=["Home","About","Products","Contact"],r={Home:"/",About:"/about",Products:"/products",Contact:"/contact"};return`
    <header>
        <div class="container">
            <div class="header-content">
                <div class="logo">
                    <a href="/">
                        <img src="https://www.genspark.ai/api/files/s/klrrvagw" alt="">
                    </a>
                </div>
                <nav class="nav-menu" id="navMenu">
                    ${e.map(n=>`<a href="${r[n]}" class="nav-link ${t===n?"active":""}">${n}</a>`).join(`
                    `)}
                </nav>
                <div class="header-actions">
                    <button class="mobile-menu-btn" id="mobileMenuBtn">
                        <span></span>
                        <span></span>
                        <span></span>
                    </button>
                </div>
            </div>
        </div>
    </header>`}function cr(){return`
    <footer>
        <div class="container">
            <p>&copy; 2024 JWC. All rights reserved.</p>
            <a href="/admin-login.html" style="opacity: 0.3; font-size: 12px; color: #999;">
                <i class="fas fa-cog"></i>
            </a>
        </div>
    </footer>`}function lr(t,e){return!t||t.length===0?`
    <section class="hero">
        <div class="hero-slider">
            <div class="hero-slide active">
                <div style="width: 100%; height: 100%; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);"></div>
            </div>
        </div>
        ${e?`
        <div class="hero-text-overlay">
            <h1>${e.title||"Welcome to JWC"}</h1>
            <p>${e.subtitle||"Premium Cosmetics"}</p>
        </div>
        `:""}
    </section>`:`
    <section class="hero">
        <div class="hero-slider">
            ${t.map((r,n)=>`
            <div class="hero-slide ${n===0?"active":""}">
                <img src="${r.data}" alt="Hero ${n+1}">
            </div>
            `).join("")}
        </div>
        ${e?`
        <div class="hero-text-overlay">
            <h1>${e.title||"Welcome to JWC"}</h1>
            <p>${e.subtitle||"Premium Cosmetics"}</p>
        </div>
        `:""}
        ${t.length>1?`
        <div class="slider-nav">
            ${t.map((r,n)=>`
            <div class="slider-dot ${n===0?"active":""}"></div>
            `).join("")}
        </div>
        `:""}
    </section>`}function Fe(t,e){return`
    <section class="page-hero" style="${e?`background-image: url('${e}');`:"background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);"}">
        <h1>${t}</h1>
    </section>`}function dr(){return`
    <!-- Company Info Section -->
    <section class="content-section" style="padding: 80px 20px; background: #f5f5f5;">
        <div class="container">
            <div class="company-info">
                <div class="info-card">
                    <div class="info-icon">💡</div>
                    <h3>Innovation</h3>
                    <p>끊임없는 연구와 혁신으로 최고의 제품을 만듭니다.</p>
                </div>
                <div class="info-card">
                    <div class="info-icon">⭐</div>
                    <h3>Quality</h3>
                    <p>엄격한 품질 관리로 신뢰할 수 있는 제품을 제공합니다.</p>
                </div>
                <div class="info-card">
                    <div class="info-icon">🤝</div>
                    <h3>Trust</h3>
                    <p>고객과의 신뢰를 최우선으로 생각합니다.</p>
                </div>
            </div>
        </div>
    </section>
    
    <style>
        .company-info {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 30px;
        }
        
        .info-card {
            background: white;
            padding: 40px;
            border-radius: 10px;
            text-align: center;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            transition: transform 0.3s;
        }
        
        .info-card:hover {
            transform: translateY(-5px);
        }
        
        .info-icon {
            font-size: 3rem;
            margin-bottom: 20px;
        }
        
        .info-card h3 {
            font-size: 1.5rem;
            margin-bottom: 15px;
            color: #333;
        }
        
        .info-card p {
            color: #666;
            line-height: 1.6;
        }
    </style>`}function hr(){return`
    <!-- About Content Section -->
    <section class="content-section" style="padding: 80px 20px;">
        <div class="container">
            <div class="about-grid">
                <div class="about-card">
                    <h2>우리의 비전</h2>
                    <p>JWC는 고객의 아름다움과 건강을 최우선으로 생각하는 화장품 회사입니다. 
                    자연에서 얻은 순수한 성분과 첨단 과학기술을 결합하여, 
                    피부에 안전하면서도 효과적인 제품을 만들어갑니다.</p>
                </div>
                
                <div class="about-card">
                    <h2>우리의 미션</h2>
                    <p>모든 사람이 자신의 피부 타입과 고민에 맞는 완벽한 솔루션을 찾을 수 있도록, 
                    다양하고 전문적인 제품 라인을 제공합니다. 
                    지속 가능한 뷰티를 추구하며, 환경을 생각하는 기업이 되겠습니다.</p>
                </div>
                
                <div class="about-card">
                    <h2>핵심 가치</h2>
                    <p>품질, 혁신, 신뢰. 이 세 가지 핵심 가치를 바탕으로 
                    고객 만족을 위해 끊임없이 노력합니다. 
                    엄격한 품질 관리와 지속적인 연구개발을 통해 
                    업계 최고의 제품을 만들어갑니다.</p>
                </div>
            </div>
        </div>
    </section>
    
    <style>
        .about-grid {
            display: grid;
            gap: 40px;
            max-width: 900px;
            margin: 0 auto;
        }
        
        .about-card {
            background: white;
            padding: 40px;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        
        .about-card h2 {
            color: #333;
            margin-bottom: 20px;
            font-size: 1.8rem;
        }
        
        .about-card p {
            color: #666;
            line-height: 1.8;
            font-size: 1.1rem;
        }
    </style>`}function ur(){return`
    <!-- Products Content Section -->
    <section class="content-section" style="padding: 80px 20px;">
        <div class="container">
            <div class="products-header">
                <h2>제품 카테고리</h2>
                <div class="filter-buttons">
                    <button class="filter-btn active">전체</button>
                    <button class="filter-btn">스킨케어</button>
                    <button class="filter-btn">메이크업</button>
                    <button class="filter-btn">바디케어</button>
                </div>
            </div>
            
            <div class="products-grid">
                <div class="product-placeholder">
                    <div class="placeholder-icon">📦</div>
                    <h3>제품 준비중</h3>
                    <p>관리자 페이지에서 제품을 추가해주세요.</p>
                </div>
            </div>
        </div>
    </section>
    
    <style>
        .products-header {
            text-align: center;
            margin-bottom: 50px;
        }
        
        .products-header h2 {
            font-size: 2.5rem;
            margin-bottom: 30px;
            color: #333;
        }
        
        .filter-buttons {
            display: flex;
            gap: 15px;
            justify-content: center;
            flex-wrap: wrap;
        }
        
        .filter-btn {
            padding: 10px 25px;
            border: 2px solid #333;
            background: white;
            color: #333;
            border-radius: 25px;
            cursor: pointer;
            font-size: 1rem;
            transition: all 0.3s;
        }
        
        .filter-btn:hover,
        .filter-btn.active {
            background: #333;
            color: white;
        }
        
        .products-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
            gap: 30px;
        }
        
        .product-placeholder {
            background: white;
            padding: 60px 20px;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            text-align: center;
            grid-column: 1 / -1;
        }
        
        .placeholder-icon {
            font-size: 4rem;
            margin-bottom: 20px;
        }
        
        .product-placeholder h3 {
            font-size: 1.5rem;
            margin-bottom: 10px;
            color: #333;
        }
        
        .product-placeholder p {
            color: #666;
        }
    </style>`}function fr(){return`
    <!-- Contact Content Section -->
    <section class="content-section" style="padding: 80px 20px;">
        <div class="container">
            <div class="contact-grid">
                <div class="contact-form">
                    <h2>문의하기</h2>
                    <form id="contactForm">
                        <div class="form-group">
                            <label for="name">이름</label>
                            <input type="text" id="name" name="name" required>
                        </div>
                        
                        <div class="form-group">
                            <label for="email">이메일</label>
                            <input type="email" id="email" name="email" required>
                        </div>
                        
                        <div class="form-group">
                            <label for="subject">제목</label>
                            <input type="text" id="subject" name="subject" required>
                        </div>
                        
                        <div class="form-group">
                            <label for="message">메시지</label>
                            <textarea id="message" name="message" rows="6" required></textarea>
                        </div>
                        
                        <button type="submit" class="submit-btn">보내기</button>
                    </form>
                </div>
                
                <div class="contact-info">
                    <h2>연락처</h2>
                    <div class="info-item">
                        <div class="info-icon">📍</div>
                        <div>
                            <h3>주소</h3>
                            <p>서울특별시 강남구</p>
                        </div>
                    </div>
                    
                    <div class="info-item">
                        <div class="info-icon">📞</div>
                        <div>
                            <h3>전화</h3>
                            <p>02-1234-5678</p>
                        </div>
                    </div>
                    
                    <div class="info-item">
                        <div class="info-icon">✉️</div>
                        <div>
                            <h3>이메일</h3>
                            <p>contact@jwc.com</p>
                        </div>
                    </div>
                    
                    <div class="info-item">
                        <div class="info-icon">🕐</div>
                        <div>
                            <h3>운영시간</h3>
                            <p>평일 09:00 - 18:00</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
    
    <style>
        .contact-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 50px;
            max-width: 1200px;
            margin: 0 auto;
        }
        
        @media (max-width: 768px) {
            .contact-grid {
                grid-template-columns: 1fr;
            }
        }
        
        .contact-form,
        .contact-info {
            background: white;
            padding: 40px;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        
        .contact-form h2,
        .contact-info h2 {
            font-size: 2rem;
            margin-bottom: 30px;
            color: #333;
        }
        
        .form-group {
            margin-bottom: 20px;
        }
        
        .form-group label {
            display: block;
            margin-bottom: 8px;
            color: #333;
            font-weight: 500;
        }
        
        .form-group input,
        .form-group textarea {
            width: 100%;
            padding: 12px;
            border: 1px solid #ddd;
            border-radius: 5px;
            font-size: 1rem;
            font-family: inherit;
        }
        
        .form-group input:focus,
        .form-group textarea:focus {
            outline: none;
            border-color: #667eea;
        }
        
        .submit-btn {
            width: 100%;
            padding: 15px;
            background: #333;
            color: white;
            border: none;
            border-radius: 5px;
            font-size: 1.1rem;
            cursor: pointer;
            transition: background 0.3s;
        }
        
        .submit-btn:hover {
            background: #555;
        }
        
        .info-item {
            display: flex;
            gap: 20px;
            margin-bottom: 30px;
        }
        
        .info-icon {
            font-size: 2rem;
            flex-shrink: 0;
        }
        
        .info-item h3 {
            font-size: 1.2rem;
            margin-bottom: 5px;
            color: #333;
        }
        
        .info-item p {
            color: #666;
        }
    </style>
    
    <script>
        document.getElementById('contactForm').addEventListener('submit', (e) => {
            e.preventDefault();
            alert('문의가 접수되었습니다. 빠른 시일 내에 답변 드리겠습니다.');
            e.target.reset();
        });
    <\/script>`}async function pr(t){try{const e=await t.list({prefix:"images:"}),r=[];for(const n of e.keys){const s=await t.get(n.name,"json");s&&s.type==="heroSlider"&&r.push(s)}return r.sort((n,s)=>(n.order_index||0)-(s.order_index||0))}catch(e){return console.error("Hero images fetch error:",e),[]}}async function qe(t,e){try{const r=await t.list({prefix:"images:"});for(const n of r.keys){const s=await t.get(n.name,"json");if(s&&s.type==="pageHero"&&s.page===e)return s}return null}catch(r){return console.error("Page hero fetch error:",r),null}}async function gr(t,e,r=null){try{const n=await t.list({prefix:"settings:"});for(const s of n.keys){const i=await t.get(s.name,"json");if(i&&i.key===e)try{return JSON.parse(i.value)}catch{return i.value}}return r}catch(n){return console.error("Setting fetch error:",n),r}}const te=new bt;te.use("/api/*",or());const vr="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAABAAAAAI8CAYAAABvddlvAAAACXBIWXMAAC4jAAAuIwF4pT92AAAgAElEQVR4nOy9B7BlV3nn+1vnnnvv7XxvzjmnVlBACMkkjAkGY2zjHMDGGAw2wcYYYxtjG2OMbYwxtrGNMcYYY4wxJgcJJJCQhBAgkBASQgiEhISE0u10u/Ptc885e633/d+99z3ddLp1u+vcvrerfWv12muv9a1vhf9a/7W+tRYAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA";te.get("/jwc-logo.png",async t=>{const e=vr.split(",")[1],r=atob(e),n=new Uint8Array(r.length);for(let s=0;s<r.length;s++)n[s]=r.charCodeAt(s);return new Response(n,{headers:{"Content-Type":"image/png","Cache-Control":"public, max-age=31536000"}})});te.get("/",async t=>{const e=await pr(t.env.KV),r=await gr(t.env.KV,"heroText",{title:"Welcome to JWC",subtitle:"Premium Cosmetics"}),n=lr(e,r)+dr(),s=Le(n,"JWC - Home","Home");return t.html(s)});te.get("/about",async t=>{const e=await qe(t.env.KV,"about"),r=Fe("About Us",e==null?void 0:e.data)+hr(),n=Le(r,"JWC - About","About");return t.html(n)});te.get("/products",async t=>{const e=await qe(t.env.KV,"products"),r=Fe("Our Products",e==null?void 0:e.data)+ur(),n=Le(r,"JWC - Products","Products");return t.html(n)});te.get("/contact",async t=>{const e=await qe(t.env.KV,"contact"),r=Fe("Contact Us",e==null?void 0:e.data)+fr(),n=Le(r,"JWC - Contact","Contact");return t.html(n)});const Qe=new bt,mr=Object.assign({"/src/index.tsx":te});let yt=!1;for(const[,t]of Object.entries(mr))t&&(Qe.route("/",t),Qe.notFound(t.notFoundHandler),yt=!0);if(!yt)throw new Error("Can't import modules from ['/src/index.tsx','/app/server.ts']");export{Qe as default};
