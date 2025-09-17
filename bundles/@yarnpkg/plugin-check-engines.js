/* eslint-disable */
//prettier-ignore
module.exports = {
name: "@yarnpkg/plugin-check-engines",
factory: function (require) {
var plugin = (() => {
  var __create = Object.create;
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getProtoOf = Object.getPrototypeOf;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __require = /* @__PURE__ */ ((x) => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x, {
    get: (a, b) => (typeof require !== "undefined" ? require : a)[b]
  }) : x)(function(x) {
    if (typeof require !== "undefined") return require.apply(this, arguments);
    throw Error('Dynamic require of "' + x + '" is not supported');
  });
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
    // If the importer is in node compatibility mode or this is not an ESM
    // file that has been converted to a CommonJS file using a Babel-
    // compatible transform (i.e. "__esModule" has not been set), then set
    // "default" to the CommonJS "module.exports" for node compatibility.
    isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
    mod
  ));
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // src/index.ts
  var src_exports = {};
  __export(src_exports, {
    default: () => src_default
  });
  var import_core = __require("@yarnpkg/core");
  var semver = __toESM(__require("semver"));
  var checkNodeVersion = (workspace) => {
    if (!workspace || !workspace.manifest) {
      return;
    }
    const requiredVersion = workspace.manifest.raw.engines?.node;
    if (!requiredVersion) {
      return;
    }
    const workspaceName = workspace.manifest.name?.name ?? workspace.relativeCwd;
    const currentNodeVersion = process.version;
    if (!semver.satisfies(currentNodeVersion, requiredVersion)) {
      return `[ENGINE CHECK] Error: Workspace '${workspaceName}' requires Node.js version ${requiredVersion}, but the current version is ${currentNodeVersion}.`;
    }
  };
  var plugin = {
    hooks: {
      /**
       * This hook is called before 'yarn install'.
       * It iterates through all workspaces to validate their engine requirements.
       */
      validateProject(project, report) {
        for (const workspace of project.workspaces) {
          const isError = checkNodeVersion(workspace);
          if (typeof isError === "string") {
            report.reportError(import_core.MessageName.UNNAMED, isError);
          }
        }
      },
      wrapScriptExecution: async (executor, project, locator, scriptName, extra) => {
        const workspace = project.getWorkspaceByLocator(locator);
        const isError = checkNodeVersion(workspace);
        if (typeof isError === "string") {
          console.error(isError);
          return () => -1;
        }
        return executor;
      }
    }
  };
  var src_default = plugin;
  return __toCommonJS(src_exports);
})();
return plugin;
}
};
