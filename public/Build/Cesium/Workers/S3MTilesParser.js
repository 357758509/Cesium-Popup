define(["./createTaskProcessorWorker","./ComponentDatatype-c140a87d","./Color-5008547b","./getStringFromTypedArray-c37342c0","./S3MCompressType-555475e4","./Cartographic-3309dd0d","./PrimitiveType-a54dc62f","./pako_inflate-f73548c4","./when-b60132fc","./Check-7b2a090c","./WebGLConstants-4ae0db90","./FeatureDetection-c3b71206","./Math-119be1a3","./RuntimeError-4a5c8994","./IndexDatatype-8a5eead4","./Cartesian4-3ca25aab"],(function(t,e,r,n,a,i,o,E,s,y,p,T,u,l,c,A){"use strict";function d(t,e,r,n,a,i){this.left=t,this.bottom=e,this.right=r,this.top=n,this.minHeight=a,this.maxHeight=i,this.width=r-t,this.length=n-e,this.height=i-a}function v(t,r,n,E,s,y,p){var T=s.getUint32(y,!0);y+=Uint32Array.BYTES_PER_ELEMENT;var u=0,l={},c=l.vertexAttributes=[],A=l.attrLocation={};l.instanceCount=0,l.instanceMode=0;var d=0;s.getUint32(y,!0),y+=Uint32Array.BYTES_PER_ELEMENT;var v=s.getUint16(y,!0);y+=Uint32Array.BYTES_PER_ELEMENT;var _=v;v>4&&(_=v>>8,v&=15);var m=s.getUint32(y,!0);y+=Uint32Array.BYTES_PER_ELEMENT;var f=void 0,g=void 0;if(m>0){var B=s.getUint16(y,!0);B=v*Float32Array.BYTES_PER_ELEMENT,y+=Uint32Array.BYTES_PER_ELEMENT,u=m*B;var P=E.subarray(y,y+u);if(n){var U=new i.Cartesian3,L=new i.Cartesian3,h=new Float32Array(P.buffer,P.byteOffset,P.byteLength/4),M=new i.Cartographic;f=new i.Cartographic,g=new i.Cartographic;for(var S=new Float32Array(2*m),N=new Float64Array(2*m),R=0;R<m;R++)o.Matrix4.multiplyByPoint(r,i.Cartesian3.fromElements(h[3*R],h[3*R+1],h[3*R+2],U),L),M=i.Cartographic.fromCartesian(L),N[2*R]=M.longitude,N[2*R+1]=M.latitude,0===R?(f.longitude=M.longitude,f.latitude=M.latitude,g.longitude=M.longitude,g.latitude=M.latitude):(f.longitude=Math.max(M.longitude,f.longitude),f.latitude=Math.max(M.latitude,f.latitude),g.longitude=Math.min(M.longitude,g.longitude),g.latitude=Math.min(M.latitude,g.latitude));for(R=0;R<m;R++)S[2*R]=N[2*R]-g.longitude,S[2*R+1]=N[2*R+1]-g.latitude;A.img=d,c.push({index:A.img,typedArray:S,componentsPerAttribute:2,componentDatatype:e.ComponentDatatype.FLOAT,offsetInBytes:0,strideInBytes:2*Float32Array.BYTES_PER_ELEMENT,normalize:!1}),d++}A.aPosition=d,c.push({index:A.aPosition,typedArray:P,componentsPerAttribute:v,componentDatatype:e.ComponentDatatype.FLOAT,offsetInBytes:0,strideInBytes:B,normalize:!1}),d++,y+=u}var D=s.getUint32(y,!0);if(y+=Uint32Array.BYTES_PER_ELEMENT,D>0){var Y=s.getUint16(y,!0);Y=_*Float32Array.BYTES_PER_ELEMENT,y+=Uint32Array.BYTES_PER_ELEMENT,u=D*Y,t.ignoreNormal||(A.aNormal=d,c.push({index:A.aNormal,typedArray:E.subarray(y,y+u),componentsPerAttribute:_,componentDatatype:e.ComponentDatatype.FLOAT,offsetInBytes:0,strideInBytes:Y,normalize:!1}),d++),y+=u}var C=s.getUint32(y,!0);if(y+=Uint32Array.BYTES_PER_ELEMENT,C>0){var I=new Uint8Array(4*C);p.push(I.buffer);var b=s.getUint32(y,!0);b=4*Float32Array.BYTES_PER_ELEMENT,y+=Uint32Array.BYTES_PER_ELEMENT,u=C*b;for(var F=new Float32Array(E.buffer,y,4*m),x=0;x<m;x++)I[4*x]=255*F[4*x],I[4*x+1]=255*F[4*x+1],I[4*x+2]=255*F[4*x+2],I[4*x+3]=255*F[4*x+3];y+=u,A.aColor=d,c.push({index:A.aColor,typedArray:I,componentsPerAttribute:4,componentDatatype:e.ComponentDatatype.UNSIGNED_BYTE,offsetInBytes:0,strideInBytes:4,normalize:!0}),d++}var w=s.getUint32(y,!0);y+=Uint32Array.BYTES_PER_ELEMENT,w>0&&(y+=u=16*w);var O=s.getUint32(y,!0);y+=Uint32Array.BYTES_PER_ELEMENT;for(var k,z,G=-1,H=0;H<O;H++){k=s.getUint32(y,!0),y+=Uint32Array.BYTES_PER_ELEMENT,z=s.getUint16(y,!0),y+=Uint16Array.BYTES_PER_ELEMENT,s.getUint16(y,!0),y+=Uint16Array.BYTES_PER_ELEMENT,u=k*z*Float32Array.BYTES_PER_ELEMENT;var W,V=E.subarray(y,y+u);if(-1!=G||20!=z&&35!=z)if(-1!==G)l.instanceBounds=new Float32Array(E.buffer,y,k*z);else{var X="aTexCoord"+H;A[X]=d++,c.push({index:A[X],typedArray:V,componentsPerAttribute:z,componentDatatype:e.ComponentDatatype.FLOAT,offsetInBytes:0,strideInBytes:z*Float32Array.BYTES_PER_ELEMENT,normalize:!1})}else G=H,l.instanceCount=k,l.instanceMode=z,l.instanceBuffer=V,20===z?(W=20*Float32Array.BYTES_PER_ELEMENT,A.uv2=d++,c.push({index:A.uv2,componentsPerAttribute:4,componentDatatype:e.ComponentDatatype.FLOAT,normalize:!1,offsetInBytes:0,strideInBytes:W,instanceDivisor:1}),A.uv3=d++,c.push({index:A.uv3,componentsPerAttribute:4,componentDatatype:e.ComponentDatatype.FLOAT,normalize:!1,offsetInBytes:4*Float32Array.BYTES_PER_ELEMENT,strideInBytes:W,instanceDivisor:1}),A.uv4=d++,c.push({index:A.uv4,componentsPerAttribute:4,componentDatatype:e.ComponentDatatype.FLOAT,normalize:!1,offsetInBytes:8*Float32Array.BYTES_PER_ELEMENT,strideInBytes:W,instanceDivisor:1}),A.secondary_colour=d++,c.push({index:A.secondary_colour,componentsPerAttribute:4,componentDatatype:e.ComponentDatatype.FLOAT,normalize:!1,offsetInBytes:12*Float32Array.BYTES_PER_ELEMENT,strideInBytes:W,instanceDivisor:1}),A.uv6=d++,c.push({index:A.uv6,componentsPerAttribute:4,componentDatatype:e.ComponentDatatype.FLOAT,normalize:!1,offsetInBytes:16*Float32Array.BYTES_PER_ELEMENT,strideInBytes:W,instanceDivisor:1})):35===z&&(W=35*Float32Array.BYTES_PER_ELEMENT,A.uv1=d++,c.push({index:A.uv1,componentsPerAttribute:4,componentDatatype:e.ComponentDatatype.FLOAT,normalize:!1,offsetInBytes:0,strideInBytes:W,instanceDivisor:1,byteLength:u}),A.uv2=d++,c.push({index:A.uv2,componentsPerAttribute:4,componentDatatype:e.ComponentDatatype.FLOAT,normalize:!1,offsetInBytes:4*Float32Array.BYTES_PER_ELEMENT,strideInBytes:W,instanceDivisor:1}),A.uv3=d++,c.push({index:A.uv3,componentsPerAttribute:4,componentDatatype:e.ComponentDatatype.FLOAT,normalize:!1,offsetInBytes:8*Float32Array.BYTES_PER_ELEMENT,strideInBytes:W,instanceDivisor:1}),A.uv4=d++,c.push({index:A.uv4,componentsPerAttribute:4,componentDatatype:e.ComponentDatatype.FLOAT,normalize:!1,offsetInBytes:12*Float32Array.BYTES_PER_ELEMENT,strideInBytes:W,instanceDivisor:1}),A.uv5=d++,c.push({index:A.uv5,componentsPerAttribute:4,componentDatatype:e.ComponentDatatype.FLOAT,normalize:!1,offsetInBytes:16*Float32Array.BYTES_PER_ELEMENT,strideInBytes:W,instanceDivisor:1}),A.uv6=d++,c.push({index:A.uv6,componentsPerAttribute:4,componentDatatype:e.ComponentDatatype.FLOAT,normalize:!1,offsetInBytes:20*Float32Array.BYTES_PER_ELEMENT,strideInBytes:W,instanceDivisor:1}),A.uv7=d++,c.push({index:A.uv7,componentsPerAttribute:3,componentDatatype:e.ComponentDatatype.FLOAT,normalize:!1,offsetInBytes:24*Float32Array.BYTES_PER_ELEMENT,strideInBytes:W,instanceDivisor:1}),A.secondary_colour=d++,c.push({index:A.secondary_colour,componentsPerAttribute:4,componentDatatype:e.ComponentDatatype.FLOAT,normalize:!1,offsetInBytes:27*Float32Array.BYTES_PER_ELEMENT,strideInBytes:W,instanceDivisor:1}),A.uv9=d++,c.push({index:A.uv9,componentsPerAttribute:4,componentDatatype:e.ComponentDatatype.FLOAT,normalize:!1,offsetInBytes:31*Float32Array.BYTES_PER_ELEMENT,strideInBytes:W,instanceDivisor:1}));y+=u}l.verticesCount=m,l.instanceIndex=G;var j=s.getUint32(y,!0);y+=Uint32Array.BYTES_PER_ELEMENT;var q,J=[];for(H=0;H<j;H++){var K={},Q=s.getUint32(y,!0);y+=Uint32Array.BYTES_PER_ELEMENT;var Z=s.getUint8(y,!0);y+=Uint8Array.BYTES_PER_ELEMENT,s.getUint8(y,!0),y+=Uint8Array.BYTES_PER_ELEMENT;var $=s.getUint8(y,!0);y+=Uint8Array.BYTES_PER_ELEMENT,y+=1,K.indicesCount=Q,K.indexType=Z,K.primitiveType=$;var tt=y;Q>0&&(0==Z?(y+=u=Q*Uint16Array.BYTES_PER_ELEMENT,Q%2==1&&(y+=2)):y+=u=4*Q),K.indicesTypedArray=E.subarray(tt,tt+u);var et=s.getUint32(y,!0);y+=Uint32Array.BYTES_PER_ELEMENT;var rt=s.getUint32(y,!0);y+=Uint32Array.BYTES_PER_ELEMENT*et,K.materialCode=rt,J.push(K)}return 2===J.length&&13===J[1].primitiveType&&J[1].indicesCount>=3&&(q=a.S3MEdgeProcessor.createEdgeDataByIndices(l,J[1],p)),t[T]={vertexPackage:l,arrIndexPackage:J,edgeGeometry:q,cartographicBounds:{max:f,min:g}},y}function _(t,r,n){var a=t.vertexAttributes,i=t.attrLocation,o=a.length;i[1===n?"instanceId":"batchId"]=o,a.push({index:o,typedArray:r,componentsPerAttribute:1,componentDatatype:e.ComponentDatatype.FLOAT,offsetInBytes:0,strideInBytes:0,instanceDivisor:n})}return new r.Color,t((function(t,e){var r=t.buffer,i=t.supportCompressType,o=t.bVolume,y=null,p=null,T=null,u=t.isCoverImageryLayer,l=t.modelMatrix;if(o&&t.volbuffer.byteLength<8&&(o=!1),o){var c=t.volbuffer,A=new Uint8Array(c,8),m=E.pako.inflate(A).buffer,f=new Float64Array(m,0,1),g=new Uint32Array(m,48,1);if(0===f[0]||3200===g[0]||3201===g[0]){var B=0;0===f[0]&&(B=8),e.push(m);var P=new Float64Array(m,B,6),U=P[0],L=P[1],h=P[2],M=P[3],S=P[4]<P[5]?P[4]:P[5],N=P[4]>P[5]?P[4]:P[5];p={left:U,top:L,right:h,bottom:M,minHeight:S,maxHeight:N,width:(y=new d(U,M,h,L,S,N)).width,length:y.length,height:y.height};var R=new Uint32Array(m,48+B,7),D=R[0],Y=R[1],C=R[2],I=R[3];T={nFormat:D,nSideBlockCount:Y,nBlockLength:C,nLength:I,nWidth:R[4],nHeight:R[5],nDepth:R[6],imageArray:new Uint8Array(m,76+B,I*I*4)}}}var b=0,F=new Uint8Array(r,0,4);if(115!==F[0]||51!==F[1]||109!==F[2])return{result:!1};var x=F[3],w=(A=new Uint8Array(r,4),E.pako.inflate(A).buffer),O=new Uint8Array(w);e.push(O.buffer);var k=new DataView(w),z=k.getUint32(b,!0);b+=Uint32Array.BYTES_PER_ELEMENT;var G=new Uint8Array(w,b,z),H=z%4;H&&(H=4-H),b+=z+H;var W=n.getStringFromTypedArray(G,void 0,void 0,"gbk");W=(W=W.replace(new RegExp("\r\n","gm"),"")).replace(new RegExp(":","gm"),""),k.getUint32(b,!0),b+=Uint32Array.BYTES_PER_ELEMENT;var V=k.getUint32(b,!0);b+=Uint32Array.BYTES_PER_ELEMENT;var X={};X.ignoreNormal=t.ignoreNormal;for(var j=0;j<V;j++)b=v(X,l,u,O,k,b,e);k.getUint32(b,!0),b+=Uint32Array.BYTES_PER_ELEMENT;var q=k.getUint32(b,!0);for(b+=Uint32Array.BYTES_PER_ELEMENT,j=0;j<q;j++){var J=k.getUint32(b,!0);b+=Uint32Array.BYTES_PER_ELEMENT;var K=k.getUint32(b,!0);b+=Uint32Array.BYTES_PER_ELEMENT;var Q={},Z=X[J].vertexPackage.instanceIndex,$=X[J].edgeGeometry;if(-1==Z){for(var tt=new Float32Array(X[J].vertexPackage.verticesCount),et=0;et<K;et++){var rt=k.getUint32(b,!0);b+=Uint32Array.BYTES_PER_ELEMENT;var nt=k.getUint32(b,!0);b+=Uint32Array.BYTES_PER_ELEMENT;var at=0,it=0;Q[rt]={batchId:et};for(var ot=0;ot<nt;ot++)if(it=k.getUint32(b,!0),b+=Uint32Array.BYTES_PER_ELEMENT,at=k.getUint32(b,!0),b+=Uint32Array.BYTES_PER_ELEMENT,tt.fill)tt.fill(et,it,it+at);else for(var Et=it+it,st=it;st<Et;st++)tt[st]=et;Q[rt].vertexColorOffset=it,Q[rt].vertexColorCount=at}_(X[J].vertexPackage,tt,void 0)}else{var yt=X[J].vertexPackage.instanceCount;X[J].vertexPackage.instanceBuffer,X[J].vertexPackage.instanceMode;var pt=new Float32Array(yt),Tt=0;for(et=0;et<K;et++){rt=k.getUint32(b,!0);b+=Uint32Array.BYTES_PER_ELEMENT;nt=k.getUint32(b,!0);b+=Uint32Array.BYTES_PER_ELEMENT;for(ot=0;ot<nt;ot++){var ut=k.getUint32(b,!0);b+=Uint32Array.BYTES_PER_ELEMENT,pt[Tt]=Tt,void 0===Q[rt]&&(Q[rt]={vertexColorCount:1,instanceIds:[],vertexColorOffset:Tt}),Q[rt].instanceIds.push(ut),Tt++}}_(X[J].vertexPackage,pt,1)}X[J].pickInfo=Q;$=X[J].edgeGeometry;if(s.defined($)){var lt,ct,At=$.regular.instancesData,dt=a.S3MEdgeProcessor.RegularInstanceStride;if(s.defined(At))for(ct=At.length,lt=0;lt<ct;lt+=dt){var vt=At[lt+9];At[lt+9]=tt[vt]}var _t=$.silhouette.instancesData;if(dt=a.S3MEdgeProcessor.SilhouetteInstanceStride,s.defined(_t))for(ct=_t.length,lt=0;lt<ct;lt+=dt){vt=_t[lt+12];_t[lt+12]=tt[vt]}}}k.getUint32(b,!0),b+=Uint32Array.BYTES_PER_ELEMENT;var mt=k.getUint32(b,!0);b+=Uint32Array.BYTES_PER_ELEMENT;var ft={};for(j=0;j<mt;j++){var gt=k.getUint32(b,!0);b+=Uint32Array.BYTES_PER_ELEMENT;var Bt=k.getUint32(b,!0);b+=Uint32Array.BYTES_PER_ELEMENT;var Pt=k.getUint32(b,!0);b+=Uint32Array.BYTES_PER_ELEMENT;var Ut=k.getUint32(b,!0);b+=Uint32Array.BYTES_PER_ELEMENT;nt=k.getUint32(b,!0);b+=Uint32Array.BYTES_PER_ELEMENT;var Lt=k.getUint32(b,!0);b+=Uint32Array.BYTES_PER_ELEMENT;var ht=null;if(Ut===a.S3MCompressType.enrS3TCDXTN&&1!==i){var Mt=null;Lt>a.S3MPixelFormat.BGR||Lt===a.S3MPixelFormat.LUMINANCE_ALPHA?(Mt=new Uint8Array(w,b,Bt*Pt),ht=new Uint8Array(Bt*Pt*4)):(Mt=new Uint16Array(w,b,nt/2),ht=new Uint16Array(Bt*Pt)),a.DXTTextureDecode.decode(ht,Bt,Pt,Mt,Lt),e.push(ht.buffer),Ut=0}else ht=new Uint8Array(w,b,nt);ft[gt]={id:gt,width:Bt,height:Pt,compressType:Ut,nFormat:Lt,imageBuffer:ht},b+=nt}return{result:!0,version:x,xmlDoc:W,geoPackage:X,texturePackage:ft,volImageBuffer:T,volBounds:p}}))}));