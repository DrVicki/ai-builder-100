# AI Builder 100 Public Course Companion — GitHub Pages Deployment

This folder is a static, public-facing companion for **AI Builder 100 — Foundations for Application**. It intentionally contains course overview content, curriculum titles, objectives, and a link to the live learning platform. Interactive lessons, embedded learning progress, certificates, and any protected learner data remain in the live application at <https://aibuilder-7jkvncr3.manus.space>.

| Item | Required configuration |
|---|---|
| Repository | `DrVicki/ai-builder-100` |
| Publishing model | Deploy from a branch |
| Branch | `main` |
| Publishing folder | `/docs` |
| Expected Pages address | `https://drvicki.github.io/ai-builder-100/` |

## One-time Pages configuration

Open the repository’s **Settings → Pages** panel. Under **Build and deployment**, select **Deploy from a branch**, choose the `main` branch, choose the `/docs` folder, then save. No GitHub Actions workflow is required for this companion.

The public site uses only relative asset paths (for example, `assets/css/styles.css`), so it works correctly beneath the `/ai-builder-100/` project-site URL. GitHub Pages may take a few minutes to finish its initial build after the files reach `main`.

## Local validation

Run the following from the repository root before committing:

```bash
pnpm pages:check
pnpm check
git diff --check
```

The validation command confirms the required Pages files exist, assets are linked relatively, the live learning platform is present, the published curriculum includes the first and final modules plus the final lesson title, and this guide contains the correct repository and Pages settings.
