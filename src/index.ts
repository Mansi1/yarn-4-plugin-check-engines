import { Plugin, Project, Workspace } from '@yarnpkg/core'; import * as semver from 'semver';

/**
 * Checks the current Node.js version against the requirement in the given workspace's package.json.
 * Throws an error if the version is not satisfied.
 * @param workspace The Yarn workspace to check.
 */
const checkNodeVersion = (workspace: Workspace): void => {
  // Guard Clause: If workspace or its manifest is missing, do nothing.
  // This handles edge cases where hooks are called without a full workspace context.
  if (!workspace || !workspace.manifest) {
    return;
  }

  const requiredVersion = workspace.manifest.raw.engines?.node;

  // If no node engine is specified for this workspace, there's nothing to check.
  if (!requiredVersion) {
    return;
  }

  const workspaceName = workspace.manifest.name?.scope
      ? `@${workspace.manifest.name.scope}/${workspace.manifest.name.name}`
      : workspace.manifest.name?.name ?? workspace.relativeCwd;

  const currentNodeVersion = process.version;

  if (!semver.satisfies(currentNodeVersion, requiredVersion)) {
    // Throwing an error is the idiomatic way for a hook to signal a fatal error.
    // Yarn will catch it, print the message, and exit with a non-zero status code.
    throw new Error(
        `[ENGINE CHECK] Error: Workspace '${workspaceName}' requires Node.js version ${requiredVersion}, but the current version is ${currentNodeVersion}.`
    );
  }
};

const plugin: Plugin = {
  hooks: {
    /**
     * This hook is called before 'yarn install'.
     * It iterates through all workspaces to validate their engine requirements.
     */
    validateProject(project: Project) {
      for (const workspace of project.workspaces) {
        checkNodeVersion(workspace);
      }
    },

    /**
     * This hook wraps the execution of any script.
     * It's used to check the engine requirement for the specific workspace
     * where the script is being run.
     */
    wrapScriptExecution: async (
        executor: () => Promise<number>,
        workspace: Workspace,
        scriptName: string,
        extra: { script: string; args: string[] }
    ) => {
      // First, perform our check for the specific workspace.
      checkNodeVersion(workspace);

      // If the check passes, proceed with the original script execution.
      return await executor();
    },
  },
};

export default plugin;
