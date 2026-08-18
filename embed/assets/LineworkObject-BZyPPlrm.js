import{B as Se,V as B,a5 as bt,I as kn,y as Xt,z as Nt,E as Be,G as Un,S as zn,H as Xn,bg as nt,J as Mn,b as Ft,K as it,e as Bn,X as ot,L as Wn,M as at,Y as Zn,a4 as Gn,bh as Vn,Q as Kn,P as $n,k as jn,D as Bt,af as Yn,a as Wt,Z as qn}from"./three-core-BMWLQXGG.js";import{cz as Hn,dh as dt,di as Jn,dj as mt,dk as Qn,d5 as ei,c_ as ti,b as ni,u as Zt,dl as ii}from"./index-BNHZOqPN.js";import{r as N,u as rt,d as bn,j as S}from"./r3f-D6fmtK_Y.js";import{f as Gt}from"./lineworkTransform-4XLiS165.js";import{i as ri}from"./transformControlsRegistry-zhGv3s0x.js";const si={DEFAULT:0,PROJECTOR:1,SURFACE:2,ROOM:3,PHOTO:4,HELPER:5,PROJECTABLE:6},oi=Object.freeze(new Set(["draw","rect","knife"])),Nn={EQUIPMENT:1,MODEL:2,ROOM:100};function ai(e){var n;let t=e;for(;t;){if(((n=t.userData)==null?void 0:n.selectionPriority)!=null)return t.userData.selectionPriority;t=t.parent}return 50}function vt(e){var n,r;let t=e;for(;t;){if(((n=t.userData)==null?void 0:n.objectId)!=null)return t.userData.objectId;if(((r=t.userData)==null?void 0:r.fieldLuxSourceObjectId)!=null)return t.userData.fieldLuxSourceObjectId;t=t.parent}return null}function vn(e){var n;let t=e;for(;t;){if(((n=t.userData)==null?void 0:n.fieldLuxSelectionLocked)===!0)return!0;t=t.parent}return!1}function ur(e,t){const n=Array.isArray(e==null?void 0:e.intersections)?e.intersections:[],r=n.findIndex(a=>(a==null?void 0:a.object)===(e==null?void 0:e.object)),i=n.findIndex(a=>vt(a==null?void 0:a.object)===t);let o=-1;return r>=0&&i>=0?o=Math.min(r,i):r>=0?o=r:o=i,o<=0?!1:n.slice(0,o).some(a=>{const c=vt(a==null?void 0:a.object);return!c||c===t||vn(a.object)?!1:ai(a.object)<Nn.ROOM})}function lr(e){if(!Array.isArray(e))return[];const t=new Set,n=[];for(const r of e){const i=r==null?void 0:r.object;if(!i||i.visible===!1||vn(i))continue;const o=vt(i);o==null||t.has(o)||(t.add(o),n.push(o))}return n}const fr=e=>{Object.values(si).forEach(t=>e.layers.enable(t))},ci={GRID:128,MIN_TRIM_SPAN_M:100,COMPONENT_CELL_SHARE:.25},pt=ci,Vt=new WeakMap;function ui(e){let t=1/0,n=-1/0,r=1/0,i=-1/0,o=0;for(let a=0;a+1<e.length;a+=2){const c=e[a],l=e[a+1];!Number.isFinite(c)||!Number.isFinite(l)||(c<t&&(t=c),c>n&&(n=c),l<r&&(r=l),l>i&&(i=l),o+=1)}return o?{minX:t,maxX:n,minZ:r,maxZ:i,count:o}:null}function li(e,t){const n=t.maxX-t.minX,r=t.maxZ-t.minZ;if(Math.max(n,r)<=pt.MIN_TRIM_SPAN_M)return null;const i=pt.GRID,o=n>0?n/i:1,a=r>0?r/i:1,c=new Uint32Array(i*i);for(let g=0;g+1<e.length;g+=2){const y=e[g],b=e[g+1];if(!Number.isFinite(y)||!Number.isFinite(b))continue;const v=Math.min(i-1,Math.max(0,Math.floor((y-t.minX)/o))),w=Math.min(i-1,Math.max(0,Math.floor((b-t.minZ)/a)));c[w*i+v]+=1}const l=new Int32Array(i*i),f=[];let u=0;const m=[];for(let g=0;g<c.length;g+=1){if(!c[g]||l[g])continue;u+=1;let y=0,b=i,v=-1,w=i,T=-1;for(m.length=0,m.push(g),l[g]=u;m.length;){const E=m.pop(),k=E%i,U=(E-k)/i;y+=1,k<b&&(b=k),k>v&&(v=k),U<w&&(w=U),U>T&&(T=U),k>0&&c[E-1]&&!l[E-1]&&(l[E-1]=u,m.push(E-1)),k<i-1&&c[E+1]&&!l[E+1]&&(l[E+1]=u,m.push(E+1)),U>0&&c[E-i]&&!l[E-i]&&(l[E-i]=u,m.push(E-i)),U<i-1&&c[E+i]&&!l[E+i]&&(l[E+i]=u,m.push(E+i))}f.push({cells:y,cMinX:b,cMaxX:v,cMinZ:w,cMaxZ:T})}if(!f.length)return null;const p=f.reduce((g,y)=>y.cells>g.cells?y:g),x=p.cells*pt.COMPONENT_CELL_SHARE;let M=null;for(const g of f){if(g.cells<x&&g!==p)continue;const y={minX:t.minX+(g.cMinX-1)*o,maxX:t.minX+(g.cMaxX+2)*o,minZ:t.minZ+(g.cMinZ-1)*a,maxZ:t.minZ+(g.cMaxZ+2)*a};M?(y.minX<M.minX&&(M.minX=y.minX),y.maxX>M.maxX&&(M.maxX=y.maxX),y.minZ<M.minZ&&(M.minZ=y.minZ),y.maxZ>M.maxZ&&(M.maxZ=y.maxZ)):M=y}return M.minX=Math.max(M.minX,t.minX),M.maxX=Math.min(M.maxX,t.maxX),M.minZ=Math.max(M.minZ,t.minZ),M.maxZ=Math.min(M.maxZ,t.maxZ),M}function fi(e){const t=e==null?void 0:e.points;if(!Array.isArray(t)||t.length<2)return null;const n=Vt.get(t);if(n!==void 0)return n;const r=ui(t);let i=null;if(r){const o={minX:r.minX,maxX:r.maxX,minZ:r.minZ,maxZ:r.maxZ},a=li(t,r)||o;i={raw:o,content:a}}return Vt.set(t,i),i}function di(e,{excludeDrawings:t=!1}={}){const n=new Se,r=new Se;let i=!1;const o=Hn(e||{});for(const l of Object.values(o||{})){if(t&&(l==null?void 0:l.type)==="linework"){l.position&&(n.expandByPoint(new B(l.position.x||0,l.position.y||0,l.position.z||0)),i=!0);continue}wt(l,r)?(n.union(r),i=!0):l!=null&&l.position&&(n.expandByPoint(new B(l.position.x||0,l.position.y||0,l.position.z||0)),i=!0)}if(!i)return{hasContent:!1,center:new B,radius:0,groundY:0};const a=new B;n.getCenter(a);const c=new B;return n.getSize(c),{hasContent:!0,center:a,radius:Math.max(c.x,c.y,c.z)*.5,groundY:n.min.y}}function dr(e){const t=di(e);if(!t.hasContent||t.radius<=100)return new B(0,1.5,5);const n=Math.min(Math.max(t.radius*.7,5),t.radius*1.5);return new B(t.center.x,t.groundY+1.5,t.center.z+n)}function wt(e,t=new Se){var n,r;if(!e)return null;if(e.type==="room"){const i=e.position||{},o=e.width||0,a=e.height||0,c=e.depth||0;if(o<=0||a<=0||c<=0)return null;const l=i.x||0,f=i.y||0,u=i.z||0;return t.min.set(l-o/2,f,u),t.max.set(l+o/2,f+a,u+c),t}if(e.type==="surface"){const i=Number(e.width)||0,o=Number(e.height)||0;if(!(i>0)||!(o>0))return null;const a=e.position||{},c=e.scale||{},l=Number.isFinite(Number(c.x))?Number(c.x):1,f=Number.isFinite(Number(c.y))?Number(c.y):1,u=e.rotation||{},m=(b,v)=>{const w=Number(b??v);return Number.isFinite(w)?w:0},p=new bt(m(u._x,u.x),m(u._y,u.y),m(u._z,u.z),u._order||u.order||"XYZ"),x=Number(a.x)||0,M=Number(a.y)||0,g=Number(a.z)||0;t.makeEmpty();const y=new B;for(const b of[-.5,.5])for(const v of[-.5,.5])y.set(b*i*l,v*o*f,0).applyEuler(p),y.set(y.x+x,y.y+M,y.z+g),t.expandByPoint(y);return t.isEmpty()?null:t}if(e.type==="linework"){const i=fi(e);if(!i)return null;const o=i.content,a=e.position||{},c=e.scale||{},l=e.rotation||{},f=(b,v)=>{const w=Number(b??v);return Number.isFinite(w)?w:0},u=Number.isFinite(Number(c.x))&&Number(c.x)!==0?Number(c.x):1,m=Number.isFinite(Number(c.z))&&Number(c.z)!==0?Number(c.z):1,p=new bt(f(l._x,l.x),f(l._y,l.y),f(l._z,l.z),l._order||l.order||"XYZ"),x=Number(a.x)||0,M=Number(a.y)||0,g=Number(a.z)||0;t.makeEmpty();const y=new B;for(const b of[o.minX,o.maxX])for(const v of[o.minZ,o.maxZ])y.set(b*u,0,v*m).applyEuler(p),y.set(y.x+x,y.y+M,y.z+g),t.expandByPoint(y);return t.isEmpty()?null:t}if(e.meshData)try{return(r=(n=e.meshData).updateMatrixWorld)==null||r.call(n,!0),t.setFromObject(e.meshData),t.isEmpty()?null:t}catch{return null}{const i=e.type==="primitive"&&e.shape==="curvedWall",o=e.type==="photo"?[Number(e.physicalWidth)||0]:e.type==="primitive"||e.type==="ledWall"?[Number(e.width)||0,Number(e.depth)||0,i?0:(Number(e.radius)||0)*2]:null;if(o){const a=e.type==="photo"?(Number(e.physicalWidth)||0)/(Number(e.aspectRatio)>0?Number(e.aspectRatio):1):Math.max(Number(e.height)||0,i?0:Number(e.radius)||0),c=e.scale||{},l=Math.max(Math.abs(Number(c.x))||1,Math.abs(Number(c.z))||1),f=Math.abs(Number(c.y))||1,u=Math.max(...o,a,0)*l/2,m=Math.max(a,0)*f/2||u;if(u>0){const p=e.position||{},x=Number(p.x)||0,M=Number(p.y)||0,g=Number(p.z)||0;return t.min.set(x-u,M-m,g-u),t.max.set(x+u,M+m,g+u),t}}}return null}function mr(e,t,n=new Se){const r=e==null?void 0:e[t];if(!r)return null;if(r.type!=="node")return wt(r,n);n.makeEmpty();const i=new Se,o=new Set([t]),a=[t];let c=!1;for(;a.length;){const l=a.pop();for(const f of Object.values(e)){if(!f||f.parentId!==l)continue;const u=f.id;if(!(u&&o.has(u))){if(u&&o.add(u),f.type==="node"){a.push(u);continue}wt(f,i)&&(n.union(i),c=!0)}}}return c&&!n.isEmpty()?n:null}function pr(e){const t=Number.isFinite(e)&&e>0?e:0;return 4*Math.min(12,Math.max(1,t/20))}const mi={TARGET_EDGES_PER_CELL:16,MIN_CELL_M:.05,MAX_CELLS:4e6,AREA_TRIM:.05};function pi(e,t,n,r,i,o){const a=mi,c=e.length/2;if(!(t>0)||c===0)return Math.max(a.MIN_CELL_M,1);const l=Math.min(c,2e4),f=Math.max(1,Math.floor(c/l)),u=[],m=[];for(let b=0;b<c;b+=f){const v=e[2*b],w=e[2*b+1];Number.isFinite(v)&&Number.isFinite(w)&&(u.push(v),m.push(w))}if(!u.length)return Math.max(a.MIN_CELL_M,1);u.sort((b,v)=>b-v),m.sort((b,v)=>b-v);const p=Math.floor((u.length-1)*a.AREA_TRIM),x=Math.ceil((u.length-1)*(1-a.AREA_TRIM)),M=Math.max(u[x]-u[p],1e-6),g=Math.max(m[x]-m[p],1e-6);let y=Math.sqrt(M*g*a.TARGET_EDGES_PER_CELL/t);(!Number.isFinite(y)||y<=0)&&(y=1),y=Math.max(y,a.MIN_CELL_M);for(let b=0;b<64;b+=1){const v=Math.floor((r-n)/y)+1,w=Math.floor((o-i)/y)+1;if(v*w<=a.MAX_CELLS)break;y*=2}return y}const Kt=new WeakMap;function hi(e){const t=e.points,n=e.edges,r=t.length/2;let i=1/0,o=-1/0,a=1/0,c=-1/0;for(let x=0;x<t.length;x+=2){const M=t[x],g=t[x+1];!Number.isFinite(M)||!Number.isFinite(g)||(M<i&&(i=M),M>o&&(o=M),g<a&&(a=g),g>c&&(c=g))}if(!Number.isFinite(i))return null;const l=pi(t,n.length/2,i,o,a,c),f=Math.max(1,Math.floor((o-i)/l)+1),u=Math.max(1,Math.floor((c-a)/l)+1),m=new Map;for(let x=0;x<r;x+=1){const M=t[2*x],g=t[2*x+1];if(!Number.isFinite(M)||!Number.isFinite(g))continue;const y=Math.floor((M-i)/l)*u+Math.floor((g-a)/l);let b=m.get(y);b||(b=[],m.set(y,b)),b.push(x)}const p=new Map;for(let x=0;x<n.length/2;x+=1){const M=n[2*x],g=n[2*x+1];if(M===g)continue;const y=t[2*M],b=t[2*M+1],v=t[2*g],w=t[2*g+1];if(!Number.isFinite(y)||!Number.isFinite(b)||!Number.isFinite(v)||!Number.isFinite(w))continue;const T=Math.floor((Math.min(y,v)-i)/l),E=Math.floor((Math.max(y,v)-i)/l),k=Math.floor((Math.min(b,w)-a)/l),U=Math.floor((Math.max(b,w)-a)/l);for(let P=T;P<=E;P+=1)for(let W=k;W<=U;W+=1){const J=P*u+W;let re=p.get(J);re||(re=[],p.set(J,re)),re.push(x)}}return{minX:i,minZ:a,cell:l,nx:f,nz:u,vBuckets:m,eBuckets:p}}function It(e){if(!e||!Array.isArray(e.points)||!Array.isArray(e.edges))return null;const t=Kt.get(e.points);if(t&&t.edges===e.edges)return t.index;const n=hi(e);return Kt.set(e.points,{edges:e.edges,index:n}),n}function $t(e,t){return t.adj||(t.adj=Qn(e)),t.adj}function Le(e,t,n,r,i={}){if(!(r>0)||!Number.isFinite(r)||!Number.isFinite(t)||!Number.isFinite(n))return dt(e,t,n,r,i);const o=It(e);if(!o)return dt(e,t,n,r,i);const a=Math.ceil(r/o.cell);if((2*a+1)*(2*a+1)>=e.points.length/2)return dt(e,t,n,r,{...i,adjacency:i.hiddenLayers?$t(e,o):void 0});const c=i.hiddenLayers||null,l=c&&c.size?$t(e,o):null,f=e.points,u=Math.floor((t-o.minX)/o.cell),m=Math.floor((n-o.minZ)/o.cell),p=Math.max(0,u-a),x=Math.min(o.nx-1,u+a),M=Math.max(0,m-a),g=Math.min(o.nz-1,m+a);let y=-1,b=r*r;for(let v=p;v<=x;v+=1)for(let w=M;w<=g;w+=1){const T=o.vBuckets.get(v*o.nz+w);if(T)for(const E of T){const k=t-f[2*E],U=n-f[2*E+1],P=k*k+U*U;(P<b||P===b&&E>y)&&(l&&Jn(e,l,E,c)||(b=P,y=E))}}return y}function Ie(e,t,n,r,i={}){var v;if(!(r>0)||!Number.isFinite(r)||!Number.isFinite(t)||!Number.isFinite(n))return mt(e,t,n,r,i);const o=It(e);if(!o)return mt(e,t,n,r,i);const a=Math.ceil(r/o.cell);if((2*a+1)*(2*a+1)>=e.edges.length/2)return mt(e,t,n,r,i);const c=e.points,l=e.edges,f=i.hiddenLayers||null,u=Math.floor((t-o.minX)/o.cell),m=Math.floor((n-o.minZ)/o.cell),p=Math.max(0,u-a),x=Math.min(o.nx-1,u+a),M=Math.max(0,m-a),g=Math.min(o.nz-1,m+a);let y=-1,b=r*r;for(let w=p;w<=x;w+=1)for(let T=M;T<=g;T+=1){const E=o.eBuckets.get(w*o.nz+T);if(E)for(const k of E){if(f&&f.has((v=e.edgeLayer)==null?void 0:v[k]))continue;const U=l[2*k],P=l[2*k+1];if(U===P)continue;const W=c[2*U],J=c[2*U+1],re=c[2*P],C=c[2*P+1],fe=re-W,he=C-J,me=fe*fe+he*he;if(me<=0)continue;let _=((t-W)*fe+(n-J)*he)/me;_=Math.max(0,Math.min(1,_));const se=t-(W+_*fe),Ae=n-(J+_*he),D=se*se+Ae*Ae;(D<b||D===b&&k>y)&&(b=D,y=k)}}return y}function xi(e,t,n,r,i){var M;const o=(((M=e==null?void 0:e.edges)==null?void 0:M.length)||0)/2;if(!o||typeof i!="function")return;if(!(r>0)||!Number.isFinite(r)||!Number.isFinite(t)||!Number.isFinite(n)){for(let g=0;g<o;g+=1)i(g);return}const a=It(e);if(!a){for(let g=0;g<o;g+=1)i(g);return}const c=Math.ceil(r/a.cell);if((2*c+1)*(2*c+1)>=o){for(let g=0;g<o;g+=1)i(g);return}const l=Math.floor((t-a.minX)/a.cell),f=Math.floor((n-a.minZ)/a.cell),u=Math.max(0,l-c),m=Math.min(a.nx-1,l+c),p=Math.max(0,f-c),x=Math.min(a.nz-1,f+c);for(let g=u;g<=m;g+=1)for(let y=p;y<=x;y+=1){const b=a.eBuckets.get(g*a.nz+y);if(b)for(const v of b)i(v)}}const st=Object.freeze({REF_MIN_LEN_FACTOR:4,CROSS_MIN_SIN:.2588,GUIDE_OVERSHOOT:.2,GUIDE_MAX_M:50,MAX_CANDIDATES:4096}),St=Object.freeze({endpoint:"Endpoint",intersection:"Intersection",midpoint:"Midpoint",extension:"Extension",perpendicular:"Perpendicular",parallel:"Parallel","on-line":"On line",ortho:"",free:""}),yi={endpoint:0,intersection:1,midpoint:2,extension:3,perpendicular:4,parallel:5},We=(e,t)=>e.points[2*t],Ze=(e,t)=>e.points[2*t+1],le=e=>Number.isFinite(e);function jt(e,t){const n=e.edges;if(!Number.isInteger(t)||t<0||2*t+1>=n.length)return null;const r=n[2*t],i=n[2*t+1];if(r===i)return null;const o=We(e,r),a=Ze(e,r),c=We(e,i),l=Ze(e,i);if(!le(o)||!le(a)||!le(c)||!le(l))return null;const f=c-o,u=l-a,m=Math.hypot(f,u);return m>0?{a:r,b:i,ax:o,az:a,bx:c,bz:l,dx:f,dz:u,len:m,ux:f/m,uz:u/m}:null}function Yt(e,t,n,r,i,o,a,c){const l=n*c-r*a;if(!le(l)||Math.abs(l)<st.CROSS_MIN_SIN)return null;const f=((i-e)*c-(o-t)*a)/l,u=e+n*f,m=t+r*f;return!le(u)||!le(m)?null:{x:u,z:m}}function gi(e,t,n){const r=(t-e.ax)*e.ux+(n-e.az)*e.uz;return{x:e.ax+e.ux*r,z:e.az+e.uz*r,t:r}}function zi(e,{cursor:t,anchor:n=null,tolM:r=0,ref:i=null,ortho:o=!1,suspend:a=!1,inference:c=!0,hiddenLayers:l=null,walls:f=null,refDrawing:u=null,refSrc:m="lw"}={}){const p=Number(t==null?void 0:t.x),x=Number(t==null?void 0:t.z),M=(R,K)=>({x:R,z:K,kind:"free",label:"",onEdge:!1,edgeId:-1,vertexId:-1,refEdgeId:null,guide:null});if(!le(p)||!le(x)||a)return M(p,x);const g=e&&Array.isArray(e.points)&&Array.isArray(e.edges),y=f&&Array.isArray(f.points)&&Array.isArray(f.edges)&&f.edges.length>0,b=Number(r),v=le(b)&&b>0,w=g&&v,T=y&&v,k=u&&Array.isArray(u.points)&&Array.isArray(u.edges)&&u.edges.length>0&&v;if(w||T||k){let R=-1,K=1/0,F=null;if(w){const I=Le(e,p,x,b,{hiddenLayers:l});if(I>=0){const V=We(e,I)-p,$=Ze(e,I)-x;R=I,K=V*V+$*$,F="lw"}}if(T){const I=Le(f,p,x,b);if(I>=0){const V=We(f,I)-p,$=Ze(f,I)-x,X=V*V+$*$;X<K&&(R=I,K=X,F="walls")}}if(k){const I=Le(u,p,x,b);if(I>=0){const V=We(u,I)-p,$=Ze(u,I)-x,X=V*V+$*$;X<K&&(R=I,K=X,F="plan")}}if(F){const I=F==="walls"?f:F==="plan"?u:e;return{x:We(I,R),z:Ze(I,R),kind:"endpoint",label:St.endpoint,onEdge:!1,edgeId:-1,vertexId:F==="lw"?R:-1,refEdgeId:i??null,guide:null,...F!=="lw"?{snapSrc:F}:null,...m!=="lw"&&i!=null?{refSrc:m}:null}}}const U=c===!0&&(w||T||k),P=Number(n==null?void 0:n.x),W=Number(n==null?void 0:n.z),J=le(P)&&le(W),re=ei.WELD_EPS_M;let C=null;const fe={lw:0,walls:1,plan:2},he=R=>fe[R]??3,me=(R,K,F,I={})=>{if(!le(K)||!le(F))return;const V=K-p,$=F-x,X=V*V+$*$;if(X>b*b||J&&Math.hypot(K-P,F-W)<=re)return;const Z=yi[R],ee=he(I.src);C&&(Z>C.rank||Z===C.rank&&(X>C.d2||X===C.d2&&(ee>C.srcOrder||ee===C.srcOrder&&(I.id??1/0)>=(C.id??1/0))))||(C={rank:Z,kind:R,x:K,z:F,d2:X,srcOrder:ee,src:fe[I.src]!==void 0?I.src:"lw",id:I.id??null,guide:I.guide??null})},_={lw:()=>[e,w],walls:()=>[f,T],plan:()=>[u,k]},[se,Ae]=(_[m]||_.lw)();let D=null;if(U&&Ae&&i!==null&&i!==void 0){const R=jt(se,i);R&&R.len>=st.REF_MIN_LEN_FACTOR*b&&(D=R)}const G=fe[m]!==void 0?m:"lw";if(U){if(D){const F=gi(D,p,x);if(F.t<0||F.t>D.len){const I=F.t<0?{x:D.ax,z:D.az}:{x:D.bx,z:D.bz};me("extension",F.x,F.z,{id:i,src:G,guide:{ox:I.x,oz:I.z,x:F.x,z:F.z}})}}if(D&&J&&!o){const F=[["perpendicular",-D.uz,D.ux],["parallel",D.ux,D.uz]];for(const[I,V,$]of F){const X=(p-P)*V+(x-W)*$,Z=P+V*X,ee=W+$*X;me(I,Z,ee,{id:i,src:G,guide:{ox:P,oz:W,x:Z,z:ee}})}}const R=[];if(D&&(J&&!o&&(R.push({ox:P,oz:W,ux:-D.uz,uz:D.ux,id:i,src:G}),R.push({ox:P,oz:W,ux:D.ux,uz:D.uz,id:i,src:G})),R.push({ox:D.ax,oz:D.az,ux:D.ux,uz:D.uz,id:i,src:G})),o&&J){const F=Gt({x:P,z:W},{x:p,z:x},{ortho:!0});F.axis==="x"?R.push({ox:P,oz:W,ux:1,uz:0,id:-1,src:null}):F.axis==="z"&&R.push({ox:P,oz:W,ux:0,uz:1,id:-1,src:null})}const K=(F,I)=>{let V=0;const $=st.MAX_CANDIDATES;xi(I,p,x,b,X=>{var ee;if(V>=$||(V+=1,F==="lw"&&l&&l.has((ee=I.edgeLayer)==null?void 0:ee[X])))return;const Z=jt(I,X);if(Z){me("midpoint",(Z.ax+Z.bx)/2,(Z.az+Z.bz)/2,{id:X,src:F});for(const oe of R){if(oe.id===X&&oe.src===F)continue;const Ne=Yt(oe.ox,oe.oz,oe.ux,oe.uz,Z.ax,Z.az,Z.ux,Z.uz);if(!Ne)continue;const Ee=(Ne.x-Z.ax)*Z.ux+(Ne.z-Z.az)*Z.uz;Ee<-re||Ee>Z.len+re||me("intersection",Ne.x,Ne.z,{id:X,src:F,guide:{ox:oe.ox,oz:oe.oz,x:Ne.x,z:Ne.z}})}}})};w&&K("lw",e),T&&K("walls",f),k&&K("plan",u);for(let F=0;F<R.length;F+=1)for(let I=F+1;I<R.length;I+=1){const V=R[F],$=R[I],X=Yt(V.ox,V.oz,V.ux,V.uz,$.ox,$.oz,$.ux,$.uz);X&&me("intersection",X.x,X.z,{id:-1,guide:{ox:V.ox,oz:V.oz,x:X.x,z:X.z}})}}let Me=p,pe=x,_e="free",be=null,Ge=null;if(C)Me=C.x,pe=C.z,_e=C.kind,be=C.guide,Ge=C.id;else if(o&&J){const R=Gt({x:P,z:W},{x:p,z:x},{ortho:!0});Me=R.x,pe=R.z,R.axis&&(_e="ortho")}let q=!1,$e=-1;if(w){const R=Ie(e,Me,pe,b,{hiddenLayers:l});R>=0&&(q=!0,$e=R)}const je=_e==="free"&&q?"on-line":_e;return{x:Me,z:pe,kind:je,label:St[je]??"",onEdge:q,edgeId:$e,vertexId:-1,refEdgeId:D?i:null,guide:be?Mi(be):null,winnerId:Ge,...C!=null&&C.src&&C.src!=="lw"?{snapSrc:C.src}:null,...D&&G!=="lw"?{refSrc:G}:null}}function Mi(e){const t=st,n=e.x-e.ox,r=e.z-e.oz,i=Math.hypot(n,r);if(!(i>0))return null;const o=Math.min(i*(1+t.GUIDE_OVERSHOOT),i+t.GUIDE_MAX_M);return{ox:e.ox,oz:e.oz,x:e.ox+n/i*o,z:e.oz+r/i*o}}const qt=.02,wn=.012,bi=2.5,Ni=45,vi=wn/(2*Math.tan(Ni*Math.PI/360));function Sn(e,t=null){if(t!=null&&t.isOrthographicCamera){const i=Number(t.zoom),o=Number(t.top)-Number(t.bottom),a=Number.isFinite(o)&&Number.isFinite(i)&&i>0?Math.abs(o)/i:0;return Math.max(qt,a*vi)}const n=Number(e),r=Number.isFinite(n)&&n>0?n:10;return Math.max(qt,r*wn)}function wi(e,t=null){return Math.min(bi,Sn(e,t))}const Ht=new Se,Je=new B;class An extends kn{constructor(){super(),this.isLineSegmentsGeometry=!0,this.type="LineSegmentsGeometry";const t=[-1,2,0,1,2,0,-1,1,0,1,1,0,-1,0,0,1,0,0,-1,-1,0,1,-1,0],n=[-1,2,1,2,-1,1,1,1,-1,-1,1,-1,-1,-2,1,-2],r=[0,2,1,2,3,1,2,4,3,4,5,3,4,6,5,6,7,5];this.setIndex(r),this.setAttribute("position",new Xt(t,3)),this.setAttribute("uv",new Xt(n,2))}applyMatrix4(t){const n=this.attributes.instanceStart,r=this.attributes.instanceEnd;return n!==void 0&&(n.applyMatrix4(t),r.applyMatrix4(t),n.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}setPositions(t){let n;t instanceof Float32Array?n=t:Array.isArray(t)&&(n=new Float32Array(t));const r=new Nt(n,6,1);return this.setAttribute("instanceStart",new Be(r,3,0)),this.setAttribute("instanceEnd",new Be(r,3,3)),this.computeBoundingBox(),this.computeBoundingSphere(),this}setColors(t){let n;t instanceof Float32Array?n=t:Array.isArray(t)&&(n=new Float32Array(t));const r=new Nt(n,6,1);return this.setAttribute("instanceColorStart",new Be(r,3,0)),this.setAttribute("instanceColorEnd",new Be(r,3,3)),this}fromWireframeGeometry(t){return this.setPositions(t.attributes.position.array),this}fromEdgesGeometry(t){return this.setPositions(t.attributes.position.array),this}fromMesh(t){return this.fromWireframeGeometry(new Un(t.geometry)),this}fromLineSegments(t){const n=t.geometry;return this.setPositions(n.attributes.position.array),this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new Se);const t=this.attributes.instanceStart,n=this.attributes.instanceEnd;t!==void 0&&n!==void 0&&(this.boundingBox.setFromBufferAttribute(t),Ht.setFromBufferAttribute(n),this.boundingBox.union(Ht))}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new zn),this.boundingBox===null&&this.computeBoundingBox();const t=this.attributes.instanceStart,n=this.attributes.instanceEnd;if(t!==void 0&&n!==void 0){const r=this.boundingSphere.center;this.boundingBox.getCenter(r);let i=0;for(let o=0,a=t.count;o<a;o++)Je.fromBufferAttribute(t,o),i=Math.max(i,r.distanceToSquared(Je)),Je.fromBufferAttribute(n,o),i=Math.max(i,r.distanceToSquared(Je));this.boundingSphere.radius=Math.sqrt(i),isNaN(this.boundingSphere.radius)&&console.error("THREE.LineSegmentsGeometry.computeBoundingSphere(): Computed radius is NaN. The instanced position data is likely to have NaN values.",this)}}toJSON(){}applyMatrix(t){return console.warn("THREE.LineSegmentsGeometry: applyMatrix() has been renamed to applyMatrix4()."),this.applyMatrix4(t)}}it.line={worldUnits:{value:1},linewidth:{value:1},resolution:{value:new Ft(1,1)},dashOffset:{value:0},dashScale:{value:1},dashSize:{value:1},gapSize:{value:1}};nt.line={uniforms:Mn.merge([it.common,it.fog,it.line]),vertexShader:`
		#include <common>
		#include <color_pars_vertex>
		#include <fog_pars_vertex>
		#include <logdepthbuf_pars_vertex>
		#include <clipping_planes_pars_vertex>

		uniform float linewidth;
		uniform vec2 resolution;

		attribute vec3 instanceStart;
		attribute vec3 instanceEnd;

		attribute vec3 instanceColorStart;
		attribute vec3 instanceColorEnd;

		#ifdef WORLD_UNITS

			varying vec4 worldPos;
			varying vec3 worldStart;
			varying vec3 worldEnd;

			#ifdef USE_DASH

				varying vec2 vUv;

			#endif

		#else

			varying vec2 vUv;

		#endif

		#ifdef USE_DASH

			uniform float dashScale;
			attribute float instanceDistanceStart;
			attribute float instanceDistanceEnd;
			varying float vLineDistance;

		#endif

		void trimSegment( const in vec4 start, inout vec4 end ) {

			// trim end segment so it terminates between the camera plane and the near plane

			// conservative estimate of the near plane
			float a = projectionMatrix[ 2 ][ 2 ]; // 3nd entry in 3th column
			float b = projectionMatrix[ 3 ][ 2 ]; // 3nd entry in 4th column
			float nearEstimate = - 0.5 * b / a;

			float alpha = ( nearEstimate - start.z ) / ( end.z - start.z );

			end.xyz = mix( start.xyz, end.xyz, alpha );

		}

		void main() {

			#ifdef USE_COLOR

				vColor.xyz = ( position.y < 0.5 ) ? instanceColorStart : instanceColorEnd;

			#endif

			#ifdef USE_DASH

				vLineDistance = ( position.y < 0.5 ) ? dashScale * instanceDistanceStart : dashScale * instanceDistanceEnd;
				vUv = uv;

			#endif

			float aspect = resolution.x / resolution.y;

			// camera space
			vec4 start = modelViewMatrix * vec4( instanceStart, 1.0 );
			vec4 end = modelViewMatrix * vec4( instanceEnd, 1.0 );

			#ifdef WORLD_UNITS

				worldStart = start.xyz;
				worldEnd = end.xyz;

			#else

				vUv = uv;

			#endif

			// special case for perspective projection, and segments that terminate either in, or behind, the camera plane
			// clearly the gpu firmware has a way of addressing this issue when projecting into ndc space
			// but we need to perform ndc-space calculations in the shader, so we must address this issue directly
			// perhaps there is a more elegant solution -- WestLangley

			bool perspective = ( projectionMatrix[ 2 ][ 3 ] == - 1.0 ); // 4th entry in the 3rd column

			if ( perspective ) {

				if ( start.z < 0.0 && end.z >= 0.0 ) {

					trimSegment( start, end );

				} else if ( end.z < 0.0 && start.z >= 0.0 ) {

					trimSegment( end, start );

				}

			}

			// clip space
			vec4 clipStart = projectionMatrix * start;
			vec4 clipEnd = projectionMatrix * end;

			// ndc space
			vec3 ndcStart = clipStart.xyz / clipStart.w;
			vec3 ndcEnd = clipEnd.xyz / clipEnd.w;

			// direction
			vec2 dir = ndcEnd.xy - ndcStart.xy;

			// account for clip-space aspect ratio
			dir.x *= aspect;
			dir = normalize( dir );

			#ifdef WORLD_UNITS

				vec3 worldDir = normalize( end.xyz - start.xyz );
				vec3 tmpFwd = normalize( mix( start.xyz, end.xyz, 0.5 ) );
				vec3 worldUp = normalize( cross( worldDir, tmpFwd ) );
				vec3 worldFwd = cross( worldDir, worldUp );
				worldPos = position.y < 0.5 ? start: end;

				// height offset
				float hw = linewidth * 0.5;
				worldPos.xyz += position.x < 0.0 ? hw * worldUp : - hw * worldUp;

				// don't extend the line if we're rendering dashes because we
				// won't be rendering the endcaps
				#ifndef USE_DASH

					// cap extension
					worldPos.xyz += position.y < 0.5 ? - hw * worldDir : hw * worldDir;

					// add width to the box
					worldPos.xyz += worldFwd * hw;

					// endcaps
					if ( position.y > 1.0 || position.y < 0.0 ) {

						worldPos.xyz -= worldFwd * 2.0 * hw;

					}

				#endif

				// project the worldpos
				vec4 clip = projectionMatrix * worldPos;

				// shift the depth of the projected points so the line
				// segments overlap neatly
				vec3 clipPose = ( position.y < 0.5 ) ? ndcStart : ndcEnd;
				clip.z = clipPose.z * clip.w;

			#else

				vec2 offset = vec2( dir.y, - dir.x );
				// undo aspect ratio adjustment
				dir.x /= aspect;
				offset.x /= aspect;

				// sign flip
				if ( position.x < 0.0 ) offset *= - 1.0;

				// endcaps
				if ( position.y < 0.0 ) {

					offset += - dir;

				} else if ( position.y > 1.0 ) {

					offset += dir;

				}

				// adjust for linewidth
				offset *= linewidth;

				// adjust for clip-space to screen-space conversion // maybe resolution should be based on viewport ...
				offset /= resolution.y;

				// select end
				vec4 clip = ( position.y < 0.5 ) ? clipStart : clipEnd;

				// back to clip space
				offset *= clip.w;

				clip.xy += offset;

			#endif

			gl_Position = clip;

			vec4 mvPosition = ( position.y < 0.5 ) ? start : end; // this is an approximation

			#include <logdepthbuf_vertex>
			#include <clipping_planes_vertex>
			#include <fog_vertex>

		}
		`,fragmentShader:`
		uniform vec3 diffuse;
		uniform float opacity;
		uniform float linewidth;

		#ifdef USE_DASH

			uniform float dashOffset;
			uniform float dashSize;
			uniform float gapSize;

		#endif

		varying float vLineDistance;

		#ifdef WORLD_UNITS

			varying vec4 worldPos;
			varying vec3 worldStart;
			varying vec3 worldEnd;

			#ifdef USE_DASH

				varying vec2 vUv;

			#endif

		#else

			varying vec2 vUv;

		#endif

		#include <common>
		#include <color_pars_fragment>
		#include <fog_pars_fragment>
		#include <logdepthbuf_pars_fragment>
		#include <clipping_planes_pars_fragment>

		vec2 closestLineToLine(vec3 p1, vec3 p2, vec3 p3, vec3 p4) {

			float mua;
			float mub;

			vec3 p13 = p1 - p3;
			vec3 p43 = p4 - p3;

			vec3 p21 = p2 - p1;

			float d1343 = dot( p13, p43 );
			float d4321 = dot( p43, p21 );
			float d1321 = dot( p13, p21 );
			float d4343 = dot( p43, p43 );
			float d2121 = dot( p21, p21 );

			float denom = d2121 * d4343 - d4321 * d4321;

			float numer = d1343 * d4321 - d1321 * d4343;

			mua = numer / denom;
			mua = clamp( mua, 0.0, 1.0 );
			mub = ( d1343 + d4321 * ( mua ) ) / d4343;
			mub = clamp( mub, 0.0, 1.0 );

			return vec2( mua, mub );

		}

		void main() {

			#include <clipping_planes_fragment>

			#ifdef USE_DASH

				if ( vUv.y < - 1.0 || vUv.y > 1.0 ) discard; // discard endcaps

				if ( mod( vLineDistance + dashOffset, dashSize + gapSize ) > dashSize ) discard; // todo - FIX

			#endif

			float alpha = opacity;

			#ifdef WORLD_UNITS

				// Find the closest points on the view ray and the line segment
				vec3 rayEnd = normalize( worldPos.xyz ) * 1e5;
				vec3 lineDir = worldEnd - worldStart;
				vec2 params = closestLineToLine( worldStart, worldEnd, vec3( 0.0, 0.0, 0.0 ), rayEnd );

				vec3 p1 = worldStart + lineDir * params.x;
				vec3 p2 = rayEnd * params.y;
				vec3 delta = p1 - p2;
				float len = length( delta );
				float norm = len / linewidth;

				#ifndef USE_DASH

					#ifdef USE_ALPHA_TO_COVERAGE

						float dnorm = fwidth( norm );
						alpha = 1.0 - smoothstep( 0.5 - dnorm, 0.5 + dnorm, norm );

					#else

						if ( norm > 0.5 ) {

							discard;

						}

					#endif

				#endif

			#else

				#ifdef USE_ALPHA_TO_COVERAGE

					// artifacts appear on some hardware if a derivative is taken within a conditional
					float a = vUv.x;
					float b = ( vUv.y > 0.0 ) ? vUv.y - 1.0 : vUv.y + 1.0;
					float len2 = a * a + b * b;
					float dlen = fwidth( len2 );

					if ( abs( vUv.y ) > 1.0 ) {

						alpha = 1.0 - smoothstep( 1.0 - dlen, 1.0 + dlen, len2 );

					}

				#else

					if ( abs( vUv.y ) > 1.0 ) {

						float a = vUv.x;
						float b = ( vUv.y > 0.0 ) ? vUv.y - 1.0 : vUv.y + 1.0;
						float len2 = a * a + b * b;

						if ( len2 > 1.0 ) discard;

					}

				#endif

			#endif

			vec4 diffuseColor = vec4( diffuse, alpha );

			#include <logdepthbuf_fragment>
			#include <color_fragment>

			gl_FragColor = vec4( diffuseColor.rgb, alpha );

			#include <tonemapping_fragment>
			#include <colorspace_fragment>
			#include <fog_fragment>
			#include <premultiplied_alpha_fragment>

		}
		`};class _n extends Xn{constructor(t){super({type:"LineMaterial",uniforms:Mn.clone(nt.line.uniforms),vertexShader:nt.line.vertexShader,fragmentShader:nt.line.fragmentShader,clipping:!0}),this.isLineMaterial=!0,this.setValues(t)}get color(){return this.uniforms.diffuse.value}set color(t){this.uniforms.diffuse.value=t}get worldUnits(){return"WORLD_UNITS"in this.defines}set worldUnits(t){t===!0?this.defines.WORLD_UNITS="":delete this.defines.WORLD_UNITS}get linewidth(){return this.uniforms.linewidth.value}set linewidth(t){this.uniforms.linewidth&&(this.uniforms.linewidth.value=t)}get dashed(){return"USE_DASH"in this.defines}set dashed(t){t===!0!==this.dashed&&(this.needsUpdate=!0),t===!0?this.defines.USE_DASH="":delete this.defines.USE_DASH}get dashScale(){return this.uniforms.dashScale.value}set dashScale(t){this.uniforms.dashScale.value=t}get dashSize(){return this.uniforms.dashSize.value}set dashSize(t){this.uniforms.dashSize.value=t}get dashOffset(){return this.uniforms.dashOffset.value}set dashOffset(t){this.uniforms.dashOffset.value=t}get gapSize(){return this.uniforms.gapSize.value}set gapSize(t){this.uniforms.gapSize.value=t}get opacity(){return this.uniforms.opacity.value}set opacity(t){this.uniforms&&(this.uniforms.opacity.value=t)}get resolution(){return this.uniforms.resolution.value}set resolution(t){this.uniforms.resolution.value.copy(t)}get alphaToCoverage(){return"USE_ALPHA_TO_COVERAGE"in this.defines}set alphaToCoverage(t){this.defines&&(t===!0!==this.alphaToCoverage&&(this.needsUpdate=!0),t===!0?(this.defines.USE_ALPHA_TO_COVERAGE="",this.extensions.derivatives=!0):(delete this.defines.USE_ALPHA_TO_COVERAGE,this.extensions.derivatives=!1))}}const Jt=new B,Qt=new B,te=new ot,ne=new ot,ye=new ot,ht=new B,xt=new at,ie=new Wn,en=new B,Qe=new Se,et=new zn,ge=new ot;let ze,Oe;function tn(e,t,n){return ge.set(0,0,-t,1).applyMatrix4(e.projectionMatrix),ge.multiplyScalar(1/ge.w),ge.x=Oe/n.width,ge.y=Oe/n.height,ge.applyMatrix4(e.projectionMatrixInverse),ge.multiplyScalar(1/ge.w),Math.abs(Math.max(ge.x,ge.y))}function Si(e,t){const n=e.matrixWorld,r=e.geometry,i=r.attributes.instanceStart,o=r.attributes.instanceEnd,a=Math.min(r.instanceCount,i.count);for(let c=0,l=a;c<l;c++){ie.start.fromBufferAttribute(i,c),ie.end.fromBufferAttribute(o,c),ie.applyMatrix4(n);const f=new B,u=new B;ze.distanceSqToSegment(ie.start,ie.end,u,f),u.distanceTo(f)<Oe*.5&&t.push({point:u,pointOnLine:f,distance:ze.origin.distanceTo(u),object:e,face:null,faceIndex:c,uv:null,uv1:null})}}function Ai(e,t,n){const r=t.projectionMatrix,o=e.material.resolution,a=e.matrixWorld,c=e.geometry,l=c.attributes.instanceStart,f=c.attributes.instanceEnd,u=Math.min(c.instanceCount,l.count),m=-t.near;ze.at(1,ye),ye.w=1,ye.applyMatrix4(t.matrixWorldInverse),ye.applyMatrix4(r),ye.multiplyScalar(1/ye.w),ye.x*=o.x/2,ye.y*=o.y/2,ye.z=0,ht.copy(ye),xt.multiplyMatrices(t.matrixWorldInverse,a);for(let p=0,x=u;p<x;p++){if(te.fromBufferAttribute(l,p),ne.fromBufferAttribute(f,p),te.w=1,ne.w=1,te.applyMatrix4(xt),ne.applyMatrix4(xt),te.z>m&&ne.z>m)continue;if(te.z>m){const w=te.z-ne.z,T=(te.z-m)/w;te.lerp(ne,T)}else if(ne.z>m){const w=ne.z-te.z,T=(ne.z-m)/w;ne.lerp(te,T)}te.applyMatrix4(r),ne.applyMatrix4(r),te.multiplyScalar(1/te.w),ne.multiplyScalar(1/ne.w),te.x*=o.x/2,te.y*=o.y/2,ne.x*=o.x/2,ne.y*=o.y/2,ie.start.copy(te),ie.start.z=0,ie.end.copy(ne),ie.end.z=0;const g=ie.closestPointToPointParameter(ht,!0);ie.at(g,en);const y=Zn.lerp(te.z,ne.z,g),b=y>=-1&&y<=1,v=ht.distanceTo(en)<Oe*.5;if(b&&v){ie.start.fromBufferAttribute(l,p),ie.end.fromBufferAttribute(f,p),ie.start.applyMatrix4(a),ie.end.applyMatrix4(a);const w=new B,T=new B;ze.distanceSqToSegment(ie.start,ie.end,T,w),n.push({point:T,pointOnLine:w,distance:ze.origin.distanceTo(T),object:e,face:null,faceIndex:p,uv:null,uv1:null})}}}class _i extends Bn{constructor(t=new An,n=new _n({color:Math.random()*16777215})){super(t,n),this.isLineSegments2=!0,this.type="LineSegments2"}computeLineDistances(){const t=this.geometry,n=t.attributes.instanceStart,r=t.attributes.instanceEnd,i=new Float32Array(2*n.count);for(let a=0,c=0,l=n.count;a<l;a++,c+=2)Jt.fromBufferAttribute(n,a),Qt.fromBufferAttribute(r,a),i[c]=c===0?0:i[c-1],i[c+1]=i[c]+Jt.distanceTo(Qt);const o=new Nt(i,2,1);return t.setAttribute("instanceDistanceStart",new Be(o,1,0)),t.setAttribute("instanceDistanceEnd",new Be(o,1,1)),this}raycast(t,n){const r=this.material.worldUnits,i=t.camera;i===null&&!r&&console.error('LineSegments2: "Raycaster.camera" needs to be set in order to raycast against LineSegments2 while worldUnits is set to false.');const o=t.params.Line2!==void 0&&t.params.Line2.threshold||0;ze=t.ray;const a=this.matrixWorld,c=this.geometry,l=this.material;Oe=l.linewidth+o,c.boundingSphere===null&&c.computeBoundingSphere(),et.copy(c.boundingSphere).applyMatrix4(a);let f;if(r)f=Oe*.5;else{const m=Math.max(i.near,et.distanceToPoint(ze.origin));f=tn(i,m,l.resolution)}if(et.radius+=f,ze.intersectsSphere(et)===!1)return;c.boundingBox===null&&c.computeBoundingBox(),Qe.copy(c.boundingBox).applyMatrix4(a);let u;if(r)u=Oe*.5;else{const m=Math.max(i.near,Qe.distanceToPoint(ze.origin));u=tn(i,m,l.resolution)}Qe.expandByScalar(u),ze.intersectsBox(Qe)!==!1&&(r?Si(this,n):Ai(this,i,n))}}const Ei=1024;function Fi(e,t={}){const n=((e==null?void 0:e.length)||0)/3,r=new Float32Array(n);if(n<2)return r;const i=Number(t.wrapM??Ei),o=Number.isFinite(i)&&i>0?i:0;let a=0;for(let c=0;c+1<n;c+=2){const l=3*c,f=3*(c+1),u=e[f]-e[l],m=e[f+1]-e[l+1],p=e[f+2]-e[l+2],x=Math.hypot(u,m,p);r[c]=a,r[c+1]=a+x,a+=x,o&&a>=o&&(a%=o)}return r}const Ii=8,Li=.6,Oi=1e-4;function Ri(e,t,n){const r=Number(e),i=Number(t),o=Number(n);return!Number.isFinite(r)||!Number.isFinite(i)||!Number.isFinite(o)||r<=0||i<=0||o<=0?0:2*Math.tan(i*Math.PI/360)*r/o}function Ti(e,t,n){const r=Ri(e,t,n);return Math.max(Oi,Ii*r)}const nn=new WeakMap;function rn(e,t){var a,c;if(!Array.isArray(t)||t.length<3)return[];const n=e==null?void 0:e.edges;if(!Array.isArray(n)||!n.length)return[];let r=nn.get(n);if(!r){const l=(((a=e.points)==null?void 0:a.length)||0)/2;r=new Map;for(let f=0;f<n.length/2;f+=1){const u=n[2*f],m=n[2*f+1];if(u===m)continue;const p=u<m?u*l+m:m*l+u;r.has(p)||r.set(p,f)}nn.set(n,r)}const i=(((c=e.points)==null?void 0:c.length)||0)/2,o=[];for(let l=0;l<t.length;l+=1){const f=t[l],u=t[(l+1)%t.length];if(!Number.isInteger(f)||!Number.isInteger(u)||f===u)continue;const m=r.get(f<u?f*i+u:u*i+f);m!==void 0&&o.push(m)}return o}function Di(e,t,n,r){const i=e.points,o=i.length/2;let a=!1;for(let c=0,l=t.length-1;c<t.length;l=c,c+=1){const f=t[c],u=t[l];if(!Number.isInteger(f)||f<0||f>=o||!Number.isInteger(u)||u<0||u>=o)return!1;const m=i[2*f],p=i[2*f+1],x=i[2*u],M=i[2*u+1];if(!Number.isFinite(m)||!Number.isFinite(p)||!Number.isFinite(x)||!Number.isFinite(M))return!1;p>r!=M>r&&n<(x-m)*(r-p)/(M-p)+m&&(a=!a)}return a}function Ci(e,t){const n=e.points;let r=0;for(let i=0,o=t.length-1;i<t.length;o=i,i+=1)r+=(n[2*o]+n[2*i])*(n[2*o+1]-n[2*i+1]);return Math.abs(r)/2}function yt(e,t,n){const r=e==null?void 0:e.faces;if(!Array.isArray(r)||!r.length||!Array.isArray(e.points)||e.points.length<6||!Number.isFinite(t)||!Number.isFinite(n))return-1;let i=-1,o=1/0;for(let a=0;a<r.length;a+=1){const c=r[a];if(!Array.isArray(c)||c.length<3||!Di(e,c,t,n))continue;const l=Ci(e,c);l<=o&&(o=l,i=a)}return i}const At=1e-6;function Pi(e,{cursor:t,anchor:n=null,objId:r=null,tolM:i=0}={}){return!e||typeof e!="object"||(e.aimCursor=t||null,e.aimAnchor=n&&Number.isFinite(n.x)&&Number.isFinite(n.z)?{x:n.x,z:n.z}:null,e.aimObjId=r??null,e.aimTolM=Number.isFinite(i)&&i>0?i:0),e}function En(e,{cursor:t,anchor:n,objId:r=null}={}){if(!e||(e.aimObjId??null)!==(r??null)||!e.aimCursor||e.aimCursor!==t)return!1;const i=e.aimAnchor;return!i||!n?!1:i.x===n.x&&i.z===n.z}function hr(e,{anchor:t,cursor:n,objId:r=null,metres:i}={}){const o=Number(t==null?void 0:t.x),a=Number(t==null?void 0:t.z);if(!Number.isFinite(o)||!Number.isFinite(a))return{ok:!1,reason:"no-anchor",source:null};if(!Number.isFinite(i)||i===0)return{ok:!1,reason:"no-length",source:null};const c=Number(n==null?void 0:n.x),l=Number(n==null?void 0:n.z),f=En(e,{cursor:n,anchor:t,objId:r}),u=f&&(e.x!==c||e.z!==l),m=u?e.x-o:c-o,p=u?e.z-a:l-a;if(!Number.isFinite(m)||!Number.isFinite(p))return{ok:!1,reason:u?"no-direction":"no-cursor",source:u?"inferred":null};const x=Math.hypot(m,p),M=u?At:Math.max(At,Number.isFinite(e==null?void 0:e.aimTolM)?e.aimTolM:0);if(!(x>M))return{ok:!1,reason:"no-direction",source:u?"inferred":"cursor"};const g=m/x,y=p/x;return{ok:!0,x:o+g*i,z:a+y*i,ux:g,uz:y,source:u?"inferred":"cursor",kind:f?e.kind??null:null}}function ki(e,t){const n=Number(e),r=Number(t);if(!Number.isFinite(n)||!Number.isFinite(r))return NaN;const i=Math.atan2(-r,n)*180/Math.PI;return i<0?i+360:i}function Ui(e,t){const n=Number(e==null?void 0:e.x),r=Number(e==null?void 0:e.z),i=Number(t==null?void 0:t.x),o=Number(t==null?void 0:t.z);if(!Number.isFinite(n)||!Number.isFinite(r)||!Number.isFinite(i)||!Number.isFinite(o))return null;const a=i-n,c=o-r,l=Math.hypot(a,c);return l>At?{lenM:l,angDeg:ki(a,c),dx:a,dz:c}:null}function xr(e,{cursor:t,anchor:n,objId:r=null}={}){const i=Number(t==null?void 0:t.x),o=Number(t==null?void 0:t.z);return!Number.isFinite(i)||!Number.isFinite(o)?null:En(e,{cursor:t,anchor:n,objId:r})?!Number.isFinite(e.x)||!Number.isFinite(e.z)?{x:i,z:o,source:"cursor"}:{x:e.x,z:e.z,source:"inferred"}:{x:i,z:o,source:"cursor"}}function yr(e,t,n){const r=Number(e==null?void 0:e.x),i=Number(e==null?void 0:e.z);if(!Number.isFinite(r)||!Number.isFinite(i))return{ok:!1,reason:"no-anchor"};const o=Number(t);if(!Number.isFinite(o)||o===0)return{ok:!1,reason:"no-length"};const a=Number(n);if(!Number.isFinite(a))return{ok:!1,reason:"no-angle"};const c=a*Math.PI/180,l=Math.cos(c),f=-Math.sin(c);return{ok:!0,x:r+l*o,z:i+f*o,ux:l,uz:f}}const gt=new WeakMap;function Xi(e){const t=e==null?void 0:e.faces;if(!Array.isArray(t)||!t.length||!Array.isArray(e.points)||e.points.length<6)return null;const n=gt.get(t);if(n&&n.points===e.points)return n.geometry;const r=[],i=e.points.length/2;for(const a of t){if(!Array.isArray(a)||a.length<3)continue;const c=[];let l=!1;for(const f of a){if(!Number.isInteger(f)||f<0||f>=i){l=!0;break}const u=e.points[2*f],m=e.points[2*f+1];if(!Number.isFinite(u)||!Number.isFinite(m)){l=!0;break}c.push(new Ft(u,-m))}l||c.length<3||r.push(new Gn(c))}if(!r.length)return gt.set(t,{points:e.points,geometry:null}),null;let o=null;try{o=new Vn(r)}catch{o=null}return gt.set(t,{points:e.points,geometry:o}),o}const _t=1e-6,sn=new WeakMap,Et=(e,t=0)=>Number.isFinite(Number(e))?Number(e):t;function Bi(e){return e&&e.type==="surface"&&e.lineworkEdgeId!==void 0&&e.lineworkEdgeId!==null&&Et(e.width)>_t}function Wi(e){return e.elements.join(",")}function Zi(e,t){var v,w;const n={points:[],edges:[],wallIds:[]};if(!e||typeof e!="object"||!(t!=null&&t.id))return n;let r=sn.get(e);r||(r=new Map,sn.set(e,r));const{worldTransforms:i}=ti(e),o=(v=i[t.id])==null?void 0:v.worldMatrix;if(!o)return n;const a=`${t.id}|${Wi(o)}`,c=r.get(a);if(c)return c;const l=new at().copy(o).invert(),f=[],u=[],m=[],p=new B,x=new B,M=new B,g=new B,y=new B;for(const[T,E]of Object.entries(e)){if(!Bi(E))continue;const k=(w=i[T])==null?void 0:w.worldMatrix;if(!k)continue;const U=k.elements;x.set(U[0],U[1],U[2]),M.set(U[8],U[9],U[10]);const P=x.length(),W=M.length();if(!(P>0)||!(W>0))continue;x.multiplyScalar(1/P),M.multiplyScalar(1/W),p.setFromMatrixPosition(k);const J=Et(E.width)*P/2;if(!(J>_t))continue;const re=E.thicknessOffset==="centre"?Et(E.thicknessM)/2:0;if(g.copy(p).addScaledVector(x,-J).addScaledVector(M,-re),y.copy(p).addScaledVector(x,J).addScaledVector(M,-re),g.y=0,y.y=0,g.applyMatrix4(l),y.applyMatrix4(l),!Number.isFinite(g.x)||!Number.isFinite(g.z)||!Number.isFinite(y.x)||!Number.isFinite(y.z)||Math.hypot(y.x-g.x,y.z-g.z)<=_t)continue;const C=f.length/2;f.push(g.x,g.z,y.x,y.z),u.push(C,C+1),m.push(T)}const b={points:f,edges:u,wallIds:m};return r.set(a,b),b}function zt(e){var t;return(e==null?void 0:e.type)==="linework"&&!!((t=e==null?void 0:e.source)!=null&&t.fileName)}function on(e){const t=(e==null?void 0:e.position)||{},n=(e==null?void 0:e.rotation)||{},r=(e==null?void 0:e.scale)||{};return[Number(t.x)||0,Number(t.y)||0,Number(t.z)||0,Number(n.x??n._x)||0,Number(n.y??n._y)||0,Number(n.z??n._z)||0,Number(r.x)||1,Number(r.y)||1,Number(r.z)||1]}const Gi=(e,t)=>e.every((n,r)=>Math.abs(n-t[r])<1e-9);function an(e){return new at().compose(new B(e[0],e[1],e[2]),new Kn().setFromEuler(new bt(e[3],e[4],e[5],"XYZ")),new B(e[6]||1,e[7]||1,e[8]||1))}const cn=new WeakMap,un=new WeakMap;function Mt(e,t,n){const r=n.slice().sort((p,x)=>p-x).join(","),i=un.get(e.points);if(i&&i.sig===r&&i.srcEdges===e.edges&&i.basePoints===t)return i.payload;const o=new Set(n),a=e.edgeLayer,c=e.edges,l=[],f=new Uint8Array(t.length/2);for(let p=0;p<c.length/2;p+=1){if(o.has(a[p]??0))continue;const x=c[2*p],M=c[2*p+1];l.push(x,M),x>=0&&x<f.length&&(f[x]=1),M>=0&&M<f.length&&(f[M]=1)}const u=new Array(t.length);for(let p=0;p<f.length;p+=1)f[p]?(u[2*p]=t[2*p],u[2*p+1]=t[2*p+1]):(u[2*p]=NaN,u[2*p+1]=NaN);const m={points:u,edges:l};return un.set(e.points,{sig:r,srcEdges:c,basePoints:t,payload:m}),m}function Vi(e,t,n=null){if(!t||t.type!=="linework"||zt(t))return null;const r=Object.values(e||{});let i=null;if(t.traceSourceId){const x=e==null?void 0:e[t.traceSourceId];zt(x)&&(i=x)}if(!i){const x=r.filter(M=>zt(M)&&M.visible!==!1);x.length===1&&([i]=x)}if(!i||i.id===t.id||i.visible===!1||!Array.isArray(i.points)||!Array.isArray(i.edges)||i.edges.length===0)return null;const o=on(i),a=on(t),c=Array.isArray(n==null?void 0:n[i.id])&&n[i.id].length&&Array.isArray(i.edgeLayer)&&i.edgeLayer.length?n[i.id]:null;if(Gi(o,a))return c?Mt(i,i.points,c):{points:i.points,edges:i.edges};const l=`${o.join(",")}|${a.join(",")}`,f=cn.get(i.points);if(f&&f.sig===l)return c?Mt(i,f.points,c):{points:f.points,edges:i.edges};const u=new at().copy(an(a)).invert().multiply(an(o)),m=new B,p=new Array(i.points.length);for(let x=0;x<i.points.length;x+=2)m.set(i.points[x],0,i.points[x+1]).applyMatrix4(u),p[x]=m.x,p[x+1]=m.z;return cn.set(i.points,{sig:l,points:p}),c?Mt(i,p,c):{points:p,edges:i.edges}}const Ki={1:"#ef4444",2:"#eab308",3:"#22c55e",4:"#06b6d4",5:"#3b82f6",6:"#d946ef",7:"#d4d4d8",8:"#71717a",9:"#a1a1aa"},ln=e=>(e==null?void 0:e.color)||Ki[e==null?void 0:e.colorIndex]||"#9ca3af",$i=.55,ji="#38BDF8",Yi=.16,fn="#e879f9",dn="#fbbf24",qi="#f87171",mn="#22d3ee",pn="#ffffff",Hi="#fde047",Ji=.6,Qi=6,hn=250,er=450,xn="#34d399",yn="#a78bfa",tr=new Set(["extension","perpendicular","parallel","intersection"]);function nr(e,t){const n=e==null?void 0:e.edges;if(!n||!Number.isInteger(t)||t<0||2*t+1>=n.length)return null;const r=n[2*t],i=n[2*t+1],o=e.points[2*r],a=e.points[2*r+1],c=e.points[2*i],l=e.points[2*i+1];return[o,a,c,l].every(Number.isFinite)?{ax:o,az:a,bx:c,bz:l}:null}function gn(e,t,n){var o,a;const r=((o=t==null?void 0:t.nativeEvent)==null?void 0:o.clientX)??(t==null?void 0:t.clientX),i=((a=t==null?void 0:t.nativeEvent)==null?void 0:a.clientY)??(t==null?void 0:t.clientY);return!Number.isFinite(r)||!Number.isFinite(i)||!Number.isFinite(e==null?void 0:e.sx)||!Number.isFinite(e==null?void 0:e.sy)?n:Math.hypot(r-e.sx,i-e.sy)>Qi}function tt(e,t,n){const r=t.length/2,i=e.length/2,o=f=>{if(!Number.isInteger(f)||f<0||f>=r)return!1;const u=t[2*f],m=t[2*f+1];return Number.isInteger(u)&&u>=0&&u<i&&Number.isInteger(m)&&m>=0&&m<i};let a=0;for(let f=0;f<n.length;f+=1)o(n[f])&&(a+=1);const c=new Float32Array(a*6);let l=0;for(let f=0;f<n.length;f+=1){const u=n[f];if(!o(u))continue;const m=t[2*u],p=t[2*u+1];c[l]=e[2*m],c[l+1]=0,c[l+2]=e[2*m+1],c[l+3]=e[2*p],c[l+4]=0,c[l+5]=e[2*p+1],l+=6}return c}function ir({positions:e,color:t,opacity:n,depthTest:r=!0,dashed:i=!1}){const o=N.useRef(null),a=N.useMemo(()=>{const u=new Yn;return u.setAttribute("position",new Wt(e,3)),i&&u.setAttribute("lineDistance",new Wt(Fi(e),1)),u},[e,i]),{camera:c,size:l}=rt(),f=rt(u=>u.controls);return bn(()=>{const u=o.current;if(!i||!u)return;const m=f==null?void 0:f.target,p=m?Math.hypot(c.position.x-m.x,c.position.y-m.y,c.position.z-m.z):c.position.length(),x=Ti(p,c.fov??50,l.height);u.dashSize=x,u.gapSize=x*Li}),e.length?S.jsx("lineSegments",{geometry:a,raycast:()=>null,userData:{noProjection:!0},renderOrder:r?0:3,children:i?S.jsx("lineDashedMaterial",{ref:o,color:t,transparent:!0,opacity:n,depthTest:r}):S.jsx("lineBasicMaterial",{color:t,transparent:!0,opacity:n,depthTest:r})}):null}function Ke({positions:e,color:t,opacity:n,widthPx:r=2}){const{size:i}=rt(),o=N.useMemo(()=>{const l=new An;return l.setPositions(e),l},[e]),a=N.useMemo(()=>new _n({color:new qn(t),linewidth:r,transparent:!0,opacity:n,depthTest:!1,depthWrite:!1}),[t,r,n]),c=N.useMemo(()=>new _i(o,a),[o,a]);return N.useEffect(()=>{a.resolution.set(i.width,i.height)},[a,i.width,i.height]),N.useEffect(()=>()=>o.dispose(),[o]),N.useEffect(()=>()=>a.dispose(),[a]),e.length?(c.raycast=()=>null,c.userData={noProjection:!0},c.renderOrder=3,S.jsx("primitive",{object:c})):null}function gr({obj:e,isSelected:t,isEditing:n,subMode:r,hiddenLayers:i,lockedLayers:o,selVertices:a,selEdges:c,errorVertices:l,hover:f,onHover:u,onPick:m,onGrowSelection:p,scope:x="one",onSelectObject:M,sceneObjectRefs:g,onPointerLocal:y,onDrawClick:b,drawPoints:v,grabbing:w,dragging:T,onGrabConfirm:E,jointVertices:k,activeLayer:U,orthoRef:P,closeHoverRef:W,inferLabelRef:J,inferRef:re,boxArmed:C,onBoxSelect:fe}){const he=N.useRef(null),me=N.useRef(null),_=e.points||[],se=e.edges||[],Ae=e.edgeLayer||[],D=e.layers||[],G=oi.has(r),Me=ni(s=>s.objects),pe=N.useMemo(()=>n&&G&&!T?Zi(Me,e):null,[n,G,T,Me,e]),_e=Zt(s=>s.lineworkHiddenLayers),be=N.useMemo(()=>n&&G&&!T?Vi(Me,e,_e):null,[n,G,T,Me,e,_e]),Ge=N.useMemo(()=>new Set(i||[]),[i]),q=N.useMemo(()=>new Set([...i||[],...o||[]]),[i,o]),$e=N.useMemo(()=>{const s=new Map;for(let d=0;d<se.length/2;d+=1){const h=Ae[d]??0;if(Ge.has(h))continue;let z=s.get(h);z||(z=[],s.set(h,z)),z.push(d)}return[...s.entries()].map(([d,h])=>{var z;return{key:d,color:ln(D[d]),dashed:((z=D[d])==null?void 0:z.style)==="dashed",positions:tt(_,se,h)}})},[_,se,Ae,D,Ge]),je=N.useMemo(()=>tt(_,se,c||[]),[_,se,c]),R=N.useMemo(()=>(f==null?void 0:f.kind)==="edge"&&f.id>=0?tt(_,se,[f.id]):new Float32Array(0),[_,se,f]),K=r==="vertex"||G,F=N.useMemo(()=>{if(!n||!K)return new Float32Array(0);const s=_.length/2,d=new Float32Array(s*3);for(let h=0;h<s;h+=1)d[3*h]=_[2*h],d[3*h+1]=0,d[3*h+2]=_[2*h+1];return d},[_,n,K]),I=N.useMemo(()=>{const s=(n&&K?k||[]:[]).filter(h=>h>=0&&h<_.length/2),d=new Float32Array(s.length*3);return s.forEach((h,z)=>{d[3*z]=_[2*h],d[3*z+1]=0,d[3*z+2]=_[2*h+1]}),d},[_,k,n,K]),V=N.useMemo(()=>{if(!n||!K)return new Float32Array(0);const s=[...a||[]];(f==null?void 0:f.kind)==="vertex"&&f.id>=0&&!s.includes(f.id)&&s.push(f.id);const d=s.filter(z=>Number.isInteger(z)&&z>=0&&z<_.length/2),h=new Float32Array(d.length*3);return d.forEach((z,A)=>{h[3*A]=_[2*z],h[3*A+1]=0,h[3*A+2]=_[2*z+1]}),h},[_,a,f,n,K]),$=N.useMemo(()=>{const s=(l||[]).filter(h=>h>=0&&h<_.length/2),d=new Float32Array(s.length*3);return s.forEach((h,z)=>{d[3*z]=_[2*h],d[3*z+1]=0,d[3*z+2]=_[2*h+1]}),d},[_,l]),X=N.useMemo(()=>{let s=1/0,d=-1/0,h=1/0,z=-1/0;for(let H=0;H<_.length;H+=2)_[H]<s&&(s=_[H]),_[H]>d&&(d=_[H]),_[H+1]<h&&(h=_[H+1]),_[H+1]>z&&(z=_[H+1]);if(!Number.isFinite(s))return n?{w:40,h:40,cx:0,cz:0}:{w:1,h:1,cx:0,cz:0};const A=d-s,L=z-h;if(!n)return{w:A+2,h:L+2,cx:(s+d)/2,cz:(h+z)/2};const j=Math.max(5,Math.max(A,L)*.5),Q=(H,ve)=>ve<0?Math.floor(H):Math.ceil(H),O=Q(s-j,-1),de=Q(d+j,1),ce=Q(h-j,-1),ue=Q(z+j,1);return{w:de-O,h:ue-ce,cx:(O+de)/2,cz:(ce+ue)/2}},[_,n]),Z=N.useCallback(s=>{const d=he.current;if(!d||!(s!=null&&s.point))return null;const h=s.point.clone();return d.worldToLocal(h),{x:h.x,z:h.z}},[]),{camera:ee,gl:oe,invalidate:Ne}=rt(),Ee=N.useCallback(s=>Sn(s==null?void 0:s.distance,ee),[ee]),Re=N.useCallback(s=>wi(s==null?void 0:s.distance,ee),[ee]),[Te,ct]=N.useState(null),ae=N.useRef(null),[ut,we]=N.useState(null),[Ye,qe]=N.useState(-1),Fn=N.useMemo(()=>{var d;if(Ye<0||!((d=e.faces)!=null&&d[Ye]))return new Float32Array(0);const s=rn(e,e.faces[Ye]).filter(h=>{var z;return!q||!q.has(((z=e.edgeLayer)==null?void 0:z[h])??0)});return s.length?tt(_,se,s):new Float32Array(0)},[Ye,e,_,se,q]);N.useEffect(()=>{qe(-1)},[r,e.id,G,w]);const Ve=N.useMemo(()=>{const s=v||[];if(!s.length)return null;const d=s[s.length-1];return{x:d[0],z:d[1]}},[v]),Fe=N.useRef(null),De=N.useRef(null),xe=N.useRef(null),Ce=N.useRef(!1),In=N.useRef(null),Pe=re||In,ke=N.useCallback((s,d)=>{var A,L;const h=Re(d),z=Pi(zi(e,{cursor:s,anchor:Ve,tolM:h,ref:((A=De.current)==null?void 0:A.id)??null,refSrc:((L=De.current)==null?void 0:L.src)||"lw",ortho:r!=="rect"&&!!(P!=null&&P.current),suspend:Ce.current,inference:r==="draw",hiddenLayers:q,walls:pe,refDrawing:be}),{cursor:s,anchor:Ve,objId:e.id,tolM:h});if(r==="draw"){let j=Ce.current?null:ii(v,s.x,s.z,h);j&&z.kind==="endpoint"&&Math.hypot(s.x-z.x,s.z-z.z)<Math.hypot(s.x-j.x,s.z-j.z)&&(j=null),W&&(W.current=j?{count:(v||[]).length}:null),j&&(z.x=j.x,z.z=j.z,z.kind="endpoint",z.label="Close the loop — Enter",z.closeLoop=!0,z.onEdge=!1,z.edgeId=null,z.guide=null,z.refEdgeId=null)}else W&&(W.current=null);return z},[e,Ve,v,W,Re,P,q,r,pe,be]),Lt=N.useRef(null),Ot=N.useRef(10);N.useEffect(()=>{if(!n||!G)return;const s=d=>{const h=d.key==="Shift",z=d.key==="Control"||d.key==="Meta";if(!h&&!z)return;z&&(Ce.current=d.type==="keydown");const A=Lt.current;if(!A)return;const L=ke(A,{distance:Ot.current});Pe.current=L,ct({x:L.x,z:L.z})};return window.addEventListener("keydown",s),window.addEventListener("keyup",s),()=>{window.removeEventListener("keydown",s),window.removeEventListener("keyup",s),Ce.current=!1}},[n,G,ke]);const Ue=N.useCallback(()=>{xe.current&&(clearTimeout(xe.current),xe.current=null)},[]);N.useEffect(()=>{Ve||(De.current=null,Fe.current=null,Ue())},[Ve,Ue]),N.useEffect(()=>{De.current=null,Fe.current=null,Ue()},[r,e.id,Ue]),N.useEffect(()=>()=>Ue(),[Ue]),N.useEffect(()=>{if(!(!n||!G))return()=>{Pe.current=null}},[n,G,r,e.id,Pe]);const Ln=N.useCallback(s=>{var z,A;if(!n)return;const d=Z(s);if(!d)return;if(y==null||y(d),C&&ae.current){we({minX:Math.min(ae.current.x,d.x),maxX:Math.max(ae.current.x,d.x),minZ:Math.min(ae.current.z,d.z),maxZ:Math.max(ae.current.z,d.z),crossing:d.x<ae.current.x});return}if(T)return;if(G){Lt.current=d,Ot.current=(s==null?void 0:s.distance)||10;const L=ke(d,s);Pe.current=L,ct({x:L.x,z:L.z});const j=Re(s),Q=Le(e,d.x,d.z,j,{hiddenLayers:q});if(Q>=0){u==null||u({kind:"vertex",id:Q}),Fe.current=null;return}const O=Ie(e,d.x,d.z,j,{hiddenLayers:q});u==null||u(O>=0?{kind:"edge",id:O}:null);let de=O,ce="lw";if(O<0&&pe){const ue=Ie(pe,d.x,d.z,j);ue>=0&&(de=ue,ce="walls")}if(de<0&&be){const ue=Ie(be,d.x,d.z,j);ue>=0&&(de=ue,ce="plan")}if(de<0||Ce.current)Fe.current=null,xe.current&&(clearTimeout(xe.current),xe.current=null);else{const ue=Date.now(),H=Fe.current;if(!H||H.id!==de||H.src!==ce){const ve={id:de,src:ce,since:ue};Fe.current=ve,xe.current&&clearTimeout(xe.current),xe.current=setTimeout(()=>{xe.current=null,Fe.current===ve&&!Ce.current&&(De.current={id:ve.id,src:ve.src})},hn)}else ue-H.since>=hn&&(De.current={id:de,src:ce})}return}if(w)return;const h=Ee(s);if(r==="vertex"){const L=Le(e,d.x,d.z,h,{hiddenLayers:q});u==null||u(L>=0?{kind:"vertex",id:L}:null),qe(L>=0?-1:(z=e.faces)!=null&&z.length?yt(e,d.x,d.z):-1)}else{const L=Ie(e,d.x,d.z,h,{hiddenLayers:q});u==null||u(L>=0?{kind:"edge",id:L}:null),qe(L>=0?-1:(A=e.faces)!=null&&A.length?yt(e,d.x,d.z):-1)}},[n,r,G,e,q,Z,Ee,Re,u,y,C,w,T,ke,pe]),On=N.useCallback(s=>{var H,ve;if(e.isLocked||(s==null?void 0:s.button)!==void 0&&s.button!==0||n&&ri(s)||n&&(s!=null&&s.altKey))return;if(!n){const Y=Zt.getState().lineworkEditId;if(G&&Y&&Y!==e.id)return;s.stopPropagation(),M==null||M(e.id,s);return}const d=Z(s);if(!d)return;s.stopPropagation();const h=Ee(s);if(w){E==null||E();return}if(ae.current={x:d.x,z:d.z,tol:h,sx:((H=s==null?void 0:s.nativeEvent)==null?void 0:H.clientX)??(s==null?void 0:s.clientX),sy:((ve=s==null?void 0:s.nativeEvent)==null?void 0:ve.clientY)??(s==null?void 0:s.clientY)},C){we(null);return}if(G){const Y=ke(d,s);Pe.current=Y,ae.current.draw={x:Y.x,z:Y.z,onEdge:Y.onEdge,edgeId:Y.edgeId,tolM:Re(s)};return}const z=Date.now(),A=me.current,L=A&&Math.hypot(d.x-A.x,d.z-A.z)<=h*2,j=A&&L&&z-A.t<er?A.n+1:1;me.current={t:z,x:d.x,z:d.z,n:j};const Q=x==="joined"?"linked":x==="run"?"chain":null,O=j>=3?"linked":j>=2?"chain":null,de=Q==="linked"||O==="linked"?"linked":Q||O,ce=!!(s.shiftKey||s.ctrlKey||s.metaKey);if(de&&!(Q&&ce)&&(r==="vertex"||r==="edge")){const Y=Ie(e,d.x,d.z,h,{hiddenLayers:q}),He=Y>=0?-1:Le(e,d.x,d.z,h,{hiddenLayers:q});if(Y>=0||He>=0){m==null||m(Y>=0?"edge":"vertex",Y>=0?Y:He,{additive:!1}),p==null||p(de,Q?{quiet:!0}:void 0);return}}if(r==="vertex"){const Y=Le(e,d.x,d.z,h,{hiddenLayers:q});if(Y>=0){m==null||m("vertex",Y,{additive:ce});return}}else{const Y=Ie(e,d.x,d.z,h,{hiddenLayers:q});if(Y>=0){m==null||m("edge",Y,{additive:ce});return}}const ue=yt(e,d.x,d.z);if(ue>=0){const Y=rn(e,e.faces[ue]).filter(He=>{var Ut;return!q||!q.has(((Ut=e.edgeLayer)==null?void 0:Ut[He])??0)});if(Y.length){m==null||m("face",Y,{additive:ce});return}}m==null||m(r==="vertex"?"vertex":"edge",-1,{additive:ce})},[e,_,n,r,x,G,q,Z,Ee,Re,m,M,ke,w,E,C,b,p]),Rn=N.useCallback(s=>{if((s==null?void 0:s.button)!==void 0&&s.button!==0)return;const d=ae.current;if(ae.current=null,!n||!d){we(null);return}const h=Z(s)||{x:d.x,z:d.z},z=Math.hypot(h.x-d.x,h.z-d.z)>=d.tol*Ji;if(d.draw){gn(d,s,z)||(s.stopPropagation(),b==null||b(d.draw)),we(null);return}if(!C){we(null);return}const A=h;if(!z){we(null);return}s.stopPropagation(),fe==null||fe({minX:Math.min(d.x,A.x),maxX:Math.max(d.x,A.x),minZ:Math.min(d.z,A.z),maxZ:Math.max(d.z,A.z)},{additive:!!(s.shiftKey||s.ctrlKey||s.metaKey),crossing:A.x<d.x}),we(null)},[n,C,Z,fe,b]),lt=N.useRef(null);lt.current||(lt.current={raycaster:new jn,ndc:new Ft,plane:new $n,origin:new B,normal:new B,hit:new B}),N.useEffect(()=>{if(!n||!w||!ee||!(oe!=null&&oe.domElement))return;const s=lt.current,d=h=>{const z=he.current;if(!z)return;const A=oe.domElement.getBoundingClientRect();!A.width||!A.height||(s.ndc.set((h.clientX-A.left)/A.width*2-1,-((h.clientY-A.top)/A.height)*2+1),s.raycaster.setFromCamera(s.ndc,ee),s.origin.setFromMatrixPosition(z.matrixWorld),s.normal.set(0,1,0).transformDirection(z.matrixWorld).normalize(),s.plane.setFromNormalAndCoplanarPoint(s.normal,s.origin),s.raycaster.ray.intersectPlane(s.plane,s.hit)&&(z.worldToLocal(s.hit),y==null||y({x:s.hit.x,z:s.hit.z})))};return window.addEventListener("pointermove",d,!0),()=>window.removeEventListener("pointermove",d,!0)},[n,w,ee,oe,y]),N.useEffect(()=>{if(!n||!G)return;const s=d=>{if(d.button!==void 0&&d.button!==0)return;const h=ae.current;h!=null&&h.draw&&(ae.current=null,gn(h,d,!1)||b==null||b(h.draw))};return window.addEventListener("pointerup",s),window.addEventListener("pointercancel",s),()=>{window.removeEventListener("pointerup",s),window.removeEventListener("pointercancel",s)}},[n,G,b]),N.useEffect(()=>{if(!n||!C)return;const s=d=>{d.button!==void 0&&d.button!==0||ae.current&&(ae.current=null,we(null))};return window.addEventListener("pointerup",s),window.addEventListener("pointercancel",s),()=>{window.removeEventListener("pointerup",s),window.removeEventListener("pointercancel",s)}},[n,C]);const Tn=N.useMemo(()=>{const s=v||[];if(!s.length)return new Float32Array(0);if(r==="rect"&&s.length===1&&Te){const[h,z]=s[0],{x:A,z:L}=Te;return new Float32Array([h,0,z,A,0,z,A,0,z,A,0,L,A,0,L,h,0,L,h,0,L,h,0,z])}const d=[];for(let h=0;h+1<s.length;h+=1)d.push(s[h][0],0,s[h][1],s[h+1][0],0,s[h+1][1]);if(Te){const h=s[s.length-1];d.push(h[0],0,h[1],Te.x,0,Te.z)}return new Float32Array(d)},[v,Te,r]),Rt=N.useMemo(()=>{const s=(v||[]).slice(0,-1),d=new Float32Array(s.length*3);return s.forEach((h,z)=>{d[3*z]=h[0],d[3*z+1]=0,d[3*z+2]=h[1]}),d},[v]),Tt=N.useMemo(()=>{const s=v||[];if(!s.length)return new Float32Array(0);const d=s[s.length-1];return new Float32Array([d[0],0,d[1]])},[v]),Dn=N.useMemo(()=>!Number.isInteger(U)||!D[U]?mn:ln(D[U]),[D,U]),Dt=N.useRef(null),ft=N.useRef(null),Ct=N.useRef(null),Cn=N.useRef(null),Pt=N.useRef(null),Xe=N.useMemo(()=>({marker:new Float32Array(3),guide:new Float32Array(12)}),[]);bn(()=>{if(!n||!G)return;const s=Pe.current,d=Dt.current,h=Ct.current;if(!d||!h)return;const z=s?`${s.kind}|${s.closeLoop?"C":""}|${s.x}|${s.z}|${s.guide?`${s.guide.ox},${s.guide.oz},${s.guide.x},${s.guide.z}`:""}|${s.refEdgeId??""}${s.refSrc??""}|${s.aimAnchor?`${s.aimAnchor.x},${s.aimAnchor.z}`:""}`:"";if(Pt.current===z)return;Pt.current=z;const A=!!s&&s.kind!=="free"&&s.kind!=="ortho";d.visible=A,A&&(Xe.marker[0]=s.x,Xe.marker[1]=0,Xe.marker[2]=s.z,d.geometry.attributes.position.needsUpdate=!0,ft.current&&ft.current.color.set(tr.has(s.kind)?yn:xn));const L=s==null?void 0:s.guide,j=(s==null?void 0:s.refSrc)==="walls"?pe:(s==null?void 0:s.refSrc)==="plan"?be:e,Q=(s==null?void 0:s.refEdgeId)!=null?nr(j,s.refEdgeId):null;if(h.visible=!!L,L){const O=Xe.guide;O[0]=L.ox,O[1]=0,O[2]=L.oz,O[3]=L.x,O[4]=0,O[5]=L.z,Q?(O[6]=Q.ax,O[7]=0,O[8]=Q.az,O[9]=Q.bx,O[10]=0,O[11]=Q.bz):(O[6]=L.ox,O[7]=0,O[8]=L.oz,O[9]=L.ox,O[10]=0,O[11]=L.oz),h.geometry.attributes.position.needsUpdate=!0}if(J){const O=s?Ui(s.aimAnchor,s):null;J.current=A||O?{label:A&&(s.label||St[s.kind])||"",x:s.x,z:s.z,kind:s.kind,mode:r==="rect"?"rect":"line",lenM:O?O.lenM:null,angDeg:O?O.angDeg:null,w:O?Math.abs(O.dx):null,d:O?Math.abs(O.dz):null}:null}Ne()});const Pn=N.useMemo(()=>{if(!ut)return new Float32Array(0);const{minX:s,maxX:d,minZ:h,maxZ:z}=ut;return new Float32Array([s,0,h,d,0,h,d,0,h,d,0,z,d,0,z,s,0,z,s,0,z,s,0,h])},[ut]),kt=N.useMemo(()=>Xi(e),[e]);return e.visible===!1?null:S.jsxs("group",{ref:s=>{he.current=s,s&&g&&(g.current[e.id]=s)},position:e.position,rotation:e.rotation,scale:e.scale||new B(1,1,1),userData:{objectId:e.id,selectionPriority:Nn.MODEL,noProjection:!0},children:[kt&&S.jsx("mesh",{geometry:kt,rotation:[-Math.PI/2,0,0],raycast:()=>null,renderOrder:1,userData:{noProjection:!0},children:S.jsx("meshBasicMaterial",{color:ji,transparent:!0,opacity:Yi,side:Bt,depthWrite:!1})}),S.jsxs("mesh",{position:[X.cx,0,X.cz],rotation:[-Math.PI/2,0,0],userData:{noProjection:!0},onPointerMove:Ln,onPointerOut:()=>{n&&(u==null||u(null),ct(null),qe(-1))},onPointerDown:On,onPointerUp:Rn,children:[S.jsx("planeGeometry",{args:[X.w,X.h]}),S.jsx("meshBasicMaterial",{transparent:!0,opacity:0,depthWrite:!1,side:Bt})]}),$e.map(s=>S.jsx(ir,{positions:s.positions,color:s.color,dashed:s.dashed,opacity:n?.85:t?.8:$i},s.key)),S.jsx(Ke,{positions:je,color:fn,opacity:1,widthPx:2}),S.jsx(Ke,{positions:R,color:dn,opacity:1,widthPx:2}),S.jsx(Ke,{positions:Fn,color:dn,opacity:.8,widthPx:2}),S.jsxs("points",{visible:n&&K&&F.length>0,raycast:()=>null,userData:{noProjection:!0},renderOrder:2,children:[S.jsx("bufferGeometry",{children:S.jsx("bufferAttribute",{attach:"attributes-position",args:[F,3]})}),S.jsx("pointsMaterial",{color:"#7dd3fc",size:5,sizeAttenuation:!1,transparent:!0,opacity:.9,depthTest:!1})]}),S.jsxs("points",{visible:n&&K&&I.length>0,raycast:()=>null,userData:{noProjection:!0},renderOrder:3,children:[S.jsx("bufferGeometry",{children:S.jsx("bufferAttribute",{attach:"attributes-position",args:[I,3]})}),S.jsx("pointsMaterial",{color:Hi,size:8,sizeAttenuation:!1,transparent:!0,opacity:1,depthTest:!1})]}),S.jsxs("points",{visible:n&&K&&V.length>0,raycast:()=>null,userData:{noProjection:!0},renderOrder:4,children:[S.jsx("bufferGeometry",{children:S.jsx("bufferAttribute",{attach:"attributes-position",args:[V,3]})}),S.jsx("pointsMaterial",{color:fn,size:9,sizeAttenuation:!1,transparent:!0,opacity:1,depthTest:!1})]}),n&&S.jsx(Ke,{positions:Tn,color:Dn,opacity:1,widthPx:2}),S.jsxs("points",{visible:n&&Rt.length>0,raycast:()=>null,userData:{noProjection:!0},renderOrder:5,children:[S.jsx("bufferGeometry",{children:S.jsx("bufferAttribute",{attach:"attributes-position",args:[Rt,3]})}),S.jsx("pointsMaterial",{color:pn,size:9,sizeAttenuation:!1,transparent:!0,opacity:1,depthTest:!1})]}),S.jsxs("points",{visible:n&&Tt.length>0,raycast:()=>null,userData:{noProjection:!0},renderOrder:5,children:[S.jsx("bufferGeometry",{children:S.jsx("bufferAttribute",{attach:"attributes-position",args:[Tt,3]})}),S.jsx("pointsMaterial",{color:pn,size:14,sizeAttenuation:!1,transparent:!0,opacity:1,depthTest:!1})]}),n&&S.jsx(Ke,{positions:Pn,color:mn,opacity:.9,widthPx:1.5}),n&&G&&S.jsxs(S.Fragment,{children:[S.jsxs("points",{ref:Dt,raycast:()=>null,userData:{noProjection:!0},renderOrder:5,visible:!1,children:[S.jsx("bufferGeometry",{children:S.jsx("bufferAttribute",{attach:"attributes-position",args:[Xe.marker,3]})}),S.jsx("pointsMaterial",{ref:ft,color:xn,size:11,sizeAttenuation:!1,transparent:!0,opacity:1,depthTest:!1})]}),S.jsxs("lineSegments",{ref:Ct,raycast:()=>null,userData:{noProjection:!0},renderOrder:4,visible:!1,children:[S.jsx("bufferGeometry",{children:S.jsx("bufferAttribute",{attach:"attributes-position",args:[Xe.guide,3]})}),S.jsx("lineBasicMaterial",{ref:Cn,color:yn,transparent:!0,opacity:.6,depthTest:!1})]})]}),S.jsxs("points",{visible:n&&$.length>0,raycast:()=>null,userData:{noProjection:!0},renderOrder:6,children:[S.jsx("bufferGeometry",{children:S.jsx("bufferAttribute",{attach:"attributes-position",args:[$,3]})}),S.jsx("pointsMaterial",{color:qi,size:12,sizeAttenuation:!1,transparent:!0,opacity:1,depthTest:!1})]})]})}export{Ki as A,oi as L,Nn as S,vt as a,wt as b,di as c,mr as d,fr as e,si as f,dr as g,xr as h,vn as i,yr as j,gr as k,ln as l,pr as m,lr as o,Sn as p,zi as r,ur as s,hr as t};
