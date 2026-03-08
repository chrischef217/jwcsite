var Ot=Object.defineProperty;var Ve=e=>{throw TypeError(e)};var At=(e,t,r)=>t in e?Ot(e,t,{enumerable:!0,configurable:!0,writable:!0,value:r}):e[t]=r;var p=(e,t,r)=>At(e,typeof t!="symbol"?t+"":t,r),ze=(e,t,r)=>t.has(e)||Ve("Cannot "+r);var o=(e,t,r)=>(ze(e,t,"read from private field"),r?r.call(e):t.get(e)),m=(e,t,r)=>t.has(e)?Ve("Cannot add the same private member more than once"):t instanceof WeakSet?t.add(e):t.set(e,r),f=(e,t,r,n)=>(ze(e,t,"write to private field"),n?n.call(e,r):t.set(e,r),r),v=(e,t,r)=>(ze(e,t,"access private method"),r);var Ge=(e,t,r,n)=>({set _(s){f(e,t,s,r)},get _(){return o(e,t,n)}});var Xe=(e,t,r)=>(n,s)=>{let i=-1;return a(0);async function a(l){if(l<=i)throw new Error("next() called multiple times");i=l;let c,d=!1,h;if(e[l]?(h=e[l][0][0],n.req.routeIndex=l):h=l===e.length&&s||void 0,h)try{c=await h(n,()=>a(l+1))}catch(u){if(u instanceof Error&&t)n.error=u,c=await t(u,n),d=!0;else throw u}else n.finalized===!1&&r&&(c=await r(n));return c&&(n.finalized===!1||d)&&(n.res=c),n}},Pt=Symbol(),$t=async(e,t=Object.create(null))=>{const{all:r=!1,dot:n=!1}=t,i=(e instanceof ft?e.raw.headers:e.headers).get("Content-Type");return i!=null&&i.startsWith("multipart/form-data")||i!=null&&i.startsWith("application/x-www-form-urlencoded")?Tt(e,{all:r,dot:n}):{}};async function Tt(e,t){const r=await e.formData();return r?_t(r,t):{}}function _t(e,t){const r=Object.create(null);return e.forEach((n,s)=>{t.all||s.endsWith("[]")?Ht(r,s,n):r[s]=n}),t.dot&&Object.entries(r).forEach(([n,s])=>{n.includes(".")&&(Nt(r,n,s),delete r[n])}),r}var Ht=(e,t,r)=>{e[t]!==void 0?Array.isArray(e[t])?e[t].push(r):e[t]=[e[t],r]:t.endsWith("[]")?e[t]=[r]:e[t]=r},Nt=(e,t,r)=>{let n=e;const s=t.split(".");s.forEach((i,a)=>{a===s.length-1?n[i]=r:((!n[i]||typeof n[i]!="object"||Array.isArray(n[i])||n[i]instanceof File)&&(n[i]=Object.create(null)),n=n[i])})},at=e=>{const t=e.split("/");return t[0]===""&&t.shift(),t},kt=e=>{const{groups:t,path:r}=It(e),n=at(r);return Mt(n,t)},It=e=>{const t=[];return e=e.replace(/\{[^}]+\}/g,(r,n)=>{const s=`@${n}`;return t.push([s,r]),s}),{groups:t,path:e}},Mt=(e,t)=>{for(let r=t.length-1;r>=0;r--){const[n]=t[r];for(let s=e.length-1;s>=0;s--)if(e[s].includes(n)){e[s]=e[s].replace(n,t[r][1]);break}}return e},Pe={},Dt=(e,t)=>{if(e==="*")return"*";const r=e.match(/^\:([^\{\}]+)(?:\{(.+)\})?$/);if(r){const n=`${e}#${t}`;return Pe[n]||(r[2]?Pe[n]=t&&t[0]!==":"&&t[0]!=="*"?[n,r[1],new RegExp(`^${r[2]}(?=/${t})`)]:[e,r[1],new RegExp(`^${r[2]}$`)]:Pe[n]=[e,r[1],!0]),Pe[n]}return null},qe=(e,t)=>{try{return t(e)}catch{return e.replace(/(?:%[0-9A-Fa-f]{2})+/g,r=>{try{return t(r)}catch{return r}})}},ct=e=>qe(e,decodeURI),lt=e=>{const t=e.url,r=t.indexOf("/",t.indexOf(":")+4);let n=r;for(;n<t.length;n++){const s=t.charCodeAt(n);if(s===37){const i=t.indexOf("?",n),a=t.indexOf("#",n),l=i===-1?a===-1?void 0:a:a===-1?i:Math.min(i,a),c=t.slice(r,l);return ct(c.includes("%25")?c.replace(/%25/g,"%2525"):c)}else if(s===63||s===35)break}return t.slice(r,n)},zt=e=>{const t=lt(e);return t.length>1&&t.at(-1)==="/"?t.slice(0,-1):t},ie=(e,t,...r)=>(r.length&&(t=ie(t,...r)),`${(e==null?void 0:e[0])==="/"?"":"/"}${e}${t==="/"?"":`${(e==null?void 0:e.at(-1))==="/"?"":"/"}${(t==null?void 0:t[0])==="/"?t.slice(1):t}`}`),dt=e=>{if(e.charCodeAt(e.length-1)!==63||!e.includes(":"))return null;const t=e.split("/"),r=[];let n="";return t.forEach(s=>{if(s!==""&&!/\:/.test(s))n+="/"+s;else if(/\:/.test(s))if(/\?/.test(s)){r.length===0&&n===""?r.push("/"):r.push(n);const i=s.replace("?","");n+="/"+i,r.push(n)}else n+="/"+s}),r.filter((s,i,a)=>a.indexOf(s)===i)},Le=e=>/[%+]/.test(e)?(e.indexOf("+")!==-1&&(e=e.replace(/\+/g," ")),e.indexOf("%")!==-1?qe(e,ut):e):e,ht=(e,t,r)=>{let n;if(!r&&t&&!/[%+]/.test(t)){let a=e.indexOf("?",8);if(a===-1)return;for(e.startsWith(t,a+1)||(a=e.indexOf(`&${t}`,a+1));a!==-1;){const l=e.charCodeAt(a+t.length+1);if(l===61){const c=a+t.length+2,d=e.indexOf("&",c);return Le(e.slice(c,d===-1?void 0:d))}else if(l==38||isNaN(l))return"";a=e.indexOf(`&${t}`,a+1)}if(n=/[%+]/.test(e),!n)return}const s={};n??(n=/[%+]/.test(e));let i=e.indexOf("?",8);for(;i!==-1;){const a=e.indexOf("&",i+1);let l=e.indexOf("=",i);l>a&&a!==-1&&(l=-1);let c=e.slice(i+1,l===-1?a===-1?void 0:a:l);if(n&&(c=Le(c)),i=a,c==="")continue;let d;l===-1?d="":(d=e.slice(l+1,a===-1?void 0:a),n&&(d=Le(d))),r?(s[c]&&Array.isArray(s[c])||(s[c]=[]),s[c].push(d)):s[c]??(s[c]=d)}return t?s[t]:s},Lt=ht,Ft=(e,t)=>ht(e,t,!0),ut=decodeURIComponent,Ye=e=>qe(e,ut),ce,A,L,pt,gt,We,W,tt,ft=(tt=class{constructor(e,t="/",r=[[]]){m(this,L);p(this,"raw");m(this,ce);m(this,A);p(this,"routeIndex",0);p(this,"path");p(this,"bodyCache",{});m(this,W,e=>{const{bodyCache:t,raw:r}=this,n=t[e];if(n)return n;const s=Object.keys(t)[0];return s?t[s].then(i=>(s==="json"&&(i=JSON.stringify(i)),new Response(i)[e]())):t[e]=r[e]()});this.raw=e,this.path=t,f(this,A,r),f(this,ce,{})}param(e){return e?v(this,L,pt).call(this,e):v(this,L,gt).call(this)}query(e){return Lt(this.url,e)}queries(e){return Ft(this.url,e)}header(e){if(e)return this.raw.headers.get(e)??void 0;const t={};return this.raw.headers.forEach((r,n)=>{t[n]=r}),t}async parseBody(e){var t;return(t=this.bodyCache).parsedBody??(t.parsedBody=await $t(this,e))}json(){return o(this,W).call(this,"text").then(e=>JSON.parse(e))}text(){return o(this,W).call(this,"text")}arrayBuffer(){return o(this,W).call(this,"arrayBuffer")}blob(){return o(this,W).call(this,"blob")}formData(){return o(this,W).call(this,"formData")}addValidatedData(e,t){o(this,ce)[e]=t}valid(e){return o(this,ce)[e]}get url(){return this.raw.url}get method(){return this.raw.method}get[Pt](){return o(this,A)}get matchedRoutes(){return o(this,A)[0].map(([[,e]])=>e)}get routePath(){return o(this,A)[0].map(([[,e]])=>e)[this.routeIndex].path}},ce=new WeakMap,A=new WeakMap,L=new WeakSet,pt=function(e){const t=o(this,A)[0][this.routeIndex][1][e],r=v(this,L,We).call(this,t);return r&&/\%/.test(r)?Ye(r):r},gt=function(){const e={},t=Object.keys(o(this,A)[0][this.routeIndex][1]);for(const r of t){const n=v(this,L,We).call(this,o(this,A)[0][this.routeIndex][1][r]);n!==void 0&&(e[r]=/\%/.test(n)?Ye(n):n)}return e},We=function(e){return o(this,A)[1]?o(this,A)[1][e]:e},W=new WeakMap,tt),Wt={Stringify:1},mt=async(e,t,r,n,s)=>{typeof e=="object"&&!(e instanceof String)&&(e instanceof Promise||(e=e.toString()),e instanceof Promise&&(e=await e));const i=e.callbacks;return i!=null&&i.length?(s?s[0]+=e:s=[e],Promise.all(i.map(l=>l({phase:t,buffer:s,context:n}))).then(l=>Promise.all(l.filter(Boolean).map(c=>mt(c,t,!1,n,s))).then(()=>s[0]))):Promise.resolve(e)},qt="text/plain; charset=UTF-8",Fe=(e,t)=>({"Content-Type":e,...t}),xe=(e,t)=>new Response(e,t),Ee,je,I,le,M,R,Ce,de,he,X,Se,Re,q,oe,rt,Ut=(rt=class{constructor(e,t){m(this,q);m(this,Ee);m(this,je);p(this,"env",{});m(this,I);p(this,"finalized",!1);p(this,"error");m(this,le);m(this,M);m(this,R);m(this,Ce);m(this,de);m(this,he);m(this,X);m(this,Se);m(this,Re);p(this,"render",(...e)=>(o(this,de)??f(this,de,t=>this.html(t)),o(this,de).call(this,...e)));p(this,"setLayout",e=>f(this,Ce,e));p(this,"getLayout",()=>o(this,Ce));p(this,"setRenderer",e=>{f(this,de,e)});p(this,"header",(e,t,r)=>{this.finalized&&f(this,R,xe(o(this,R).body,o(this,R)));const n=o(this,R)?o(this,R).headers:o(this,X)??f(this,X,new Headers);t===void 0?n.delete(e):r!=null&&r.append?n.append(e,t):n.set(e,t)});p(this,"status",e=>{f(this,le,e)});p(this,"set",(e,t)=>{o(this,I)??f(this,I,new Map),o(this,I).set(e,t)});p(this,"get",e=>o(this,I)?o(this,I).get(e):void 0);p(this,"newResponse",(...e)=>v(this,q,oe).call(this,...e));p(this,"body",(e,t,r)=>v(this,q,oe).call(this,e,t,r));p(this,"text",(e,t,r)=>!o(this,X)&&!o(this,le)&&!t&&!r&&!this.finalized?new Response(e):v(this,q,oe).call(this,e,t,Fe(qt,r)));p(this,"json",(e,t,r)=>v(this,q,oe).call(this,JSON.stringify(e),t,Fe("application/json",r)));p(this,"html",(e,t,r)=>{const n=s=>v(this,q,oe).call(this,s,t,Fe("text/html; charset=UTF-8",r));return typeof e=="object"?mt(e,Wt.Stringify,!1,{}).then(n):n(e)});p(this,"redirect",(e,t)=>{const r=String(e);return this.header("Location",/[^\x00-\xFF]/.test(r)?encodeURI(r):r),this.newResponse(null,t??302)});p(this,"notFound",()=>(o(this,he)??f(this,he,()=>xe()),o(this,he).call(this,this)));f(this,Ee,e),t&&(f(this,M,t.executionCtx),this.env=t.env,f(this,he,t.notFoundHandler),f(this,Re,t.path),f(this,Se,t.matchResult))}get req(){return o(this,je)??f(this,je,new ft(o(this,Ee),o(this,Re),o(this,Se))),o(this,je)}get event(){if(o(this,M)&&"respondWith"in o(this,M))return o(this,M);throw Error("This context has no FetchEvent")}get executionCtx(){if(o(this,M))return o(this,M);throw Error("This context has no ExecutionContext")}get res(){return o(this,R)||f(this,R,xe(null,{headers:o(this,X)??f(this,X,new Headers)}))}set res(e){if(o(this,R)&&e){e=xe(e.body,e);for(const[t,r]of o(this,R).headers.entries())if(t!=="content-type")if(t==="set-cookie"){const n=o(this,R).headers.getSetCookie();e.headers.delete("set-cookie");for(const s of n)e.headers.append("set-cookie",s)}else e.headers.set(t,r)}f(this,R,e),this.finalized=!0}get var(){return o(this,I)?Object.fromEntries(o(this,I)):{}}},Ee=new WeakMap,je=new WeakMap,I=new WeakMap,le=new WeakMap,M=new WeakMap,R=new WeakMap,Ce=new WeakMap,de=new WeakMap,he=new WeakMap,X=new WeakMap,Se=new WeakMap,Re=new WeakMap,q=new WeakSet,oe=function(e,t,r){const n=o(this,R)?new Headers(o(this,R).headers):o(this,X)??new Headers;if(typeof t=="object"&&"headers"in t){const i=t.headers instanceof Headers?t.headers:new Headers(t.headers);for(const[a,l]of i)a.toLowerCase()==="set-cookie"?n.append(a,l):n.set(a,l)}if(r)for(const[i,a]of Object.entries(r))if(typeof a=="string")n.set(i,a);else{n.delete(i);for(const l of a)n.append(i,l)}const s=typeof t=="number"?t:(t==null?void 0:t.status)??o(this,le);return xe(e,{status:s,headers:n})},rt),y="ALL",Bt="all",Kt=["get","post","put","delete","options","patch"],vt="Can not add a route since the matcher is already built.",xt=class extends Error{},Jt="__COMPOSED_HANDLER",Vt=e=>e.text("404 Not Found",404),Qe=(e,t)=>{if("getResponse"in e){const r=e.getResponse();return t.newResponse(r.body,r)}return console.error(e),t.text("Internal Server Error",500)},$,E,bt,T,V,$e,Te,ue,Gt=(ue=class{constructor(t={}){m(this,E);p(this,"get");p(this,"post");p(this,"put");p(this,"delete");p(this,"options");p(this,"patch");p(this,"all");p(this,"on");p(this,"use");p(this,"router");p(this,"getPath");p(this,"_basePath","/");m(this,$,"/");p(this,"routes",[]);m(this,T,Vt);p(this,"errorHandler",Qe);p(this,"onError",t=>(this.errorHandler=t,this));p(this,"notFound",t=>(f(this,T,t),this));p(this,"fetch",(t,...r)=>v(this,E,Te).call(this,t,r[1],r[0],t.method));p(this,"request",(t,r,n,s)=>t instanceof Request?this.fetch(r?new Request(t,r):t,n,s):(t=t.toString(),this.fetch(new Request(/^https?:\/\//.test(t)?t:`http://localhost${ie("/",t)}`,r),n,s)));p(this,"fire",()=>{addEventListener("fetch",t=>{t.respondWith(v(this,E,Te).call(this,t.request,t,void 0,t.request.method))})});[...Kt,Bt].forEach(i=>{this[i]=(a,...l)=>(typeof a=="string"?f(this,$,a):v(this,E,V).call(this,i,o(this,$),a),l.forEach(c=>{v(this,E,V).call(this,i,o(this,$),c)}),this)}),this.on=(i,a,...l)=>{for(const c of[a].flat()){f(this,$,c);for(const d of[i].flat())l.map(h=>{v(this,E,V).call(this,d.toUpperCase(),o(this,$),h)})}return this},this.use=(i,...a)=>(typeof i=="string"?f(this,$,i):(f(this,$,"*"),a.unshift(i)),a.forEach(l=>{v(this,E,V).call(this,y,o(this,$),l)}),this);const{strict:n,...s}=t;Object.assign(this,s),this.getPath=n??!0?t.getPath??lt:zt}route(t,r){const n=this.basePath(t);return r.routes.map(s=>{var a;let i;r.errorHandler===Qe?i=s.handler:(i=async(l,c)=>(await Xe([],r.errorHandler)(l,()=>s.handler(l,c))).res,i[Jt]=s.handler),v(a=n,E,V).call(a,s.method,s.path,i)}),this}basePath(t){const r=v(this,E,bt).call(this);return r._basePath=ie(this._basePath,t),r}mount(t,r,n){let s,i;n&&(typeof n=="function"?i=n:(i=n.optionHandler,n.replaceRequest===!1?s=c=>c:s=n.replaceRequest));const a=i?c=>{const d=i(c);return Array.isArray(d)?d:[d]}:c=>{let d;try{d=c.executionCtx}catch{}return[c.env,d]};s||(s=(()=>{const c=ie(this._basePath,t),d=c==="/"?0:c.length;return h=>{const u=new URL(h.url);return u.pathname=u.pathname.slice(d)||"/",new Request(u,h)}})());const l=async(c,d)=>{const h=await r(s(c.req.raw),...a(c));if(h)return h;await d()};return v(this,E,V).call(this,y,ie(t,"*"),l),this}},$=new WeakMap,E=new WeakSet,bt=function(){const t=new ue({router:this.router,getPath:this.getPath});return t.errorHandler=this.errorHandler,f(t,T,o(this,T)),t.routes=this.routes,t},T=new WeakMap,V=function(t,r,n){t=t.toUpperCase(),r=ie(this._basePath,r);const s={basePath:this._basePath,path:r,method:t,handler:n};this.router.add(t,r,[n,s]),this.routes.push(s)},$e=function(t,r){if(t instanceof Error)return this.errorHandler(t,r);throw t},Te=function(t,r,n,s){if(s==="HEAD")return(async()=>new Response(null,await v(this,E,Te).call(this,t,r,n,"GET")))();const i=this.getPath(t,{env:n}),a=this.router.match(s,i),l=new Ut(t,{path:i,matchResult:a,env:n,executionCtx:r,notFoundHandler:o(this,T)});if(a[0].length===1){let d;try{d=a[0][0][0][0](l,async()=>{l.res=await o(this,T).call(this,l)})}catch(h){return v(this,E,$e).call(this,h,l)}return d instanceof Promise?d.then(h=>h||(l.finalized?l.res:o(this,T).call(this,l))).catch(h=>v(this,E,$e).call(this,h,l)):d??o(this,T).call(this,l)}const c=Xe(a[0],this.errorHandler,o(this,T));return(async()=>{try{const d=await c(l);if(!d.finalized)throw new Error("Context is not finalized. Did you forget to return a Response object or `await next()`?");return d.res}catch(d){return v(this,E,$e).call(this,d,l)}})()},ue),wt=[];function Xt(e,t){const r=this.buildAllMatchers(),n=(s,i)=>{const a=r[s]||r[y],l=a[2][i];if(l)return l;const c=i.match(a[0]);if(!c)return[[],wt];const d=c.indexOf("",1);return[a[1][d],c]};return this.match=n,n(e,t)}var He="[^/]+",we=".*",ye="(?:|/.*)",ae=Symbol(),Yt=new Set(".\\+*[^]$()");function Qt(e,t){return e.length===1?t.length===1?e<t?-1:1:-1:t.length===1||e===we||e===ye?1:t===we||t===ye?-1:e===He?1:t===He?-1:e.length===t.length?e<t?-1:1:t.length-e.length}var Y,Q,_,te,Zt=(te=class{constructor(){m(this,Y);m(this,Q);m(this,_,Object.create(null))}insert(t,r,n,s,i){if(t.length===0){if(o(this,Y)!==void 0)throw ae;if(i)return;f(this,Y,r);return}const[a,...l]=t,c=a==="*"?l.length===0?["","",we]:["","",He]:a==="/*"?["","",ye]:a.match(/^\:([^\{\}]+)(?:\{(.+)\})?$/);let d;if(c){const h=c[1];let u=c[2]||He;if(h&&c[2]&&(u===".*"||(u=u.replace(/^\((?!\?:)(?=[^)]+\)$)/,"(?:"),/\((?!\?:)/.test(u))))throw ae;if(d=o(this,_)[u],!d){if(Object.keys(o(this,_)).some(g=>g!==we&&g!==ye))throw ae;if(i)return;d=o(this,_)[u]=new te,h!==""&&f(d,Q,s.varIndex++)}!i&&h!==""&&n.push([h,o(d,Q)])}else if(d=o(this,_)[a],!d){if(Object.keys(o(this,_)).some(h=>h.length>1&&h!==we&&h!==ye))throw ae;if(i)return;d=o(this,_)[a]=new te}d.insert(l,r,n,s,i)}buildRegExpStr(){const r=Object.keys(o(this,_)).sort(Qt).map(n=>{const s=o(this,_)[n];return(typeof o(s,Q)=="number"?`(${n})@${o(s,Q)}`:Yt.has(n)?`\\${n}`:n)+s.buildRegExpStr()});return typeof o(this,Y)=="number"&&r.unshift(`#${o(this,Y)}`),r.length===0?"":r.length===1?r[0]:"(?:"+r.join("|")+")"}},Y=new WeakMap,Q=new WeakMap,_=new WeakMap,te),Ne,Oe,nt,er=(nt=class{constructor(){m(this,Ne,{varIndex:0});m(this,Oe,new Zt)}insert(e,t,r){const n=[],s=[];for(let a=0;;){let l=!1;if(e=e.replace(/\{[^}]+\}/g,c=>{const d=`@\\${a}`;return s[a]=[d,c],a++,l=!0,d}),!l)break}const i=e.match(/(?::[^\/]+)|(?:\/\*$)|./g)||[];for(let a=s.length-1;a>=0;a--){const[l]=s[a];for(let c=i.length-1;c>=0;c--)if(i[c].indexOf(l)!==-1){i[c]=i[c].replace(l,s[a][1]);break}}return o(this,Oe).insert(i,t,n,o(this,Ne),r),n}buildRegExp(){let e=o(this,Oe).buildRegExpStr();if(e==="")return[/^$/,[],[]];let t=0;const r=[],n=[];return e=e.replace(/#(\d+)|@(\d+)|\.\*\$/g,(s,i,a)=>i!==void 0?(r[++t]=Number(i),"$()"):(a!==void 0&&(n[Number(a)]=++t),"")),[new RegExp(`^${e}`),r,n]}},Ne=new WeakMap,Oe=new WeakMap,nt),tr=[/^$/,[],Object.create(null)],_e=Object.create(null);function yt(e){return _e[e]??(_e[e]=new RegExp(e==="*"?"":`^${e.replace(/\/\*$|([.\\+*[^\]$()])/g,(t,r)=>r?`\\${r}`:"(?:|/.*)")}$`))}function rr(){_e=Object.create(null)}function nr(e){var d;const t=new er,r=[];if(e.length===0)return tr;const n=e.map(h=>[!/\*|\/:/.test(h[0]),...h]).sort(([h,u],[g,x])=>h?1:g?-1:u.length-x.length),s=Object.create(null);for(let h=0,u=-1,g=n.length;h<g;h++){const[x,b,P]=n[h];x?s[b]=[P.map(([O])=>[O,Object.create(null)]),wt]:u++;let j;try{j=t.insert(b,u,x)}catch(O){throw O===ae?new xt(b):O}x||(r[u]=P.map(([O,w])=>{const N=Object.create(null);for(w-=1;w>=0;w--){const[ge,Me]=j[w];N[ge]=Me}return[O,N]}))}const[i,a,l]=t.buildRegExp();for(let h=0,u=r.length;h<u;h++)for(let g=0,x=r[h].length;g<x;g++){const b=(d=r[h][g])==null?void 0:d[1];if(!b)continue;const P=Object.keys(b);for(let j=0,O=P.length;j<O;j++)b[P[j]]=l[b[P[j]]]}const c=[];for(const h in a)c[h]=r[a[h]];return[i,c,s]}function se(e,t){if(e){for(const r of Object.keys(e).sort((n,s)=>s.length-n.length))if(yt(r).test(t))return[...e[r]]}}var U,B,ke,Et,st,sr=(st=class{constructor(){m(this,ke);p(this,"name","RegExpRouter");m(this,U);m(this,B);p(this,"match",Xt);f(this,U,{[y]:Object.create(null)}),f(this,B,{[y]:Object.create(null)})}add(e,t,r){var l;const n=o(this,U),s=o(this,B);if(!n||!s)throw new Error(vt);n[e]||[n,s].forEach(c=>{c[e]=Object.create(null),Object.keys(c[y]).forEach(d=>{c[e][d]=[...c[y][d]]})}),t==="/*"&&(t="*");const i=(t.match(/\/:/g)||[]).length;if(/\*$/.test(t)){const c=yt(t);e===y?Object.keys(n).forEach(d=>{var h;(h=n[d])[t]||(h[t]=se(n[d],t)||se(n[y],t)||[])}):(l=n[e])[t]||(l[t]=se(n[e],t)||se(n[y],t)||[]),Object.keys(n).forEach(d=>{(e===y||e===d)&&Object.keys(n[d]).forEach(h=>{c.test(h)&&n[d][h].push([r,i])})}),Object.keys(s).forEach(d=>{(e===y||e===d)&&Object.keys(s[d]).forEach(h=>c.test(h)&&s[d][h].push([r,i]))});return}const a=dt(t)||[t];for(let c=0,d=a.length;c<d;c++){const h=a[c];Object.keys(s).forEach(u=>{var g;(e===y||e===u)&&((g=s[u])[h]||(g[h]=[...se(n[u],h)||se(n[y],h)||[]]),s[u][h].push([r,i-d+c+1]))})}}buildAllMatchers(){const e=Object.create(null);return Object.keys(o(this,B)).concat(Object.keys(o(this,U))).forEach(t=>{e[t]||(e[t]=v(this,ke,Et).call(this,t))}),f(this,U,f(this,B,void 0)),rr(),e}},U=new WeakMap,B=new WeakMap,ke=new WeakSet,Et=function(e){const t=[];let r=e===y;return[o(this,U),o(this,B)].forEach(n=>{const s=n[e]?Object.keys(n[e]).map(i=>[i,n[e][i]]):[];s.length!==0?(r||(r=!0),t.push(...s)):e!==y&&t.push(...Object.keys(n[y]).map(i=>[i,n[y][i]]))}),r?nr(t):null},st),K,D,it,ir=(it=class{constructor(e){p(this,"name","SmartRouter");m(this,K,[]);m(this,D,[]);f(this,K,e.routers)}add(e,t,r){if(!o(this,D))throw new Error(vt);o(this,D).push([e,t,r])}match(e,t){if(!o(this,D))throw new Error("Fatal error");const r=o(this,K),n=o(this,D),s=r.length;let i=0,a;for(;i<s;i++){const l=r[i];try{for(let c=0,d=n.length;c<d;c++)l.add(...n[c]);a=l.match(e,t)}catch(c){if(c instanceof xt)continue;throw c}this.match=l.match.bind(l),f(this,K,[l]),f(this,D,void 0);break}if(i===s)throw new Error("Fatal error");return this.name=`SmartRouter + ${this.activeRouter.name}`,a}get activeRouter(){if(o(this,D)||o(this,K).length!==1)throw new Error("No active router has been determined yet.");return o(this,K)[0]}},K=new WeakMap,D=new WeakMap,it),be=Object.create(null),or=e=>{for(const t in e)return!0;return!1},J,S,Z,fe,C,z,G,pe,ar=(pe=class{constructor(t,r,n){m(this,z);m(this,J);m(this,S);m(this,Z);m(this,fe,0);m(this,C,be);if(f(this,S,n||Object.create(null)),f(this,J,[]),t&&r){const s=Object.create(null);s[t]={handler:r,possibleKeys:[],score:0},f(this,J,[s])}f(this,Z,[])}insert(t,r,n){f(this,fe,++Ge(this,fe)._);let s=this;const i=kt(r),a=[];for(let l=0,c=i.length;l<c;l++){const d=i[l],h=i[l+1],u=Dt(d,h),g=Array.isArray(u)?u[0]:d;if(g in o(s,S)){s=o(s,S)[g],u&&a.push(u[1]);continue}o(s,S)[g]=new pe,u&&(o(s,Z).push(u),a.push(u[1])),s=o(s,S)[g]}return o(s,J).push({[t]:{handler:n,possibleKeys:a.filter((l,c,d)=>d.indexOf(l)===c),score:o(this,fe)}}),s}search(t,r){var h;const n=[];f(this,C,be);let i=[this];const a=at(r),l=[],c=a.length;let d=null;for(let u=0;u<c;u++){const g=a[u],x=u===c-1,b=[];for(let j=0,O=i.length;j<O;j++){const w=i[j],N=o(w,S)[g];N&&(f(N,C,o(w,C)),x?(o(N,S)["*"]&&v(this,z,G).call(this,n,o(N,S)["*"],t,o(w,C)),v(this,z,G).call(this,n,N,t,o(w,C))):b.push(N));for(let ge=0,Me=o(w,Z).length;ge<Me;ge++){const Ke=o(w,Z)[ge],F=o(w,C)===be?{}:{...o(w,C)};if(Ke==="*"){const re=o(w,S)["*"];re&&(v(this,z,G).call(this,n,re,t,o(w,C)),f(re,C,F),b.push(re));continue}const[Rt,Je,me]=Ke;if(!g&&!(me instanceof RegExp))continue;const k=o(w,S)[Rt];if(me instanceof RegExp){if(d===null){d=new Array(c);let ne=r[0]==="/"?1:0;for(let ve=0;ve<c;ve++)d[ve]=ne,ne+=a[ve].length+1}const re=r.substring(d[u]),De=me.exec(re);if(De){if(F[Je]=De[0],v(this,z,G).call(this,n,k,t,o(w,C),F),or(o(k,S))){f(k,C,F);const ne=((h=De[0].match(/\//))==null?void 0:h.length)??0;(l[ne]||(l[ne]=[])).push(k)}continue}}(me===!0||me.test(g))&&(F[Je]=g,x?(v(this,z,G).call(this,n,k,t,F,o(w,C)),o(k,S)["*"]&&v(this,z,G).call(this,n,o(k,S)["*"],t,F,o(w,C))):(f(k,C,F),b.push(k)))}}const P=l.shift();i=P?b.concat(P):b}return n.length>1&&n.sort((u,g)=>u.score-g.score),[n.map(({handler:u,params:g})=>[u,g])]}},J=new WeakMap,S=new WeakMap,Z=new WeakMap,fe=new WeakMap,C=new WeakMap,z=new WeakSet,G=function(t,r,n,s,i){for(let a=0,l=o(r,J).length;a<l;a++){const c=o(r,J)[a],d=c[n]||c[y],h={};if(d!==void 0&&(d.params=Object.create(null),t.push(d),s!==be||i&&i!==be))for(let u=0,g=d.possibleKeys.length;u<g;u++){const x=d.possibleKeys[u],b=h[d.score];d.params[x]=i!=null&&i[x]&&!b?i[x]:s[x]??(i==null?void 0:i[x]),h[d.score]=!0}}},pe),ee,ot,cr=(ot=class{constructor(){p(this,"name","TrieRouter");m(this,ee);f(this,ee,new ar)}add(e,t,r){const n=dt(t);if(n){for(let s=0,i=n.length;s<i;s++)o(this,ee).insert(e,n[s],r);return}o(this,ee).insert(e,t,r)}match(e,t){return o(this,ee).search(e,t)}},ee=new WeakMap,ot),jt=class extends Gt{constructor(e={}){super(e),this.router=e.router??new ir({routers:[new sr,new cr]})}},lr=/^\s*(?:text\/(?!event-stream(?:[;\s]|$))[^;\s]+|application\/(?:javascript|json|xml|xml-dtd|ecmascript|dart|postscript|rtf|tar|toml|vnd\.dart|vnd\.ms-fontobject|vnd\.ms-opentype|wasm|x-httpd-php|x-javascript|x-ns-proxy-autoconfig|x-sh|x-tar|x-virtualbox-hdd|x-virtualbox-ova|x-virtualbox-ovf|x-virtualbox-vbox|x-virtualbox-vdi|x-virtualbox-vhd|x-virtualbox-vmdk|x-www-form-urlencoded)|font\/(?:otf|ttf)|image\/(?:bmp|vnd\.adobe\.photoshop|vnd\.microsoft\.icon|vnd\.ms-dds|x-icon|x-ms-bmp)|message\/rfc822|model\/gltf-binary|x-shader\/x-fragment|x-shader\/x-vertex|[^;\s]+?\+(?:json|text|xml|yaml))(?:[;\s]|$)/i,Ze=(e,t=hr)=>{const r=/\.([a-zA-Z0-9]+?)$/,n=e.match(r);if(!n)return;let s=t[n[1]];return s&&s.startsWith("text")&&(s+="; charset=utf-8"),s},dr={aac:"audio/aac",avi:"video/x-msvideo",avif:"image/avif",av1:"video/av1",bin:"application/octet-stream",bmp:"image/bmp",css:"text/css",csv:"text/csv",eot:"application/vnd.ms-fontobject",epub:"application/epub+zip",gif:"image/gif",gz:"application/gzip",htm:"text/html",html:"text/html",ico:"image/x-icon",ics:"text/calendar",jpeg:"image/jpeg",jpg:"image/jpeg",js:"text/javascript",json:"application/json",jsonld:"application/ld+json",map:"application/json",mid:"audio/x-midi",midi:"audio/x-midi",mjs:"text/javascript",mp3:"audio/mpeg",mp4:"video/mp4",mpeg:"video/mpeg",oga:"audio/ogg",ogv:"video/ogg",ogx:"application/ogg",opus:"audio/opus",otf:"font/otf",pdf:"application/pdf",png:"image/png",rtf:"application/rtf",svg:"image/svg+xml",tif:"image/tiff",tiff:"image/tiff",ts:"video/mp2t",ttf:"font/ttf",txt:"text/plain",wasm:"application/wasm",webm:"video/webm",weba:"audio/webm",webmanifest:"application/manifest+json",webp:"image/webp",woff:"font/woff",woff2:"font/woff2",xhtml:"application/xhtml+xml",xml:"application/xml",zip:"application/zip","3gp":"video/3gpp","3g2":"video/3gpp2",gltf:"model/gltf+json",glb:"model/gltf-binary"},hr=dr,ur=(...e)=>{let t=e.filter(s=>s!=="").join("/");t=t.replace(new RegExp("(?<=\\/)\\/+","g"),"");const r=t.split("/"),n=[];for(const s of r)s===".."&&n.length>0&&n.at(-1)!==".."?n.pop():s!=="."&&n.push(s);return n.join("/")||"."},Ct={br:".br",zstd:".zst",gzip:".gz"},fr=Object.keys(Ct),pr="index.html",gr=e=>{const t=e.root??"./",r=e.path,n=e.join??ur;return async(s,i)=>{var h,u,g,x;if(s.finalized)return i();let a;if(e.path)a=e.path;else try{if(a=ct(s.req.path),/(?:^|[\/\\])\.\.(?:$|[\/\\])/.test(a))throw new Error}catch{return await((h=e.onNotFound)==null?void 0:h.call(e,s.req.path,s)),i()}let l=n(t,!r&&e.rewriteRequestPath?e.rewriteRequestPath(a):a);e.isDir&&await e.isDir(l)&&(l=n(l,pr));const c=e.getContent;let d=await c(l,s);if(d instanceof Response)return s.newResponse(d.body,d);if(d){const b=e.mimes&&Ze(l,e.mimes)||Ze(l);if(s.header("Content-Type",b||"application/octet-stream"),e.precompressed&&(!b||lr.test(b))){const P=new Set((u=s.req.header("Accept-Encoding"))==null?void 0:u.split(",").map(j=>j.trim()));for(const j of fr){if(!P.has(j))continue;const O=await c(l+Ct[j],s);if(O){d=O,s.header("Content-Encoding",j),s.header("Vary","Accept-Encoding",{append:!0});break}}}return await((g=e.onFound)==null?void 0:g.call(e,l,s)),s.body(d)}await((x=e.onNotFound)==null?void 0:x.call(e,l,s)),await i()}},mr=async(e,t)=>{let r;t&&t.manifest?typeof t.manifest=="string"?r=JSON.parse(t.manifest):r=t.manifest:typeof __STATIC_CONTENT_MANIFEST=="string"?r=JSON.parse(__STATIC_CONTENT_MANIFEST):r=__STATIC_CONTENT_MANIFEST;let n;t&&t.namespace?n=t.namespace:n=__STATIC_CONTENT;const s=r[e];if(!s)return null;const i=await n.get(s,{type:"stream"});return i||null},vr=e=>async function(r,n){return gr({...e,getContent:async i=>mr(i,{manifest:e.manifest,namespace:e.namespace?e.namespace:r.env?r.env.__STATIC_CONTENT:void 0})})(r,n)},Ae=e=>vr(e),xr=e=>{const r={...{origin:"*",allowMethods:["GET","HEAD","PUT","POST","DELETE","PATCH"],allowHeaders:[],exposeHeaders:[]},...e},n=(i=>typeof i=="string"?i==="*"?()=>i:a=>i===a?a:null:typeof i=="function"?i:a=>i.includes(a)?a:null)(r.origin),s=(i=>typeof i=="function"?i:Array.isArray(i)?()=>i:()=>[])(r.allowMethods);return async function(a,l){var h;function c(u,g){a.res.headers.set(u,g)}const d=await n(a.req.header("origin")||"",a);if(d&&c("Access-Control-Allow-Origin",d),r.credentials&&c("Access-Control-Allow-Credentials","true"),(h=r.exposeHeaders)!=null&&h.length&&c("Access-Control-Expose-Headers",r.exposeHeaders.join(",")),a.req.method==="OPTIONS"){r.origin!=="*"&&c("Vary","Origin"),r.maxAge!=null&&c("Access-Control-Max-Age",r.maxAge.toString());const u=await s(a.req.header("origin")||"",a);u.length&&c("Access-Control-Allow-Methods",u.join(","));let g=r.allowHeaders;if(!(g!=null&&g.length)){const x=a.req.header("Access-Control-Request-Headers");x&&(g=x.split(/\s*,\s*/))}return g!=null&&g.length&&(c("Access-Control-Allow-Headers",g.join(",")),a.res.headers.append("Vary","Access-Control-Request-Headers")),a.res.headers.delete("Content-Length"),a.res.headers.delete("Content-Type"),new Response(null,{headers:a.res.headers,status:204,statusText:"No Content"})}await l(),r.origin!=="*"&&a.header("Vary","Origin",{append:!0})}};function Ie(e,t="JWC",r=""){return`<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${t}</title>
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
    ${br(r)}
    ${e}
    ${wr()}
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
</html>`}function br(e){const t=["Home","About","Products","Contact"],r={Home:"/",About:"/about",Products:"/products",Contact:"/contact"};return`
    <header>
        <div class="container">
            <div class="header-content">
                <div class="logo">
                    <a href="/">
                        <img src="/jwc-logo.png" alt="JWC">
                    </a>
                </div>
                <nav class="nav-menu" id="navMenu">
                    ${t.map(n=>`<a href="${r[n]}" class="nav-link ${e===n?"active":""}">${n}</a>`).join(`
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
    </header>`}function wr(){return`
    <footer>
        <div class="container">
            <p>&copy; 2024 JWC. All rights reserved.</p>
            <a href="/admin-login.html" style="opacity: 0.3; font-size: 12px; color: #999;">
                <i class="fas fa-cog"></i>
            </a>
        </div>
    </footer>`}function yr(e,t){return!e||e.length===0?`
    <section class="hero">
        <div class="hero-slider">
            <div class="hero-slide active">
                <div style="width: 100%; height: 100%; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);"></div>
            </div>
        </div>
        ${t?`
        <div class="hero-text-overlay">
            <h1>${t.title||"Welcome to JWC"}</h1>
            <p>${t.subtitle||"Premium Cosmetics"}</p>
        </div>
        `:""}
    </section>`:`
    <section class="hero">
        <div class="hero-slider">
            ${e.map((r,n)=>`
            <div class="hero-slide ${n===0?"active":""}">
                <img src="${r.data}" alt="Hero ${n+1}">
            </div>
            `).join("")}
        </div>
        ${t?`
        <div class="hero-text-overlay">
            <h1>${t.title||"Welcome to JWC"}</h1>
            <p>${t.subtitle||"Premium Cosmetics"}</p>
        </div>
        `:""}
        ${e.length>1?`
        <div class="slider-nav">
            ${e.map((r,n)=>`
            <div class="slider-dot ${n===0?"active":""}"></div>
            `).join("")}
        </div>
        `:""}
    </section>`}function Ue(e,t){return`
    <section class="page-hero" style="${t?`background-image: url('${t}');`:"background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);"}">
        <h1>${e}</h1>
    </section>`}function Er(){return`
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
    </style>`}function jr(){return`
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
    </style>`}function Cr(){return`
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
    </style>`}function Sr(){return`
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
    <\/script>`}async function Rr(e){try{const t=await e.list({prefix:"images:"}),r=[];for(const n of t.keys){const s=await e.get(n.name,"json");s&&s.type==="heroSlider"&&r.push(s)}return r.sort((n,s)=>(n.order_index||0)-(s.order_index||0))}catch(t){return console.error("Hero images fetch error:",t),[]}}async function Be(e,t){try{const r=await e.list({prefix:"images:"});for(const n of r.keys){const s=await e.get(n.name,"json");if(s&&s.type==="pageHero"&&s.page===t)return s}return null}catch(r){return console.error("Page hero fetch error:",r),null}}async function Or(e,t,r=null){try{const n=await e.list({prefix:"settings:"});for(const s of n.keys){const i=await e.get(s.name,"json");if(i&&i.key===t)try{return JSON.parse(i.value)}catch{return i.value}}return r}catch(n){return console.error("Setting fetch error:",n),r}}const H=new jt;H.use("/api/*",xr());H.use("/css/*",Ae({root:"./public"}));H.use("/js/*",Ae({root:"./public"}));H.use("/images/*",Ae({root:"./public"}));H.use("/jwc-logo.png",Ae({root:"./public"}));H.use("/admin*.html",Ae({root:"./"}));H.get("/",async e=>{const t=await Rr(e.env.KV),r=await Or(e.env.KV,"heroText",{title:"Welcome to JWC",subtitle:"Premium Cosmetics"}),n=yr(t,r)+Er(),s=Ie(n,"JWC - Home","Home");return e.html(s)});H.get("/about",async e=>{const t=await Be(e.env.KV,"about"),r=Ue("About Us",t==null?void 0:t.data)+jr(),n=Ie(r,"JWC - About","About");return e.html(n)});H.get("/products",async e=>{const t=await Be(e.env.KV,"products"),r=Ue("Our Products",t==null?void 0:t.data)+Cr(),n=Ie(r,"JWC - Products","Products");return e.html(n)});H.get("/contact",async e=>{const t=await Be(e.env.KV,"contact"),r=Ue("Contact Us",t==null?void 0:t.data)+Sr(),n=Ie(r,"JWC - Contact","Contact");return e.html(n)});const et=new jt,Ar=Object.assign({"/src/index.tsx":H});let St=!1;for(const[,e]of Object.entries(Ar))e&&(et.route("/",e),et.notFound(e.notFoundHandler),St=!0);if(!St)throw new Error("Can't import modules from ['/src/index.tsx','/app/server.ts']");export{et as default};
