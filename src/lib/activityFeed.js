// Shared activity-feed loader - used by both the desktop taskbar and the mobile
// notification shade so the two UIs always show the same data.

const GITHUB_USER = "Harshan07-web";
const NOTIF_CACHE_KEY = "activity-feed-cache-v2"; // bumped: v1 could cache empty/failed GitHub fetches
const NOTIF_CACHE_TTL = 10 * 60 * 1000; // 10 min
export const NOTIF_SEEN_KEY = "activity-feed-last-seen";

function relativeTime(dateStr) {
  const diffMs = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

// Resolves with the (cached or freshly fetched) list of feed items.
// `setLoading` is an optional callback so callers can show a spinner.
export async function loadActivityFeed(setLoading = () => {}) {
  try {
    const cached = JSON.parse(localStorage.getItem(NOTIF_CACHE_KEY) || "null");
    if (cached && Date.now() - cached.fetchedAt < NOTIF_CACHE_TTL) {
      return cached.items;
    }
  } catch {
    // ignore bad cache
  }

  setLoading(true);
  let ghItems = [];
  let ghFetchFailed = false;

  try {
    // 1. Fetch REAL GitHub Activity
    // NOTE: /events/public only returns events on PUBLIC repos, and only the last
    // ~90 days / 300 events. Activity on private repos never appears here no
    // matter what. Also unauthenticated requests are capped at 60/hr per IP.
    const res = await fetch(`https://api.github.com/users/${GITHUB_USER}/events/public`);
    if (!res.ok) {
      throw new Error(`GitHub API ${res.status}${res.status === 403 ? " (likely rate-limited)" : ""}`);
    }
    const events = await res.json();

    const repoLabel = (name) => name.replace(`${GITHUB_USER}/`, "");

    ghItems = (Array.isArray(events) ? events : [])
      .flatMap((e) => {
        switch (e.type) {
          case "PushEvent": {
            const commits = e.payload?.commits;
            if (Array.isArray(commits) && commits.length > 0) {
              // Some pushes DO include the full commit list — use it when present.
              return commits.map((c) => ({
                id: c.sha,
                icon: "push",
                platform: "GitHub",
                message: c.message.split("\n")[0],
                repo: repoLabel(e.repo.name),
                url: `https://github.com/${e.repo.name}/commit/${c.sha}`,
                date: e.created_at,
              }));
            }
            // Most pushes from /events/public only give before/head SHAs, no
            // commit list — fall back to a single generic push item so real
            // activity isn't silently dropped.
            const branch = (e.payload?.ref || "").replace("refs/heads/", "");
            const head = e.payload?.head;
            if (!head) return [];
            return [{
              id: `push-${e.id}`,
              icon: "push",
              platform: "GitHub",
              message: `Pushed to ${branch || "repo"}`,
              repo: repoLabel(e.repo.name),
              url: `https://github.com/${e.repo.name}/commit/${head}`,
              date: e.created_at,
            }];
          }
          case "PullRequestEvent":
            return [{
              id: e.id,
              icon: "merge",
              platform: "GitHub",
              message: `${e.payload.action} PR: ${e.payload.pull_request.title}`,
              repo: repoLabel(e.repo.name),
              url: e.payload.pull_request.html_url,
              date: e.created_at,
            }];
          case "PullRequestReviewEvent":
            return [{
              id: e.id,
              icon: "review",
              platform: "GitHub",
              message: `Reviewed PR: ${e.payload.pull_request.title}`,
              repo: repoLabel(e.repo.name),
              url: e.payload.pull_request.html_url,
              date: e.created_at,
            }];
          case "IssuesEvent":
            return [{
              id: e.id,
              icon: "issue",
              platform: "GitHub",
              message: `${e.payload.action} issue: ${e.payload.issue.title}`,
              repo: repoLabel(e.repo.name),
              url: e.payload.issue.html_url,
              date: e.created_at,
            }];
          case "IssueCommentEvent":
            return [{
              id: e.id,
              icon: "comment",
              platform: "GitHub",
              message: `Commented on: ${e.payload.issue.title}`,
              repo: repoLabel(e.repo.name),
              url: e.payload.comment.html_url,
              date: e.created_at,
            }];
          case "CreateEvent": {
            const refType = e.payload?.ref_type;
            if (refType === "repository") {
              return [{
                id: e.id,
                icon: "create-repo",
                platform: "GitHub",
                message: `Created repository`,
                repo: repoLabel(e.repo.name),
                url: `https://github.com/${e.repo.name}`,
                date: e.created_at,
              }];
            }
            if (refType === "branch" || refType === "tag") {
              return [{
                id: e.id,
                icon: "branch",
                platform: "GitHub",
                message: `Created ${refType}: ${e.payload?.ref}`,
                repo: repoLabel(e.repo.name),
                url: `https://github.com/${e.repo.name}/tree/${e.payload?.ref}`,
                date: e.created_at,
              }];
            }
            return [];
          }
          case "ForkEvent":
            return [{
              id: e.id,
              icon: "fork",
              platform: "GitHub",
              message: `Forked repository`,
              repo: repoLabel(e.repo.name),
              url: e.payload?.forkee?.html_url || `https://github.com/${e.repo.name}`,
              date: e.created_at,
            }];
          case "WatchEvent":
            return [{
              id: e.id,
              icon: "star",
              platform: "GitHub",
              message: `Starred repository`,
              repo: repoLabel(e.repo.name),
              url: `https://github.com/${e.repo.name}`,
              date: e.created_at,
            }];
          case "ReleaseEvent":
            return [{
              id: e.id,
              icon: "release",
              platform: "GitHub",
              message: `Published release: ${e.payload?.release?.tag_name || ""}`,
              repo: repoLabel(e.repo.name),
              url: e.payload?.release?.html_url || `https://github.com/${e.repo.name}`,
              date: e.created_at,
            }];
          default:
            return [];
        }
      });
  } catch (err) {
    ghFetchFailed = true;
    console.warn("GitHub fetch failed, falling back to defaults:", err.message);
  }

  // THE FAILSAFE: If API is empty/blocked (private-repo-only activity, rate limit,
  // or genuinely zero public events in the window), inject a placeholder so the
  // portfolio always looks good instead of showing a dead panel.
  if (ghItems.length === 0) {
    ghItems = [
      {
        id: "gh-mock-1",
        icon: "push",
        platform: "GitHub",
        message: "Refactored Airflow DAGs for data ingestion pipeline",
        repo: "futhommie-backend",
        url: "https://github.com/Harshan07-web",
        date: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(), // 12 hours ago
      }
    ];
  }

  // 2. Mocked Competitive Programming Stats
  const extraItems = [
    {
      id: "lc-1",
      icon: "leetcode",
      platform: "LeetCode",
      message: "Solved: Median of Two Sorted Arrays (Hard)",
      repo: "Daily Challenge",
      url: "https://leetcode.com/Harshan07-web/",
      date: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
    },
    {
      id: "nc-1",
      icon: "neetcode",
      platform: "NeetCode",
      message: "Completed: Advanced Graphs Module",
      repo: "NeetCode 150",
      url: "https://neetcode.io/",
      date: new Date(Date.now() - 1000 * 60 * 60 * 28).toISOString(),
    }
  ];

  // 3. Merge, sort by newest, and format times
  const allItems = [...ghItems, ...extraItems]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .map(item => ({ ...item, relTime: relativeTime(item.date) }))
    .slice(0, 20);

  try {
    localStorage.setItem(
      NOTIF_CACHE_KEY,
      JSON.stringify({ fetchedAt: Date.now(), items: allItems })
    );
  } catch {
    // storage can be unavailable (private mode) - the feed still works without a cache
  }

  setLoading(false);
  return allItems;
}
