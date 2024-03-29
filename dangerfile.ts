import { danger, warn, message } from 'danger'
import mentor from 'danger-plugin-mentor'


mentor()

// No PR is too small to include a description of why you made a change
if (danger.github.pr.body.length < 100) {
  warn('Please include a detailed description of your PR changes, at least 100 characters.')
}


// Request changes to src also include changes to tests.
const allFiles = danger.git.modified_files.concat(danger.git.created_files)
const hasAppChanges = allFiles.some((p) => p.includes('src/'))
const hasTestChanges = allFiles.some((p) => !!p.match(/.*\.test\.[jt]sx?/))

if (hasAppChanges && !hasTestChanges) {
  warn(
    'This PR does not include tests, even though it affects app code.',
  )
}

const hasDescTitlePattern = /(style|refactor|perf|feat|fix|docs|test|build|ci|migration)/im
const hasDescTitle = hasDescTitlePattern.test(danger.github.pr.title)
if (!hasDescTitle) {
  warn(
    'In the PR title use tags (fix), (feat), (refactor), (perf), (style), (docs), (test), (build), (ci) or (migration)',
    
  )
}

const reviewersCount = danger.github.requested_reviewers.users.length
if (reviewersCount === 0) {
  warn(`🕵 Whoops, I don't see any reviewers. Remember to add one.`)
} else if (reviewersCount > 1) {
  warn(
    `It's great to have ${reviewersCount} reviewers. Remember though that more than 1 reviewer may lead to uncertainty as to who is responsible for the review.`
  )
}


const migrationPattern = /migration/im

const hasMigrationChanges = allFiles.some((p) => p.includes('migrations/'))

if (migrationPattern.test(danger.github.pr.title) || hasMigrationChanges) {
  warn('Please Pay attention to the Migrations on dev')
  warn('Add a manual testing for the Migration in the description!')
  message(`
  # Test MongoDB Database Migration
  - Run [Atlas Action](https://github.com/impargo/impargo-backend/actions/workflows/mongo-atlas.yml)
  - To get the connection string, check the Connection String step.
  - Use the connection string to connect to the database, from the code or Mongo Atlas ...etc.
  - if the migration works properly, then we can merge the PR to the dev, and the database migration job will apply the changes.
  `)
}

const bigPRThreshold = 20
const linesCount = danger.git.linesOfCode("**/*"); // add await 
const excludeLinesCount = danger.git.linesOfCode("(.*(\.snap|\.test.*|mock.*|json|xml))"); // add await
const totalLinesCount = linesCount - excludeLinesCount;

if (danger.git.commits.length > 20 || totalLinesCount > bigPRThreshold) {
  warn(
    'Pull Request size seems relatively large. If Pull Request contains multiple changes, split each into separate PR will helps faster, easier review.!',
  )
}

if (danger.github.pr.deletions > danger.github.pr.additions) {
  message(`:thumbsup: You removed more code than added!`);
}

