// Get the latest release version on GitHub as a number
export default {
    type: ['Gauge'],
    name: ['release_version'],
    help: ['Github versions of latest releases represented as numbers'],
    url: [
        'https://api.github.com/repos/ethereum/go-ethereum/releases/latest',
        'https://api.github.com/graphprotocol/graph-node/releases/latest',
    ],
    headers: {
        Accept: 'application/vnd.github+json',
        Authorization: 'Bearer ' + process.env.GITHUB_TOKEN,
        'X-GitHub-Api-Version': '2022-11-28',
    },
    cache: 60000,
    method: 'get',
    callback: (response, prometheus) => {
        if (response.status == 200) {
            const parts = response.request.path.split('/');
            const version = response.data.tag_name.replace(/^v/, '');
            const versionNumber = version.split('.').reduce(
                (acc, num, i) => acc + parseInt(num) * Math.pow(10, (2 - i) * 2),
                0
            );
            prometheus['release_version'].labels('repo', parts[2] + '/' + parts[3]).set(versionNumber);
        } else {
            console.warn('Invalid response from github for ' + parts[2] + '/' + parts[3]);
        }
    }
}
