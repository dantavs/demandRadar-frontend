async function getIssues() {
    const url = 'http://127.0.0.1:3333/api/v1/getIssuesList'
    try {
        const response = await fetch(url)
        const content = await response.text()
        return JSON.parse(content)
    } catch(err){
        return
    }
}

async function listIssues(){
    const res = await getIssues()
    const issues = res.issue
    console.log('Issues: ', issues)

    return issues
}