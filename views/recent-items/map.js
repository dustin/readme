function(doc) {
    if (doc.rm_state === 'unread') {
        emit(doc.rm_updated, null);
    }
};
