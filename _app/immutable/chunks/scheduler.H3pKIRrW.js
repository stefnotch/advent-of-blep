function k(){}const K=t=>t;function P(t,n){for(const e in n)t[e]=n[e];return t}function Q(t){return!!t&&(typeof t=="object"||typeof t=="function")&&typeof t.then=="function"}function B(t){return t()}function R(){return Object.create(null)}function D(t){t.forEach(B)}function M(t){return typeof t=="function"}function V(t,n){return t!=t?n==n:t!==n||t&&typeof t=="object"||typeof t=="function"}function X(t){return Object.keys(t).length===0}function N(t,...n){if(t==null){for(const i of n)i(void 0);return k}const e=t.subscribe(...n);return e.unsubscribe?()=>e.unsubscribe():e}function Y(t){let n;return N(t,e=>n=e)(),n}function Z(t,n,e){t.$$.on_destroy.push(N(n,e))}function $(t,n,e,i){if(t){const r=j(t,n,e,i);return t[0](r)}}function j(t,n,e,i){return t[1]&&i?P(e.ctx.slice(),t[1](i(n))):e.ctx}function tt(t,n,e,i){if(t[2]&&i){const r=t[2](i(e));if(n.dirty===void 0)return r;if(typeof r=="object"){const s=[],c=Math.max(n.dirty.length,r.length);for(let o=0;o<c;o+=1)s[o]=n.dirty[o]|r[o];return s}return n.dirty|r}return n.dirty}function nt(t,n,e,i,r,s){if(r){const c=j(n,e,i,s);t.p(c,r)}}function et(t){if(t.ctx.length>32){const n=[],e=t.ctx.length/32;for(let i=0;i<e;i++)n[i]=-1;return n}return-1}function it(t){const n={};for(const e in t)e[0]!=="$"&&(n[e]=t[e]);return n}function rt(t,n){const e={};n=new Set(n);for(const i in t)!n.has(i)&&i[0]!=="$"&&(e[i]=t[i]);return e}function ct(t,n,e){return t.set(e),n}function lt(t){return t&&M(t.destroy)?t.destroy:k}let p=!1;function ot(){p=!0}function st(){p=!1}function O(t,n,e,i){for(;t<n;){const r=t+(n-t>>1);e(r)<=i?t=r+1:n=r}return t}function T(t){if(t.hydrate_init)return;t.hydrate_init=!0;let n=t.childNodes;if(t.nodeName==="HEAD"){const l=[];for(let u=0;u<n.length;u++){const a=n[u];a.claim_order!==void 0&&l.push(a)}n=l}const e=new Int32Array(n.length+1),i=new Int32Array(n.length);e[0]=-1;let r=0;for(let l=0;l<n.length;l++){const u=n[l].claim_order,a=(r>0&&n[e[r]].claim_order<=u?r+1:O(1,r,S=>n[e[S]].claim_order,u))-1;i[l]=e[a]+1;const v=a+1;e[v]=l,r=Math.max(v,r)}const s=[],c=[];let o=n.length-1;for(let l=e[r]+1;l!=0;l=i[l-1]){for(s.push(n[l-1]);o>=l;o--)c.push(n[o]);o--}for(;o>=0;o--)c.push(n[o]);s.reverse(),c.sort((l,u)=>l.claim_order-u.claim_order);for(let l=0,u=0;l<c.length;l++){for(;u<s.length&&c[l].claim_order>=s[u].claim_order;)u++;const a=u<s.length?s[u]:null;t.insertBefore(c[l],a)}}function q(t,n){if(p){for(T(t),(t.actual_end_child===void 0||t.actual_end_child!==null&&t.actual_end_child.parentNode!==t)&&(t.actual_end_child=t.firstChild);t.actual_end_child!==null&&t.actual_end_child.claim_order===void 0;)t.actual_end_child=t.actual_end_child.nextSibling;n!==t.actual_end_child?(n.claim_order!==void 0||n.parentNode!==t)&&t.insertBefore(n,t.actual_end_child):t.actual_end_child=n.nextSibling}else(n.parentNode!==t||n.nextSibling!==null)&&t.appendChild(n)}function ut(t,n,e){p&&!e?q(t,n):(n.parentNode!==t||n.nextSibling!=e)&&t.insertBefore(n,e||null)}function at(t){t.parentNode&&t.parentNode.removeChild(t)}function ft(t,n){for(let e=0;e<t.length;e+=1)t[e]&&t[e].d(n)}function I(t){return document.createElement(t)}function g(t){return document.createTextNode(t)}function _t(){return g(" ")}function dt(){return g("")}function ht(t,n,e,i){return t.addEventListener(n,e,i),()=>t.removeEventListener(n,e,i)}function mt(t,n,e){e==null?t.removeAttribute(n):t.getAttribute(n)!==e&&t.setAttribute(n,e)}function pt(t){return Array.from(t.childNodes)}function L(t){t.claim_info===void 0&&(t.claim_info={last_index:0,total_claimed:0})}function A(t,n,e,i,r=!1){L(t);const s=(()=>{for(let c=t.claim_info.last_index;c<t.length;c++){const o=t[c];if(n(o)){const l=e(o);return l===void 0?t.splice(c,1):t[c]=l,r||(t.claim_info.last_index=c),o}}for(let c=t.claim_info.last_index-1;c>=0;c--){const o=t[c];if(n(o)){const l=e(o);return l===void 0?t.splice(c,1):t[c]=l,r?l===void 0&&t.claim_info.last_index--:t.claim_info.last_index=c,o}}return i()})();return s.claim_order=t.claim_info.total_claimed,t.claim_info.total_claimed+=1,s}function z(t,n,e,i){return A(t,r=>r.nodeName===n,r=>{const s=[];for(let c=0;c<r.attributes.length;c++){const o=r.attributes[c];e[o.name]||s.push(o.name)}s.forEach(c=>r.removeAttribute(c))},()=>i(n))}function yt(t,n,e){return z(t,n,e,I)}function F(t,n){return A(t,e=>e.nodeType===3,e=>{const i=""+n;if(e.data.startsWith(i)){if(e.data.length!==i.length)return e.splitText(i.length)}else e.data=i},()=>g(n),!0)}function bt(t){return F(t," ")}function xt(t,n){n=""+n,t.data!==n&&(t.data=n)}function gt(t,n,e,i){e==null?t.style.removeProperty(n):t.style.setProperty(n,e,i?"important":"")}function H(t,n,{bubbles:e=!1,cancelable:i=!1}={}){return new CustomEvent(t,{detail:n,bubbles:e,cancelable:i})}function vt(t,n){return new t(n)}let m;function y(t){m=t}function d(){if(!m)throw new Error("Function called outside component initialization");return m}function wt(t){d().$$.on_mount.push(t)}function Et(t){d().$$.after_update.push(t)}function kt(t){d().$$.on_destroy.push(t)}function Nt(){const t=d();return(n,e,{cancelable:i=!1}={})=>{const r=t.$$.callbacks[n];if(r){const s=H(n,e,{cancelable:i});return r.slice().forEach(c=>{c.call(t,s)}),!s.defaultPrevented}return!0}}function jt(t,n){return d().$$.context.set(t,n),n}function At(t){return d().$$.context.get(t)}const h=[],w=[];let _=[];const E=[],C=Promise.resolve();let x=!1;function U(){x||(x=!0,C.then(G))}function Ct(){return U(),C}function W(t){_.push(t)}const b=new Set;let f=0;function G(){if(f!==0)return;const t=m;do{try{for(;f<h.length;){const n=h[f];f++,y(n),J(n.$$)}}catch(n){throw h.length=0,f=0,n}for(y(null),h.length=0,f=0;w.length;)w.pop()();for(let n=0;n<_.length;n+=1){const e=_[n];b.has(e)||(b.add(e),e())}_.length=0}while(h.length);for(;E.length;)E.pop()();x=!1,b.clear(),y(t)}function J(t){if(t.fragment!==null){t.update(),D(t.before_update);const n=t.dirty;t.dirty=[-1],t.fragment&&t.fragment.p(t.ctx,n),t.after_update.forEach(W)}}function St(t){const n=[],e=[];_.forEach(i=>t.indexOf(i)===-1?n.push(i):e.push(i)),e.forEach(i=>i()),_=n}export{U as $,Q as A,d as B,y as C,G as D,jt as E,kt as F,At as G,Y as H,lt as I,rt as J,P as K,it as L,Nt as M,K as N,ft as O,N as P,ct as Q,ht as R,D as S,M as T,R as U,X as V,W,St as X,m as Y,B as Z,h as _,_t as a,ot as a0,st as a1,Et as b,bt as c,at as d,dt as e,I as f,yt as g,pt as h,ut as i,mt as j,gt as k,g as l,F as m,xt as n,wt as o,w as p,vt as q,$ as r,V as s,Ct as t,nt as u,et as v,tt as w,q as x,k as y,Z as z};
