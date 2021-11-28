const core = require('@actions/core');
const github = require('@actions/github');

const token = core.getInput('token');
const octokit = github.getOctokit(token);

const addComment = async (reply) => {
    await octokit.rest.issues.createComment({
        owner: github.context.repo.owner,
        repo: github.context.repo.repo,
        issue_number: github.context.issue.number,
        body: reply
    });
}

const updateComment = async (commentId, reply) => {
    await octokit.rest.issues.updateComment({
        owner: github.context.repo.owner,
        repo: github.context.repo.repo,
        comment_id: commentId,
        body: reply
    });
}

const openIssue = async () => {
    await octokit.rest.issues.update({
        owner: github.context.repo.owner,
        repo: github.context.repo.repo,
        issue_number: github.context.issue.number,
        state: 'open'
    });
}

const closeIssue = async () => {
    await octokit.rest.issues.update({
        owner: github.context.repo.owner,
        repo: github.context.repo.repo,
        issue_number: github.context.issue.number,
        state: 'closed'
    });
}

const addLabels = async (labels) => {
    console.log({labels });
    labels.forEach( async (label) => {
        await octokit.rest.issues.addLabels({
            owner: github.context.repo.owner,
            repo: github.context.repo.repo,
            issue_number: github.context.issue.number,
            labels: [label]
        });
    });
}

const removeLabels = async (labels) => {
    console.log({labels });
    labels.forEach( async (label) => {
        await octokit.rest.issues.removeLabel({
            owner: github.context.repo.owner,
            repo: github.context.repo.repo,
            issue_number: github.context.issue.number,
            name: label
        });
    });
}

const addAssignees = async (assignees) => {
    console.log({assignees });
    assignees.forEach( async (assignee) => {
        await octokit.rest.issues.addAssignees({
            owner: github.context.repo.owner,
            repo: github.context.repo.repo,
            issue_number: github.context.issue.number,
            assignees: [assignee]
        });
    });
}

const removeAssignees = async (assignees) => {
    console.log({assignees });
    assignees.forEach( async (assignee) => {
        await octokit.rest.issues.removeAssignees({
            owner: github.context.repo.owner,
            repo: github.context.repo.repo,
            issue_number: github.context.issue.number,
            assignees: [assignee]
        });
    });
}

const addReviewers = async (reviewers) => {
    console.log({reviewers });
    reviewers.forEach( async (reviewer) => {
        await octokit.rest.pulls.requestReviewers({
            owner: github.context.repo.owner,
            repo: github.context.repo.repo,
            pull_number: github.context.issue.number,
            reviewers: [reviewer]
        });
    });
}

const removeReviewers = async (reviewers) => {
    console.log({reviewers });
    reviewers.forEach( async (reviewer) => {
        await octokit.rest.pulls.removeRequestedReviewers({
            owner: github.context.repo.owner,
            repo: github.context.repo.repo,
            pull_number: github.context.issue.number,
            reviewers: [reviewer]
        });
    });
}

try {
    const action = core.getInput('action');
    const reply = core.getInput('reply');
    const state = core.getInput('state');

    const addedLabelss = core.getInput('addedLabels')
    console.log({addedLabelss });
    const removedLabelss = core.getInput('removedLabels')
    console.log({removedLabelss });
    const assigneesAddeds = core.getInput('assigneesAdded')
    console.log({assigneesAddeds });
    const assigneesRemoveds = core.getInput('assigneesRemoved')
    console.log({assigneesRemoveds });
    const reviewersAddeds = core.getInput('reviewersAdded')
    console.log({reviewersAddeds });
    const reviewersRemoveds = core.getInput('reviewersRemoved')
    console.log({reviewersRemoveds });

    const addedLabels = core.getInput('addedLabels').split(',');
    const removedLabels = core.getInput('removedLabels').split(',');
    const assigneesAdded = core.getInput('assigneesAdded').split(',');
    const assigneesRemoved = core.getInput('assigneesRemoved').split(',');
    const reviewersAdded = core.getInput('reviewersAdded').split(',');
    const reviewersRemoved = core.getInput('reviewersRemoved').split(',');

    if (!addedLabels && !removedLabels && !reply && !assigneesAdded && !assigneesRemoved && !reviewersAdded && !reviewersRemoved && !state) {
        throw new Error('No action specified');
    }

    if (action === 'add' && reply) {
        addComment(reply);
    } else if (action === 'update' && reply) {
        updateComment(github.context.comment.comment_id, reply);
    } else if (action && reply) {
        throw new Error(`Invalid action: ${action}`);
    }

    if (state && state === 'open') {
        if (github.context.issue.state === 'open') {
            throw new Error('Issue is already open');
        }
        openIssue();
    } else if (state && state === 'closed') {
        if (github.context.issue.state === 'closed') {
            throw new Error('Issue is already closed');
        }
        closeIssue();
    } else if (state) {
        throw new Error(`Invalid state: ${state}`);
    }

    if (addedLabels && addedLabels.length > 0) {
        addLabels(addedLabels);
    }

    if (removedLabels && removedLabels.length > 0) {
        removeLabels(removedLabels);
    }

    if (assigneesAdded && assigneesAdded.length > 0) {
        addAssignees(assigneesAdded);
    }

    if (assigneesRemoved && assigneesRemoved.length > 0) {
        removeAssignees(assigneesRemoved);
    }

    if (reviewersAdded && reviewersAdded.length > 0) {
        addReviewers(reviewersAdded);
    }

    if (reviewersRemoved && reviewersRemoved.length > 0) {
        removeReviewers(reviewersRemoved);
    }

} catch (error) {
    core.setFailed(error.message);
}
