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
    await octokit.rest.issues.addLabels({
        owner: github.context.repo.owner,
        repo: github.context.repo.repo,
        issue_number: github.context.issue.number,
        labels: labels
    });
}

const removeLabels = async (labels) => {
    labels.forEach(async (label) => {
        await octokit.rest.issues.removeLabel({
            owner: github.context.repo.owner,
            repo: github.context.repo.repo,
            issue_number: github.context.issue.number,
            name: label
        });
    });
}

const addAssignees = async (assignees) => {
    await octokit.rest.issues.addAssignees({
        owner: github.context.repo.owner,
        repo: github.context.repo.repo,
        issue_number: github.context.issue.number,
        assignees: assignees
    });
}

const removeAssignees = async (assignees) => {
    await octokit.rest.issues.removeAssignees({
        owner: github.context.repo.owner,
        repo: github.context.repo.repo,
        issue_number: github.context.issue.number,
        assignees: assignees
    });
}

const addReviewers = async (reviewers) => {
    await octokit.rest.pulls.requestReviewers({
        owner: github.context.repo.owner,
        repo: github.context.repo.repo,
        pull_number: github.context.issue.number,
        reviewers: reviewers
    });
}

const removeReviewers = async (reviewers) => {
    await octokit.rest.pulls.removeRequestedReviewers({
        owner: github.context.repo.owner,
        repo: github.context.repo.repo,
        pull_number: github.context.issue.number,
        reviewers: reviewers
    });
}

const clearAllLabels = async () => {
    await octokit.rest.issues.removeAllLabels({
        owner: github.context.repo.owner,
        repo: github.context.repo.repo,
        issue_number: github.context.issue.number,
    });
}

const clearAllAssignees = async () => {
    const { assignees } = await octokit.rest.issues.get({
        owner: github.context.repo.owner,
        repo: github.context.repo.repo,
        issue_number: github.context.issue.number,
    });
    await octokit.rest.issues.removeAssignees({
        owner: github.context.repo.owner,
        repo: github.context.repo.repo,
        issue_number: github.context.issue.number,
        assignees: assignees.map(assignee => assignee.login)
    });
}

const clearAllReviewers = async () => {
    const { requested_reviewers } = await octokit.rest.pulls.get({
        owner: github.context.repo.owner,
        repo: github.context.repo.repo,
        pull_number: github.context.issue.number,
    });
    await octokit.rest.pulls.removeRequestedReviewers({
        owner: github.context.repo.owner,
        repo: github.context.repo.repo,
        pull_number: github.context.issue.number,
        reviewers: requested_reviewers.map(reviewer => reviewer.login)
    });
}

const formatInputList = (input) => {
    return input.split(',').filter(item => item.trim().length);
}

try {
    const action = core.getInput('action');
    const reply = core.getInput('reply');
    const state = core.getInput('state');

    const addedLabels = formatInputList(core.getInput('addedLabels'));
    const removedLabels = formatInputList(core.getInput('removedLabels'));
    const assigneesAdded = formatInputList(core.getInput('assigneesAdded'));
    const assigneesRemoved = formatInputList(core.getInput('assigneesRemoved'));
    const reviewersAdded = formatInputList(core.getInput('reviewersAdded'));
    const reviewersRemoved = formatInputList(core.getInput('reviewersRemoved'));

    const clearLabels = core.getInput('clearLabels');
    const clearAssignees = core.getInput('clearAssignees');
    const clearReviewers = core.getInput('clearReviewers');

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

    if (clearLabels === 'true') {
        clearAllLabels();
    }

    if (clearAssignees === 'true') {
        clearAllAssignees();
    }

    if (clearReviewers === 'true') {
        clearAllReviewers();
    }

    if (addedLabels.length) {
        addLabels(addedLabels);
    }

    if (removedLabels.length) {
        removeLabels(removedLabels);
    }

    if (assigneesAdded.length) {
        addAssignees(assigneesAdded);
    }

    if (assigneesRemoved.length) {
        removeAssignees(assigneesRemoved);
    }

    if (reviewersAdded.length) {
        addReviewers(reviewersAdded);
    }

    if (reviewersRemoved.length) {
        removeReviewers(reviewersRemoved);
    }

} catch (error) {
    core.setFailed(error.message);
}
