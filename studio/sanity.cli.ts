
import {defineCliConfig} from 'sanity/cli'
import project from '../src/sanity/project.json'

export default defineCliConfig({
  api: {
    projectId: project.projectId,
    dataset: project.dataset,
  },
  deployment: {
    autoUpdates: true,
  },
})
