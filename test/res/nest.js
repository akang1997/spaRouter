st.extendSence("nest", {
    init: function (param) {
        console.log("xx1 init:", param);
        window.statge3 = st.addStatge("#nest", {});

        setTimeout(function () {
            statge3.loadSenceById("x1");
        }, 2000);
    }
});

console.log('nest loaded');