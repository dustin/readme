function rm_init_update_links(app) {
    var baseUri = app.db.uri;
    var ddoc = app.ddoc._id;

    $(".statechange").each(function(a, el) {
        var parts = el.id.split('-');
        $(el).click(function() {
            $.ajax({type: 'POST',
                    url: baseUri + ddoc + "/_update/set_state/" + parts[1],
                    data: 'new_state=' + encodeURIComponent(parts[0]),
                    dataType: "json",
                    complete: function(res) {
                        if (res.responseText === 'change') {
                            $('#item-' + parts[1]).hide('fast');
                        }
                    }});

            return false;
        });
    });
}

function rm_init_list_links(app) {
    var path = app.require("vendor/couchapp/lib/path").init(app.req);

    $(".statelist a").each(function(a, el) {
        var state = el.title;
        $(el).attr('href', path.list('todo', 'by_state', {state: state,
                                                          startkey: [state],
                                                          endkey: [state, {}],
                                                          descending: false,
                                                          include_docs: true,
                                                          limit: 50}));
    });
}