function(doc, req) {
    var old_state = doc['rm_state'];
    doc['rm_state'] = req.form.new_state;
    return [doc, (old_state === req.form.new_state) ? "nochange" : "change"];
}
