$(function () {
    st.start();
    window.statge1 = st.addStatge("#statge1", {});
    statge1.loadSenceById("sence1");
    setTimeout(function () {
        statge1.loadSenceById("sence2")
    }, 2000)


    window.statge2 = st.addStatge("#statge2", {});
    setTimeout(function () {
        statge2.loadSenceById("sence2");
        setTimeout(function () {
            statge2.loadSenceById("sencenest");
        }, 2000)
    }, 1000);

});