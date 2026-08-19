# promptsample

A small sample "AI product" (a customer support agent) used to test the
[promptcheck](https://promptchecksaas.vercel.app) CI integration end-to-end.

- `prompts/support-agent.txt` — the actual prompt template this "product" ships
- `src/support-agent.js` — a minimal example of the feature using it
- `.github/workflows/promptcheck.yml` — runs the corresponding promptcheck
  suite on every push and pull request, and fails the build if quality
  regresses against your saved baseline

## To finish setting this up (two things I couldn't do myself)

I don't have access to your live promptcheck dashboard session, so two
values still need to come from you:

1. **Create a suite** at [promptcheck → New suite](https://promptchecksaas.vercel.app/dashboard/new)
   with a prompt template matching `prompts/support-agent.txt` (or just
   paste that file's content in). Copy the suite's ID from its URL:
   `/dashboard/suites/<suite-id>`.

2. Open `.github/workflows/promptcheck.yml` in this repo and replace
   `REPLACE_WITH_YOUR_SUITE_ID` with that ID.

3. **Generate an API token** at
   [promptcheck → API tokens](https://promptchecksaas.vercel.app/dashboard/tokens)
   (requires a paid plan), then add it as a secret in this repo:
   Settings → Secrets and variables → Actions → New repository secret →
   name it `PROMPTCHECK_TOKEN` → paste the token.

Once both are done, push any commit (or just re-run the workflow from the
Actions tab) and it'll run your suite against this repo's branch/commit and
report pass/fail/regression right in the workflow summary.
