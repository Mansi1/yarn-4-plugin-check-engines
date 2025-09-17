/* eslint-disable */
//prettier-ignore
module.exports = {
name: "@yarnpkg/plugin-check-engines",
factory: function (require) {
var plugin=(()=>{var c=Object.create;var i=Object.defineProperty;var f=Object.getOwnPropertyDescriptor;var u=Object.getOwnPropertyNames;var p=Object.getPrototypeOf,d=Object.prototype.hasOwnProperty;var g=(e=>typeof require<"u"?require:typeof Proxy<"u"?new Proxy(e,{get:(r,n)=>(typeof require<"u"?require:r)[n]}):e)(function(e){if(typeof require<"u")return require.apply(this,arguments);throw Error('Dynamic require of "'+e+'" is not supported')});var v=(e,r)=>{for(var n in r)i(e,n,{get:r[n],enumerable:!0})},o=(e,r,n,s)=>{if(r&&typeof r=="object"||typeof r=="function")for(let t of u(r))!d.call(e,t)&&t!==n&&i(e,t,{get:()=>r[t],enumerable:!(s=f(r,t))||s.enumerable});return e};var N=(e,r,n)=>(n=e!=null?c(p(e)):{},o(r||!e||!e.__esModule?i(n,"default",{value:e,enumerable:!0}):n,e)),l=e=>o(i({},"__esModule",{value:!0}),e);var $={};v($,{default:()=>P});var m=N(g("semver")),a=e=>{if(!e||!e.manifest)return;let r=e.manifest.raw.engines?.node;if(!r)return;let n=e.manifest.name?.scope?`@${e.manifest.name.scope}/${e.manifest.name.name}`:e.manifest.name?.name??e.relativeCwd,s=process.version;if(!m.satisfies(s,r))throw new Error(`[ENGINE CHECK] Error: Workspace '${n}' requires Node.js version ${r}, but the current version is ${s}.`)},E={hooks:{validateProject(e){for(let r of e.workspaces)a(r)},wrapScriptExecution:async(e,r,n,s)=>(a(r),await e())}},P=E;return l($);})();
return plugin;
}
};
