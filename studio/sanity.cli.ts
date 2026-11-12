import {defineCliConfig} from 'sanity/cli'
import project from '../src/sanity/project.json'

export default defineCliConfig({
  // Matches the public Studio mount in the root vercel.json. The workspace
  // basePath stays at / so the CLI prefix is applied exactly once.
  project: {
    basePath: '/studio',
  },
  api: {
    projectId: project.projectId,
    dataset: project.dataset,
  },
  deployment: {
    /**
     * Enable auto-updates for studios.
     * Learn more at https://www.sanity.io/docs/studio/latest-version-of-sanity#k47faf43faf56
     */
    autoUpdates: true,
  },
})
