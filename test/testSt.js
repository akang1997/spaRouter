$(function () {
    window.statge = st.addStatge("#st", {});
    statge.loadSenceById("x1");

    setTimeout(function () {
        statge.loadSenceById("x2")
    }, 2000)
});