import {Locator, MessageName, Plugin, Project, Workspace} from '@yarnpkg/core';
import { PortablePath } from '@yarnpkg/fslib';
import { Writable, Readable } from 'stream';
import * as semver from 'semver';

const checkNodeVersion = (workspace: Workspace): void | string => {
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
        return `[ENGINE CHECK] Error: Workspace '${workspaceName}' requires Node.js version ${requiredVersion}, but the current version is ${currentNodeVersion}.`
    }
};

const plugin: Plugin = {
    hooks: {
        /**
         * This hook is called before 'yarn install'.
         * It iterates through all workspaces to validate their engine requirements.
         */
        validateProject(project: Project, report:
        {
            reportError: (name: MessageName, text: string) => void;
            reportWarning: (name: MessageName, text: string) => void
        }) {
            for (const workspace of project.workspaces) {
                const isError = checkNodeVersion(workspace);
                if (typeof isError === 'string') {
                    report.reportError(MessageName.UNNAMED, isError)
                }
            }
        },
        wrapScriptExecution: async (
            executor: () => Promise<number>,
            project: Project,
            locator: Locator,
            scriptName: string,
            extra: { args: string[]; cwd: PortablePath; env: NodeJS.ProcessEnv; script: string; stderr: Writable; stdin: null | Readable; stdout: Writable } // use the full type for correctness
        ) => {
            // 1. Get the correct workspace, no guesswork.
            const workspace = project.getWorkspaceByLocator(locator);

            // 2. Run our check.
            const isError = checkNodeVersion(workspace);
            if (typeof isError === 'string') {
                console.error(isError);
                return () => -1
            }
            // 3. Return the executor for Yarn to run. DO NOT await it here.
            // This was the source of the internal Yarn error.
            return executor;
        },
    },
};

export default plugin;