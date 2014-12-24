function dice_initialize(container, w, h) {
    "use strict";
    var canvas = document.getElementById('canvas');
    canvas.style.width = w + 'px';
    canvas.style.height = h + 'px';
    canvas.style.color = 'red';

    var label = document.getElementById('label');
    var selector_div = document.getElementById('selector_div');
    var info_div = document.getElementById('info_div');

    var box = new eaw.dice.dice_box(canvas);

    function show_selector() {
        info_div.style.display = 'none';
        selector_div.style.display = 'inline-block';
        box.draw_selector();
    }

    function before_roll(vectors) {
        info_div.style.display = 'none';
        selector_div.style.display = 'none';
    }

    function notation_getter() {
      console.log('gettingnotaion');
        return eaw.dice.parse_notation(set.value);
    }

    function after_roll(notation, result) {
        var res = result.join(' ');
        if (notation.constant) res += ' +' + notation.constant;
        if (result.length > 1) res += ' = ' +
                (result.reduce(function(s, a) { return s + a; }) + notation.constant);
        label.innerHTML = res;
        console.log(res);
        info_div.style.display = 'inline-block';
    }

    box.bind_mouse(container, notation_getter, before_roll, after_roll);
    box.bind_throw(document.getElementById('throw'), notation_getter, before_roll, after_roll);

    bind(container, ['mouseup', 'touchend', 'touchcancel'], function(ev) {
        if (selector_div.style.display == 'none') {
            if (!box.rolling) show_selector();
            box.rolling = false;
            return;
        }
        var name = box.search_dice_by_mouse(ev);
        console.log(name);
        if (name !== undefined) {
            var notation = eaw.dice.parse_notation(set.value);
            notation.set.push(name);
            set.value = eaw.dice.stringify_notation(notation);
        }
    });

    var params = get_url_params();
    if (params.notation) {
        set.value = params.notation;
    }
    if (params.roll) {
      raise_event(document.getElementById('throw'), 'mouseup');
    }
    else {
        show_selector();
    }
}

var get_url_params = function() {
    var params = window.location.search.substring(1).split("&");
    var res = {};
    for (var i in params) {
        var keyvalue = params[i].split("=");
        res[keyvalue[0]] = decodeURI(keyvalue[1]);
    }
    return res;
};

var bind = function(sel, eventname, func, bubble) {
    if (eventname.constructor === Array) {
        for (var i in eventname)
            sel.addEventListener(eventname[i], func, bubble ? bubble : false);
    }
    else
        sel.addEventListener(eventname, func, bubble ? bubble : false);
};

var raise_event = function(sel, eventname, bubble, cancelable) {
    var evt = document.createEvent('UIEvents');
    evt.initEvent(eventname, bubble === undefined ? true : bubble,
            cancelable === undefined ? true : cancelable);
    sel.dispatchEvent(evt);
};
var copy = function(obj) {
    if (!obj) return obj;
    return copyto(obj, new obj.constructor());
}

var copyto = function(obj, res) {
    if (obj == null || typeof obj !== 'object') return obj;
    if (obj instanceof Array) {
        for (var i = obj.length - 1; i >= 0; --i)
            res[i] = copy(obj[i]);
    }
    else {
        for (var i in obj) {
            if (obj.hasOwnProperty(i))
                res[i] = copy(obj[i]);
        }
    }
    return res;
}
