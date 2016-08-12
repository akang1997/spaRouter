$(function () {
    window.statge = st.addStatge("#st", {});
    statge.loadSenceById("x1");
    setTimeout(function () {
        statge.loadSenceById("x2")
    }, 2000)


    window.statge2 = st.addStatge("#st2", {});
    setTimeout(function () {
        statge2.loadSenceById("x2");
        setTimeout(function () {
            statge2.loadSenceById("nest");
        }, 2000)
    }, 1000);

});