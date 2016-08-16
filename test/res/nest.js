st.extendSence("nest", {
    init: function (data) {
        console.log("nest init:", data);
        window.statge3 = st.addStatge("#statge3", {});

        setTimeout(function () {
            statge3.loadSenceById("sence1");
        }, 2000);
    }
    , beforeNextSence: function () {
        statge3.destroy();
        statge3 = null;
    }
});

console.log('nest loaded');