function(doc, req) {
    doc['rm_state'] = req.form.new_state;
    return [doc, 'State set to ' + doc['rm_state']];
}
