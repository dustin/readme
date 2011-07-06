function() {
    var state = (window.location.hash || '#unread');
    state = state.substring(1, state.length);
    return {
        "view" : "by_state",
        "descending" : "false",
        "limit" : 50,
        "include_docs": "true",
        "startkey": [state],
        "endkey": [state, {}]
    };
}
