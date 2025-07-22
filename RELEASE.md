# Managing Package Releases

This project uses the [Changesets](https://github.com/changesets/changesets)
tool to manage semantic versioning and release notes.

## Pre-requisites

Permit GitHub Actions to create and approve pull requests:

1. Go to Actions -> General in the repository settings: (`https://github.com/<user>/<repo>/settings/actions`)
2. In `Workflow permissions` enable the toggle for
   `Allow GitHub Actions to create and approve pull requests` (it is not required
   to also toggle the `Read and write permission` option)

## How to release a new version of the package

### Step 1: Create a new changeset

```sh
npx changeset
```

Follow the prompt to choose the major/minor/patch version and affected
packages (if a monorepo).

### Step 2: Commit the changeset file(s) to the repository

```sh
git add .changeset/
git commit -m "chore: add changeset for release"
git push origin HEAD
```

### Step 3: A new Pull Request for versioning

The Changesets GitHub Action will pick up the new changeset in the repository
and open a new pull request with the versioning changes in the relevant package
manifest files. Review the changes and merge the pull request.

### Step 4: Publish the package

The GitHub Action will automatically publish the package to the npm registry.

Created using npx create-node-lib svg-path-properties-new
