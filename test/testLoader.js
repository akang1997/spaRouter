function logArgsSucc() {
    console.log("succ", arguments);
}
function logArgsErr() {
    console.log("err", arguments);
}
st.loader.loadUrls(["res/xx.html", "res/xx.1.html"], ["res/xx.js", "res/xx.1.2.js"], logArgsSucc, logArgsErr).always(next);

function next() {
    st.loader.loadUrls(["res/xx.html", "res/xx.1.html"], ["res/xx.js", "res/xx.1.js"], logArgsSucc, logArgsErr);
}