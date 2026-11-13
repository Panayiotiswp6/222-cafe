import {setTimeout as delay} from 'node:timers/promises';

// A repository still configured for branch-based Pages also starts GitHub's
// built-in Jekyll deployment. Let it finish before publishing our Vite artifact.
// Otherwise that deployment can finish last and replace the app with raw TSX.
const repository = process.env.GITHUB_REPOSITORY;
const sha = process.env.GITHUB_SHA;
const token = process.env.GH_TOKEN;
if (!repository || !sha || !token) throw new Error('This step runs inside GitHub Actions.');

async function get(suffix) {
  const response = await fetch(`https://api.github.com/repos/${repository}${suffix}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
    },
    signal: AbortSignal.timeout(30000),
  });
  if (!response.ok) throw new Error(`GitHub Pages coordination returned HTTP ${response.status}.`);
  return response.json();
}

const pages = await get('/pages');
if (pages.build_type === 'workflow') {
  console.log('Pages uses GitHub Actions; no branch build to wait for.');
} else {
  const deadline = Date.now() + 5 * 60 * 1000;
  while (true) {
    const {workflow_runs: runs} = await get(`/actions/runs?head_sha=${encodeURIComponent(sha)}&event=dynamic&per_page=100`);
    const legacy = runs.filter(run => run.name === 'pages build and deployment');
    if (legacy.length && legacy.every(run => run.status === 'completed')) {
      console.log('Branch-based Pages build finished; publishing the compiled website last.');
      break;
    }
    if (Date.now() >= deadline) {
      throw new Error('Branch-based Pages build has not finished. Retry this workflow, or select GitHub Actions in Settings > Pages.');
    }
    console.log('Waiting for the branch-based Pages build for this commit…');
    await delay(10000);
  }
}
