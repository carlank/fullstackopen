(this["webpackJsonpbloglist-frontend"]=this["webpackJsonpbloglist-frontend"]||[]).push([[0],{14:function(t,e,n){t.exports=n(36)},36:function(t,e,n){"use strict";n.r(e);var r=n(1),u=n.n(r),a=n(11),o=n.n(a),l=n(13),c=function(t){var e=t.blog;return u.a.createElement("div",null,e.title," ",e.author)},i=n(12),s=n.n(i),f=function(){return s.a.get("/api/blogs").then((function(t){return t.data}))},b=function(){var t=Object(r.useState)([]),e=Object(l.a)(t,2),n=e[0],a=e[1];return Object(r.useEffect)((function(){f().then((function(t){return a(t)}))}),[]),u.a.createElement("div",null,u.a.createElement("h2",null,"blogs"),n.map((function(t){return u.a.createElement(c,{key:t.id,blog:t})})))};o.a.render(u.a.createElement(b,null),document.getElementById("root"))}},[[14,1,2]]]);
//# sourceMappingURL=main.47decddf.chunk.js.map