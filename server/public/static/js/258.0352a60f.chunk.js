"use strict";(self.webpackChunkclient=self.webpackChunkclient||[]).push([[258],{8258:function(e,s,n){n.r(s),n.d(s,{default:function(){return N}});var t=n(9439),l=n(2791),c=n(7210),r=n(642),o=n(64),i=n(3433),d=n(1243),a=n(2591),u=n(3360),h=n(4849),x=(n(98),n(7022)),m=n(9743),j=n(2677),f=n(1087),p=n(524),Z=n(9627),v=n(184);var y=function(e){var s=e.totalProducts.reduce((function(e,s){return e+s.dollCount*s.dollPrice}),0);return(0,v.jsx)("div",{children:(0,v.jsx)(Z.Z,{style:{textAlign:"right"},children:(0,v.jsxs)(Z.Z.Body,{children:[(0,v.jsx)(Z.Z.Title,{children:'\u05e1\u05d4"\u05db \u05d1\u05e1\u05dc \u05d4\u05e7\u05e0\u05d9\u05d5\u05ea'}),(0,v.jsx)("hr",{}),(0,v.jsxs)("div",{style:{justifyContent:"space-between",display:"flex",direction:"rtl"},children:[(0,v.jsx)(Z.Z.Text,{children:'\u05e1\u05d4"\u05db \u05dc\u05ea\u05e9\u05dc\u05d5\u05dd'}),(0,v.jsxs)(Z.Z.Text,{children:["\u20aa",s,".00"]})]}),(0,v.jsx)(f.rU,{to:"/Check-out",children:(0,v.jsx)(u.Z,{style:{backgroundColor:"purple",border:"none"},children:"\u05de\u05e2\u05d1\u05e8 \u05dc\u05ea\u05e9\u05dc\u05d5\u05dd"})})]})})})};var g=function(){var e=(0,l.useState)([]),s=(0,t.Z)(e,2),n=s[0],c=s[1],r=(0,l.useState)([]),o=(0,t.Z)(r,2),Z=o[0],g=o[1],C=(0,l.useState)(!0),N=(0,t.Z)(C,2),b=N[0],k=N[1];return(0,l.useEffect)((function(){g(n)}),[n]),(0,l.useEffect)((function(){d.Z.get("/api/get-cart",{withCredentials:!0}).then((function(e){"empty cart"===e.data[0]?c([]):c(e.data),console.log(e.data),k(!1)})).catch((function(e){console.error(e),k(!1)}))}),[]),b?(0,v.jsx)("div",{className:"cart-spinner-div",children:(0,v.jsx)(h.Z,{animation:"grow",className:"cart-spinner",style:{fontSize:"5rem"}})}):(0,v.jsx)("div",{className:"primary-font",style:{textAlign:"center"},children:0===n.length?(0,v.jsxs)(x.Z,{children:[(0,v.jsx)("h3",{style:{margin:"5% auto"},children:"\u05e1\u05dc \u05d4\u05e7\u05e0\u05d9\u05d5\u05ea \u05e9\u05dc\u05da \u05e8\u05d9\u05e7 \u05db\u05e8\u05d2\u05e2"}),(0,v.jsx)(u.Z,{style:{margin:"5% auto",backgroundColor:"purple",border:"none"},children:(0,v.jsx)(f.rU,{to:"/\u05d7\u05e0\u05d5\u05ea",className:"navLink",children:"\u05d7\u05d6\u05d5\u05e8 \u05dc\u05d7\u05e0\u05d5\u05ea"})})]}):(0,v.jsxs)("div",{style:{margin:"auto 3% "},children:[(0,v.jsx)("h1",{children:"My Cart"}),(0,v.jsxs)(m.Z,{style:{display:"inline-flex",flexDirection:"row-reverse"},children:[(0,v.jsx)(j.Z,{md:7,sm:12,className:"cart-products-divider",children:(0,v.jsxs)(a.Z,{className:"center-content",responsive:"sm",striped:!0,bordered:!0,hover:!0,children:[(0,v.jsx)("thead",{children:(0,v.jsxs)("tr",{children:[(0,v.jsx)("th",{className:"col-md-3 col-sm-4",children:"\u05db\u05de\u05d5\u05ea"}),(0,v.jsx)("th",{className:"col-md-3 col-sm-2",children:"\u05de\u05d7\u05d9\u05e8"}),(0,v.jsx)("th",{className:"col-md-6 col-sm-8",colSpan:3,children:"\u05de\u05d5\u05e6\u05e8"})]})}),(0,v.jsx)("tbody",{children:n.map((function(e,s){return(0,v.jsxs)("tr",{children:[(0,v.jsx)("td",{className:"col-md-2 col-sm-2",children:(0,v.jsx)("div",{style:{display:"flex",alignItems:"center"},children:(0,v.jsx)(p.Z,{count:Number(e.dollCount),onCountChange:function(e){return function(e,s){var t=(0,i.Z)(n);t[e].dollCount=s,g(t)}(s,e)}})})}),(0,v.jsxs)("td",{className:"col-md-3 col-sm-2",children:["\u20aa",e.dollPrice]}),(0,v.jsx)("td",{className:"col-md-3 col-sm-2",children:(0,v.jsx)(f.rU,{to:e.dollURL,className:"cart-product-name",children:e.name})}),(0,v.jsx)("td",{className:"col-md-3 col-sm-4",children:(0,v.jsx)(f.rU,{to:e.dollURL,children:(0,v.jsx)("img",{src:e.ImgsSRC,alt:"",style:{width:"90%"}})})}),(0,v.jsx)("td",{className:"col-md-2 col-sm-2",children:(0,v.jsx)(u.Z,{onClick:function(){!function(e){n.splice(e,1),console.log(n),d.Z.post("/api/update-cart",{params:{updateCartList:n},withCredentials:!0}).then((function(e){console.log(e),window.location.reload()})).catch((function(e){console.error(e)}))}(s)},style:{backgroundColor:"black",border:"none"},children:"X"})})]},s)}))})]})}),(0,v.jsx)(j.Z,{md:5,sm:12,children:(0,v.jsx)(y,{totalProducts:Z})})]})]})})},C=n(14);var N=function(){var e=(0,C.I)(null),s=(0,l.useState)([]),n=(0,t.Z)(s,2),i=n[0],d=n[1];return(0,l.useEffect)((function(){d(e)}),[e]),(0,v.jsxs)("div",{children:[(0,v.jsx)(c.Z,{}),(0,v.jsx)(g,{value:i}),(0,v.jsx)(r.Z,{}),(0,v.jsx)(o.Z,{})]})}}}]);
//# sourceMappingURL=258.0352a60f.chunk.js.map