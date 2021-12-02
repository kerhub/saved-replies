<p align="center">
 <img width="20%" height="20%" src="./logo.svg" alt="project logo">
</p>

# Saved Replies
> Simplify your communication workflow with a simple, yet powerful, GitHub Action!


## Features

- ✅ open or close issues and pull requests
- ✅ add or update comments
- ✅ manage the contributors list


## Inputs

| Input                 | Required                      | Description                                                  | Default                                                                |
| ---------------------- | ------------------------- | ------------------------------------------------------------ | ---------------------------------------------------------------------- |
| token                  | `true`                  | GitHub Personal Access Token                                   |                                            |
| addedLabels            | `false`                 | comma seperated stringified list of labels to add              |                                                                |
| removedLabels          | `false`                 | comma seperated stringified of labels to remove                | 
| reply                  | `false`                 | reply                                                          | 
| assigneesAdded         | `false`                 | comma seperated stringified list of assignees to add           | 
| assigneesRemoved       | `false`                 | comma seperated stringified list of assignees to remove        | 
| reviewersAdded         | `false`                 | comma seperated stringified list of reviewers to add           | 
| reviewersRemoved       | `false`                 | comma seperated stringified list of reviewers to remove        | 
| action                 | `false`                 | action to perform (add or update). default to add              | `add`
| state                  | `false`                 | new issue state (open or closed)                               | 
| clearLabels            | `false`                 | clear existing labels (expected value: `'true'`)                                          | 
| clearAssignees         | `false`                 | clear existing assignees (expected value: `'true'`)                                     | 
| clearReviewers         | `false`                 | clear existing reviewers (expected value: `'true'`)                                       | 


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
        uses: kerhub/saved-replies@v1.0.0
        with:
          token: ${{ secrets.GITHUB_TOKEN }}
          addedLabels: 'triage'
```

Add a list of assignees on `scope: core` label addition and remove the `triage` label

```yaml
on:
  issues:
    types: [labeled]
jobs:
  scopeCore:
    if ${{ github.event.label.name }} == 'scope: core'
    runs-on: ubuntu-latest
    steps:
      - name: add core scope
        uses: kerhub/saved-replies@v1.0.0
        with:
          token: ${{ secrets.GITHUB_TOKEN }}
          removedLabels: 'triage'
          assigneesAdded: 'geromegrignon'
```

Greet the author on a pull request creation

```yaml
on:
  pull_request:
    types: [opened]
jobs:
  greetings:
    runs-on: ubuntu-latest
    steps:
      - name: greet the author
        uses: kerhub/saved-replies@v1.0.0
        with:
          token: ${{ secrets.GITHUB_TOKEN }}
          reply: 'Hi @${{ github.event.pull_request.user.login }}, thanks for contributing to this project!'
```

Close an pull request on a label addition

```yaml
on:
  pull_request:
    types: [labeled]
jobs:
  closePR:
    if: "${{github.event.label.name == 'out of scope' }}"
    runs-on: ubuntu-latest
    steps:
      - name: close the pull request
        uses: kerhub/saved-replies@v1.0.0
        with:
          token: ${{ secrets.GITHUB_TOKEN }}
          state: 'closed'
          reply: 'The content of this contribution is out of the scope of the project'
```
