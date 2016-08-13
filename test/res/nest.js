st.extendSence("nest", {
    init: function (param) {
        console.log("xx1 init:", param);
        window.statge3 = st.addStatge("#st3", {});

        setTimeout(function () {
            statge3.loadSenceById("x1");
        }, 2000);
    }
    , beforeNextSence: function () {
        statge3.destroy();
        statge3 = null;
    }
});

console.log('nest loaded');