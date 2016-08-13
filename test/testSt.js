$(function () {
    st.start();
    window.statge1 = st.addStatge("#st1", {});
    statge1.loadSenceById("x1");
    setTimeout(function () {
        statge1.loadSenceById("x2")
    }, 2000)


    window.statge2 = st.addStatge("#st2", {});
    setTimeout(function () {
        statge2.loadSenceById("x2");
        setTimeout(function () {
            statge2.loadSenceById("nest");
        }, 2000)
    }, 1000);

});