function rm_parseISO8601(timestamp) {
    var regex = new RegExp("^([\\d]{4})-([\\d]{2})-([\\d]{2})T([\\d]{2}):([\\d]{2}):([\\d]{2})Z?$");
    var matches = regex.exec(timestamp);
    var rv = null;
    if(matches != null) {
        rv = new Date(
            Date.UTC(
                parseInt(matches[1], 10),
                parseInt(matches[2], 10) - 1,
                parseInt(matches[3], 10),
                parseInt(matches[4], 10),
                parseInt(matches[5], 10),
                parseInt(matches[6], 10)
            )
        );
    } else {
        rv = new Date(timestamp);
    }
    if (rv === null) {
        console.log("Failed to parse", timestamp);
    }
    return rv;
}

// Mostly stolen from utils, but my timestamps are slightly different.
function myPretty(ts) {
    var date = rm_parseISO8601(ts),
        diff = (((new Date()).getTime() - date.getTime()) / 1000),
        day_diff = Math.floor(diff / 86400);

    if (isNaN(day_diff)) {
        return ts;
    }
    return day_diff < 1 && (
        diff < 60 && "just now" ||
            diff < 120 && "1 minute ago" ||
            diff < 3600 && Math.floor( diff / 60 ) + " minutes ago" ||
            diff < 7200 && "1 hour ago" ||
            diff < 86400 && Math.floor( diff / 3600 ) + " hours ago") ||
        day_diff == 1 && "yesterday" ||
        day_diff < 21 && day_diff + " days ago" ||
        day_diff < 45 && Math.ceil( day_diff / 7 ) + " weeks ago" ||
        date.toString();
}

function rm_refreshTimestamps() {
    rm_updateTimestamps();
    setTimeout(rm_refreshTimestamps, 60000);
}

function rm_updateTimestamps(app) {
    $('.timestamp').each(function() {
        $(this).text(myPretty($(this).attr("title")));
    });
}

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