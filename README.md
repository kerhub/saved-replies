<p align="center">
 <img width="20%" height="20%" src="./logo.svg" alt="project logo">
</p>

# Saved Replies
> Simplify your communication workflow with a simple, yet powerful, GitHub Action!


## Features

- ✅ Keep control of your triggers
- ✅ Keep control of your triggers
- ✅ Keep control of your triggers


## Inputs

| Input                 | Required                      | Description                                                  | Default                                                                |
| ---------------------- | ------------------------- | ------------------------------------------------------------ | ---------------------------------------------------------------------- |
| token                  | `true`                  | GitHub Personal Access Token                                   |                                            |
| addedLabels            | `false`                 | labels to add                                                  |                                                                |
| removedLabels          | `false`                 | labels to remove                                               | 
| reply                  | `false`                 | reply                                                          | 
| assigneesAdded         | `false`                 | list of assignees to add                                       | 
| assigneesRemoved       | `false`                 | list of assignees to remove                                    | 
| reviewersAdded         | `false`                 | list of reviewers to add                                       | 
| reviewersRemoved       | `false`                 | list of reviewers to remove                                    | 
| action                 | `false`                 | action to perform (add or update). default to add              | `add`
| state                  | `false`                 | new issue state (open or closed)                               | 


## Examples

Add a `triage` label on issue creation

```yaml
on:
  issues:
    types: [opened]
jobs:
  triage:
    runs-on: ubuntu-latest
    steps:
      - name: add triage label
        uses: kerhub/saved-replies@v0.2.9
        with:
          token: ${{ secrets.GITHUB_TOKEN }}
          addedLabels: 'triage'

```
