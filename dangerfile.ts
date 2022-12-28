import { danger, fail, warn } from 'danger'

// No PR is too small to include a description of why you made a change
if (danger.github.pr.body.length < 10) {
  warn('Please include a description of your PR changes.')
}

// Check that someone has been assigned to this PR
if (danger.github.pr.assignee === null) {
  warn(
    'Please assign someone to Review this PR.',
  )
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

const hasDescTitlePattern = /(Fix|Feature|Refactor|Release|Hotfix|Migration)/im
const hasDescTitle = hasDescTitlePattern.test(danger.github.pr.title)
if (!hasDescTitle) {
  warn(
    'In the PR title use tags [Fix], [Feature], [Refactor], [Release], [Hotfix], [Migration]',
  )
}
const migrationPattern = /migration/im

const hasMigrationChanges = allFiles.some((p) => p.includes('database-migration/'))

if (migrationPattern.test(danger.github.pr.title) || hasMigrationChanges) {
  warn('Please Pay attention to the Migrations on dev')
  warn('Add a manual testing for the Migration in the description!')
}

if (danger.git.commits.length > 5) {
  fail(
    'Keep PRs short, and have less commits!',
  )
}
