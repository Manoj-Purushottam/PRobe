import axios from 'axios';

export function parsePRUrl(url) {
  const regex = /github\.com\/([^/]+)\/([^/]+)\/pull\/(\d+)/;
  const match = url.match(regex);
  if (!match) throw new Error('Invalid GitHub PR URL');
  return { owner: match[1], repo: match[2], prNumber: parseInt(match[3], 10) };
}

function buildHeaders(githubToken) {
  const headers = { 'User-Agent': 'PRobe-AI' };
  if (githubToken) {
    headers.Authorization = `Bearer ${githubToken}`;
  }
  return headers;
}

function handleGitHubError(err) {
  if (err.response) {
    const { status } = err.response;
    if (status === 404) {
      throw new Error('PR not found or repository is private');
    }
    if (status === 403) {
      throw new Error('GitHub API rate limit exceeded. Please provide a GitHub token.');
    }
  }
  throw new Error(err.message || 'Failed to fetch PR data from GitHub');
}

export async function fetchPRData(owner, repo, prNumber, githubToken) {
  const token = githubToken || process.env.GITHUB_TOKEN;
  const headers = buildHeaders(token);
  const baseUrl = `https://api.github.com/repos/${owner}/${repo}/pulls/${prNumber}`;
  let prResponse, diffResponse, filesResponse;
  try {
    [prResponse, diffResponse, filesResponse] = await Promise.all([
      axios.get(baseUrl, { headers, maxRedirects: 5 }),
      axios.get(baseUrl, {
        headers: { ...headers, Accept: 'application/vnd.github.v3.diff' },
        transformResponse: (r) => r,
        maxRedirects: 5,
      }),
      axios.get(`${baseUrl}/files`, { headers, maxRedirects: 5 }),
    ]);
  } catch (err) {
    handleGitHubError(err);
  }
  const pr = prResponse.data;
  let diff = diffResponse.data;
  const files = filesResponse.data;
  if (diff && diff.length > 12000) {
    diff = diff.slice(0, 12000) + '\n\n... (diff truncated)';
  }
  return {
    title: pr.title,
    body: pr.body,
    user: pr.user.login,
    additions: pr.additions,
    deletions: pr.deletions,
    changedFiles: pr.changed_files,
    diff,
    files,
  };
}
